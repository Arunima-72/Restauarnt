// import React, { useState } from 'react';
// import axios from 'axios';

// function ForgotPassword() {
//   const [email, setEmail] = useState('');
//   const [msg, setMsg] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const res = await axios.post('http://localhost:3000/forgot-password', { email });
//     setMsg(res.data.message);
//   };

//   return (
//     <div>
//       <h2>Forgot Password</h2>
//       <form onSubmit={handleSubmit}>
//         <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
//         <button type="submit">Send Reset Link</button>
//       </form>
//       <p>{msg}</p>
//     </div>
//   );
// }

// export default ForgotPassword;
import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
} from '@mui/material';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/forgot-password', { email });
      setMsg(res.data.message);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
      setMsg('');
    }
  };
  


  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f5f5f5">
      <Card sx={{ width: 400, padding: 2, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom align="center">
            Forgot Password
          </Typography>
          <form onSubmit={handleSubmit}>
            <Box display="flex" flexDirection="column" gap={2}>
              <TextField
                label="Email Address"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                fullWidth
              />
              <Button variant="contained"  type="submit" style={{color:""}}>
                Send Reset Link
              </Button>
              {msg && <Alert severity="success">{msg}</Alert>}
              {error && <Alert severity="error">{error}</Alert>}
            </Box>
          </form>
        </CardContent>
      </Card>
      
    </Box>

    
  );
}

export default ForgotPassword;
