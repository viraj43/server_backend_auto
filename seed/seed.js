import mongoose from 'mongoose';
import User from '../models/User.js'; // Ensure the path is correct for your User model

// MongoDB URI directly placed here
const MONGO_URI = "mongodb+srv://virajMishra:viraj@cluster0.uiftlzv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Check if MONGO_URI is correctly set
if (!MONGO_URI) {
  console.error('MONGO_URI is not defined!');
  process.exit(1); // Exit if MONGO_URI is missing
}

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('MongoDB connected successfully!');
    seedUser();  // Call the seed function
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit if connection fails
  });

// Function to seed a user
const seedUser = async () => {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ username: 'johndoe' });
    if (existingUser) {
      console.log('User already exists!');
      mongoose.connection.close();
      return;
    }

    // Create a new user instance with a plain text password
    const newUser = new User({
      username: 'johndoe',
      password: 'password123',  // Plain text password
    });

    // Save the user to the database
    const savedUser = await newUser.save();
    console.log('User seeded successfully:', savedUser);
    mongoose.connection.close();  // Close connection after seeding
  } catch (error) {
    console.error('Error seeding user:', error);
    mongoose.connection.close();  // Close connection in case of error
  }
};
