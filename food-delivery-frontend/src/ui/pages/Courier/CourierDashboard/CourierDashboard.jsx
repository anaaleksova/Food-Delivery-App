import React, {useEffect, useState} from 'react';
import {
    Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Button, Box, Card, CardContent,
    Chip, Alert
} from "@mui/material";
import axiosInstance from "../../../../axios/axios.js";
import useAuth from "../../../../hooks/useAuth.js";

const CourierDashboard = () => {
    const [confirmedOrders, setConfirmedOrders] = useState([]);
    const [myOrders, setMyOrders] = useState([]);
    const [myDeliveredOrders, setMyDeliveredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const {user} = useAuth();

    const fetchOrders = async () => {
        try {
            const [confirmedRes, myOrdersRes,myDeliveredOrdersRes] = await Promise.all([
                axiosInstance.get('/orders/confirmed'),
                axiosInstance.get('/couriers/my-orders'),
                axiosInstance.get('/couriers/my-delivered-orders')
            ]);
            setConfirmedOrders(confirmedRes.data);
            setMyOrders(myOrdersRes.data);
            setMyDeliveredOrders(myDeliveredOrdersRes.data);
        } catch (err) {
            console.error('Error fetching orders:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleAssign = async (orderId) => {
        try {
            await axiosInstance.post(`/couriers/assign/${orderId}`);
            await fetchOrders();
            alert('Order assigned successfully!');
        } catch (err) {
            alert('Failed to assign order: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleComplete = async (orderId) => {
        try {
            await axiosInstance.post(`/couriers/complete/${orderId}`);
            await fetchOrders();
            alert('Order completed successfully!');
        } catch (err) {
            alert('Failed to complete order: ' + (err.response?.data?.message || err.message));
        }
    };


    const getStatusColor = (status) => {
        switch (status) {
            case 'CONFIRMED': return 'primary';
            case 'PICKED_UP': return 'warning';
            case 'DELIVERED': return 'success';
            default: return 'default';
        }
    };

    if (loading) return <Typography>Loading...</Typography>;

    return (
        <Box>
            <Typography variant="h4" sx={{ mb: 3 }}>
                Courier Dashboard
            </Typography>

            <Alert severity="info" sx={{ mb: 3 }}>
                Welcome, {user?.username}! You can assign yourself to confirmed orders and track your deliveries.
            </Alert>

            {/* Available Orders Section */}
            <Card sx={{ mb: 4 }}>
                <CardContent>
                    <Typography variant="h5" sx={{ mb: 2 }}>
                        Available Orders for Pickup
                    </Typography>

                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Order ID</TableCell>
                                    <TableCell>Customer</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Items</TableCell>
                                    <TableCell>Total</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {confirmedOrders.filter(order => order.status === 'CONFIRMED').map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell>#{order.id}</TableCell>
                                        <TableCell>{order.username}</TableCell>
                                        <TableCell>
                                            <Chip label={order.status} color={getStatusColor(order.status)} size="small" />
                                        </TableCell>
                                        <TableCell>
                                            {order.products?.length || 0} items
                                        </TableCell>
                                        <TableCell>{order.total?.toFixed(2) || '0.00'} ден.</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                size="small"
                                                onClick={() => handleAssign(order.id)}
                                            >
                                                Start Delivery
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {confirmedOrders.filter(order => order.status === 'CONFIRMED').length === 0 && (
                        <Typography color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                            No orders available for pickup.
                        </Typography>
                    )}
                </CardContent>
            </Card>

            {/* My Deliveries Section */}
            <Card>
                <CardContent>
                    <Typography variant="h5" sx={{ mb: 2 }}>
                        My Active Deliveries
                    </Typography>

                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Order ID</TableCell>
                                    <TableCell>Customer</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Items</TableCell>
                                    <TableCell>Total</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {myOrders.filter(order => order.status !== 'DELIVERED').map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell>#{order.id}</TableCell>
                                        <TableCell>{order.username}</TableCell>
                                        <TableCell>
                                            <Chip label={order.status} color={getStatusColor(order.status)} size="small" />
                                        </TableCell>
                                        <TableCell>
                                            {order.products?.length || 0} items
                                        </TableCell>
                                        <TableCell>{order.total?.toFixed(2) || '0.00'} ден.</TableCell>
                                        <TableCell>
                                            {order.status === 'PICKED_UP' && (
                                                <Button
                                                    variant="contained"
                                                    color="success"
                                                    size="small"
                                                    onClick={() => handleComplete(order.id)}
                                                >
                                                    Mark Delivered
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {myOrders.filter(order => order.status !== 'DELIVERED').length === 0 && (
                        <Typography color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                            No active deliveries.
                        </Typography>
                    )}
                </CardContent>
            </Card>

            {/* My Delivered Orders Section */}
            <Card sx={{ mt: 4 }}>
                <CardContent>
                    <Typography variant="h5" sx={{ mb: 2 }}>
                        My Delivered Orders
                    </Typography>

                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Order ID</TableCell>
                                    <TableCell>Customer</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Items</TableCell>
                                    <TableCell>Total</TableCell>
                                    <TableCell>Delivered At</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {myDeliveredOrders.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell>#{order.id}</TableCell>
                                        <TableCell>{order.username}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={order.status}
                                                color={getStatusColor(order.status)}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {order.products?.length || 0} items
                                        </TableCell>
                                        <TableCell>{order.total?.toFixed(2) || "0.00"} ден.</TableCell>
                                        <TableCell>
                                            {order.deliveredAt
                                                ? new Date(order.deliveredAt).toLocaleString()
                                                : "-"}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {myDeliveredOrders.length === 0 && (
                        <Typography
                            color="text.secondary"
                            sx={{ textAlign: "center", py: 3 }}
                        >
                            No delivered orders yet.
                        </Typography>
                    )}
                </CardContent>
            </Card>

        </Box>
    );
};

export default CourierDashboard;