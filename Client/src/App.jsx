import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import '@splidejs/react-splide/css';
import Header from './components/Header';
import Home from './pages/Home/Home';
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Products from './pages/Products/Products';
import AdminLogin from './pages/Admin/AdminLogin';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminHome from './pages/Admin/AdminHome';
import ProductCategories from './pages/Admin/ProductCategories';
import UserProfile from './pages/Profile/UserProfile';
import ProductDetail from './pages/Products/ProductDetail';
import AdminOrders from './pages/Admin/AdminOrders';
import AdminUsers from './pages/Admin/AdminUsers';
import AdminInventory from './pages/Admin/AdminInventory';
import AdminComplaints from './pages/Admin/AdminComplaints';
import AdminProducts from './pages/Admin/AdminProducts';

const App = () => {
  return (
    <BrowserRouter>
      {/* <Header /> */}

      <Routes>
        {/* User Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/contact-us" element={<Contact />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/dashboard" element={<UserProfile />} />
        <Route path="/user/profile" element={<UserProfile />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />}>
          <Route index element={<AdminHome />} />
          <Route path="category" element={<ProductCategories />} />
          <Route path="product" element={<AdminProducts />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="inventory" element={<AdminInventory />} />
          <Route path="complaints" element={<AdminComplaints />} />
        </Route>  
      </Routes>
    </BrowserRouter>
  );
};

export default App;
