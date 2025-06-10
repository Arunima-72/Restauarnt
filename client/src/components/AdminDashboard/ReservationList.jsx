
import React, { useState, useEffect } from "react";
import axiosInstance from "../../axiosInterceptor";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

import "./ReservationList.css"; 
import { toast } from "react-toastify";

const AdminReservationPanel = () => {
  const [slots, setSlots] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    availableSeats: "  parseInt(formData.availableSeats, 10)",
  });
  const [editId, setEditId] = useState(null);

  // Fetch slots
  useEffect(() => {
    fetchSlots();
    fetchReservations();
  }, []);

  const fetchSlots = async () => {
    try {
      const res = await axiosInstance.get("http://localhost:3000/slots");
      setSlots(res.data);
    } catch (err) {
      console.error("Error fetching slots", err);
    }
  };

  const fetchReservations = async () => {
    try {
      const res = await axiosInstance.get("http://localhost:3000/reservations");
      setReservations(res.data);
    } catch (err) {
      console.error("Error fetching reservations", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        toast.success("Slot updated successfully!");
        
      } else {
        await axiosInstance.post("http://localhost:3000/slots", formData);
        toast.success("Slot added successfully!");
      }
      setFormData({ date: "", time: "", availableSeats: " parseInt(formData.availableSeats, 10)" });
      setEditId(null);
      fetchSlots();
    } catch (err) {
      console.error("Slot operation failed", err);
    }
  };

  const handleEdit = (slot) => {
    setFormData({
      date: slot.date,
      time: slot.time,
      availableSeats: slot.availableSeats,
    });
    setEditId(slot._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this slot?")) return;
    try {
      await axiosInstance.delete(`http://localhost:3000/slots/${id}`);
      fetchSlots();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (

    <Box sx={{ p: 3 }}  style={{backgroundImage:"url('/images/reshometable.avif')"}}>
      <Typography variant="h4"  sx={{ mb: 4, color: "white", fontFamily:"-moz-initial" }}>
        Admin Reservation Panel
      </Typography>
      <Grid container spacing={4}>
  {/* Left: Add/Edit Slot Form */}
  <Grid item xs={12} md={4}>
    <Card sx={{ height: "100%", p: 3 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom align="center" style={{color:"orange",fontFamily:"-moz-initial"}}>
          {editId ? "Edit Slot" : "Add New Slot"}
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                type="date"
                name="date"
                fullWidth
                label="Date"
                value={formData.date}
                onChange={handleChange}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Time"
                name="time"
                fullWidth
                value={formData.time}
                onChange={handleChange}
                required
                placeholder="e.g. 7:00 PM"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Available Seats"
                name="availableSeats"
                type="number"
                fullWidth
                value={formData.availableSeats}
                onChange={handleChange}
                required
              />
            </Grid>
          </Grid>
          <Box textAlign="center">
            <Button
              type="submit"
              variant="contained"
              sx={{ mt: 3, backgroundColor: "orange", px: 4 }}
            >
              {editId ? "Update Slot" : "Add Slot"}
            </Button>
          </Box>
        </form>
      </CardContent>
    </Card>
  </Grid>

  {/* Right: List of Slots */}
  <Grid item xs={12} md={8}>
    <Typography variant="h5" sx={{ mb: 2 }} style={{color:"white",fontFamily:"-moz-initial"}}>
      All Available Slots
    </Typography>
    <Grid container spacing={2}>
      {slots.map((slot) => (
        <Grid item xs={12} sm={6} key={slot._id}>
          <Card>
            <CardContent>
              <Typography>
                <strong>Date:</strong>{" "}
                {new Date(slot.date).toLocaleDateString()}
              </Typography>
              <Typography>
                <strong>Time:</strong> {slot.time}
              </Typography>
              <Typography>
                <strong>Seats:</strong> {slot.availableSeats}
              </Typography>
              <Button
                onClick={() => handleEdit(slot)}
                sx={{ mt: 1, mr: 1 }}
                variant="outlined"
              >
                Edit
              </Button>
              <Button
                onClick={() => handleDelete(slot._id)}
                sx={{ mt: 1 }}
                variant="outlined"
                color="error"
              >
                Delete
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  </Grid>
</Grid>

 
      <Typography variant="h5" sx={{ mt: 5, mb: 2 }} style={{color:"white",fontFamily:"-moz-initial"}}>
  User Reservations
</Typography>
<Card sx={{ overflowX: "auto" }}>
  <Table>
    <TableHead sx={{ backgroundColor: "burlywood" }}>
      <TableRow sx={{ textAlign: "center" }}>
        <TableCell><strong>User</strong></TableCell>
        <TableCell><strong>Date</strong></TableCell>
        <TableCell><strong>Time</strong></TableCell>
        <TableCell><strong>Guests</strong></TableCell>
        <TableCell><strong>Requests</strong></TableCell>
        <TableCell><strong>Status</strong></TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {reservations.map((res) => (
        <TableRow key={res._id}>
          <TableCell>{res.user?.name || "N/A"}</TableCell>
          <TableCell>{new Date(res.date).toLocaleDateString()}</TableCell>
          <TableCell>{res.time}</TableCell>
          <TableCell>{res.numberOfGuests}</TableCell>
          <TableCell>{res.specialRequests || "None"}</TableCell>
          <TableCell>{res.status}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</Card>

    
    </Box>
  );
};

export default AdminReservationPanel;
