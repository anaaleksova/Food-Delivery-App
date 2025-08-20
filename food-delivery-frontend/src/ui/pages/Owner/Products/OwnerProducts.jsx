import React, {useEffect, useState} from 'react';
import {Box, Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography} from "@mui/material";
import productRepository from "../../../../repository/productRepository.js";

const OwnerProducts = () => {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({name:"", description:"", price:0, quantity:0, restaurantId:""});
  const refresh = () => productRepository.findAll().then(res => setItems(res.data));
  useEffect(() => { refresh() }, []);
  const submit = async () => { await productRepository.add(form); setOpen(false); await refresh(); }

  return (
    <Box>
      <Typography variant="h5" sx={{mb:1}}>Manage Products</Typography>
      <Button variant="contained" onClick={()=> setOpen(true)}>Add product</Button>
      <Grid container spacing={2} sx={{mt:1}}>
        {items.map(p => (
          <Grid item xs={12} md={6} key={p.id}>
            <Card><CardContent>
              <Typography variant="h6">{p.name}</Typography>
              <Typography>{p.price} € — Qty: {p.quantity}</Typography>
              <Box sx={{display:'flex', gap:1, mt:1}}>
                <Button onClick={async()=> { 
                  const name = prompt("New name", p.name);
                  if (name) { await productRepository.edit(p.id, {...p, name}); await refresh(); }
                }}>Rename</Button>
                <Button color="error" onClick={async()=> { await productRepository.remove(p.id); await refresh(); }}>Delete</Button>
              </Box>
            </CardContent></Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={()=> setOpen(false)}>
        <DialogTitle>New product</DialogTitle>
        <DialogContent sx={{display:'grid', gap:2, mt:1}}>
          <TextField label="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})}/>
          <TextField label="Description" value={form.description} onChange={e=>setForm({...form, description:e.target.value})}/>
          <TextField label="Price" type="number" value={form.price} onChange={e=>setForm({...form, price:parseFloat(e.target.value)})}/>
          <TextField label="Quantity" type="number" value={form.quantity} onChange={e=>setForm({...form, quantity:parseInt(e.target.value)})}/>
          <TextField label="Restaurant ID" value={form.restaurantId} onChange={e=>setForm({...form, restaurantId:e.target.value})}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=> setOpen(false)}>Cancel</Button>
          <Button onClick={submit} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
export default OwnerProducts;
