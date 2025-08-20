import React, {useEffect, useState} from 'react';
import {Box, Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography} from "@mui/material";
import restaurantRepository from "../../../../repository/restaurantRepository.js";
import productRepository from "../../../../repository/productRepository.js";

const OwnerRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({name:"", description:""});

  // Since backend has no list endpoint for restaurants, derive from products set
  const refresh = async () => {
    const products = await productRepository.findAll();
    const ids = [...new Set(products.data.map(p => p.restaurantId))];
    const results = await Promise.all(ids.map(id => restaurantRepository.findById(id)));
    setRestaurants(results.map(r => r.data));
  };

  useEffect(() => { refresh() }, []);
  const submit = async () => { await restaurantRepository.add(form); setOpen(false); await refresh(); }

  return (
    <Box>
      <Typography variant="h5" sx={{mb:1}}>Manage Restaurants</Typography>
      <Button variant="contained" onClick={()=> setOpen(true)}>Add restaurant</Button>
      <Grid container spacing={2} sx={{mt:1}}>
        {restaurants.map(r => (
          <Grid item xs={12} md={6} key={r.id}>
            <Card><CardContent>
              <Typography variant="h6">{r.name}</Typography>
              <Typography>{r.description}</Typography>
            </CardContent></Card>
          </Grid>
        ))}
      </Grid>
      <Dialog open={open} onClose={()=> setOpen(false)}>
        <DialogTitle>New restaurant</DialogTitle>
        <DialogContent sx={{display:'grid', gap:2, mt:1}}>
          <TextField label="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})}/>
          <TextField label="Description" value={form.description} onChange={e=>setForm({...form, description:e.target.value})}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=> setOpen(false)}>Cancel</Button>
          <Button onClick={submit} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
export default OwnerRestaurants;
