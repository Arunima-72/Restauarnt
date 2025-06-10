
import React, { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Snackbar,
  Alert
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSignup = () => {
    const { name, email, password } = form;

    // Client-side validations
    if (!name || !email || !password) {
      setToast({ open: true, message: 'All fields are required.', severity: 'error' });
      return;
    }

    if (!validateEmail(email)) {
      setToast({ open: true, message: 'Invalid email format.', severity: 'error' });
      return;
    }

    if (password.length < 6) {
      setToast({ open: true, message: 'Password must be at least 6 characters.', severity: 'error' });
      return;
    }

    // Send signup request
    axios.post('http://localhost:3000/user/signup', { ...form, role: 'user' })
      .then(() => {
        setToast({ open: true, message: 'Signup successful! ', severity: 'success' });
        setTimeout(() => navigate('/login'), 2000); // Redirect after toast
      })
      .catch((err) => {
        const message = err.response?.data?.message || 'Signup failed. Try again.';
        setToast({ open: true, message, severity: 'error' });
        
});
      // });
  };

  return (
    <div 
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        backgroundImage: "url('/images/sign.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
    >
      <Card sx={{ maxWidth: 400, margin: 'auto', boxShadow: 5 }}>
        <CardContent>
          <Typography variant="h4" align="center" gutterBottom sx={{ color: 'orange', fontFamily: '-moz-initial' }}>
            Create an account
          </Typography>

          <TextField
            fullWidth label="Name" margin="normal" 
            
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <TextField
            fullWidth label="Email" margin="normal"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <TextField
            fullWidth label="Password" type="password" margin="normal"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <Button
            fullWidth variant="contained" color="warning" sx={{ mt: 2 }}
            onClick={handleSignup}
          >
            Sign Up
          </Button>

          <Typography align="center" sx={{ mt: 2 }}>
            <Link style={{ color: 'goldenrod', textDecoration: 'none' }} to={'/login'}>
              Already have an account? Login
            </Link>
          </Typography>
        </CardContent>
      </Card>

      {/* Toast Snackbar */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setToast({ ...toast, open: false })}
          severity={toast.severity}
          sx={{ width: '100%' }}
          variant="filled"
          
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Signup;
