

import React, { useState } from 'react';
import { TextField, Button, Typography, Card, CardContent } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    axios.post('http://localhost:3000/user/login', form)
      .then(res => {
        if (res.data.jtoken) {
          localStorage.setItem('logintoken', res.data.jtoken);
          localStorage.setItem('userRole', res.data.role); 
          localStorage.setItem('userId', res.data.user._id); // 
         console.log("✅ Stored userId:", res.data.user._id);  
          // localStorage.setItem('user', JSON.stringify(res.data.user));

  alert(res.data.message || 'Login successful');
          // 🔁 Navigate based on role
          if (res.data.role === 'admin') {
            navigate('/');
          } else if (res.data.role === 'delivery') {
            navigate('/delivery-dashboard');
          } else {
            navigate('/');
          }
        } else {
          setLoginError('Invalid email or password');
        }
      })
      .catch(() => setLoginError('Invalid email or password'));
      


  };

  return (
      <div className="login-container" style={{
        backgroundImage: "url('/images/login.avif')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >     
      
    <Card sx={{ maxWidth: 400, margin: 'auto', mt: 5 }}>
      <CardContent>
        <Typography variant="h4" align="center"style={{fontFamily:"-moz-initial" ,color:"orange"}}>Login</Typography>
        <TextField fullWidth label="Email" margin="normal"
          onChange={(e) => setForm({ ...form, email: e.target.value })}  />
        <TextField fullWidth label="Password" margin="normal" type="password"
          onChange={(e) => setForm({ ...form, password: e.target.value })} />
          
        {loginError && <Typography color="error">{loginError}</Typography>}
        <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={handleLogin} style={{backgroundColor:"orange" }}>Login</Button>
        <Typography align="right" sx={{ mt: 1 }}>
  <Link to="/forgot-password" style={{ color: "brown", fontSize: "0.9rem" }}>
    Forgot Password?
  </Link>
</Typography>


        <Typography align="center" sx={{ mt: 2 }}>
          <Link to="/signup" style={{color:"burlywood"}}>Don't have an account? Sign up</Link>
        </Typography>
      </CardContent>
    </Card>
    </div>
  );
};

export default Login;
