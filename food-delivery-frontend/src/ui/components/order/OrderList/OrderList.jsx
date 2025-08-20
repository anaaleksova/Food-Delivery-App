import React from 'react';
import {Box, Button, Card, CardContent, Divider, Typography} from "@mui/material";

const normalizeItems = (order) => {
  if (!order) return [];

  // 1) Preferred: full item DTOs
  if (Array.isArray(order.orderItems) && order.orderItems.length) return order.orderItems;
  if (Array.isArray(order.items) && order.items.length) return order.items;

  // 2) DisplayOrderDto shape: { username, Products, status }
  if (Array.isArray(order.Products) && order.Products.length) {
    return order.Products.map(p => ({
      productId: p.id,
      productName: p.name,
      quantity: 1,
      unitPriceSnapshot: p.price,
      lineTotal: p.price,
    }));
  }
  return [];
};

const lineTotalOf = (i) => {
  const qty = i.quantity ?? 1;
  const unit =
      i.unitPriceSnapshot ??
      i.unitPrice ??
      i.price ??
      0;
  return i.lineTotal ?? qty * unit;
};

const OrderList = ({order, onCheckout, onCancel}) => {
  const items = normalizeItems(order);

  if (!items.length) {
    return (
        <Card>
          <CardContent>
            <Typography variant="h5">Your Cart</Typography>
            <Divider sx={{my:1}}/>
            <Typography color="text.secondary">No items yet.</Typography>
          </CardContent>
        </Card>
    );
  }

  const total =
      order?.total ??
      items.reduce((s, i) => s + lineTotalOf(i), 0);

  return (
      <Card>
        <CardContent>
          <Typography variant="h5">Your Cart</Typography>
          <Divider sx={{my:1}}/>
          <Box sx={{display:'flex', flexDirection:'column', gap:1}}>
            {items.map((i, idx) => (
                <Box key={i.id ?? i.productId ?? idx} sx={{display:'flex', justifyContent:'space-between'}}>
                  <Typography>
                    {i.productName || i.name || `Item ${idx+1}`}
                    {" "}
                    × {i.quantity ?? 1}
                  </Typography>
                  <Typography>{lineTotalOf(i).toFixed(2)} €</Typography>
                </Box>
            ))}
          </Box>
          <Divider sx={{my:1}}/>
          <Box sx={{display:'flex', justifyContent:'space-between'}}>
            <Typography variant="h6">Total</Typography>
            <Typography variant="h6">{Number(total || 0).toFixed(2)} €</Typography>
          </Box>
          <Box sx={{display:'flex', gap:1, mt:2}}>
            <Button variant="contained" onClick={onCheckout}>Checkout</Button>
            <Button onClick={onCancel}>Cancel</Button>
          </Box>
        </CardContent>
      </Card>
  );
};

export default OrderList;