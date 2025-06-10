

import React, { useEffect, useState } from "react";
import {
  AppBar,
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Tabs,
  Tab,
  Toolbar,
  Stack,
  Paper,
} from "@mui/material";
import { toast } from "react-toastify";
import axiosInstance from "../axiosInterceptor";
import { useNavigate } from "react-router-dom";

const MyReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);
  const navigate = useNavigate();

  const fetchReservations = async () => {
    try {
      const res = await axiosInstance.get("/reservations/my");
      setReservations(res.data);
    } catch (err) {
      toast.error("Failed to load reservations");
    }
  };

  const cancelReservation = async (id) => {
    try {
      await axiosInstance.put(`/reservations/${id}/cancel`);
      toast.success("Reservation cancelled");
      fetchReservations();
    } catch (err) {
      console.error("Error cancelling reservation:", err.message);
      toast.error("Cancel failed");
    }
  };

  const deleteReservation = async (id) => {
    try {
      await axiosInstance.delete(`/reservations/${id}`);
      toast.success("Reservation deleted");
      fetchReservations();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const today = new Date().toISOString().split("T")[0];
  const upcoming = reservations.filter((r) => new Date(r.date) >= new Date(today));
  const past = reservations.filter((r) => new Date(r.date) < new Date(today));

  const getStatusColor = (status) => {
    switch (status) {
      case "Confirmed":
        return "#2e7d32";
      case "Pending":
        return "#f9a825";
      case "Cancelled":
        return "#c62828";
      default:
        return "gray";
    }
  };

  const renderReservation = (r, isUpcoming) => (
    <Grid item xs={12} sm={6} md={4} key={r._id}>
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "white",
          borderRadius: 3,
          boxShadow: 3,
          p: 2,
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            transform: "scale(1.02)",
            boxShadow: 6,
          },
        }}
      >
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="body2" fontWeight="bold" gutterBottom>
            ID: {r._id.slice(-6)}
          </Typography>
          <Typography variant="body2">
            <strong>Guests:</strong> {r.numberOfGuests}
          </Typography>
          <Typography variant="body2">
            <strong>Time:</strong> {r.time}
          </Typography>
          <Typography variant="body2">
            <strong>Date:</strong> {r.date}
          </Typography>
          <Typography
            variant="body2"
            fontWeight={600}
            color={getStatusColor(r.status)}
          >
            {r.status}
          </Typography>
          {r.specialRequests && (
            <Typography variant="caption" display="block">
              <strong>Note:</strong> {r.specialRequests}
            </Typography>
          )}
        </CardContent>

        <Stack direction="row" spacing={1}>
          {isUpcoming && r.status !== "Cancelled" && (
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => cancelReservation(r._id)}
            >
              Cancel
            </Button>
          )}
          {!isUpcoming && (
            <Button
              variant="outlined"
              color="secondary"
              size="small"
              onClick={() => deleteReservation(r._id)}
            >
              Delete
            </Button>
          )}
        </Stack>
      </Card>
    </Grid>
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: "url('/images/reshome.avif')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        pb: 8,
      }}
    >
      {/* App Bar */}
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
               <Button color="inherit" onClick={() => navigate("/reservations")}>
                  Reservations
               </Button>
               {/* <Button color="inherit" onClick={handleLogout}>
                 Logout
               </Button> */}
             </Toolbar>
           </AppBar>

      {/* Tabs */}
      <Box sx={{ px: 3, pt: 4 }}>
        <Tabs
          value={tabIndex}
          onChange={(e, newVal) => setTabIndex(newVal)}
          // textColor="primary"
          indicatorColor=""
          variant="fullWidth"
          centered
          
          sx={{ backgroundColor: "white", borderRadius: 2 }}
        >
          <Tab label="Upcoming Reservations" style={{fontFamily:"-moz-initial",fontWeight:"bold",color:"crimson"}}/>
          <Tab label="Past Reservations"  style={{fontFamily:"-moz-initial",fontWeight:"bold",color:"crimson"}}/>
        </Tabs>

        <Box sx={{ mt: 4, px: 2 }}>
          {tabIndex === 0 && (
            <Grid container spacing={3}>
              {upcoming.length > 0 ? (
                upcoming.map((r) => renderReservation(r, true))
              ) : (
                <Typography sx={{ color: "white", pl: 2 }}>No upcoming reservations</Typography>
              )}
            </Grid>
          )}

          {tabIndex === 1 && (
            <Grid container spacing={3}>
              {past.length > 0 ? (
                past.map((r) => renderReservation(r, false))
              ) : (
                <Typography sx={{ color: "white", pl: 2 }}>No past reservations</Typography>
              )}
            </Grid>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default MyReservations;
