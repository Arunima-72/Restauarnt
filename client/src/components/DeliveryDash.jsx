


import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  AppBar,
  Toolbar
} from '@mui/material';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosInterceptor';

const DeliveryDash = () => {
  const [orders, setOrders] = useState([]);
  const [availability, setAvailability] = useState(false);
  const deliveryId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  

  const fetchAvailability = async () => {
    try {
      const res = await axiosInstance.get(`http://localhost:3000/user/${deliveryId}`, {
        headers: { token }
      });
      setAvailability(res.data.available);
    } catch (err) {
      console.error("Error fetching availability:", err);
    }
  };
const fetchOrders = async () => {
  try {
    const res = await axiosInstance.get('http://localhost:3000/orders');
    const assignedOrders = res.data.filter(order => 
      (order.status === 'placed' || order.deliveryPerson?._id === deliveryId)
    );
    setOrders(assignedOrders);
  } catch (err) {
    console.error('Failed to fetch orders:', err.message);
  }
};
  const toggleAvailability = async () => {
    try {
      const res = await axiosInstance.put("http://localhost:3000/user/availability", {
        available: !availability
      }, {
        headers: { token }
      });
      setAvailability(res.data.available);
      toast.success("Availability updated");
    } catch (err) {
      console.error("Error updating availability:", err);
      toast.error("Failed to update availability");
    }
  };

  const handleAcceptOrder = async (orderId) => {
    try {
      await axios.put(`http://localhost:3000/orders/${orderId}/assign`, {
        deliveryId
      }, {
        headers: { token }
      });
      toast.success("Order accepted");
      fetchOrders();
    } catch (err) {
      console.error("Error accepting order:", err);
      toast.error("Failed to accept order");
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axiosInstance.put(`http://localhost:3000/orders/${orderId}`, {
        status: newStatus
      }, {
        headers: { token }
      });
      toast.success("Status updated");
      fetchOrders();
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error("Failed to update status");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  useEffect(() => {
    fetchOrders();
    fetchAvailability();
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <ToastContainer position="top-right" autoClose={3000} />

      <AppBar position="static" sx={{ backgroundColor: "orange" }}>
        <Toolbar>
          <Typography variant="h3" component="div" sx={{ flexGrow: 1, fontFamily: 'initial', color: 'white' }}>
            Foodie Bites
          </Typography>
          <Button color="inherit" onClick={() => navigate("/")}>Home</Button>
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Toolbar>
      </AppBar>

      <Box textAlign="center" mt={3} mb={3}>
        <FormControlLabel
          control={
            <Switch
              checked={availability}
              onChange={toggleAvailability}
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: 'orange',
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  backgroundColor: 'orange',
                },
              }}
            />
          }
          label={availability ? 'Online' : 'Offline'}
        />
      </Box>

      <Grid container spacing={3} alignItems="stretch">
        {orders.length === 0 ? (
          <Grid item xs={12}>
            <Typography variant="h6" align="center" color="textSecondary">
              No orders assigned yet.
            </Typography>
          </Grid>
        ) : (
          orders.map(order => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={order._id}>
              <Card sx={{
                height: "100%",
              
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                borderRadius: 3,
                boxShadow: 3,
                border: '1px solid #e0e0e0',
                minHeight:350,
                transition: '0.3s',
                '&:hover': {
                  boxShadow: 6,
                  borderColor: '#1976d2'
                }
              }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography><strong>User:</strong> {order.user?.name}</Typography>
                  <Typography><strong>Phone:</strong> {order.phone}</Typography>
                  <Typography><strong>Address:</strong> {order.deliveryLocation?.address}</Typography>
                  <Typography><strong>Total Price:</strong> ₹{order.totalPrice}</Typography>
                  {/* <Typography><strong>Payment Method:</strong> {order.paymentMethod}</Typography> */}
                  <Typography><strong>Payment Status:</strong> {order.paymentStatus}</Typography>
                  <Typography><strong>Status:</strong> {order.status}</Typography>

                  <Box mt={2}>
                    <Typography fontWeight="bold">Items:</Typography>
                    {order.items.map((item, idx) => (
                      <Typography key={idx}>
                        - {item.name} × {item.quantity} (₹{item.price})
                      </Typography>
                    ))}
                  </Box>

                  {order.status === "placed" && (
                    <Button
                      fullWidth
                      variant="contained"
                      sx={{ mt: 2, backgroundColor: 'orange', '&:hover': { backgroundColor: '#e69500' } }}
                      onClick={() => handleAcceptOrder(order._id)}
                    >
                      Accept Order
                    </Button>
                  )}

                  <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={order.status}
                      label="Status"
                      onChange={e => handleStatusChange(order._id, e.target.value)}
                    >
                      <MenuItem value="delivering">Delivering</MenuItem>
                      <MenuItem value="delivered">Delivered</MenuItem>
                      <MenuItem value="cancelled">Cancelled</MenuItem>
                    </Select>
                  </FormControl>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
};

export default DeliveryDash;
