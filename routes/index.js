var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
const { validateRegistration,loginValidation } = require('../validation/authValidation');
const userModel = require('../model/user.model');
const buyerModel = require('../model/buyer.model');
const adminModel = require('../model/admin.model');
const jwt = require('jsonwebtoken');

let selector = {
  admin: { secret: process.env.ADMIN_SECRET, model: adminModel },
  user: { secret: process.env.USER_SECRET, model: userModel },
  buyer: { secret: process.env.BUYER_SECRET, model: buyerModel },
};

router.post('/login', loginValidation, async (req, res) => {
  try {
    const { email, password, userType } = req.body;
    const User = selector[userType]?.model;

    // Check if the user type is valid
    if (!User) {
      return res.status(400).json({ message: 'Invalid user type provided.' });
    }

    // Attempt to find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Login failed: User not found.' });
    }

    // Check if the provided password matches the stored password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Login failed: Incorrect password.' });
    }

    // Sign the JWT token with user-specific data
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Return the token upon successful login
    res.json({ token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'An error occurred during login: ' + err.message });
  }
});



router.post('/register/admin', validateRegistration, async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const newAdmin = new adminModel({ email, name, password: hashedPassword });
    await newAdmin.save();
    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// User Registration
router.post('/register/user', validateRegistration, async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new userModel({ email, name, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Buyer Registration
router.post('/register/buyer', validateRegistration, async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const newBuyer = new buyerModel({ email, name, password: hashedPassword });
    await newBuyer.save();
    res.status(201).json({ message: 'Buyer registered successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



module.exports = router;
