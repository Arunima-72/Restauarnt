
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Card, CardContent,
  Button, Divider, AppBar, Toolbar, CircularProgress // Added for loading state
} from '@mui/material';
import { toast } from 'react-toastify';
import axiosInstance from '../axiosInterceptor'; // Assuming this is correctly set up

const OrderPage = () => {
  const { state } = useLocation(); // Contains cart details if navigated from Cart
  const navigate = useNavigate();

  // State for displaying previous orders
  const [allUserOrders, setAllUserOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  // Default to 'current' orders if there's no new order to confirm
  const [activeTab, setActiveTab] = useState('current');

  // Function to get userId from localStorage (Centralized for consistency)
  // const getUserId = () => {
  //   try {
  //     const userString = localStorage.getItem("logintoken"); // Assuming 'logintoken' stores JSON string of user
  //     if (userString) {
  //       const user = JSON.parse(userString);
  //       return user._id; // Assuming user object has an _id field
  //     }
  //     // Fallback if 'logintoken' doesn't contain _id, check 'userId' directly
  //     const userId = localStorage.getItem("userId");
  //     return userId;
  //   } catch (error) {
  //     console.error("Error parsing user data from localStorage:", error);
  //     toast.error("Failed to retrieve user information.");
  //     return null;
  //   }
  // };
// OrderPage.jsx (and other files using getUserId)
const getUserId = () => {
  try {
    const userId = localStorage.getItem("userId"); // Directly get the userId
    // console.log("Retrieved userId from localStorage:", userId); // For debugging

    // if (!userId || userId.length !== 24) { // Basic validation for MongoDB ObjectId length
    //     console.warn("User ID not found or is invalid (length mismatch).");
    //     // You might want to toast.error("User not logged in or invalid ID.") here too
    //     return null;
    // }
    return userId;
  } catch (error) {
    console.error("Error retrieving userId from localStorage:", error);
    // This catch block might be less likely to hit now, but good to keep.
    return null;
  }
};
  // Fetch user's orders on component mount
  useEffect(() => {
    const userId = getUserId();
    if (!userId || userId.length !== 24) {
      // toast.info("Please log in to view your orders."); // Maybe too aggressive if user is just Browse
      setLoadingOrders(false);
      return;
    }

    const fetchUserOrders = async () => {
      setLoadingOrders(true);
      try {
        const res = await axiosInstance.get(`http://localhost:3000/orders/user/${userId}`);
        // Filter orders into 'current' (pending, preparing, delivering, etc.) and 'past' (delivered, cancelled)
        const sortedOrders = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Most recent first
        setAllUserOrders(sortedOrders);
      } catch (err) {
        console.error("Failed to load user orders:", err);
        toast.error("Failed to load your orders. Please try again.");
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchUserOrders();
  }, []); // Empty dependency array means this runs once on mount


  // Filter orders for "Current" and "Past" views
  const currentOrders = allUserOrders.filter(order =>
    !['delivered', 'cancelled'].includes(order.status)
  );

  const pastOrders = allUserOrders.filter(order =>
    ['delivered', 'cancelled'].includes(order.status)
  );


  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: "orange" }}>
        <Toolbar>
          <Typography variant="h4" sx={{ flexGrow: 1 }} style={{fontFamily:"-moz-initial"}}>Foodie Bites</Typography>
          <Button color="inherit" onClick={() => navigate("/")}>Home</Button>
          <Button color="inherit" onClick={() => navigate("/menu")}>Menu</Button>
          <Button color="inherit" onClick={() => navigate("/cart")}>Cart</Button>
        </Toolbar>
      </AppBar>

      {/* Tab Buttons */}
      <Box sx={{ textAlign: 'center', my: 3 }}>
        <Button
          variant={activeTab === 'current' ? 'contained' : 'outlined'}
          color="warning"
          onClick={() => setActiveTab('current')}
          sx={{ mx: 1 }}
        >
          ⏱️ Current Orders ({currentOrders.length})
        </Button>
        <Button
          variant={activeTab === 'past' ? 'contained' : 'outlined'}
          color="warning"
          onClick={() => setActiveTab('past')}
          sx={{ mx: 1 }}
        >
          📜 Past Orders ({pastOrders.length})
        </Button>
      </Box>

      <Box sx={{ maxWidth: 700, margin: 'auto', p: 3 }}>
        {/* Current Orders Tab Content */}
        {activeTab === 'current' && (
          <OrderList orders={currentOrders} title="Current Orders" loading={loadingOrders} />
        )}

        {/* Past Orders Tab Content */}
        {activeTab === 'past' && (
          <OrderList orders={pastOrders} title="Past Orders" loading={loadingOrders} />
        )}

        {/* Message if no orders are found */}
        {!loadingOrders && allUserOrders.length === 0 && (
            <Typography variant="h6" color="text.secondary" align="center">
                You haven't placed any orders yet. Go to <Button onClick={() => navigate("/menu")}>Menu</Button> to get started!
            </Typography>
        )}
      </Box>
    </Box>
  );
};

// Helper component to render lists of orders
const OrderList = ({ orders, title, loading }) => {
  return (
    <>
      <Typography variant="h5" color="orange" align="center" sx={{ mb: 3 }}>
        {title}
      </Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress color="warning" />
        </Box>
      ) : orders.length === 0 ? (
        <Typography variant="body1" color="text.secondary" align="center">
          No {title.toLowerCase()} found.
        </Typography>
      ) : (
        orders.map(order => (
          <Card key={order._id} sx={{ mb: 2, p: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              🕒 Order placed on: {new Date(order.createdAt).toLocaleString()}
            </Typography>
            <Typography variant="body2" sx={{fontWeight:'bold'}}>Order ID: {order._id}</Typography>
            <Divider sx={{ my: 1 }} />

            {order.items.map((item, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                {/* Check if foodItem is populated. If not, handle it gracefully. */}
                {item.foodItem?.imageUrl && (
                  <img src={item.foodItem.imageUrl} alt={item.foodItem.name} style={{ width: 50, height: 50, borderRadius: 4, marginRight: 10 }} />
                )}
                <Box>
                  <Typography variant="body1">{item.foodItem?.name || item.name || 'Unknown Food Item'}</Typography>
                  <Typography variant="body2">
                    Qty: {item.quantity} × ₹{item.foodItem?.price || item.price || 0}
                  </Typography>
                </Box>
              </Box>
            ))}

            <Divider sx={{ my: 1 }} />

            <Typography>Total: ₹{order.totalPrice}</Typography>
            <Typography>Delivery To: {order.deliveryLocation.address}, {order.deliveryLocation.pincode}</Typography>
            <Typography>Payment Method: {order.paymentMethod}</Typography>
            <Typography>Payment Status: <Typography component="span" sx={{ color: order.paymentStatus === 'paid' ? 'success.main' : order.paymentStatus === 'failed' ? 'error.main' : 'warning.main', fontWeight: 'bold' }}>{order.paymentStatus}</Typography></Typography>
            <Typography>Order Status: <Typography component="span" sx={{ color: order.status === 'delivered' ? 'success.main' : order.status === 'cancelled' ? 'error.main' : 'info.main', fontWeight: 'bold' }}>{order.status}</Typography></Typography>
            {order.deliveryPerson && (
              <Typography>Delivery Person: {order.deliveryPerson.name}</Typography>
            )}
          </Card>
        ))
      )}
    </>
  );
};


export default OrderPage;