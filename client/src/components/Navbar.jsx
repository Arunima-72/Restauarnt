import { AppBar, Badge, Box, Button, IconButton, Toolbar, Typography } from '@mui/material'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from './context/CartContext';
import ShoppingCart from '@mui/icons-material/ShoppingCart';

const Nav = () => { 
  const { cartItems } = useCart();
  const navigate = useNavigate();

 const token = localStorage.getItem('logintoken');
  const role = localStorage.getItem('userRole');
  const handleLogout = () => {
    localStorage.removeItem('logintoken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('user');
    navigate('/login');
  };
  
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  return (
    
      <Box sx={{ flexGrow: 1 ,backgroundColor:'orange' }}>
      <AppBar color='orange' position="static"  >
      <Toolbar>
        {/* <IconButton
          size="large"
          edge="start"
          color="orange"
          aria-label="menu"
          sx={{ mr: 2,backgroundColor:"white" }}
        >
         
        </IconButton> */}
        <Typography  variant="h3" component="div"  sx={{ flexGrow: 1 ,fontFamily:'initial',color:'white'}}>
Foodie Bites
        </Typography> 
         {/* Always visible */}
             <Link to={'/'}><Button style={{color:'white',fontFamily:"-moz-initial"}}>Home</Button></Link>
             
 {/* Show when not logged in */}
          {!token && (
<>
             <Link to={'/login'}><Button style={{color:'white' ,fontFamily:"-moz-initial"}}>Login</Button></Link>
              <Link to={'/signup'}><Button style={{color:'white',fontFamily:"-moz-initial"}}>Signup</Button></Link>
</>)}  

{/* Show for user role */}
          {token && role === 'user' && (
            <>

        <Link to= {'/menu'}><Button style={{color:'white',fontFamily:"-moz-initial"}}>Menu</Button></Link>
        <Link to={'/reservations'}> <Button style={{color:'white',fontFamily:"-moz-initial"}}>Reservation</Button></Link>
         {/* <Link to={'/my'}> <Button style={{color:'white',fontFamily:"-moz-initial"}}> My Reservation</Button></Link> */}

        {/* <Link to={'/cart'}> <Button style={{color:'white',fontFamily:"-moz-initial"}}> My Orders</Button></Link> */}
        </>)}


{/* Show for admin role */}
          {token && role === 'admin' && (
            <>
              <Link to={'/admin-dashboard'}> <Button style={{color:'white',fontFamily:"-moz-initial"}}>Admin Dashboard</Button></Link>
            </>
          )}


          {/* Show for delivery role */}
          {token && role === 'delivery' && (
            <>
              <Link to={'/delivery-dashboard'}> <Button style={{color:'white',fontFamily:"-moz-initial"}}>Delivery Dashboard</Button></Link>
            </>
          )}

 {/* Cart button for user */}

             {/* {token && role === 'user' && (
               <IconButton color="default" onClick={() => navigate('/cart')}>
          <Badge badgeContent={cartCount} color="warning">
            <ShoppingCart />
          </Badge>
        </IconButton>
          )}  */}
          {/* Show logout if logged in */}
          {token && (
        <Link to={'/'}> <Button style={{color:'white',fontFamily:"-moz-initial"}} onClick={handleLogout}>log out</Button></Link>

          )}

          
       
          
      </Toolbar>
    </AppBar>
  </Box>
   
  )
}

export default Nav

