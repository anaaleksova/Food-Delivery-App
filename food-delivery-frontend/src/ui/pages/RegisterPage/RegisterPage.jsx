// import React, { useState } from "react";
// import { Box, Button, MenuItem, TextField, Typography, Avatar } from "@mui/material";
// import { LocalDining } from "@mui/icons-material";
// import userRepository from "../../../repository/userRepository.js";
// import { useNavigate, Link } from "react-router";
// import AuthLayout from "../../components/Auth/AuthLayout.jsx";
//
// const RegisterPage = () => {
//     const [form, setForm] = useState({
//         username: "", name: "", surname: "",
//         email: "", password: "", role: "CUSTOMER"
//     });
//     const navigate = useNavigate();
//
//     const submit = async (e) => {
//         e.preventDefault();
//         try {
//             await userRepository.register(form);
//             alert("Registration successful. You can log in now.");
//             navigate("/login");
//         } catch (err) {
//             console.error(err);
//             alert("Registration failed.");
//         }
//     };
//
//     return (
//         <AuthLayout>
//             <Box component="form" onSubmit={submit}>
//                 <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
//                     <Avatar sx={{ bgcolor: "#f97316", width: 32, height: 32 }}>
//                         <LocalDining fontSize="small" />
//                     </Avatar>
//                     <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
//                         Ana2AnaFoodDelivery
//                     </Typography>
//                 </Box>
//
//                 <Typography variant="h5" className="auth-title">Create account</Typography>
//                 <Typography className="auth-subtitle">It takes less than a minute.</Typography>
//
//                 <TextField fullWidth label="Username" margin="dense"
//                            value={form.username} onChange={e=>setForm({...form, username:e.target.value})} required />
//                 <TextField fullWidth label="First name" margin="dense"
//                            value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required />
//                 <TextField fullWidth label="Last name" margin="dense"
//                            value={form.surname} onChange={e=>setForm({...form, surname:e.target.value})} required />
//                 <TextField fullWidth label="Email" type="email" margin="dense"
//                            value={form.email} onChange={e=>setForm({...form, email:e.target.value})} required />
//                 <TextField fullWidth label="Password" type="password" margin="dense"
//                            value={form.password} onChange={e=>setForm({...form, password:e.target.value})} required />
//                 <Button type="submit" variant="contained" sx={{ mt: 2, width: "100%" }}>
//                     Sign up
//                 </Button>
//
//                 <Box className="auth-footer">
//                     <span>Already have an account? </span>
//                     <Link to="/login">Sign in</Link>
//                 </Box>
//             </Box>
//         </AuthLayout>
//     );
// };
//
// export default RegisterPage;
import React, { useState } from "react";
import { Box, Button, MenuItem, TextField, Typography, Avatar } from "@mui/material";
import { LocalDining } from "@mui/icons-material";
import userRepository from "../../../repository/userRepository.js";
import { useNavigate, Link } from "react-router";
import AuthLayout from "../../components/Auth/AuthLayout.jsx";

const RegisterPage = () => {
    const [form, setForm] = useState({
        username: "",
        name: "",
        surname: "",
        email: "",
        password: "",
        role: ""
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
            <Box component="form" onSubmit={submit}>
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

                <TextField fullWidth label="Username" margin="dense"
                           value={form.username} onChange={e=>setForm({...form, username:e.target.value})} required />
                <TextField fullWidth label="First name" margin="dense"
                           value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required />
                <TextField fullWidth label="Last name" margin="dense"
                           value={form.surname} onChange={e=>setForm({...form, surname:e.target.value})} required />
                <TextField fullWidth label="Email" type="email" margin="dense"
                           value={form.email} onChange={e=>setForm({...form, email:e.target.value})} required />
                <TextField fullWidth label="Password" type="password" margin="dense"
                           value={form.password} onChange={e=>setForm({...form, password:e.target.value})} required />

                {/* Role dropdown */}
                <TextField
                    select
                    fullWidth
                    label="Role"
                    margin="dense"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    required
                >
                    <MenuItem value="ROLE_CUSTOMER">Customer</MenuItem>
                    <MenuItem value="ROLE_COURIER">Courier</MenuItem>
                </TextField>

                <Button type="submit" variant="contained" sx={{ mt: 2, width: "100%" }}>
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
