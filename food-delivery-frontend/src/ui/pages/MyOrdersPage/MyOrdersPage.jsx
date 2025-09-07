import React, { useEffect, useState } from "react";
import orderRepository from "../../../repository/orderRepository.js";
import { useNavigate } from "react-router";
import { Box, Typography, Card, CardContent, CardActions, Button, Grid } from "@mui/material";

const MyOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        orderRepository.getMyOrders().then((res) => {
            setOrders(res.data);
        });
    }, []);

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                My Orders
            </Typography>

            {orders.length === 0 ? (
                <Typography>No confirmed orders yet.</Typography>
            ) : (
                <Grid container spacing={2}>
                    {orders.map((order) => (
                        <Grid item xs={12} sm={6} md={4} key={order.id}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Order #{order.id}
                                    </Typography>
                                    <Typography color="text.secondary">
                                        Restaurant: {order.restaurantName}
                                    </Typography>
                                    <Typography color="text.secondary">
                                        Total: {order.total.toFixed(2)}ден.
                                    </Typography>
                                    <Typography color="primary" sx={{ mt: 1 }}>
                                        Status: {order.status}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button
                                        size="small"
                                        variant="contained"
                                        color="primary"
                                        onClick={() => {
                                            console.log('Navigating to track order', order.id);
                                            navigate(`/orders/track/${order.id}`);
                                        }}
                                    >
                                        Track Order
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
};

export default MyOrdersPage;
