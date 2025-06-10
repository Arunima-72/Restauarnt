
const User = require('../model/userData'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer=require('nodemailer')
// Login function
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    // Check if user exists AND password matches
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'RestauarantApp', 
      { expiresIn: '1d' } 
    );

    
    res.status(200).json({
      message: 'Login successful',
      jtoken: token,
      role: user.role, 
      user: { 
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role 
      }
    });
  } catch (err) {
    console.error("Login error:", err); 
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


exports.signup = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
   
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // 2. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 salt rounds

    // 3. Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      // Default role to 'user' if not provided, or use the provided role (e.g., 'admin', 'delivery')
      role: role || 'user',
    });

    await newUser.save();

    // 4. Send success response
    res.status(201).json({ message: 'Signup successful' });
  } catch (error) {
    console.error("Signup error:", error); 
    res.status(500).json({ message: 'Signup failed', error: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const token = crypto.randomBytes(32).toString('hex');

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetLink = `http://localhost:5173/reset-password/${token}`;

    // Send Email (Using nodemailer)
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER, // your Gmail
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      to: user.email,
      subject: 'Password Reset',
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password. Link valid for 1 hour.</p>`
    });

    res.json({ message: 'Reset link sent to your email' });
  } catch (err) {
    res.status(500).json({ message: 'Error sending email', error: err.message });
  }
};

// POST: /reset-password/:token
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error resetting password', error: err.message });
  }
};