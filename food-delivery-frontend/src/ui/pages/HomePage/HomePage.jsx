import React, { useEffect, useState } from "react";
import {
    Typography,
    Grid,
    Card,
    CardContent,
    CardMedia,
    CardActions,
    Button,
    Box,
    Chip,
    TextField,
} from "@mui/material";
import { Link } from "react-router"; // ← per your setup (not react-router-dom)
import restaurantRepository from "../../../repository/restaurantRepository.js";
import banner from "../../../assets/banner.png"; // ← ESM import (no require)

/* ---------- Restaurant card ---------- */
const RestaurantCard = ({ restaurant }) => (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <CardMedia
            component="img"
            height="200"
            image={restaurant.imageUrl || "https://via.placeholder.com/400x200?text=Restaurant"}
            alt={restaurant.name}
        />
        <CardContent sx={{ flexGrow: 1 }}>
            <Typography variant="h6" gutterBottom>
                {restaurant.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {restaurant.description}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <Chip label={`⭐ ${restaurant.rating ?? 4.5}`} size="small" />
                <Chip label={`${restaurant.deliveryTimeEstimate ?? 30} min`} size="small" />
                <Chip
                    label={restaurant.isOpen ? "Open" : "Closed"}
                    color={restaurant.isOpen ? "success" : "default"}
                    size="small"
                />
            </Box>

            <Typography variant="body2" color="text.secondary">
                {restaurant.openHours || "09:00–22:00"}
            </Typography>
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

/* ---------- Page ---------- */
const HomePage = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        let active = true;
        restaurantRepository
            .findAll()
            .then((res) => {
                if (!active) return;
                setRestaurants(res.data || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
        return () => {
            active = false;
        };
    }, []);

    const filtered = restaurants.filter((r) =>
        (r.name || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <Typography>Loading restaurants...</Typography>;

    return (
        <Box>
            {/* ---------- FULL-BLEED HERO ---------- */}
            {/* Break out of the parent Container to go edge-to-edge */}
            <Box
                sx={{
                    position: "relative",
                    left: "50%",
                    right: "50%",
                    ml: "-50vw",
                    mr: "-50vw",
                    width: "100vw",
                    height: { xs: 280, md: 420 },
                    mb: 6,
                    overflow: "hidden",
                    backgroundImage: `url(${banner})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                {/* Dark overlay for contrast */}
                <Box
                    sx={{
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(rgba(0,0,0,.45), rgba(0,0,0,.45))",
                    }}
                />

                {/* Centered headline + search */}
                <Box
                    sx={{
                        position: "relative",
                        zIndex: 1,
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        px: 2,
                    }}
                >
                    <Box sx={{ width: "min(720px, 92vw)", textAlign: "center" }}>
                        <Typography
                            variant="h3"
                            sx={{
                                fontWeight: 800,
                                color: "#fff",
                                mb: 1,
                                lineHeight: 1.15,
                                fontSize: { xs: "1.75rem", md: "2.25rem" },
                            }}
                        >
                            Feast Your Senses,&nbsp;
                            <Box component="span" sx={{ color: "#f97316" }}>
                                Fast and Fresh
                            </Box>
                        </Typography>

                        <Typography variant="body1" sx={{ color: "rgba(255,255,255,.9)", mb: 3 }}>
                            Order restaurant food, takeaway and groceries.
                        </Typography>

                        <TextField
                            fullWidth
                            placeholder="Search for restaurants…"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            variant="outlined"
                            sx={{
                                background: "#fff",
                                borderRadius: 2,
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 2,
                                    px: 1,
                                    "& fieldset": { borderColor: "transparent" },
                                    "&:hover fieldset": { borderColor: "#e5e7eb" },
                                    "&.Mui-focused fieldset": { borderColor: "#2563eb" },
                                },
                                "& input": { py: 1.5 },
                            }}
                        />
                    </Box>
                </Box>
            </Box>

            {/* ---------- LIST ---------- */}
            <Typography variant="h4" sx={{ mb: 3 }}>
                Browse Restaurants
            </Typography>

            <Grid container spacing={3}>
                {filtered.map((restaurant) => (
                    <Grid item key={restaurant.id} xs={12} sm={6} md={4}>
                        <RestaurantCard restaurant={restaurant} />
                    </Grid>
                ))}
            </Grid>

            {!filtered.length && (
                <Typography color="text.secondary" sx={{ textAlign: "center", mt: 4 }}>
                    No restaurants match “{searchTerm}”.
                </Typography>
            )}
        </Box>
    );
};

export default HomePage;