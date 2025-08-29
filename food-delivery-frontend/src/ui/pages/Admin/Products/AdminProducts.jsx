import React, { useEffect, useMemo, useState } from "react";
import {
    Box,
    Typography,
    TextField,
    InputAdornment,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    IconButton,
    MenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link } from "react-router";
import productRepository from "../../../../repository/productRepository.js";
import restaurantRepository from "../../../../repository/restaurantRepository.js";

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const [restaurantId, setRestaurantId] = useState("");
    const [q, setQ] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let live = true;
        Promise.all([
            productRepository.findAll(),
            restaurantRepository.findAll(),
        ])
            .then(([p, r]) => {
                if (!live) return;
                setProducts(p?.data || []);
                setRestaurants(r?.data || []);
            })
            .catch((err) => console.error("Load failed", err))
            .finally(() => live && setLoading(false));
        return () => { live = false; };
    }, []);

    const filtered = useMemo(() => {
        let list = products;
        if (restaurantId) {
            list = list.filter(
                (p) => String(p.restaurantId) === String(restaurantId)
            );
        }
        const s = q.trim().toLowerCase();
        if (s) {
            list = list.filter(
                (p) =>
                    p.name?.toLowerCase().includes(s) ||
                    p.description?.toLowerCase().includes(s) ||
                    p.category?.toLowerCase().includes(s)
            );
        }
        return list;
    }, [products, restaurantId, q]);

    const onAdd = () => alert("TODO: open Add Product dialog");
    const onEdit = (p) => alert(`TODO: edit product ${p.name}`);
    const onDelete = (p) => {
        const ok = window.confirm(`Delete "${p.name}"?`);
        if (!ok) return;
        alert("TODO: call delete endpoint, then refresh list.");
    };

    return (
        <Box>
            {/* Toolbar: title, filter, search, add */}
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
                    Product Management
                </Typography>

                <Box sx={{ display: "grid", gap: 1 }}>
                    <Typography
                        variant="body2"
                        sx={{ color: "text.secondary", fontWeight: 600 }}
                    >
                        Filter by Restaurant
                    </Typography>
                    <TextField
                        select
                        value={restaurantId}
                        onChange={(e) => setRestaurantId(e.target.value)}
                        placeholder="All restaurants"
                        sx={{
                            minWidth: { xs: "100%", sm: 260 },
                            background: "#fff",
                            borderRadius: 2,
                            "& .MuiOutlinedInput-root": { borderRadius: 2 },
                        }}
                    >
                        <MenuItem value="">All restaurants</MenuItem>
                        {restaurants.map((r) => (
                            <MenuItem key={r.id} value={r.id}>
                                {r.name}
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>

                <TextField
                    placeholder="Search products…"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    sx={{
                        width: { xs: "100%", sm: 320, md: 380 },
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
                    Add Product
                </Button>
            </Box>

            {/* Table */}
            {loading ? (
                <Typography>Loading…</Typography>
            ) : (
                <TableContainer
                    component={Paper}
                    elevation={0}
                    sx={{
                        border: "1px solid #E5E7EB",
                        borderRadius: 2,
                        overflow: "hidden",
                    }}
                >
                    <Table sx={{ minWidth: 960 }}>
                        <TableHead>
                            <TableRow sx={{ bgcolor: "#F9FAFB" }}>
                                <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Restaurant</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Price</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Quantity</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Available</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filtered.map((p) => (
                                <TableRow key={p.id} hover>
                                    <TableCell sx={{ width: 320 }}>
                                        <Box sx={{ display: "grid" }}>
                                            <Typography sx={{ fontWeight: 600 }}>{p.name}</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {p.description}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        {
                                            restaurants.find(
                                                (r) => String(r.id) === String(p.restaurantId)
                                            )?.name
                                        }
                                    </TableCell>
                                    <TableCell>{p.category}</TableCell>
                                    <TableCell>€{Number(p.price ?? 0).toFixed(2)}</TableCell>
                                    <TableCell>{p.quantity ?? 0}</TableCell>
                                    <TableCell>
                                        <Chip
                                            size="small"
                                            color={p.isAvailable ? "success" : "default"}
                                            label={p.isAvailable ? "Yes" : "No"}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => onEdit(p)} color="primary">
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton onClick={() => onDelete(p)} color="error">
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {!filtered.length && (
                                <TableRow>
                                    <TableCell colSpan={7} align="center">
                                        <Typography color="text.secondary">
                                            No products match your filters.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
};

export default AdminProducts;
