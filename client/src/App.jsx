


import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Login from './components/Login';
import Home from './components/Home';
import Signup from './components/Signup';
import AdminDashboard from './components/AdminDashboard/AdminDashboard';
import Menu from './components/Menu';
import Reservation from './components/Reservation';
import PrivateRoutes from './components/PrivateRoutes';
import DeliveryDash from './components/DeliveryDash';
import Main from './components/Main';
import { ToastContainer } from 'react-toastify';
import Cart from './components/Cart';
import OrderPage from './components/Order';
import FoodItems from './components/Menu';
import FoodForm from './components/AdminDashboard/FoodForm';
import OrderList from './components/AdminDashboard/OrderList';
import ReservationList from './components/AdminDashboard/ReservationList';
import FoodItem from './components/AdminDashboard/FoodItems';
import 'bootstrap/dist/css/bootstrap.min.css';
import MyReservations from './components/MyReservation';
import { Toaster } from 'react-hot-toast';
import Payment from './components/Payment';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';

// import UserProfile from './components/UserProfile';
const App = () => {
  return ( 
    <>
    <Toaster position="top-center" />
   <ToastContainer position="top-center" autoClose={3000} />
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
         <Route path='/' element={<Main child={<Home/>}/>}></Route>
         {/* <Route path='/menu' element={<Main child={<Menu/>}/>}></Route> */}
         <Route path='/login' element={<Main child={<Login/>}/>}></Route>
         <Route path='/signup' element={<Main child={<Signup/>}/>}></Route>
        {/* <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} /> */}
         {/* <Route path='/cart' element={<Main child={<Cart/>}/>}></Route> */}
<Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Private routes */}
 <Route path="/cart" element={
          <PrivateRoutes allowedRoles={['user']}>
            <Cart />
          </PrivateRoutes>
        } />


        <Route path="/menu" element={
          
          <PrivateRoutes allowedRoles={['user']}>
            <Menu />
          </PrivateRoutes>
        } />
        <Route path="/orders" element={
          <PrivateRoutes allowedRoles={['user']}>
            <OrderPage />
          </PrivateRoutes>
        } />

        <Route path="/reservations" element={
          <PrivateRoutes allowedRoles={['user']}>
             {/* <Main child={<Reservation />} /> */}
            <Reservation />
          </PrivateRoutes>
        } />
          <Route path="/my" element={
          <PrivateRoutes allowedRoles={['user']}>
          {/* <Main child={  <MyReservations />}/> */}
          <MyReservations/>
          </PrivateRoutes>
        } />
        <Route path="/payment" element={
          <PrivateRoutes allowedRoles={['user']}>
          {/* <Main child={  <MyReservations />}/> */}
          <Payment/>
          </PrivateRoutes>
        } />


<Route path="/admin-dashboard" element={
    <PrivateRoutes allowedRoles={['admin']}>
      <AdminDashboard />
    </PrivateRoutes>
  }>
<Route path="fooditems" element={
  <PrivateRoutes allowedRoles={['admin']}>
    <FoodItem />
  </PrivateRoutes>
} />

<Route path="orders" element={
  <PrivateRoutes allowedRoles={['admin']}>
    <OrderList />
  </PrivateRoutes>
} />

<Route path="reservations" element={
  <PrivateRoutes allowedRoles={['admin']}>
    <ReservationList />
  </PrivateRoutes>
} />

<Route path="additems" element={
  <PrivateRoutes allowedRoles={['admin']}>
    <FoodForm />
  </PrivateRoutes>
} />
  
  </Route>

        <Route path="/delivery-dashboard" element={
          <PrivateRoutes allowedRoles={['delivery']}>
            <DeliveryDash />
          </PrivateRoutes>
        } />


      </Routes>
 </>
  );
};

export default App;

