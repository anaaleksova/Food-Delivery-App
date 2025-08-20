import React from 'react'
import { createRoutesFromElements, Route } from 'react-router'
import Layout from './ui/components/layout/Layout/Layout.jsx'
import HomePage from './ui/pages/HomePage/HomePage.jsx'
import ProductPage from './ui/pages/ProductPage/ProductPage.jsx'
import RestaurantPage from './ui/pages/RestaurantPage/RestaurantPage.jsx'
import CartPage from './ui/pages/CartPage/CartPage.jsx'
import LoginPage from './ui/pages/LoginPage/LoginPage.jsx'
import RegisterPage from './ui/pages/RegisterPage/RegisterPage.jsx'
import CheckoutPage from './ui/pages/CheckoutPage/CheckoutPage.jsx'
import ProtectedRoute from './ui/components/routing/ProtectedRoute/ProtectedRoute.jsx'
import OwnerProducts from './ui/pages/Owner/Products/OwnerProducts.jsx'
import OwnerRestaurants from './ui/pages/Owner/Restaurants/OwnerRestaurants.jsx'

const App = () => null

App.routes = createRoutesFromElements(
  <Route element={<Layout/>}>
    <Route index element={<HomePage/>}/>
    <Route path="/products/:id" element={<ProductPage/>}/>
    <Route path="/restaurants/:id" element={<RestaurantPage/>}/>
    <Route path="/cart" element={<ProtectedRoute role={"CUSTOMER"}/>}>
      <Route index element={<CartPage/>}/>
    </Route>
    <Route path="/checkout" element={<ProtectedRoute role={"CUSTOMER"}/>}>
      <Route index element={<CheckoutPage/>}/>
    </Route>
    <Route path="/owner" element={<ProtectedRoute role={"OWNER"}/>}>
      <Route path="products" element={<OwnerProducts/>}/>
      <Route path="restaurants" element={<OwnerRestaurants/>}/>
    </Route>
    <Route path="/login" element={<LoginPage/>}/>
    <Route path="/register" element={<RegisterPage/>}/>
  </Route>
)

export default App
