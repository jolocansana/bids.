const Joi = require('joi');

module.exports = function (req) {
    
    const schema = Joi.object({
        name: Joi.string().max(200).required(),
        brand: Joi.string().min(2).max(200).required(),
        description: Joi.string().min(5).max(200).required(),
        tags: Joi.string().min(5).max(200).required(),
        productType: Joi.string().valid('clothes', 'food', 'electronics', 'tickets', 
        'furniture', 'beauty', 'books', 'hobbies',
        'sports', 'accessories', 'media', 'music', 'pets').required(),
    });

    return schema.validate(req);
}