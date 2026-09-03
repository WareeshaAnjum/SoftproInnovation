import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import '@splidejs/react-splide/css';
import Header from './components/Header';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Products from './pages/Products/Products';
import AdminLogin from './pages/Admin/AdminLogin';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminHome from './pages/Admin/AdminHome';
// import Category from './pages/Admin/ProductCategories';
// import Products from './pages/Products/Products';
import Category from "../src/pages/Admin/Category"

const App = () => {
  return (
    <BrowserRouter>
      {/* <Header /> */}

      <Routes>
        {/* User Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />}>
          <Route index element={<AdminHome />} />
          {/* <Route path='category' element={<Category/>}></Route> */}
          <Route path='category' element={<Category/>}></Route>
           <Route path='product' element={<Products/>}></Route>
        </Route>  
      </Routes>
    </BrowserRouter>
  );
};

export default App;
