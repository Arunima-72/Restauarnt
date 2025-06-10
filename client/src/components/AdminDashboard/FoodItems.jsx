
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  Box,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosInterceptor";
import { toast } from "react-toastify";

const FoodItem = () => {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = () => {
    axiosInstance
      .get("http://localhost:3000/fooditems")
      .then((res) => setItems(res.data))
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load food items");
      });
  };

  const updateData = (val) => {
    navigate("/admin-dashboard/additems", { state: { val } });
  };

  const toggleStatus = (id) => {
    axiosInstance
      .put(`http://localhost:3000/fooditems/${id}/toggle-status`)
      .then((res) => {
        toast.success(res.data.message);
        fetchItems(); // Refresh the list
      })
      .catch((err) => {
        toast.error("Failed to update status");
        console.error(err);
      });
  };

  return (
    <Box p={3}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" color="orange">
          Manage Food Items
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {items.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item._id}>
            <Card sx={{ maxWidth: 345, opacity: item.isActive ? 1 : 0.6 }}>
              <CardMedia
                sx={{ height: 200 }}
                image={item.imageUrl || "/images/placeholder.jpg"}
                title={item.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h6">
                  {item.name}
                </Typography>
                <Typography variant="body1" color="text.primary">
                  ₹{item.price}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Category: {item.category}
                </Typography>
                <Typography variant="body2" color={item.available ? "green" : "red"}>
                  {item.available ? "Available" : "Not Available"}
                </Typography>
                <Typography variant="body2" sx={{ color: item.isActive ? "green" : "red" }}>
                  Status: {item.isActive ? "Active" : "Inactive"}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="warning"
                  variant="contained"
                  onClick={() => updateData(item)}
                >
                  Update
                </Button>

                <Button
                  size="small"
                  variant="contained"
                  color={item.isActive ? "error" : "success"}
                  onClick={() => toggleStatus(item._id)}
                >
                  {item.isActive ? "Deactivate" : "Activate"}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FoodItem;
