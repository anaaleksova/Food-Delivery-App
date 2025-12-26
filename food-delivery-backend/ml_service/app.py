from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
from content_based_recommendations import AdvancedContentBasedRecommender
import threading

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Global recommender instance
recommender = AdvancedContentBasedRecommender()
recommender_lock = threading.Lock()
initialized = False


def initialize_recommender():
    """Initialize recommender on first request"""
    global initialized

    if not initialized:
        with recommender_lock:
            if not initialized:  # Double-check locking
                logger.info("Initializing recommender system...")
                recommender.connect_db()
                recommender.initialize(force_rebuild=False)  # Use cache if available
                initialized = True
                logger.info("Recommender system initialized successfully")


@app.before_request
def before_request():
    """Ensure recommender is initialized before handling requests"""
    initialize_recommender()


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'advanced-content-based-recommender',
        'version': '2.0.0',
        'initialized': initialized,
        'cached_products': len(recommender.product_vectors),
        'cached_user_profiles': len(recommender.user_profiles)
    }), 200


@app.route('/api/recommendations/advanced/<username>', methods=['GET'])
def get_advanced_recommendations(username):
    """
    Get advanced content-based recommendations with vectorization and TF-IDF.

    Query parameters:
    - n: Number of recommendations (default: 10)
    - apply_rules: Apply business rules (default: true)

    Returns:
        JSON array of recommended products with similarity scores
    """
    try:
        n = request.args.get('n', default=10, type=int)
        apply_rules = request.args.get('apply_rules', default='true', type=str).lower() == 'true'

        if n < 1 or n > 50:
            return jsonify({
                'error': 'Invalid parameter',
                'message': 'n must be between 1 and 50'
            }), 400

        logger.info(f"Getting advanced recommendations for: {username}, n={n}, rules={apply_rules}")

        # Ensure database connection
        if not recommender.conn or recommender.conn.closed:
            recommender.connect_db()

        # Get recommendations
        recommendations = recommender.get_recommendations(
            username,
            n=n,
            apply_rules=apply_rules
        )

        if not recommendations:
            return jsonify({
                'username': username,
                'recommendations': [],
                'message': 'No recommendations available. User may not have order history.',
                'recommendation_type': 'empty'
            }), 200

        # Format response
        response = {
            'username': username,
            'count': len(recommendations),
            'recommendation_type': 'personalized',
            'features_used': {
                'category_encoding': True,
                'tfidf_text': True,
                'normalized_price': True,
                'business_rules': apply_rules
            },
            'recommendations': recommendations
        }

        logger.info(f"Successfully generated {len(recommendations)} recommendations for {username}")

        return jsonify(response), 200

    except Exception as e:
        logger.error(f"Error generating recommendations for {username}: {str(e)}")
        return jsonify({
            'error': 'Internal server error',
            'message': str(e)
        }), 500


@app.route('/api/recommendations/cold-start', methods=['GET'])
def get_cold_start_recommendations():
    """
    Get cold-start recommendations for new users.
    Returns trending/popular products.

    Query parameters:
    - n: Number of recommendations (default: 10)
    - category: Optional category filter

    Returns:
        JSON array of popular products
    """
    try:
        n = request.args.get('n', default=10, type=int)
        category = request.args.get('category', default=None, type=str)

        if n < 1 or n > 50:
            return jsonify({
                'error': 'Invalid parameter',
                'message': 'n must be between 1 and 50'
            }), 400

        logger.info(f"Getting cold-start recommendations: n={n}, category={category}")

        # Ensure database connection
        if not recommender.conn or recommender.conn.closed:
            recommender.connect_db()

        # Get cold-start recommendations
        recommendations = recommender.cold_start_recommendations(n=n, category=category)

        response = {
            'count': len(recommendations),
            'recommendation_type': 'cold_start',
            'category_filter': category,
            'recommendations': recommendations
        }

        logger.info(f"Successfully generated {len(recommendations)} cold-start recommendations")

        return jsonify(response), 200

    except Exception as e:
        logger.error(f"Error generating cold-start recommendations: {str(e)}")
        return jsonify({
            'error': 'Internal server error',
            'message': str(e)
        }), 500


@app.route('/api/recommendations/user-vector/<username>', methods=['GET'])
def get_user_vector_info(username):
    """
    Get user profile vector information.
    Shows dimensionality and statistics about the user's feature vector.

    Returns:
        JSON object with user vector metadata
    """
    try:
        logger.info(f"Getting user vector info for: {username}")

        # Ensure database connection
        if not recommender.conn or recommender.conn.closed:
            recommender.connect_db()

        # Build user profile
        user_vector = recommender.build_user_profile(username, use_cache=False)

        if user_vector is None:
            return jsonify({
                'username': username,
                'has_profile': False,
                'message': 'User has no order history'
            }), 200

        # Calculate statistics
        import numpy as np

        response = {
            'username': username,
            'has_profile': True,
            'vector_dimensions': len(user_vector),
            'statistics': {
                'mean': float(np.mean(user_vector)),
                'std': float(np.std(user_vector)),
                'min': float(np.min(user_vector)),
                'max': float(np.max(user_vector)),
                'non_zero_features': int(np.count_nonzero(user_vector))
            },
            'feature_breakdown': {
                'total_features': len(user_vector),
                'category_features': len(recommender.category_encoder.get('category', {})) +
                                   len(recommender.category_encoder.get('restaurant_category', {})),
                'tfidf_features': 100,  # Max features set in TF-IDF
                'numeric_features': 1  # Price
            }
        }

        logger.info(f"Successfully retrieved user vector info for {username}")

        return jsonify(response), 200

    except Exception as e:
        logger.error(f"Error getting user vector for {username}: {str(e)}")
        return jsonify({
            'error': 'Internal server error',
            'message': str(e)
        }), 500


@app.route('/api/recommendations/rebuild-cache', methods=['POST'])
def rebuild_cache():
    """
    Rebuild product vectors cache from database.
    This should be called when:
    - New products are added
    - Product information is updated
    - Categories change

    Returns:
        JSON object with rebuild status
    """
    try:
        logger.info("Rebuilding cache...")

        # Ensure database connection
        if not recommender.conn or recommender.conn.closed:
            recommender.connect_db()

        # Force rebuild
        recommender.initialize(force_rebuild=True)

        response = {
            'status': 'success',
            'message': 'Cache rebuilt successfully',
            'cached_products': len(recommender.product_vectors),
            'vector_dimensions': len(next(iter(recommender.product_vectors.values())))
                                if recommender.product_vectors else 0
        }

        logger.info("Cache rebuilt successfully")

        return jsonify(response), 200

    except Exception as e:
        logger.error(f"Error rebuilding cache: {str(e)}")
        return jsonify({
            'error': 'Internal server error',
            'message': str(e)
        }), 500


@app.route('/api/recommendations/similarity/<int:product_id>', methods=['GET'])
def get_product_similarity(product_id):
    """
    Calculate similarity between a product and a user's profile.

    Query parameters:
    - username: Username to compare against

    Returns:
        JSON object with similarity score
    """
    try:
        username = request.args.get('username', type=str)

        if not username:
            return jsonify({
                'error': 'Missing parameter',
                'message': 'username is required'
            }), 400

        logger.info(f"Calculating similarity for product {product_id} and user {username}")

        # Ensure database connection
        if not recommender.conn or recommender.conn.closed:
            recommender.connect_db()

        # Get user profile
        user_vector = recommender.build_user_profile(username)

        if user_vector is None:
            return jsonify({
                'error': 'User has no profile',
                'message': 'User has no order history'
            }), 400

        # Calculate similarity
        similarity = recommender.calculate_similarity(user_vector, product_id)

        # Get product metadata
        metadata = recommender.product_metadata.get(product_id)

        response = {
            'product_id': product_id,
            'username': username,
            'similarity_score': float(similarity),
            'product_info': metadata if metadata else None
        }

        logger.info(f"Similarity score: {similarity:.4f}")

        return jsonify(response), 200

    except Exception as e:
        logger.error(f"Error calculating similarity: {str(e)}")
        return jsonify({
            'error': 'Internal server error',
            'message': str(e)
        }), 500


@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({
        'error': 'Not found',
        'message': 'The requested endpoint does not exist'
    }), 404


@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    logger.error(f"Internal server error: {str(error)}")
    return jsonify({
        'error': 'Internal server error',
        'message': 'An unexpected error occurred'
    }), 500


if __name__ == '__main__':
    logger.info("Starting Advanced Content-Based Recommendation Service")
    logger.info("Service will be available at http://localhost:5002")
    logger.info("\nEndpoints:")
    logger.info("  GET  /health")
    logger.info("  GET  /api/recommendations/advanced/<username>")
    logger.info("  GET  /api/recommendations/cold-start")
    logger.info("  GET  /api/recommendations/user-vector/<username>")
    logger.info("  POST /api/recommendations/rebuild-cache")
    logger.info("  GET  /api/recommendations/similarity/<product_id>")

    # Run Flask app on different port (5002) to avoid conflict
    app.run(
        host='0.0.0.0',
        port=5002,
        debug=True
    )