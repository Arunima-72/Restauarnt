
import {
  Button,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../../axiosInterceptor';
import { toast } from 'react-toastify';

const FoodForm = () => {
  const [form, setForm] = useState({
    name: '',
    price: '',
    category: '',
    available: '',
    description: '',
    imageUrl: '',
  });

  const navigate = useNavigate();
  const location = useLocation();
  const isUpdate = !!location.state?.val;

  useEffect(() => {
    if (isUpdate) {
      const {
        name,
        price,
        category,
        available,
        description,
        imageUrl,
      } = location.state.val;
      setForm({
        name: name || '',
        price: price || '',
        category: category || '',
        available: available ?? '',
        description: description || '',
        imageUrl: imageUrl || '',
      });
    }
  }, [isUpdate, location]);
   const isValidImageUrl = (url) => {
  return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
};

const handleSubmit = () => {
  if (!isValidImageUrl(form.imageUrl)) {
    toast.error('Please enter a valid image URL (.jpg, .png, .gif, etc.)');
    return;
  }
 
    const apiCall = isUpdate
      ? axiosInstance.put(
          `http://localhost:3000/fooditems/edit/${location.state.val._id}`,
          form
        )
      : axiosInstance.post('http://localhost:3000/fooditems/additems', form);

    apiCall
      .then(() => {
        toast.success(
          isUpdate ? 'Item updated successfully' : 'Item added successfully'
        );
        navigate('/admin-dashboard/fooditems');
      })
      .catch((err) => {
        console.error(err);
        toast.error('Something went wrong. Please try again.');
      });
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <Typography
        variant="h4"
        align="center"
        color="orange"
        fontFamily="cursive"
        gutterBottom
      >
        {isUpdate ? 'Update Food Item' : 'Add New Food Item'}
      </Typography>

      <Grid container spacing={2} direction="column">
        <Grid item xs={12}>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            color="warning"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Price"
            variant="outlined"
            fullWidth
            color="warning"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Category"
            variant="outlined"
            fullWidth
            color="warning"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            color="warning"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Availability"
            variant="outlined"
            fullWidth
            select
            color="warning"
            value={form.available}
            onChange={(e) =>
              setForm({ ...form, available: e.target.value })
            }
          >
            <MenuItem value={true}>Available</MenuItem>
            <MenuItem value={false}>Not Available</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Image URL"
            variant="outlined"
            fullWidth
            color="warning"
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
          />
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            fullWidth
            size="large"
            color="warning"
            onClick={handleSubmit}
          >
            {isUpdate ? 'Update Item' : 'Add Item'}
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default FoodForm;
