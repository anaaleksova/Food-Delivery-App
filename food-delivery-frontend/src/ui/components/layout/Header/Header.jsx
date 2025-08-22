import React from 'react';
import {AppBar, Toolbar, Typography, Box, Button, IconButton} from "@mui/material";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import {Link, useNavigate} from "react-router";
import useAuth from "../../../../hooks/useAuth.js";

const Header = () => {
    const {user, logout} = useAuth();
    const navigate = useNavigate();

    const getDashboardLink = () => {
        if (!user) return null;

        if (user.roles?.includes('ADMIN')) {
            return (
                <Button color="inherit" startIcon={<AdminPanelSettingsIcon/>} component={Link} to="/admin">
                    Admin Panel
                </Button>
            );
        }

        if (user.roles?.includes('COURIER')) {
            return (
                <Button color="inherit" startIcon={<DeliveryDiningIcon/>} component={Link} to="/courier">
                    Courier Dashboard
                </Button>
            );
        }

        return null;
    };

    return (
        <AppBar position="static" color="primary">
            <Toolbar sx={{display: 'flex', gap: 2}}>
                <RestaurantIcon/>

                <Typography variant="h6" sx={{flexGrow: 1}} component={Link} to="/"
                                style={{color: "#fff", textDecoration: "none"}}>
                        Food Delivery
                </Typography>


                {user?.roles?.includes('CUSTOMER') && (
                    <Button color="inherit" startIcon={<ShoppingCartIcon/>} component={Link} to="/cart">
                        Cart
                    </Button>
                )}

                {getDashboardLink()}

                {user ? (
                    <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                        <Typography variant="body2">Hello, {user.username}</Typography>
                        <Button color="inherit" onClick={() => {
                            logout();
                            navigate('/');
                        }}>Logout</Button>
                    </Box>
                ) : (
                    <Box sx={{display: 'flex', gap: 1}}>
                        <Button color="inherit" component={Link} to="/login">Login</Button>
                        <Button color="inherit" component={Link} to="/register">Register</Button>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
}
export default Header;