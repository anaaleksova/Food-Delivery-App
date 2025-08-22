import React, {useEffect, useState} from 'react';
import {Typography, Grid, Card, CardContent, CardMedia, CardActions, Button, Box, Chip} from "@mui/material";
import {Link} from "react-router";
import restaurantRepository from "../../../repository/restaurantRepository.js";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import StarIcon from '@mui/icons-material/Star';

const RestaurantCard = ({restaurant}) => (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardMedia
            component="img"
            height="200"
            image={restaurant.imageUrl || 'https://via.placeholder.com/400x200?text=Restaurant'}
            alt={restaurant.name}
        />
        <CardContent sx={{ flexGrow: 1 }}>
            <Typography variant="h6" gutterBottom>
                {restaurant.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {restaurant.description}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <StarIcon sx={{ color: '#ffc107', fontSize: 20 }} />
                <Typography variant="body2">{restaurant.rating || 4.5}</Typography>
                <AccessTimeIcon sx={{ fontSize: 16, ml: 1 }} />
                <Typography variant="body2">{restaurant.deliveryTimeEstimate || 30} min</Typography>
            </Box>

            {restaurant.category && (
                <Chip label={restaurant.category} size="small" sx={{ mb: 1 }} />
            )}

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                    {restaurant.openHours || "09:00-22:00"}
                </Typography>
                <Chip
                    label={restaurant.isOpen ? "Open" : "Closed"}
                    color={restaurant.isOpen ? "success" : "error"}
                    size="small"
                />
            </Box>
        </CardContent>
        <CardActions>
            <Button
                size="small"
                variant="contained"
                component={Link}
                to={`/restaurants/${restaurant.id}`}
                fullWidth
            >
                View Menu
            </Button>
        </CardActions>
    </Card>
);

const HomePage = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        restaurantRepository.findAll()
            .then(res => {
                setRestaurants(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching restaurants:', err);
                setLoading(false);
            });
    }, []);

    if (loading) return <Typography>Loading restaurants...</Typography>;

    return (
        <Box>
            <Typography variant="h4" sx={{mb: 3}}>
                Browse Restaurants
            </Typography>

            <Grid container spacing={3}>
                {restaurants.map(restaurant => (
                    <Grid item key={restaurant.id} xs={12} sm={6} md={4}>
                        <RestaurantCard restaurant={restaurant} />
                    </Grid>
                ))}
            </Grid>

            {restaurants.length === 0 && (
                <Typography color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
                    No restaurants available at the moment.
                </Typography>
            )}
        </Box>
    );
};

export default HomePage;