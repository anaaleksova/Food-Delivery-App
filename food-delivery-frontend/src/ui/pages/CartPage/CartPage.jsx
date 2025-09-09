import React, { useState } from "react";
import useOrder from "../../../hooks/useOrder.js";
import OrderList from "../../components/order/OrderList/OrderList.jsx";
import orderRepository from "../../../repository/orderRepository.js";
import { useNavigate } from "react-router";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Typography,
    Box,
    Divider,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const CartPage = () => {
    const { order, loading, refresh } = useOrder();
    const navigate = useNavigate();

    const [showAddressDialog, setShowAddressDialog] = useState(false);
    const [address, setAddress] = useState({
        line1: "",
        line2: "",
        city: "",
        postalCode: "",
        country: "",
    });

    const onCheckout = () => {
        if (!order?.deliveryAddress) {
            setShowAddressDialog(true);
            return;
        }
        navigate("/checkout");
    };

    const onCancel = async () => {
        const ok = window.confirm("Remove all items from the cart?");
        if (!ok) return;
        await orderRepository.cancelPending();
        await refresh();
    };

    const handleSaveAddress = async () => {
        if (!address.line1 || !address.city || !address.country) {
            alert("Please fill in Line 1, City, and Country.");
            return;
        }
        await orderRepository.updateAddress(order.id, address);
        await refresh();
        setShowAddressDialog(false);
        navigate("/checkout");
    };

    if (loading) return <>Loading...</>;

    return (
        <Box sx={{ maxWidth: 1000, mx: "auto", mt: 4, px: 2 }}>
            {/* Header */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 1 }}>
                <ShoppingCartIcon color="primary" />
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    Your Cart
                </Typography>
            </Box>

            {/* Order list */}
            <OrderList order={order} onCheckout={onCheckout} onCancel={onCancel} refresh={refresh} />

            {/* Address Dialog */}
            <Dialog
                open={showAddressDialog}
                onClose={() => setShowAddressDialog(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{ fontWeight: 700 }}>Enter Delivery Address</DialogTitle>
                <Divider />
                <DialogContent sx={{ mt: 1 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Please provide your delivery details so we can bring your order right to your door.
                    </Typography>

                    <TextField
                        fullWidth
                        margin="normal"
                        label="Address Line 1"
                        value={address.line1}
                        onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Address Line 2"
                        value={address.line2}
                        onChange={(e) => setAddress({ ...address, line2: e.target.value })}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="City"
                        value={address.city}
                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Postal Code"
                        value={address.postalCode}
                        onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Country"
                        value={address.country}
                        onChange={(e) => setAddress({ ...address, country: e.target.value })}
                    />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setShowAddressDialog(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleSaveAddress} sx={{ borderRadius: 2 }}>
                        Save & Continue
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default CartPage;
