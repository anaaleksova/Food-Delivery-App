import React, { useEffect, useMemo, useState } from "react";
import {
    Box,
    Typography,
    TextField,
    InputAdornment,
    Button,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Chip,
    IconButton,
    Stack,
    Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import StarIcon from "@mui/icons-material/Star";
import { Link } from "react-router";
import restaurantRepository from "../../../../repository/restaurantRepository.js";

const FALLBACK =
    "https://via.placeholder.com/640x360.png?text=Restaurant";

const clamp = (lines = 2) => ({
    display: "-webkit-box",
    WebkitLineClamp: lines,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
});

const RestaurantRowCard = ({ r, onEdit, onDelete }) => (
    <Card
        elevation={0}
        sx={{
            border: "1px solid #E5E7EB",
            borderRadius: 2,
            boxShadow: "0 1px 6px rgba(0,0,0,.05)",
            p: 2,
            display: "flex",
            alignItems: "stretch",
            gap: 2,
        }}
    >
        <CardMedia
            component="img"
            src={r.imageUrl || FALLBACK}
            alt={r.name}
            onError={(e) => {
                if (e.currentTarget.src !== FALLBACK) e.currentTarget.src = FALLBACK;
            }}
            sx={{
                width: 160,
                height: 110,
                objectFit: "cover",
                flexShrink: 0,
                borderRadius: 1,
                background: "#f3f4f6",
            }}
        />

        <CardContent
            sx={{
                p: 0,
                flex: 1,
                display: "grid",
                gridTemplateRows: "auto auto 1fr auto",
                rowGap: 0.75,
            }}
        >
            <Typography variant="h6" sx={clamp(1)}>{r.name}</Typography>

            <Typography variant="body2" color="text.secondary" sx={clamp(2)}>
                {r.description || "No description provided."}
            </Typography>

            <Stack
                direction="row"
                spacing={1.5}
                alignItems="center"
                sx={{ color: "text.secondary" }}
            >
                <Stack direction="row" spacing={0.5} alignItems="center">
                    <StarIcon sx={{ color: "#f59e0b", fontSize: 18 }} />
                    <Typography variant="body2">{r.rating ?? 4.5}</Typography>
                </Stack>

                <Stack direction="row" spacing={0.5} alignItems="center">
                    <AccessTimeIcon sx={{ fontSize: 16 }} />
                    <Typography variant="body2">
                        {r.deliveryTimeEstimate ?? 30} min
                    </Typography>
                </Stack>

                <Chip
                    size="small"
                    color={r.isOpen ? "success" : "default"}
                    label={r.isOpen ? "Open" : "Closed"}
                    sx={{ fontWeight: 600 }}
                />
            </Stack>

            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                <Tooltip title="Edit">
                    <IconButton onClick={() => onEdit?.(r)} size="small" color="primary">
                        <EditIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                    <IconButton onClick={() => onDelete?.(r)} size="small" color="error">
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
                <Box sx={{ flex: 1 }} />
                <Button
                    variant="contained"
                    color="secondary"
                    component={Link}
                    to={`/restaurants/${r.id}`}
                    sx={{ borderRadius: 1.5, fontWeight: 700 }}
                >
                    View Menu
                </Button>
            </Stack>
        </CardContent>
    </Card>
);

const AdminRestaurants = () => {
    const [rows, setRows] = useState([]);
    const [q, setQ] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let live = true;
        restaurantRepository
            .findAll()
            .then((res) => live && setRows(res?.data || []))
            .catch((err) => console.error("Load restaurants failed", err))
            .finally(() => live && setLoading(false));
        return () => { live = false; };
    }, []);

    const filtered = useMemo(() => {
        const s = q.trim().toLowerCase();
        if (!s) return rows;
        return rows.filter(
            (r) =>
                r.name?.toLowerCase().includes(s) ||
                r.description?.toLowerCase().includes(s)
        );
    }, [rows, q]);

    const onAdd = () => alert("TODO: open Add Restaurant dialog");
    const onEdit = (r) => alert(`TODO: edit restaurant ${r.name}`);
    const onDelete = (r) => {
        const ok = window.confirm(`Delete "${r.name}"?`);
        if (!ok) return;
        alert("TODO: call delete endpoint, then refresh list.");
    };

    return (
        <Box>
            {/* Toolbar */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    flexWrap: "wrap",
                    mb: 3,
                }}
            >
                <Typography variant="h4" sx={{ fontWeight: 800, mr: "auto" }}>
                    Restaurant Management
                </Typography>

                <TextField
                    placeholder="Search restaurants…"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    sx={{
                        width: { xs: "100%", sm: 340, md: 420 },
                        background: "#fff",
                        borderRadius: 2,
                        "& .MuiOutlinedInput-root": { borderRadius: 2 },
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />

                <Button
                    onClick={onAdd}
                    variant="contained"
                    color="secondary"
                    startIcon={<AddIcon />}
                    sx={{ borderRadius: 2, fontWeight: 700 }}
                >
                    Add Restaurant
                </Button>
            </Box>

            {/* List */}
            {loading ? (
                <Typography>Loading…</Typography>
            ) : filtered.length ? (
                <Grid container spacing={2}>
                    {filtered.map((r) => (
                        <Grid item xs={12} key={r.id}>
                            <RestaurantRowCard r={r} onEdit={onEdit} onDelete={onDelete} />
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Typography color="text.secondary" sx={{ mt: 2 }}>
                    No restaurants match “{q}”.
                </Typography>
            )}
        </Box>
    );
};

export default AdminRestaurants;
