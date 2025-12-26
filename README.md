# 🍔 Food Delivery App

A **full-stack food delivery application** connecting **customers, restaurants, couriers, and administrators** in one unified platform.  

The system allows users to browse restaurants and place orders, restaurants/admins to manage menus and orders, and couriers to deliver food efficiently.

This project demonstrates a **real-world food delivery system**, with frontend UI, backend API, database integration, and secure role-based access.

---

## 🎯About

This repository contains a full-stack Food Delivery App:

- Backend API – handles authentication, user/role management, restaurants, orders, courier workflows, and ML-powered recommendations
- Frontend Web App – provides UI for customers, couriers, and admins
- ML Service – Python-based recommendation system with advanced content-based filtering

It demonstrates:

- Role-based authentication (Customer, Courier, Admin)
- End-to-end order flow (from ordering to delivery)
- AI-powered personalized recommendations
- Scalable, modular architecture
- Clean separation of concerns (frontend, backend, ML)
- JWT-secured API endpoints
- Order tracking
- Payment integration (Stripe test mode)

## Features

### 👤 User (Customer) Features

- ✅ Secure registration and login with JWT authentication
- 🍽️ Browse restaurants with filtering by category and search
- 🛒 Add food items to cart with real-time updates
- 📦 Place orders with delivery address
- 💳 Integrated payment flow (Stripe test mode)
- 📜 View complete order history
- 🚚 Real-time order tracking (Pending → Preparing → On the way → Delivered)
- 🤖 Personalized recommendations:
  - Time-based recommendations (breakfast, lunch, dinner patterns)
  - Popular trending items
  - Advanced ML content-based filtering
- ⭐ Write and view restaurant reviews
- 📱 Fully responsive UI across all devices

### 🔐 Admin / Restaurant Features

- 👨‍💼 Secure admin authentication and dashboard
- 🏪 Complete restaurant management (CRUD operations)
- 🍕 Menu item management across all restaurants
- 👥 User management (view, edit roles, delete users)
- 🎯 Content management and moderation

### 🚴 Courier Features

- 🔐 Courier-specific authentication
- 📋 View all available delivery orders
- ✅ Accept and pick up orders
- 🗺️ Access delivery addresses and customer info
- ✔️ Mark orders as delivered
- 📈 Track personal delivery statistics
- 🏆 View completed delivery history

### 🤖 Advanced ML Recommendations

- Time-of-Day Recommendations:
  - Analyzes user ordering patterns by hour
  - Provides personalized suggestions for breakfast, lunch, dinner
  - Fallback to global patterns when user history is sparse

- Popular Recommendations:
  - Identifies trending items across all users
  - Weighted by recency and diversity
  - Filters by availability and stock

- Advanced Content-Based Filtering:
  - Feature vectorization (One-Hot Encoding + TF-IDF + Normalized numeric)
  - Cosine similarity scoring
  - Business rules (popularity boost, recency penalties)
  - User profile building from interaction history
  - Cold-start support for new users

---

## Tech Stack

| Layer       | Technology                           |
|------------|--------------------------------------|
| Frontend    | JavaScript (React)   |
| Backend     | Java(Spring Boot), Spring Security, Spring Data JPA                   |
| ML Service  |Python 3.13, Flask 3.0, scikit-learn 1.3.2, pandas, numpy |
| Database    | PostgreSQL                           |
| Authentication | JWT (JSON Web Tokens), BCrypt password hashing             |
| API         | RESTful API with OpenAPI/Swagger documentation                         |
| Build Tools | Maven (backend), npm (frontend), pip (ML service)                           |
| Version Control | Git & GitHub                     |

---

## 💻 Installation

### Prerequisites
* Java 17 or higher
* Maven 3.9+
* Node.js 18+ and npm
* Python 3.13+ and pip
* PostgreSQL 12+
* Git

### 1. Clone the Repository
```bash
git clone https://github.com/anaaleksova/Food-Delivery-App
```

### 2. Database Setup
```bash
# Create database
createdb FoodDelivery

# Or using psql
psql -U postgres
CREATE DATABASE "FoodDelivery";
```

### 3. Backend Setup
```bash
cd food-delivery-backend

# Update database credentials in src/main/resources/application.properties
spring.datasource.url=jdbc:postgresql://localhost:5432/FoodDelivery
spring.datasource.username=your_username
spring.datasource.password=your_password

# Build and run
./mvnw clean install
./mvnw spring-boot:run

# Backend will start on http://localhost:8080
# Swagger UI: http://localhost:8080/swagger-ui/index.html
```

### 4. ML Service Setup
```bash
cd food-delivery-backend/ml_service

# Create virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Update database credentials in content_based_recommendations.py
DB_CONFIG = {
    'dbname': 'FoodDelivery',
    'user': 'postgres',
    'password': 'your_password',
    'host': 'localhost',
    'port': '5432'
}

# Generate synthetic data (optional, for testing)
python data_generator.py

# Run ML service
python app.py

# ML Service will start on http://localhost:5002
```

### 5. Frontend Setup
```bash
cd food-delivery-frontend

# Install dependencies
npm install

# Update API base URL in src/axios/axios.js if needed
baseURL: "http://localhost:8080/api"

# Start development server
npm run dev

# Frontend will start on http://localhost:3000
```

## ⚙️ Configuration

### JWT Configuration
`JwtConstants.java`:
```java
public static final String SECRET_KEY = "your-secret-key-here";
public static final Long EXPIRATION_TIME = 864000000L; // 10 days
```

### Stripe Configuration
`PaymentServiceImpl.java`:
```java
private static final String STRIPE_SECRET_KEY = "your-stripe-test-key";
```

### Frontend Configuration
`axios.js`:
```javascript
const axiosInstance = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: { "Content-Type": "application/json" },
});
```

## 🚀 Usage

### Running the Application
1. Start Backend:
```bash
   cd food-delivery-backend
   ./mvnw spring-boot:run
```
2. Start ML Service:
```bash
   cd food-delivery-backend/ml_service
   python app.py
```
3. Start Frontend:
```bash
   cd food-delivery-frontend
   npm run dev
```

