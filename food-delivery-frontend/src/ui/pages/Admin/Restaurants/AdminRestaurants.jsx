import React, {useEffect, useState} from 'react';
import {
    Typography, Grid, Card, CardContent, Button, Box, Dialog,
    DialogTitle, DialogContent, DialogActions, TextField, IconButton,
    CardActions, Chip
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import restaurantRepository from "../../../../repository/restaurantRepository.js";

const AdminRestaurants = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingRestaurant, setEditingRestaurant] = useState(null);
    const [form, setForm] = useState({
        name: '',
        description: '',
        openHours: '09:00-22:00',
        category: '',
        imageUrl: ''
    });

    const fetchRestaurants = async () => {
        try {
            const response = await restaurantRepository.findAll();
            setRestaurants(response.data);
        } catch (err) {
            console.error('Error fetching restaurants:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRestaurants();
    }, []);

    const handleAdd = () => {
        setEditingRestaurant(null);
        setForm({
            name: '',
            description: '',
            openHours: '09:00-22:00',
            category: '',
            imageUrl: ''
        });
        setDialogOpen(true);
    };

    const handleEdit = (restaurant) => {
        setEditingRestaurant(restaurant);
        setForm({
            name: restaurant.name || '',
            description: restaurant.description || '',
            openHours: restaurant.openHours || '09:00-22:00',
            category: restaurant.category || '',
            imageUrl: restaurant.imageUrl || ''
        });
        setDialogOpen(true);
    };

    const handleSave = async () => {
        try {
            if (editingRestaurant) {
                await restaurantRepository.edit(editingRestaurant.id, form);
            } else {
                await restaurantRepository.add(form);
            }
            await fetchRestaurants();
            setDialogOpen(false);
            alert('Restaurant saved successfully!');
        } catch (err) {
            alert('Failed to save restaurant: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this restaurant?')) return;

        try {
            await restaurantRepository.remove(id);
            await fetchRestaurants();
            alert('Restaurant deleted successfully!');
        } catch (err) {
            alert('Failed to delete restaurant: ' + (err.response?.data?.message || err.message));
        }
    };

    if (loading) return <Typography>Loading...</Typography>;

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">
                    Restaurant Management
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAdd}
                >
                    Add Restaurant
                </Button>
            </Box>

            <Grid container spacing={3}>
                {restaurants.map(restaurant => (
                    <Grid item xs={12} md={6} lg={4} key={restaurant.id}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography variant="h6" gutterBottom>
                                    {restaurant.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    {restaurant.description}
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    <strong>Hours:</strong> {restaurant.openHours || 'Not specified'}
                                </Typography>
                                {restaurant.category && (
                                    <Chip label={restaurant.category} size="small" sx={{ mb: 1 }} />
                                )}
                                <Chip
                                    label={restaurant.isOpen ? "Open" : "Closed"}
                                    color={restaurant.isOpen ? "success" : "error"}
                                    size="small"
                                />
                            </CardContent>
                            <CardActions>
                                <IconButton
                                    color="primary"
                                    onClick={() => handleEdit(restaurant)}
                                    size="small"
                                >
                                    <EditIcon />
                                </IconButton>
                                <IconButton
                                    color="error"
                                    onClick={() => handleDelete(restaurant.id)}
                                    size="small"
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {restaurants.length === 0 && (
                <Typography color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
                    No restaurants found.
                </Typography>
            )}

            {/* Add/Edit Dialog */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {editingRestaurant ? 'Edit Restaurant' : 'Add Restaurant'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'grid', gap: 2, mt: 1 }}>
                        <TextField
                            label="Name"
                            value={form.name}
                            onChange={(e) => setForm({...form, name: e.target.value})}
                            required
                        />
                        <TextField
                            label="Description"
                            value={form.description}
                            onChange={(e) => setForm({...form, description: e.target.value})}
                            multiline
                            rows={3}
                            required
                        />
                        <TextField
                            label="Opening Hours"
                            value={form.openHours}
                            onChange={(e) => setForm({...form, openHours: e.target.value})}
                            placeholder="09:00-22:00"
                        />
                        <TextField
                            label="Category"
                            value={form.category}
                            onChange={(e) => setForm({...form, category: e.target.value})}
                            placeholder="e.g., Italian, Fast Food"
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
                        {editingRestaurant ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminRestaurants;