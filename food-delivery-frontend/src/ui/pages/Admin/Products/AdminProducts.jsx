import React, {useEffect, useState} from 'react';
import {
    Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Button, Box, Dialog, DialogTitle,
    DialogContent, DialogActions, TextField, IconButton, MenuItem,
    Chip, FormControl, InputLabel, Select
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import productRepository from "../../../../repository/productRepository.js";
import restaurantRepository from "../../../../repository/restaurantRepository.js";

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState('');
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [form, setForm] = useState({
        name: '',
        description: '',
        price: 0,
        quantity: 0,
        restaurantId: '',
        category: '',
        imageUrl: ''
    });

    const fetchData = async () => {
        try {
            const [productsRes, restaurantsRes] = await Promise.all([
                productRepository.findAll(),
                restaurantRepository.findAll()
            ]);
            setProducts(productsRes.data);
            setRestaurants(restaurantsRes.data);
            setFilteredProducts(productsRes.data);
        } catch (err) {
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (selectedRestaurant) {
            setFilteredProducts(products.filter(p => String(p.restaurantId) === String(selectedRestaurant)));
        } else {
            setFilteredProducts(products);
        }
    }, [selectedRestaurant, products]);

    const getRestaurantName = (restaurantId) => {
        const restaurant = restaurants.find(r => r.id === restaurantId);
        return restaurant ? restaurant.name : 'Unknown Restaurant';
    };

    const handleAdd = () => {
        setEditingProduct(null);
        setForm({
            name: '',
            description: '',
            price: 0,
            quantity: 0,
            restaurantId: selectedRestaurant || '',
            category: '',
            imageUrl: ''
        });
        setDialogOpen(true);
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setForm({
            name: product.name || '',
            description: product.description || '',
            price: product.price || 0,
            quantity: product.quantity || 0,
            restaurantId: product.restaurantId || '',
            category: product.category || '',
            imageUrl: product.imageUrl || ''
        });
        setDialogOpen(true);
    };

    const handleSave = async () => {
        try {
            if (editingProduct) {
                const updated = await productRepository.edit(editingProduct.id, form);
                setProducts(products.map(p => p.id === editingProduct.id ? updated.data : p));
            } else {
                const added = await productRepository.add(form);
                setProducts([...products, added.data]);
            }
            setDialogOpen(false);
            alert('Product saved successfully!');
        } catch (err) {
            alert('Failed to save product: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;

        try {
            await productRepository.remove(id);
            await fetchData();
            alert('Product deleted successfully!');
        } catch (err) {
            alert('Failed to delete product: ' + (err.response?.data?.message || err.message));
        }
    };

    if (loading) return <Typography>Loading...</Typography>;

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">
                    Product Management
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAdd}
                >
                    Add Product
                </Button>
            </Box>

            {/* Restaurant Filter */}
            <Box sx={{ mb: 3 }}>
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Filter by Restaurant</InputLabel>
                    <Select
                        value={selectedRestaurant}
                        onChange={(e) => setSelectedRestaurant(e.target.value)}
                        label="Filter by Restaurant"
                    >
                        <MenuItem value="">All Restaurants</MenuItem>
                        {restaurants.map(restaurant => (
                            <MenuItem key={restaurant.id} value={restaurant.id}>
                                {restaurant.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Restaurant</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell>Available</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredProducts.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>
                                    <Box>
                                        <Typography variant="subtitle2">{product.name}</Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {product.description}
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>{getRestaurantName(product.restaurantId)}</TableCell>
                                <TableCell>
                                    {product.category && (
                                        <Chip label={product.category} size="small" />
                                    )}
                                </TableCell>
                                <TableCell>€{product.price?.toFixed(2)}</TableCell>
                                <TableCell>{product.quantity}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={product.isAvailable ? "Yes" : "No"}
                                        color={product.isAvailable ? "success" : "error"}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    <IconButton
                                        color="primary"
                                        onClick={() => handleEdit(product)}
                                        size="small"
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        color="error"
                                        onClick={() => handleDelete(product.id)}
                                        size="small"
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {filteredProducts.length === 0 && (
                <Typography color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
                    No products found.
                </Typography>
            )}

            {/* Add/Edit Dialog */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>
                    {editingProduct ? 'Edit Product' : 'Add Product'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'grid', gap: 2, mt: 1, gridTemplateColumns: 'repeat(2, 1fr)' }}>
                        <TextField
                            label="Name"
                            value={form.name}
                            onChange={(e) => setForm({...form, name: e.target.value})}
                            required
                        />
                        <TextField
                            select
                            label="Restaurant"
                            value={form.restaurantId}
                            onChange={(e) => setForm({...form, restaurantId: e.target.value})}
                            required
                        >
                            {restaurants.map(restaurant => (
                                <MenuItem key={restaurant.id} value={restaurant.id}>
                                    {restaurant.name}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            label="Description"
                            value={form.description}
                            onChange={(e) => setForm({...form, description: e.target.value})}
                            multiline
                            rows={2}
                            sx={{ gridColumn: '1 / -1' }}
                        />
                        <TextField
                            label="Price"
                            type="number"
                            value={form.price}
                            onChange={(e) => setForm({...form, price: parseFloat(e.target.value)})}
                            required
                        />
                        <TextField
                            label="Quantity"
                            type="number"
                            value={form.quantity}
                            onChange={(e) => setForm({...form, quantity: parseInt(e.target.value)})}
                            required
                        />
                        <TextField
                            label="Category"
                            value={form.category}
                            onChange={(e) => setForm({...form, category: e.target.value})}
                            placeholder="e.g., Appetizer, Main Course"
                        />
                        <TextField
                            label="Image URL"
                            value={form.imageUrl}
                            onChange={(e) => setForm({...form, imageUrl: e.target.value})}
                            placeholder="https://..."
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained">
                        {editingProduct ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminProducts;