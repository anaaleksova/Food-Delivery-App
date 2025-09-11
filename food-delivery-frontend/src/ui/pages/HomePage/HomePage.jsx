import React, { useEffect, useMemo, useState } from "react";
import {
    Typography,
    Grid,
    Card,
    CardContent,
    CardActions,
    Button,
    Box,
    Chip,
    TextField,
} from "@mui/material";
import { Link } from "react-router"; // per your setup (not react-router-dom)
import restaurantRepository from "../../../repository/restaurantRepository.js";
import banner from "../../../assets/banner.png";

/* ---------- opening-hours helpers (daily string only) ---------- */
const timeToMinutes = (hhmm) => {
    const [h, m] = (hhmm || "").split(":").map(Number);
    return (h || 0) * 60 + (m || 0);
};

const parseIntervals = (value) => {
    if (!value || typeof value !== "string") return [];
    return value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((part) => {
            const [start, end] = part.split("-").map((s) => s.trim());
            if (!start || !end) return null;
            return { start: timeToMinutes(start), end: timeToMinutes(end) };
        })
        .filter(Boolean);
};

const isOpenAt = (nowMin, intervals) => {
    for (const { start, end } of intervals) {
        if (start === end) continue;
        if (start < end) {
            if (nowMin >= start && nowMin < end) return true;
        } else {
            // crosses midnight
            if (nowMin >= start || nowMin < end) return true;
        }
    }
    return false;
};

/* ---------- Restaurant card (screenshot-like style) ---------- */
const RestaurantCard = ({ restaurant }) => {
    // Time-based open/closed
    const [isOpenNow, setIsOpenNow] = useState(false);
    const intervals = useMemo(() => {
        const raw = restaurant?.openHours || "09:00-22:00";
        return parseIntervals(raw);
    }, [restaurant?.openHours]);

    useEffect(() => {
        const compute = () => {
            const now = new Date();
            const nowMin = now.getHours() * 60 + now.getMinutes();
            setIsOpenNow(isOpenAt(nowMin, intervals));
        };
        compute();
        const id = setInterval(compute, 60 * 1000);
        return () => clearInterval(id);
    }, [intervals]);

    return (
        <Card
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                borderRadius: 3, // ~24px
                overflow: "hidden",
                boxShadow:
                    "0 2px 10px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)",
                transition: "transform .15s ease, box-shadow .15s ease",
                "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow:
                        "0 8px 20px rgba(0,0,0,0.12), 0 3px 6px rgba(0,0,0,0.06)",
                },
            }}
        >
            {/* Top full-bleed image (rounded by card), no logo overlay */}
            <Box
                sx={{
                    position: "relative",
                    aspectRatio: "16 / 9",
                    bgcolor: "background.default",
                }}
            >
                <Box
                    component="img"
                    alt={restaurant.name}
                    src={
                        restaurant.imageUrl ||
                        "https://via.placeholder.com/800x450?text=Restaurant"
                    }
                    sx={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                    }}
                />
                {/* subtle bottom fade to make text readable if you decide to overlay later */}
                <Box
                    sx={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: "28%",
                        background:
                            "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,.06) 100%)",
                    }}
                />
            </Box>

            {/* Body with name and small meta row */}
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 700, mb: 0.5, lineHeight: 1.25 }}
                >
                    {restaurant.name}
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                    <Chip
                        label={`⭐ ${restaurant.averageRating ?? 4.5}`}
                        size="small"
                        variant="outlined"
                    />
                    <Chip
                        label={`${restaurant.deliveryTimeEstimate ?? 30} min`}
                        size="small"
                        variant="outlined"
                    />
                    <Chip
                        label={isOpenNow ? "Open" : "Closed"}
                        color={isOpenNow ? "success" : "default"}
                        size="small"
                    />
                </Box>
            </CardContent>

            <CardActions sx={{ pt: 0, px: 2, pb: 2 }}>
                <Button
                    size="small"
                    variant="contained"
                    component={Link}
                    to={`/restaurants/${restaurant.id}`}
                    fullWidth
                    sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700 }}
                >
                    View Menu
                </Button>
            </CardActions>
        </Card>
    );
};

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
            <Box
                sx={{
                    position: "relative",
                    /* center a viewport-wide box even if we're inside a padded Container */
                    mx: "calc(50% - 50dvw)",
                    width: "99.5dvw",                 // excludes scrollbar width
                    height: { xs: 280, md: 420 },
                    mb: 6,
                    overflow: "clip",                // avoids tiny overflows
                    backgroundImage: `url(${banner})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <Box
                    sx={{
                        position: "absolute",
                        inset: 0,
                        background:
                            "linear-gradient(rgba(0,0,0,.45), rgba(0,0,0,.45))",
                    }}
                />
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

                        <Typography
                            variant="body1"
                            sx={{ color: "rgba(255,255,255,.9)", mb: 3 }}
                        >
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
                    <Grid item key={restaurant.id} xs={12} sm={6} md={3}>
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