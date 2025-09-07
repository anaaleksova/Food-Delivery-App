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
                    maxWidth: 400,      // same width as login page
                    width: "95%",
                    mx: "auto",
                    my: 4,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                }}
            >
                {/* Brand */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                    <Avatar sx={{ bgcolor: "#f97316", width: 32, height: 32 }}>
                        <LocalDining fontSize="small" />
                    </Avatar>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        Ana2AnaFoodDelivery
                    </Typography>
                </Box>

                <Typography variant="h5" className="auth-title">Create account</Typography>
                <Typography className="auth-subtitle">It takes less than a minute.</Typography>

                {/* Form Fields */}
                <TextField
                    label="Username"
                    fullWidth
                    size="medium"
                    margin="dense"
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                    required
                />
                <TextField
                    label="First name"
                    fullWidth
                    size="medium"
                    margin="dense"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                />
                <TextField
                    label="Last name"
                    fullWidth
                    size="medium"
                    margin="dense"
                    value={form.surname}
                    onChange={(e) => setForm({ ...form, surname: e.target.value })}
                    required
                />
                <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    size="medium"
                    margin="dense"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                />
                <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    size="medium"
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

                <Box className="auth-footer">
                    <span>Already have an account? </span>
                    <Link to="/login">Sign in</Link>
                </Box>
            </Box>
        </AuthLayout>
    );
};

export default RegisterPage;
