import React, {useState} from 'react';
import {Box, Button, TextField, Typography} from "@mui/material";
import userRepository from "../../../repository/userRepository.js";
import useAuth from "../../../hooks/useAuth.js";
import { useNavigate, Link, useLocation } from "react-router";

const LoginPage = () => {
    const [form, setForm] = useState({username:"", password:""});
    const {login} = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const redirectTo = location.state?.from || "/";

    const submit = async (e) => {
        e.preventDefault();
        try {
            const res = await userRepository.login(form);
            login(res.data.token);
            navigate(redirectTo, { replace: true }); // go back to cart (or wherever)
        } catch (e) {
            alert("Login failed.");
        }
    };

    return (
        <Box component="form" onSubmit={submit} sx={{maxWidth:420, mx:"auto", display:"grid", gap:2}}>
            <Typography variant="h4">Login</Typography>
            <TextField label="Username" value={form.username} onChange={e=>setForm({...form, username:e.target.value})} required/>
            <TextField type="password" label="Password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} required/>
            <Button type="submit" variant="contained">Login</Button>
            <Typography variant="body2">No account? <Link to="/register">Register</Link></Typography>
        </Box>
    );
};
export default LoginPage;