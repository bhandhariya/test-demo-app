// Importing the mongoose module for MongoDB interactions.
const mongoose = require('mongoose');

// Configuration object for MongoDB connection options.
const options = {
  useNewUrlParser: true,      // Use the new URL parser for MongoDB connections.
  useUnifiedTopology: true,   // Use the new server discovery and monitoring engine.
  useCreateIndex: true,       // Automatically create indices when defining models.
  useFindAndModify: false     // Deprecate findAndModify in favor of findOneAndUpdate.
};

// Environment variable for MongoDB URL for security and flexibility.
// Set the variable in your environment or a .env file.
const mongodbURL = process.env.mongodbURL;

// Function to connect to MongoDB using mongoose.
const connectToDatabase = async () => {
  try {
    // Attempting to connect to the MongoDB database.
    await mongoose.connect(mongodbURL, {});
    console.log('Database Connected Successfully');
  } catch (err) {
    // Logging error if the connection fails.
    console.error('Database Connection Failed', err);
  }
};

// Call the connect function to establish the database connection.
connectToDatabase();
