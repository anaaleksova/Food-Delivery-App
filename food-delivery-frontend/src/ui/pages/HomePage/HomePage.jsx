import React from 'react';
import {Typography} from "@mui/material";
import useProducts from "../../../hooks/useProducts.js";
import { addToCartRespectingSingleRestaurant } from "../../../repository/cartActions.js";
import ProductGrid from "../../components/products/ProductGrid/ProductGrid.jsx";

const HomePage = () => {
  const {items, loading} = useProducts();
  const handleAdd = async (id) => {
    const res = await addToCartRespectingSingleRestaurant(id);
    if (res?.ok) alert(res.replaced ? "Cart replaced and item added." : "Added to cart.");
  }
  return (
      <div>
        <Typography variant="h4" sx={{mb:2}}>Browse products</Typography>
        {loading ? <Typography>Loading...</Typography> : <ProductGrid items={items} onAdd={handleAdd}/>}
      </div>
  );
};
export default HomePage;