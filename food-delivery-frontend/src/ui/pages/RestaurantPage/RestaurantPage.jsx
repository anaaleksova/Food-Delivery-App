import React, {useEffect, useState} from 'react';
import {useParams} from "react-router";
import {Divider, Typography} from "@mui/material";
import restaurantRepository from "../../../repository/restaurantRepository.js";
import productRepository from "../../../repository/productRepository.js";
import { addToCartRespectingSingleRestaurant } from "../../../repository/cartActions.js";
import reviewRepository from "../../../repository/reviewRepository.js";
import ProductGrid from "../../components/products/ProductGrid/ProductGrid.jsx";
import ReviewList from "../../components/reviews/ReviewList/ReviewList.jsx";
import ReviewForm from "../../components/reviews/ReviewForm/ReviewForm.jsx";

const RestaurantPage = () => {
    const {id} = useParams();
    const [restaurant, setRestaurant] = useState(null);
    const [products, setProducts] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;
        Promise.all([
            restaurantRepository.findById(id),
            productRepository.findAll(),
            reviewRepository.list(id),
        ]).then(([r, p, rv]) => {
            if (!active) return;
            setRestaurant(r.data);
            setProducts(p.data.filter(x => String(x.restaurantId) === String(id)));
            setReviews(rv.data);
            setLoading(false);
        });
        return () => { active = false; }
    }, [id]);

    const handleAdd = async (pid) => {
        const res = await addToCartRespectingSingleRestaurant(pid);
        if (res?.ok) alert(res.replaced ? "Cart replaced and item added." : "Added to cart.");
    }
    const handleReview = async ({rating, comment}) => {
        await reviewRepository.add(id, {rating, comment});
        const rv = await reviewRepository.list(id);
        setReviews(rv.data);
    }

    if (loading) return <>Loading...</>;
    return (
        <div>...</div>
    );
};
export default RestaurantPage;