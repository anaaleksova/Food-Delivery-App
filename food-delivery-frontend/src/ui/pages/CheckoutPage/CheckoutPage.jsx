import React, {useEffect, useState} from 'react';
import {Box, Button, Card, CardContent, Divider, Typography} from "@mui/material";
import useOrder from "../../../hooks/useOrder.js";
import paymentRepository from "../../../repository/paymentRepository.js";
import orderRepository from "../../../repository/orderRepository.js";
import { useNavigate } from "react-router";

const CheckoutPage = () => {
  const {order, loading} = useOrder();
  const [payment, setPayment] = useState(null);
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!order?.id) return;
    paymentRepository.createIntent(order.id).then(res => setPayment(res.data));
  }, [order?.id]);

  const onSuccess = async () => {
    if (!payment?.id) return;
    setBusy(true);
    await paymentRepository.simulateSuccess(payment.id);
    await orderRepository.confirmPending();
    setBusy(false);
    alert("Payment succeeded! Order confirmed.");
    navigate("/");
  };
  const onFailure = async () => {
    if (!payment?.id) return;
    setBusy(true);
    await paymentRepository.simulateFailure(payment.id);
    setBusy(false);
    alert("Payment failed (simulated). Try again.");
  };

  if (loading) return <>Loading...</>;
  if (!order) return <Typography>No pending order to pay.</Typography>;
  return (
    <Card>
      <CardContent>
        <Typography variant="h5">Test Payment (Stripe - TEST MODE)</Typography>
        <Typography color="text.secondary">This backend uses a simulated Stripe flow. Use the buttons below to test success/failure.</Typography>
        <Divider sx={{my:1}}/>
        <Box sx={{display:'flex', gap:1}}>
          <Button disabled={!payment || busy} variant="contained" onClick={onSuccess}>Simulate success</Button>
          <Button disabled={!payment || busy} onClick={onFailure}>Simulate failure</Button>
        </Box>
        {payment && (
          <Box sx={{mt:2}}>
            <Typography variant="caption">Payment ID: {payment.id} — Provider: {payment.provider} — Status: {payment.status}</Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
export default CheckoutPage;
