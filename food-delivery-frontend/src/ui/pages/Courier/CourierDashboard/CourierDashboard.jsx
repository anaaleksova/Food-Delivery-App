import React, { useEffect, useState } from "react";
import {
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Box,
    Card,
    CardContent,
    Chip,
    Tooltip,
    Popover,
    List,
    ListItem,
    ListItemText,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import axiosInstance from "../../../../axios/axios.js";
import useAuth from "../../../../hooks/useAuth.js";
import Alert from "../../../../common/Alert.jsx"; //

const CourierDashboard = () => {
    const [confirmedOrders, setConfirmedOrders] = useState([]);
    const [myOrders, setMyOrders] = useState([]);
    const [myDeliveredOrders, setMyDeliveredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    // Popover state
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState([]);

    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    const handleItemsClick = (event, products) => {
        setAnchorEl(event.currentTarget);
        setSelectedProducts(products || []);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    const fetchOrders = async () => {
        try {
            const [confirmedRes, myOrdersRes, myDeliveredOrdersRes] = await Promise.all([
                axiosInstance.get("/orders/confirmed"),
                axiosInstance.get("/couriers/my-orders"),
                axiosInstance.get("/couriers/my-delivered-orders"),
            ]);
            setConfirmedOrders(confirmedRes.data);
            setMyOrders(myOrdersRes.data);
            setMyDeliveredOrders(myDeliveredOrdersRes.data);
        } catch (err) {
            console.error("Error fetching orders:", err);
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
            setAlertMessage("Order assigned successfully!");
            setAlertOpen(true);
        } catch (err) {
            setAlertMessage(
                "Failed to assign order: " + (err.response?.data?.message || err.message)
            );
            setAlertOpen(true);
        }
    };

    const handleComplete = async (orderId) => {
        try {
            await axiosInstance.post(`/couriers/complete/${orderId}`);
            await fetchOrders();
            setAlertMessage("Order completed successfully!");
            setAlertOpen(true);
        } catch (err) {
            setAlertMessage(
                "Failed to complete order: " + (err.response?.data?.message || err.message)
            );
            setAlertOpen(true);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "CONFIRMED":
                return "primary";
            case "PICKED_UP":
                return "warning";
            case "DELIVERED":
                return "success";
            default:
                return "default";
        }
    };

    if (loading) return <Typography>Loading...</Typography>;

    const TruncatedCell = ({ children, title }) => (
        <Tooltip title={title || ""}>
      <span
          style={{
              display: "inline-block",
              maxWidth: "100%",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
          }}
      >
        {children}
      </span>
        </Tooltip>
    );

    return (
        <Box>
            <Typography variant="h4" sx={{ mb: 3 }}>
                Courier Dashboard
            </Typography>

            {/* Info banner (keep MUI look) */}
            <MuiAlert severity="info" sx={{ mb: 3 }}>
                Welcome, {user?.username}! You can assign yourself to confirmed orders and track your deliveries.
            </MuiAlert>

            {/* Available Orders Section */}
            <Card sx={{ mb: 4 }}>
                <CardContent>
                    <Typography variant="h5" sx={{ mb: 2 }}>
                        Available Orders for Pickup
                    </Typography>

                    <TableContainer component={Paper}>
                        <Table sx={{ tableLayout: "fixed" }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ width: "10%" }}>Order ID</TableCell>
                                    <TableCell sx={{ width: "10%" }}>Customer</TableCell>
                                    <TableCell sx={{ width: "15%" }}>Status</TableCell>
                                    <TableCell sx={{ width: "15%" }}>Restaurant</TableCell>
                                    <TableCell sx={{ width: "10%" }}>Items</TableCell>
                                    <TableCell sx={{ width: "17%" }}>Address</TableCell>
                                    <TableCell sx={{ width: "13%" }}>Total</TableCell>
                                    <TableCell sx={{ width: "15%" }}>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {confirmedOrders
                                    .filter((order) => order.status === "CONFIRMED")
                                    .map((order) => (
                                        <TableRow key={order.id}>
                                            <TableCell>#{order.id}</TableCell>
                                            <TableCell>
                                                <TruncatedCell title={order.userUsername}>
                                                    {order.userUsername}
                                                </TruncatedCell>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={order.status}
                                                    color={getStatusColor(order.status)}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <TruncatedCell title={order.restaurantName}>
                                                    {order.restaurantName}
                                                </TruncatedCell>
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    onClick={(e) => handleItemsClick(e, order.products)}
                                                >
                                                    {order.products?.length || 0} items
                                                </Button>
                                            </TableCell>
                                            <TableCell>
                                                <TruncatedCell title={order.deliveryAddress?.line1}>
                                                    {order.deliveryAddress?.line1}
                                                </TruncatedCell>
                                            </TableCell>
                                            <TableCell>
                                                {order.total?.toFixed(2) || "0.00"} ден.
                                            </TableCell>
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
                </CardContent>
            </Card>

            {/* My Active Deliveries */}
            <Card>
                <CardContent>
                    <Typography variant="h5" sx={{ mb: 2 }}>
                        My Active Deliveries
                    </Typography>

                    <TableContainer component={Paper}>
                        <Table sx={{ tableLayout: "fixed" }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ width: "10%" }}>Order ID</TableCell>
                                    <TableCell sx={{ width: "10%" }}>Customer</TableCell>
                                    <TableCell sx={{ width: "15%" }}>Status</TableCell>
                                    <TableCell sx={{ width: "15%" }}>Restaurant</TableCell>
                                    <TableCell sx={{ width: "10%" }}>Items</TableCell>
                                    <TableCell sx={{ width: "17%" }}>Address</TableCell>
                                    <TableCell sx={{ width: "13%" }}>Total</TableCell>
                                    <TableCell sx={{ width: "15%" }}>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {myOrders
                                    .filter((order) => order.status !== "DELIVERED")
                                    .map((order) => (
                                        <TableRow key={order.id}>
                                            <TableCell>#{order.id}</TableCell>
                                            <TableCell>
                                                <TruncatedCell title={order.userUsername}>
                                                    {order.userUsername}
                                                </TruncatedCell>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={order.status}
                                                    color={getStatusColor(order.status)}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <TruncatedCell title={order.restaurantName}>
                                                    {order.restaurantName}
                                                </TruncatedCell>
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    onClick={(e) => handleItemsClick(e, order.products)}
                                                >
                                                    {order.products?.length || 0} items
                                                </Button>
                                            </TableCell>
                                            <TableCell>
                                                <TruncatedCell title={order.deliveryAddress?.line1}>
                                                    {order.deliveryAddress?.line1}
                                                </TruncatedCell>
                                            </TableCell>
                                            <TableCell>
                                                {order.total?.toFixed(2) || "0.00"} ден.
                                            </TableCell>
                                            <TableCell>
                                                {order.status === "PICKED_UP" && (
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
                </CardContent>
            </Card>

            {/* My Delivered Orders */}
            <Card sx={{ mt: 4 }}>
                <CardContent>
                    <Typography variant="h5" sx={{ mb: 2 }}>
                        My Delivered Orders
                    </Typography>

                    <TableContainer component={Paper}>
                        <Table sx={{ tableLayout: "fixed" }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ width: "10%" }}>Order ID</TableCell>
                                    <TableCell sx={{ width: "10%" }}>Customer</TableCell>
                                    <TableCell sx={{ width: "15%" }}>Status</TableCell>
                                    <TableCell sx={{ width: "15%" }}>Restaurant</TableCell>
                                    <TableCell sx={{ width: "10%" }}>Items</TableCell>
                                    <TableCell sx={{ width: "17%" }}>Address</TableCell>
                                    <TableCell sx={{ width: "13%" }}>Total</TableCell>
                                    <TableCell sx={{ width: "15%" }}>Delivered At</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {myDeliveredOrders.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell>#{order.id}</TableCell>
                                        <TableCell>
                                            <TruncatedCell title={order.userUsername}>
                                                {order.userUsername}
                                            </TruncatedCell>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={order.status}
                                                color={getStatusColor(order.status)}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TruncatedCell title={order.restaurantName}>
                                                {order.restaurantName}
                                            </TruncatedCell>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                onClick={(e) => handleItemsClick(e, order.products)}
                                            >
                                                {order.products?.length || 0} items
                                            </Button>
                                        </TableCell>
                                        <TableCell>
                                            <TruncatedCell title={order.deliveryAddress?.line1}>
                                                {order.deliveryAddress?.line1}
                                            </TruncatedCell>
                                        </TableCell>
                                        <TableCell>
                                            {order.total?.toFixed(2) || "0.00"} ден.
                                        </TableCell>
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
                </CardContent>
            </Card>

            {/* Items Popover */}
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handlePopoverClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                transformOrigin={{ vertical: "top", horizontal: "left" }}
            >
                <Box sx={{ p: 2, maxWidth: 250 }}>
                    <Typography variant="subtitle1" sx={{ mb: 1 }} />
                    {selectedProducts.length > 0 ? (
                        <List dense>
                            {selectedProducts.map((p, i) => (
                                <ListItem key={i} disablePadding>
                                    <ListItemText primary={p.name} />
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Typography color="text.secondary">No products</Typography>
                    )}
                </Box>
            </Popover>
            <Alert
                open={alertOpen}
                onClose={() => setAlertOpen(false)}
                message={alertMessage}
            />
        </Box>
    );
};

export default CourierDashboard;