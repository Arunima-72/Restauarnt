
import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Box,
} from '@mui/material';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // clear token or auth logic here
    localStorage.removeItem("logintoken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("UserId")
    navigate("/login");
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Navbar */}
      <AppBar position="static" sx={{ backgroundColor: "orange" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Admin Dashboard
          </Typography>
          <Button color="inherit" onClick={() => navigate("/")}>
            Home
          </Button>
          
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* Dashboard Grid */}
      <Box p={4}>
        <Typography variant="h4" gutterBottom color="orange" style={{ textAlign: 'center' }}>
          Welcome Admin
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Link to="additems" style={{ textDecoration:'none'}}>
              <Card
                sx={{
                  height: 40,
                  backgroundColor: "blanchedalmond",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: 3,
                  transition: "0.3s",
                  "&:hover": {
                    boxShadow: 6,
                    transform: "scale(1.05)",
                  },
                }}
              >
                <CardContent>
                  <Typography variant="h6" align="center">
                    Add Food Items
                  </Typography>
                </CardContent>
              </Card>
            </Link>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Link to="fooditems" style={{ textDecoration: 'none' }}>
              <Card
                sx={{
                  height: 40,
                  backgroundColor: "blanchedalmond",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: 3,
                  transition: "0.3s",
                  "&:hover": {
                    boxShadow: 6,
                    transform: "scale(1.05)",
                  },
                }}
              >
                <CardContent>
                  <Typography variant="h6" align="center">
                    Manage Menu
                  </Typography>
                </CardContent>
              </Card>
            </Link>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Link to="orders" style={{ textDecoration: 'none' }}>
              <Card
                sx={{
                  height: 40,
                  backgroundColor: "blanchedalmond",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: 3,
                  transition: "0.3s",
                  "&:hover": {
                    boxShadow: 6,
                    transform: "scale(1.05)",
                  },
                }}
              >
                <CardContent>
                  <Typography variant="h6" align="center">
                    Manage Orders
                  </Typography>
                </CardContent>
              </Card>
            </Link>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Link to="reservations" style={{ textDecoration: 'none' }}>
              <Card
                sx={{
                  height: 40,
                  backgroundColor: "blanchedalmond",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: 3,
                  transition: "0.3s",
                  "&:hover": {
                    boxShadow: 6,
                    transform: "scale(1.05)",
                  },
                }}
              >
                <CardContent>
                  <Typography variant="h6" align="center">
                    Manage Reservations
                  </Typography>
                </CardContent>
              </Card>
            </Link>
          </Grid>
        </Grid>
        {/* Nested child routes rendered here */}
        <Box mt={5}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
