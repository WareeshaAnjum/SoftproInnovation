import React from 'react'
import Home from './pages/Home/Home'
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import '@splidejs/react-splide/css';
import { createBrowserRouter, RouterProvider} from 'react-router-dom'
import Header from './components/Header';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminLogin from './pages/Admin/AdminLogin';
import Products from './pages/Products/Products'

const App = () => {
  const router= createBrowserRouter ([
    {
      path: '/',
      element: <Home/>
    },
    {
      path: '/products',
      element: <Products/>
    },
    {
      path: '/login',
      element: <Login/>
    },
    {
      path: '/register',
      element: <Register/>
    },
     {
      path: '/admin/login',
      element: <AdminLogin/> 
    },
     {
      path: '/admin/',
      element: <AdminDashboard/> 
    },

  ])
  return (
   <>
   <Header/>
    <RouterProvider router={router}/>

   </>
  
  )
}

export default App