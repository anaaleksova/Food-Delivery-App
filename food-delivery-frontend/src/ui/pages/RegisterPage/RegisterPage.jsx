import React, { useState } from "react";
import {
    Box,
    Button,
    TextField,
    Typography,
    Avatar,
} from "@mui/material";
import { LocalDining } from "@mui/icons-material";
import { useNavigate, Link } from "react-router";
import userRepository from "../../../repository/userRepository.js";
import AuthLayout from "../../components/Auth/AuthLayout.jsx";

const RegisterPage = () => {
    const [form, setForm] = useState({
        username: "",
        name: "",
        surname: "",
        email: "",
        password: "",
        phone: "",
        role: "ROLE_CUSTOMER",
    });
    const navigate = useNavigate();

    const submit = async (e) => {
        e.preventDefault();
        try {
            await userRepository.register(form);
            alert("Registration successful. You can log in now.");
            navigate("/login");
        } catch (err) {
            console.error(err);
            alert("Registration failed.");
        }
    };

    return (
        <AuthLayout>
            <Box
                component="form"
                onSubmit={submit}
                sx={{
                    maxWidth: 360,    // slightly narrower
                    width: "95%",
                    mx: "auto",
                    my: 3,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,        // less vertical space
                }}
            >
                {/* Brand */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                    <Avatar sx={{ bgcolor: "#f97316", width: 28, height: 28 }}>
                        <LocalDining fontSize="small" />
                    </Avatar>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        Ana2AnaFoodDelivery
                    </Typography>
                </Box>

                <Typography variant="h6">Create account</Typography>
                <Typography sx={{ fontSize: "0.85rem", color: "text.secondary" }}>
                    It takes less than a minute.
                </Typography>

                {/* Form Fields */}
                <TextField
                    label="Username"
                    fullWidth
                    size="small"
                    margin="dense"
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                    required
                />
                <TextField
                    label="First name"
                    fullWidth
                    size="small"
                    margin="dense"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                />
                <TextField
                    label="Last name"
                    fullWidth
                    size="small"
                    margin="dense"
                    value={form.surname}
                    onChange={(e) => setForm({ ...form, surname: e.target.value })}
                    required
                />
                <TextField
                    label="Phone number"
                    fullWidth
                    size="small"
                    margin="dense"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    required
                />
                <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    size="small"
                    margin="dense"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                />
                <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    size="small"
                    margin="dense"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                />

                <Button
                    type="submit"
                    variant="contained"
                    sx={{ mt: 1, width: "100%" }}
                >
                    Sign up
                </Button>

                <Box sx={{ fontSize: "0.85rem", textAlign: "center", mt: 1 }}>
                    <span>Already have an account? </span>
                    <Link to="/login">Sign in</Link>
                </Box>
            </Box>
        </AuthLayout>
    );
};

export default RegisterPage;
