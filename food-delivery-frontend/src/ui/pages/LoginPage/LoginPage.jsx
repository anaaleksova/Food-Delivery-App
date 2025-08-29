import React, { useState } from "react";
import {
    Box, Button, Checkbox, FormControlLabel, IconButton, InputAdornment,
    TextField, Typography, Avatar
} from "@mui/material";
import { Visibility, VisibilityOff, LocalDining } from "@mui/icons-material";
import userRepository from "../../../repository/userRepository.js";
import useAuth from "../../../hooks/useAuth.js";
import { useNavigate, Link, useLocation } from "react-router"; // NOTE: -dom
import AuthLayout from "../../components/Auth/AuthLayout.jsx";

const LoginPage = () => {
    const [form, setForm] = useState({ username: "", password: "" });
    const [show, setShow] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const redirectTo = location.state?.from || "/";

    const submit = async (e) => {
        e.preventDefault();
        try {
            // 👇 keep your original working call/shape
            const res = await userRepository.login(form);
            const token = res?.data?.token;

            if (!token) {
                throw new Error(res?.data?.message || "No token returned.");
            }

            login(token);
            navigate(redirectTo, { replace: true });
        } catch (err) {
            const msg =
                err?.response?.data?.message ||
                err?.message ||
                "Login failed.";
            alert(msg);
            console.error("Login error:", err);
        }
    };

    return (
        <AuthLayout>
            <Box component="form" onSubmit={submit}>
                {/* Brand chip (like your screenshot) */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                    <Avatar sx={{ bgcolor: "#f97316", width: 32, height: 32 }}>
                        <LocalDining fontSize="small" />
                    </Avatar>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        Ana2AnaFoodDelivery
                    </Typography>
                </Box>

                <Typography variant="h5" className="auth-title">Welcome!</Typography>
                <Typography className="auth-subtitle">Login</Typography>

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
                    label="Password"
                    fullWidth
                    size="medium"
                    margin="dense"
                    type={show ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={() => setShow((v) => !v)}
                                    edge="end"
                                    aria-label="toggle password"
                                >
                                    {show ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                <Box className="auth-actions">
                    <FormControlLabel control={<Checkbox size="small" />} label="Remember me" />
                    <Link to="#" style={{ textDecoration: "none" }}>
                        Forgot password?
                    </Link>
                </Box>

                <Button
                    type="submit"
                    variant="contained"
                    sx={{ mt: 2, width: "100%" }}
                >
                    Sign in
                </Button>

                <Box className="auth-footer">
                    <span>Don’t have an account? </span>
                    <Link to="/register">Sign up now</Link>
                </Box>
            </Box>
        </AuthLayout>
    );
};

export default LoginPage;
