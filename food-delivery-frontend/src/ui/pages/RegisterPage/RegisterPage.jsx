import React, {useState} from 'react';
import {Box, Button, MenuItem, TextField, Typography} from "@mui/material";
import userRepository from "../../../repository/userRepository.js";
import { useNavigate } from "react-router";

const RegisterPage = () => {
  const [form, setForm] = useState({username:"", name:"", surname:"", email:"", password:"", role:"CUSTOMER"});
  const navigate = useNavigate();
  const submit = async (e) => {
    e.preventDefault();
    try {
      await userRepository.register(form);
      alert("Registration successful. You can log in now.");
      navigate("/login");
    } catch (e) {
      alert("Registration failed.");
    }
  }
  return (
    <Box component="form" onSubmit={submit} sx={{maxWidth:520, mx:"auto", display:"grid", gap:2}}>
      <Typography variant="h4">Register</Typography>
      <TextField label="Username" value={form.username} onChange={e=>setForm({...form, username:e.target.value})} required/>
      <TextField label="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required/>
      <TextField label="Surname" value={form.surname} onChange={e=>setForm({...form, surname:e.target.value})} required/>
      <TextField label="Email" type="email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} required/>
      <TextField label="Password" type="password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} required/>
      {/*<TextField select label="Role" value={form.role} onChange={e=>setForm({...form, role:e.target.value})}>*/}
      {/*  <MenuItem value="CUSTOMER">Customer</MenuItem>*/}
      {/*</TextField>*/}
      <Button type="submit" variant="contained">Create account</Button>
    </Box>
  );
};
export default RegisterPage;
