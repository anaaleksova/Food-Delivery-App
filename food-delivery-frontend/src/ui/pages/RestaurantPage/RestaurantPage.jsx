import React, { useEffect, useState } from 'react';
import { useParams } from "react-router";
import {
    Typography, Card, CardContent, Box, Divider, Chip, Grid,
    CardMedia, Button, CardActions
} from "@mui/material";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StarIcon from '@mui/icons-material/Star';
import restaurantRepository from "../../../repository/restaurantRepository.js";
import productRepository from "../../../repository/productRepository.js";
import { addToCartRespectingSingleRestaurant } from "../../../repository/cartActions.js";
import reviewRepository from "../../../repository/reviewRepository.js";
import ReviewList from "../../components/reviews/ReviewList/ReviewList.jsx";
import ReviewForm from "../../components/reviews/ReviewForm/ReviewForm.jsx";
import useAuth from "../../../hooks/useAuth.js";

const ProductCard = ({ product, onAdd }) => {
    const { user } = useAuth();

    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardMedia
                component="img"
                height="140"
                image={product.imageUrl || 'https://via.placeholder.com/300x140?text=Food'}
                alt={product.name}
            />
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                    {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {product.description}
                </Typography>
                <Typography variant="h6" color="primary">
                    €{product.price?.toFixed(2)}
                </Typography>
                {product.category && (
                    <Chip label={product.category} size="small" sx={{ mt: 1 }} />
                )}
            </CardContent>

            {user?.roles?.includes('CUSTOMER') && (
                <CardActions>
                    <Button
                        variant="contained"
                        onClick={() => onAdd?.(product.id)}
                        disabled={!product.isAvailable || product.quantity <= 0}
                        fullWidth
                    >
                        {product.quantity <= 0 ? "Out of Stock" : "Add to Cart"}
                    </Button>
                </CardActions>
            )}
        </Card>
    );
};

const RestaurantPage = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [restaurant, setRestaurant] = useState(null);
    const [products, setProducts] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;
        Promise.all([
            restaurantRepository.findById(id),
            productRepository.findAll(),
            reviewRepository.list(id),
        ]).then(([r, p, rv]) => {
            if (!active) return;
            setRestaurant(r.data);
            setProducts(p.data.filter(x => String(x.restaurantId) === String(id)));
            setReviews(rv.data);
            setLoading(false);
        }).catch(err => {
            console.error('Error loading restaurant data:', err);
            setLoading(false);
        });
        return () => { active = false; }
    }, [id]);

    const handleAdd = async (productId) => {
        try {
            const res = await addToCartRespectingSingleRestaurant(productId);
            if (res?.ok) {
                alert(res.replaced ? "Cart replaced and item added." : "Added to cart.");
            }
        } catch (err) {
            alert("Failed to add item to cart.");
        }
    };

    const handleReview = async ({ rating, comment }) => {
        try {
            await reviewRepository.add(id, { rating, comment });
            const rv = await reviewRepository.list(id);
            setReviews(rv.data);
            alert("Review submitted successfully!");
        } catch (err) {
            alert("Failed to submit review.");
        }
    };

    if (loading) return <Typography>Loading...</Typography>;
    if (!restaurant) return <Typography>Restaurant not found.</Typography>;

    return (
        <Box>
            {/* Restaurant Header */}
            <Card sx={{ mb: 3 }}>
                <CardMedia
                    component="img"
                    height="300"
                    image={restaurant.imageUrl || 'https://via.placeholder.com/800x300?text=Restaurant'}
                    alt={restaurant.name}
                />
                <CardContent>
                    <Typography variant="h3" gutterBottom>
                        {restaurant.name}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <StarIcon sx={{ color: '#ffc107' }} />
                            <Typography variant="h6">{restaurant.rating || 4.5}</Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <AccessTimeIcon />
                            <Typography>{restaurant.deliveryTimeEstimate || 30} min delivery</Typography>
                        </Box>

                        <Chip
                            label={restaurant.isOpen ? "Open" : "Closed"}
                            color={restaurant.isOpen ? "success" : "error"}
                        />
                    </Box>

                    <Typography variant="body1" sx={{ mb: 2 }}>
                        {restaurant.description}
                    </Typography>

                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Opening Hours
                        </Typography>
                        <Typography>{restaurant.openHours || "09:00-22:00"}</Typography>
                    </Box>

                    {restaurant.address && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <LocationOnIcon color="action" />
                            <Typography color="text.secondary">
                                {restaurant.address.line1}, {restaurant.address.city}
                            </Typography>
                        </Box>
                    )}
                </CardContent>
            </Card>

            {/* Menu Section */}
            <Typography variant="h4" sx={{ mb: 2 }}>
                Menu
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                {products.map(product => (
                    <Grid item key={product.id} xs={12} sm={6} md={4}>
                        <ProductCard product={product} onAdd={handleAdd} />
                    </Grid>
                ))}
            </Grid>

            {products.length === 0 && (
                <Typography color="text.secondary" sx={{ textAlign: 'center', mb: 4 }}>
                    No menu items available.
                </Typography>
            )}

            <Divider sx={{ my: 4 }} />

            {/* Reviews Section */}
            <Typography variant="h4" sx={{ mb: 2 }}>
                Reviews
            </Typography>

            {user?.roles?.includes('CUSTOMER') && (
                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Write a Review
                        </Typography>
                        <ReviewForm onSubmit={handleReview} />
                    </CardContent>
                </Card>
            )}

            {reviews.length > 0 ? (
                reviews.map((r) => (
                    <Card key={r.id} sx={{ mb: 2 }}>
                        <CardContent>
                            {/* Username */}
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                                {r.userUsername || "Anonymous"}
                            </Typography>

                            {/* Rating with stars (1–5) */}
                            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <StarIcon
                                        key={i}
                                        sx={{
                                            color: i < r.rating ? "#ffc107" : "#e0e0e0"
                                        }}
                                    />
                                ))}
                            </Box>

                            {/* Comment */}
                            <Typography variant="body2">{r.comment}</Typography>
                        </CardContent>
                    </Card>
                ))
            ) : (
                <Typography color="text.secondary">No reviews yet.</Typography>
            )}
        </Box>
    );
};

export default RestaurantPage;
