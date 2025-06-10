const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./model/userData'); // adjust the path as needed

// Connect to MongoDB
mongoose.connect('mongodb+srv://Arunima:Arunima72@cluster0.dwfhkqr.mongodb.net/RestaurantDb?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Rehash plain passwords
const rehashPasswords = async () => {
  try {
    const users = await User.find();

    for (const user of users) {
      if (!user.password.startsWith('$2b$')) {
        // password is not hashed
        const hashedPassword = await bcrypt.hash(user.password, 10);
        user.password = hashedPassword;
        await user.save();
        console.log(`✅ Hashed password for: ${user.email}`);
      } else {
        console.log(`🔒 Already hashed: ${user.email}`);
      }
    }

    console.log('✅ All plain-text passwords updated.');
  } catch (error) {
    console.error('Error updating passwords:', error);
  } finally {
    mongoose.disconnect();
  }
};

rehashPasswords();
