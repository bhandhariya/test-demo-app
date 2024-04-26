const jwt = require('jsonwebtoken');
const Admin = require("../model/admin.model");
const Buyer = require("../model/buyer.model");
const User = require("../model/user.model");

let selector = {
  admin: { secret: process.env.ADMIN_SECRET, model: Admin },
  user: { secret: process.env.USER_SECRET, model: User },
  buyer: { secret: process.env.BUYER_SECRET, model: Buyer },
};

/**
 * Signs a JWT with the appropriate secret for the user type.
 * @param {*} data - The payload to sign.
 * @param {string} userType - The type of user (admin, user, buyer).
 * @returns {string} - The signed JWT.
 */
exports.jwtSign = (data, userType) => {
  try {
    const secret = selector[userType]?.secret;
    if (!secret) {
      throw new Error("Missing secret for user type");
    }
    return jwt.sign(data, secret, { expiresIn: '30d' });
  } catch (err) {
    console.error(`JWT sign error: ${err}`);
    throw err;
  }
};

/**
 * Verifies a JWT and returns the decoded data if the token is valid.
 * @param {string} token - The JWT to verify.
 * @param {string} userType - The type of user (admin, user, buyer).
 * @returns {Object} - The decoded JWT payload.
 */
exports.jwtVerify = (token, userType) => {
  try {
    const secret = selector[userType]?.secret;
    if (!secret) {
      throw new Error("Missing secret for user type");
    }
    return jwt.verify(token, secret);
  } catch (err) {
    console.error(`JWT verify error: ${err}`);
    throw err;
  }
};

// Protect routes
exports.protect = (userType) => {
  return async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Make sure token exists
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    try {
      // Verify token
      const decoded = exports.jwtVerify(token, userType);
      console.log(decoded);
      let user = await selector[userType].model.findOne({ _id: decoded.userId });

      if (!user) {
        return res.status(401).json({ message: "Unauthorized: User not found" });
      }

      req.user = decoded;
      req.userType = userType;

      next();
    } catch (err) {
      console.log(`error: ${err}`);
      return res.status(401).json({ message: "Unauthorized: Error in token verification" });
    }
  }
};


exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.userType)) {
      return res.status(403).json({ message: "Unauthorized: You do not have permission to perform this action" });
    }
    next();
  };
};
