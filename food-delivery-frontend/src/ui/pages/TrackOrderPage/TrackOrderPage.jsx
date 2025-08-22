import React, {useEffect, useState} from 'react';
import {useParams} from "react-router";
import {
    Typography, Card, CardContent, Box, Stepper, Step, StepLabel,
    Chip, Divider, LinearProgress
} from "@mui/material";
import axiosInstance from "../../../axios/axios.js";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PersonIcon from '@mui/icons-material/Person';

const TrackOrderPage = () => {
    const {orderId} = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await axiosInstance.get(`/orders/track/${orderId}`);
                setOrder(response.data);
            } catch (err) {
                console.error('Error fetching order:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();

        // Poll for updates every 30 seconds
        const interval = setInterval(fetchOrder, 30000);
        return () => clearInterval(interval);
    }, [orderId]);

    const getActiveStep = (status) => {
        switch (status) {
            case 'CONFIRMED': return 0;
            case 'ACCEPTED_BY_RESTAURANT': return 1;
            case 'IN_PREPARATION': return 2;
            case 'READY_FOR_PICKUP': return 3;
            case 'PICKED_UP': return 4;
            case 'EN_ROUTE': return 4;
            case 'DELIVERED': return 5;
            default: return 0;
        }
    };

    const steps = [
        'Order Confirmed',
        'Restaurant Accepted',
        'Preparing Food',
        'Ready for Pickup',
        'Out for Delivery',
        'Delivered'
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'CONFIRMED': return 'info';
            case 'PICKED_UP':
            case 'EN_ROUTE': return 'warning';
            case 'DELIVERED': return 'success';
            default: return 'default';
        }
    };

    if (loading) return <LinearProgress />;
    if (!order) return <Typography>Order not found.</Typography>;

    const activeStep = getActiveStep(order.status);

    return (
        <Box>
            <Typography variant="h4" sx={{ mb: 3 }}>
                Track Order #{order.id}
            </Typography>

            {/* Order Status */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                        <Typography variant="h6">Order Status</Typography>
                        <Chip
                            label={order.status.replace(/_/g, ' ')}
                            color={getStatusColor(order.status)}
                            icon={order.status === 'DELIVERED' ? <CheckCircleIcon /> : <LocalShippingIcon />}
                        />
                    </Box>

                    <Stepper activeStep={activeStep} alternativeLabel>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </CardContent>
            </Card>

            {/* Courier Information */}
            {order.courier && (
                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PersonIcon /> Your Courier
                        </Typography>
                        <Typography variant="body1">
                            <strong>Name:</strong> {order.courier.name}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Phone:</strong> {order.courier.phone}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Your courier is {order.courier.active ? 'available' : 'currently delivering your order'}
                        </Typography>
                    </CardContent>
                </Card>
            )}

            {/* Order Details */}
            <Card>
                <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Order Details
                    </Typography>

                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Order placed: {order.placedAt ? new Date(order.placedAt).toLocaleString() : 'N/A'}
                        </Typography>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="subtitle1" sx={{ mb: 1 }}>Items:</Typography>
                    {order.Products?.map((item, index) => (
                        <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography>{item.name}</Typography>
                            <Typography>€{item.price?.toFixed(2)}</Typography>
                        </Box>
                    ))}

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="h6">Total:</Typography>
                        <Typography variant="h6">€{order.total?.toFixed(2) || '0.00'}</Typography>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default TrackOrderPage;