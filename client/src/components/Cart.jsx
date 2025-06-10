
import React, { useState, useEffect } from 'react';
import {
  Box, Typography, IconButton, Button, List, ListItem,
  ListItemText, ListItemAvatar, Avatar, TextField, MenuItem,
  AppBar, Toolbar,
  Dialog,
  DialogTitle,
  DialogContent
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import RoomIcon from '@mui/icons-material/Room';
import { useCart } from '../components/context/CartContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../axiosInterceptor'; 
import MapSelector from './MapSelector';  

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  const navigate = useNavigate();


  const [selectedLocation, setSelectedLocation] = useState(null); // Stores { address, lat, lng }

  const [additionalAddressDetails, setAdditionalAddressDetails] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash on delivery');
  const [openMapModal, setOpenMapModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("pending");

  const deliveryFee = 50;

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );


 
// const Maps_API_KEY =import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const Maps_API_KEY ='AIzaSyCuqOu8NjS4Bp2keZoS8e2VcxSiIEIkdaM';

  const handleConfirmedLocation = (locationData) => {
    setSelectedLocation(locationData);
    setOpenMapModal(false); 
    toast.success('Delivery location selected!');
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      toast.warning('Your cart is empty!');
      return;
    }
    if (!phone.match(/^[6-9]\d{9}$/)) {
      toast.warning('Enter a valid 10-digit Indian phone number!');
      return;
    }
    // Validate using selectedLocation
    if (!selectedLocation || !selectedLocation.address || selectedLocation.lat === null || selectedLocation.lng === null) {
      toast.warning('Please select your delivery location using the map icon!');
      return;
    }

    const orderDetails = {
      items: cartItems.map(item => ({
        foodItem: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      totalPrice: totalPrice + deliveryFee,
      status: "placed",
      paymentStatus,
      phone,
      paymentMethod,
      deliveryLocation: {
        address: `${selectedLocation.address}${additionalAddressDetails ? ', ' + additionalAddressDetails : ''}`,
        lat: selectedLocation.lat,
        lng: selectedLocation.lng
      },
    };

    if (paymentMethod === 'cash on delivery') {
      try {

        await axiosInstance.post('http://localhost:3000/orders', orderDetails); 
        console.log("Order Data Sent:", orderDetails);

        toast.success('Order placed successfully with Cash on Delivery!');
        navigate('/orders');
      } catch (err) {
        console.error("Error placing order:", err.response ? err.response.data : err.message);
        toast.error('Failed to place order!');
      }
    } else if (paymentMethod === 'online payment') {
      navigate('/payment', { state: orderDetails });
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: "orange" }}>
        <Toolbar>
          <Typography variant="h3" sx={{ flexGrow: 1, fontFamily: 'initial', color: 'white' }}>
            Foodie Bites
          </Typography>
          <Button color="inherit" onClick={() => navigate("/")}>Home</Button>
          <Button color="inherit" onClick={() => navigate("/menu")}>Menu</Button>
          <Button color="inherit" onClick={() => navigate("/orders")}>My Orders</Button>
        </Toolbar>
      </AppBar>

      <Box p={3} pb={10}>
        <Typography variant="h4" gutterBottom style={{ color: "orange", fontFamily: "initial" }}>Cart</Typography>
        {cartItems.length === 0 ? (
          <Typography style={{ color: "GrayText" }}>Your cart is empty.</Typography>
        ) : (
          <List>
            {cartItems.map(item => (
              <ListItem key={item._id}>
                <ListItemAvatar>
                  <Avatar variant="square" src={item.imageUrl} sx={{ width: 60, height: 60 }} />
                </ListItemAvatar>
                <ListItemText
                  primary={item.name}
                  secondary={`₹${item.price} × ${item.quantity} = ₹${item.price * item.quantity}`}
                />
                <IconButton onClick={() => decreaseQuantity(item._id)}><RemoveIcon /></IconButton>
                <Typography>{item.quantity}</Typography>
                <IconButton onClick={() => increaseQuantity(item._id)}><AddIcon /></IconButton>
                <IconButton onClick={() => removeFromCart(item._id)}><DeleteIcon /></IconButton>
              </ListItem>
            ))}
          </List>
        )}

        <Box mt={3}>
          <TextField
            fullWidth
            label="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter 10-digit mobile number"
            margin="normal"
            inputProps={{ maxLength: 10 }}
          />
          <Box display="flex" alignItems="flex-end" gap={2}>
            <TextField
              fullWidth
              label="Delivery Location (from Map)"
              value={selectedLocation?.address || ''} 
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <IconButton onClick={() => setOpenMapModal(true)} title="Select on Map">
                    <RoomIcon />
                  </IconButton>
                ),
              }}
              margin="normal"
              helperText={!selectedLocation && "Click the map icon to select your location"}
            />
          </Box>
          <TextField
            fullWidth
            label="Flat No., Building, Landmark (Optional)"
            placeholder="E.g., Flat 4B, Blue Apartment, Near Central Park"
            value={additionalAddressDetails}
            onChange={(e) => setAdditionalAddressDetails(e.target.value)}
            margin="normal"
          />
        </Box>

        <Box mt={3}>
          <TextField
            select
            label="Select Payment Method"
            fullWidth
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <MenuItem value="cash on delivery">Cash on Delivery</MenuItem>
            <MenuItem value="online payment">Online Payment (Card/UPI)</MenuItem>
          </TextField>
        </Box>

        <Box mt={4}>
          <Typography variant="h6" gutterBottom>Order Summary</Typography>
          {cartItems.map(item => (
            <Typography key={item._id}>
              {item.name} × {item.quantity} = ₹{item.price * item.quantity}
            </Typography>
          ))}
          <Typography><strong>Delivery Fee:</strong> ₹{deliveryFee}</Typography>
          <Typography mt={2}><strong>Total:</strong> ₹{totalPrice + deliveryFee}</Typography>
        </Box>

        <Button
          variant="contained"
          color="warning"
          onClick={handlePlaceOrder}
          sx={{ mt: 3 }}
        >
          Place Order
        </Button>

        {/* The Dialog containing MapSelector for location selection */}
        <Dialog open={openMapModal} onClose={() => setOpenMapModal(false)} fullWidth maxWidth="md">
          <DialogTitle>Select Your Delivery Location</DialogTitle>
          <DialogContent>
            <MapSelector
              googleMapsApiKey={Maps_API_KEY} 
              onLocationConfirm={handleConfirmedLocation} 
              initialLat={selectedLocation?.lat}
              initialLng={selectedLocation?.lng}
              initialAddress={selectedLocation?.address}
            />
          </DialogContent>
        </Dialog>
      </Box>
    </Box>
  );
};

export default Cart;