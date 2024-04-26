const Joi = require('joi');


exports.validateRegistration = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(), // Minimum 6 characters
        name: Joi.string().min(3).required() // Minimum 3 characters
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};


exports.loginValidation = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(), // Minimum 6 characters
        userType: Joi.string().min(3).required() // Minimum 3 characters
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};