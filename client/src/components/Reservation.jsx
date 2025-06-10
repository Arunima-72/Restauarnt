
import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  TextareaAutosize,
  useMediaQuery,
  useTheme,
  AppBar,
  Toolbar,
} from "@mui/material";
import axiosInstance from "../axiosInterceptor";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Reservation = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [formData, setFormData] = useState({
    name: "",
    date: "",
    time: "",
    numberOfGuests: "",
    specialRequests: "",
  });

  const [availableTimes, setAvailableTimes] = useState([]);
  const [status, setStatus] = useState("");
  const [MyReservations, setMyReservations] = useState([]);

  useEffect(() => {
    const fetchMyReservations = async () => {
      try {
        const res = await axiosInstance.get("http://localhost:3000/reservations/my");
        setMyReservations(res.data);
      } catch (err) {
        toast.error("Failed to load reservations");
      }
    };
    fetchMyReservations();
  }, []);


useEffect(() => {
  const fetchAvailableTimes = async () => {
    if (!formData.date) return;
    try {
      const res = await axiosInstance.get(`http://localhost:3000/reservations/available-times?date=${formData.date}`);
      console.log("Available Times:", res.data.availableSlots);
      setAvailableTimes(res.data.availableSlots || []);
    } catch (err) {
      toast.error("Could not load time slots");
      console.error(err);
    }
  };
  fetchAvailableTimes();
}, [formData.date]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
const handleSubmit = async (e) => {
  e.preventDefault();
  if (!availableTimes.includes(formData.time)) {
    toast.error("Selected time slot is no longer available.");
    return;
  }
  try {
    const res = await axiosInstance.post("http://localhost:3000/reservations", formData);
      toast.success("Reservation successful!");
    setStatus(res.data.status || "Confirmed");

    navigate("/my", {
      state: {
        reservation: {
          ...formData,
          status: res.data.status || "Confirmed",
          reservationId: res.data.reservationId || "",
        },
      },
    });

    setFormData({
      name: "",
      date: "",
      time: "",
      numberOfGuests: "",
      specialRequests: "",
    });
  } catch (err) {
    toast.error("Reservation failed");
    console.error(err);
  }
};



  return (
      <Box sx={{ flexGrow: 1 }}>
      {/* Navbar */}
      <AppBar position="static" sx={{ backgroundColor: "orange" }}>
        <Toolbar>
           <Typography  variant="h3" component="div"  sx={{ flexGrow: 1 ,fontFamily:'initial',color:'white'}}>
         Foodie Bites
                 </Typography> 
          <Button color="inherit" onClick={() => navigate("/")}>
            Home
          </Button>
          <Button color="inherit" onClick={() => navigate("/menu")}>
            Menu
          </Button>
          <Button color="inherit" onClick={() => navigate("/my")}>
            My Reservations
          </Button>
          {/* <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button> */}
        </Toolbar>
      </AppBar>
    <Box
      sx={{
        backgroundImage: "url('/images/tablereserve.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Card
        sx={{
          width: isSmallScreen ? "90%" : "40%",
          bgcolor: "rgba(255,255,255,0.9)",
          mt: 5,
          mb: 5,
        }}
      >
        <CardContent>
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{ fontFamily: "-moz-initial", color: "orange" }}
          >
            Reserve a Table
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Your Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
              required
            />
<TextField
  fullWidth
  type="date"
  name="date"
  value={formData.date}
  onChange={handleChange}
  margin="normal"
  required
  inputProps={{
    min: new Date().toISOString().split("T")[0], // Disable past dates
  }}
/>

            {/* <TextField
              fullWidth
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
            /> */}
            <FormControl fullWidth margin="normal" required>
  <InputLabel>Select a Time</InputLabel>
  <Select
    name="time"
    value={formData.time}
    onChange={handleChange}
    label="Select a Time"
  >
    {availableTimes.length > 0 ? (
      availableTimes.map((slot, index) => (
        <MenuItem key={index} value={slot}>
          {slot}
        </MenuItem>
      ))
    ) : (
      <MenuItem disabled>No slots available</MenuItem>
    )}
  </Select>
</FormControl>

           

            <TextField
              fullWidth
              type="number"
              name="numberOfGuests"
              label="Number of Guests"
              value={formData.numberOfGuests}
              onChange={handleChange}
              margin="normal"
              required
            />

            <TextareaAutosize
              name="specialRequests"
              placeholder="Special Requests (optional)"
              value={formData.specialRequests}
              onChange={handleChange}
              minRows={3}
              style={{
                width: "100%",
                marginTop: 16,
                padding: 10,
                borderRadius: 4,
                borderColor: "#ccc",
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 2,
                bgcolor: "orange",
                "&:hover": { bgcolor: "darkgoldenrod" },
              }}
            >
              Reserve Now
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
    </Box>
  );
};

export default Reservation;
