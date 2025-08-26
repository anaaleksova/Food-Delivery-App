import React, {useEffect, useState} from 'react';
import {Box, Button, Card, CardContent, Divider, Typography} from "@mui/material";
import useOrder from "../../../hooks/useOrder.js";
import paymentRepository from "../../../repository/paymentRepository.js";
import orderRepository from "../../../repository/orderRepository.js";
import { useNavigate } from "react-router";
import {Elements, CardElement, useStripe, useElements} from "@stripe/react-stripe-js";
import {loadStripe} from "@stripe/stripe-js";

const CheckoutPage = () => {
  const {order, loading} = useOrder();
  const [payment, setPayment] = useState(null);
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  // 1) Load / create PaymentIntent (backend returns clientSecret if Stripe is configured)
  useEffect(() => {
    if (!order?.id) return;
    paymentRepository.createIntent(order.id).then(res => setPayment(res.data));
  }, [order?.id]);

  // 2) Simulation fallback (kept for when keys are missing)
  const simulateSuccess = async () => {
    if (!payment?.id) return;
    setBusy(true);
    await paymentRepository.simulateSuccess(payment.id);
    await orderRepository.confirmPending();
    setBusy(false);
    alert("Payment succeeded! Order confirmed.");
    navigate("/");
  };
  const simulateFailure = async () => {
    if (!payment?.id) return;
    setBusy(true);
    await paymentRepository.simulateFailure(payment.id);
    setBusy(false);
    alert("Payment failed (simulated). Try again.");
  };

  if (loading) return <>Loading...</>;
  if (!order) return <Typography>No pending order to pay.</Typography>;

  // 3) Load Stripe with a hard-coded publishable test key. This matches the
  // server-side secret key and allows the checkout page to render the card form
  // without relying on environment variables. Do NOT use this approach in
  // production — always load keys securely.
  const PUBLISHABLE_KEY =
      "pk_test_51S0LPxISIz2c7ED1kvux04tVOZWothXvPPC664G8ob5m0bfUO8dl8Jv4JzbIIMAQRJ1FPJ8aae3cr1IZPdFBJkH200XCUEHZcd";
  const stripePromise = loadStripe(PUBLISHABLE_KEY);

  const hasClientSecret = !!payment?.clientSecret;
  const usingRealStripe = !!stripePromise && hasClientSecret;

  return (
      <Card>
        <CardContent>
          <Typography variant="h5">Stripe Payment (Test Mode)</Typography>
          <Divider sx={{my:1}}/>

          {/* Small diagnostics so you can see why the card form might not appear */}
          <Typography variant="body2" color="text.secondary" sx={{mb:2}}>
            Diagnostics — clientSecret: {hasClientSecret ? 'present' : 'missing'}
          </Typography>

          {usingRealStripe ? (
              <Elements stripe={stripePromise} options={{ clientSecret: payment.clientSecret }}>
                <StripeForm
                    clientSecret={payment.clientSecret}
                    busy={busy}
                    setBusy={setBusy}
                    onPaid={async () => {
                      await orderRepository.confirmPending();
                      alert("Payment succeeded! Order confirmed.");
                      navigate("/");
                    }}
                />
              </Elements>
          ) : (
              <>
                <Typography color="text.secondary" sx={{mb:1}}>
                  No Stripe keys or client secret detected — using simulated buttons.
                </Typography>
                <Box sx={{display:'flex', gap:1}}>
                  <Button disabled={!payment || busy} variant="contained" onClick={simulateSuccess}>Simulate success</Button>
                  <Button disabled={!payment || busy} onClick={simulateFailure}>Simulate failure</Button>
                </Box>
              </>
          )}

          {payment && (
              <Box sx={{mt:2}}>
                <Typography variant="caption">
                  Payment ID: {payment.id} — Provider: {payment.provider} — Status: {payment.status}
                </Typography>
              </Box>
          )}
        </CardContent>
      </Card>
  );
};
export default CheckoutPage;

// Stripe card form
function StripeForm({clientSecret, busy, setBusy, onPaid}) {
  const stripe = useStripe();
  const elements = useElements();

  const handlePay = async () => {
    if (!stripe || !elements) return;
    setBusy(true);

    // IMPORTANT: pass the real clientSecret we got from the backend
    const {error, paymentIntent} = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: elements.getElement(CardElement) }
    });

    setBusy(false);

    if (error) {
      alert(error.message || "Payment failed");
      return;
    }
    if (paymentIntent && paymentIntent.status === 'succeeded') {
      await onPaid();
    } else {
      alert(`Payment status: ${paymentIntent?.status ?? "unknown"}`);
    }
  };

  return (
      <Box sx={{display:'grid', gap:1, maxWidth:420}}>
        <CardElement options={{hidePostalCode:true}} />
        <Button variant="contained" disabled={busy || !stripe} onClick={handlePay}>
          Pay
        </Button>
        <Typography variant="body2" color="text.secondary">
          Use Stripe test cards (e.g. 4242 4242 4242 4242, any future date, any CVC).
        </Typography>
      </Box>
  );
}