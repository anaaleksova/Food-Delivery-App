import React, { useState } from 'react';
//import React from 'react';
import {useParams} from "react-router";
import useProductDetails from "../../../hooks/useProductDetails.js";
import productRepository from "../../../repository/productRepository.js";
import { addToCartRespectingSingleRestaurant } from "../../../repository/cartActions.js";
import ProductDetails from "../../components/products/ProductDetails/ProductDetails.jsx";
import Alert from "../../../common/Alert.jsx";

const ProductPage = () => {
  const {id} = useParams();
  const {item, loading} = useProductDetails(id);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const handleAdd = async () => {
    const res = await addToCartRespectingSingleRestaurant(id);
    if (res?.ok) {
      setAlertMessage(res.replaced ? "Cart replaced and item added." : "Added.");
      setAlertOpen(true);
    }
  };

  const handleRemove = async () => {
    await productRepository.removeFromOrder(id);
    setAlertMessage("Removed.");
    setAlertOpen(true);
  };

  if (loading) return <>Loading...</>;

  return (
      <>
        <ProductDetails details={item} onAdd={handleAdd} onRemove={handleRemove} />
        <Alert
            open={alertOpen}
            onClose={() => setAlertOpen(false)}
            message={alertMessage}
        />
      </>
  );
};

export default ProductPage;