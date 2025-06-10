
import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Grid,
  IconButton,
  Snackbar,
  Alert,
  Tabs,
  Tab,
  Rating,
  TextField,
  Stack,
  DialogActions,
  DialogTitle,
  DialogContent,
  Dialog,
  AppBar,
  Toolbar,
  Badge
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCart from '@mui/icons-material/ShoppingCart';
import { useCart } from './context/CartContext';
import axiosInstance from '../axiosInterceptor';
import { useNavigate } from 'react-router-dom';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';

const categories = [
  { label: 'All 🍽️', value: 'All' },
  { label: 'Indian 🍛', value: 'Indian' },
  { label: 'Italian 🍕', value: 'Italian' },
  { label: 'Desserts 🍰', value: 'Desserts' },
   { label: 'Arabian 🍜', value: 'Arabian' },
];

const FoodItems = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [category, setCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastOpen, setToastOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);


  const { cartItems, addToCart, increaseQuantity, decreaseQuantity } = useCart();
  const navigate = useNavigate();
useEffect(() => {
  axiosInstance
    .get('http://localhost:3000/menu')
    .then((res) => {
      const activeItems = res.data.filter(item => item.isActive); // 🟠 filter active items
      setItems(activeItems);
      setFilteredItems(activeItems);
    })
    .catch((err) => console.log(err));
}, []);

  // useEffect(() => {
  //   axiosInstance
  //     .get('http://localhost:3000/menu')
  //     .then((res) => {
  //       setItems(res.data);
  //       setFilteredItems(res.data);
  //     })
  //     .catch((err) => console.log(err));
  // }, []);

  const handleCategoryChange = (event, newValue) => {
    setCategory(newValue);
    filterItems(newValue, searchQuery);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    filterItems(category, value);
  };

  const filterItems = (cat, query) => {
    let result = [...items];

    if (cat !== 'All') {
      result = result.filter(item => item.category === cat);
    }

    if (query.trim()) {
      result = result.filter(item => item.name.toLowerCase().includes(query.toLowerCase()));
    }

    setFilteredItems(result);
  };

  const getItemQuantity = (id) => {
    const item = cartItems.find((i) => i._id === id);
    return item ? item.quantity : 0;
  };

  const handleAddToCart = (item) => {
    addToCart(item);
    setToastOpen(true);
  };

  const handleViewDetails = (item) => {
    setSelectedItem(item);
    setDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setSelectedItem(null);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Navbar */}
      <AppBar position="static" sx={{ backgroundColor: "orange" }}>
        <Toolbar>
          <Typography variant="h4" sx={{ flexGrow: 1, fontFamily: 'initial', color: 'white' }}>
            Foodie Bites
          </Typography>
          <Button color="inherit" onClick={() => navigate("/")}>Home</Button>
          <IconButton color="default" onClick={() => navigate('/cart')}>
            <Badge badgeContent={cartCount} color="warning">
              <ShoppingCart />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Emoji Banner */}
      <Box sx={{ textAlign: 'center', mt: 2, fontSize: '1.8rem' }}>
        🍽️ 🍛 🍕 🍜 🍣 🍔 🍰 🍹
      </Box>

      {/* Category Tabs */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Tabs
          value={category}
          onChange={handleCategoryChange}
          centered
          textColor="secondary"
          indicatorColor="secondary"
          sx={{
            mb: 2,
            '& .MuiTab-root': {
              fontWeight: 'bold',
              color: 'gray',
              '&.Mui-selected': {
                color: 'orange',
              },
            },
          }}
        >
          {categories.map((cat) => (
            <Tab key={cat.value} label={cat.label} value={cat.value} />
          ))}
        </Tabs>
      </Box>

      {/* Search Bar */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <TextField
          label="Search "
          variant="outlined"
          color="warning"
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{ width: { xs: '90%', sm: '70%', md: '50%' } ,'& .MuiOutlinedInput-root': {
        borderRadius: '30px',}}}
        InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <SearchIcon color="disabled" />
        </InputAdornment>
      ),
    }}
        />
      </Box>

      {/* Food Items Grid */}
      <Grid container spacing={3} justifyContent="center">
        {filteredItems.map((item) => {
          const quantity = getItemQuantity(item._id);
          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item._id}>
              <Card sx={{ height: '100%', borderRadius: 3, boxShadow: 4, width: 250 }}>
                <CardMedia
                  sx={{ height: 160, objectFit: 'cover' }}
                  image={item.imageUrl}
                  title={item.name}
                />
                <CardContent>
                  <Typography variant="subtitle1" fontWeight="bold" noWrap>
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap sx={{ mb: 1 }}>
                    {item.description}
                  </Typography>
                  <Button
                    size="small"
                    onClick={() => handleViewDetails(item)}
                    sx={{ textTransform: 'none', color: 'orange', fontSize: '0.75rem', pl: 0 }}
                  >
                    View Details
                  </Button>
                  <Typography variant="subtitle2" fontWeight="bold">₹{item.price}</Typography>
                  <Rating
                    name="read-only"
                    value={item.rating || 0}
                    precision={0.5}
                    readOnly
                    size="small"
                    sx={{ my: 1 }}
                  />
                  {item.available === false ? (
                    <Typography variant="body2" color="textDisabled">Not Available</Typography>
                  ) : (
                    <Box sx={{ mt: 1 }}>
                      {quantity === 0 ? (
                        <Button
                          variant="contained"
                          fullWidth
                          color="warning"
                          onClick={() => handleAddToCart(item)}
                          sx={{ fontWeight: 'bold', borderRadius: 2 }}
                        >
                          Add to Cart
                        </Button>
                      ) : (
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="center"
                          alignItems="center"
                          sx={{
                            border: '1px solid orange',
                            borderRadius: 2,
                            px: 1,
                            py: 0.5
                          }}
                        >
                          <IconButton size="small" onClick={() => decreaseQuantity(item._id)}>
                            <RemoveIcon />
                          </IconButton>
                          <Typography variant="body1" fontWeight="bold">{quantity}</Typography>
                          <IconButton size="small" onClick={() => increaseQuantity(item._id)}>
                            <AddIcon />
                          </IconButton>
                        </Stack>
                      )}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Dialog for View Details */}
      <Dialog open={detailsOpen} onClose={handleCloseDetails} maxWidth="sm" fullWidth>
        {selectedItem && (
          <>
            <DialogTitle>{selectedItem.name}</DialogTitle>
            <DialogContent>
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <img
                  src={selectedItem.imageUrl}
                  alt={selectedItem.name}
                  style={{ maxWidth: '100%', borderRadius: 8 }}
                />
              </Box>
              <Typography variant="body1" gutterBottom>{selectedItem.description}</Typography>
              <Typography variant="subtitle1" fontWeight="bold">Price: ₹{selectedItem.price}</Typography>
              <Rating
                name="read-only"
                value={selectedItem.rating || 0}
                precision={0.5}
                readOnly
                size="small"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDetails} color="warning" variant="contained">
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Toast Notification */}
      <Snackbar
        open={toastOpen}
        autoHideDuration={3000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity="success"
          sx={{ width: '100%' }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => {
                setToastOpen(false);
                navigate('/cart');
              }}
            >
              View Cart
            </Button>
          }
        >
          Item added to cart!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FoodItems;
