const Joi = require('joi');


exports.validatePermission=(req, res, next)=> {
    const permissionSchema = Joi.object({
        permission: Joi.string().valid('read', 'write').required(),
        value: Joi.boolean().required()
    });
    

    const { error } = permissionSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
}

exports.validatePagination = (req, res, next) => {
    const { page, pageSize } = req.query;
    if (page && isNaN(parseInt(page, 10))) {
        return res.status(400).json({ message: 'Page must be a valid number' });
    }
    if (pageSize && isNaN(parseInt(pageSize, 10))) {
        return res.status(400).json({ message: 'Page size must be a valid number' });
    }
    next();
};