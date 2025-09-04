import React from 'react';
import useOrder from "../../../hooks/useOrder.js";
import OrderList from "../../components/order/OrderList/OrderList.jsx";
import orderRepository from "../../../repository/orderRepository.js";
import { useNavigate } from "react-router";

const CartPage = () => {
  const {order, loading, refresh} = useOrder();
  const navigate = useNavigate();

  const onCheckout = () => navigate("/checkout");

  const onCancel = async () => {
    const ok = window.confirm("Remove all items from the cart?");
    if (!ok) return;
    await orderRepository.cancelPending();
    await refresh();
  };

  if (loading) return <>Loading...</>;
  return <OrderList order={order} onCheckout={onCheckout} onCancel={onCancel} refresh={refresh}/>;
};
export default CartPage;