import React from 'react';
import {useParams} from "react-router";
import useProductDetails from "../../../hooks/useProductDetails.js";
import productRepository from "../../../repository/productRepository.js";
import { addToCartRespectingSingleRestaurant } from "../../../repository/cartActions.js";
import ProductDetails from "../../components/products/ProductDetails/ProductDetails.jsx";

const ProductPage = () => {
  const {id} = useParams();
  const {item, loading} = useProductDetails(id);
  const handleAdd = async () => {
    const res = await addToCartRespectingSingleRestaurant(id);
    if (res?.ok) alert(res.replaced ? "Cart replaced and item added." : "Added.");
  };
  const handleRemove = () => productRepository.removeFromOrder(id).then(()=> alert("Removed."));
  if (loading) return <>Loading...</>;
  return <ProductDetails details={item} onAdd={handleAdd} onRemove={handleRemove}/>;
};
export default ProductPage;