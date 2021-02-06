const Joi = require('joi');

module.exports = function (req) {
    
    const schema = Joi.object({
        name: Joi.string().max(200).required(),
        brand: Joi.string().min(2).max(200).required(),
        startPrice: Joi.number().greater(0).required().messages({
            'number.base': `"start price" should be a type of 'number'`,
            'number.empty': `"start price" cannot be an empty field`,
            'any.required': `"start price" is required`,
            'number.greater': `"start price" must be greater than 0`
        }),
        buyOutPrice: Joi.number().greater(parseInt(req.startPrice ? req.startPrice : 0)).required().messages({
            'number.base': `"buy-out price" should be a type of 'number'`,
            'number.empty': `"buy-out price" cannot be an empty field`,
            'any.required': `"buy-out price" is required`,
            'number.greater': `"start price" must be greater than ${req.startPrice}`
        }),
        description: Joi.string().min(5).max(200).required(),
        tags: Joi.string().min(5).max(200).required(),
        bidIncrease: Joi.number().greater(0).required().messages({
            'number.base': `"bid increase amount" should be a type of 'number'`,
            'number.empty': `"bid increase amount" cannot be an empty field`,
            'any.required': `"bid increase amount" is required`,
            'number.greater': `"bind increase amount" must be greater than 0`
        }),
        startDate: Joi.date().required().messages({
            'date.base': `"start date" should be a type of 'date'`,
            'date.empty': `"start date" cannot be an empty field`,
            'any.required': `"start date" is required`
        }),
        endDate: Joi.date().required().messages({
            'date.base': `"end date" should be a type of 'date'`,
            'date.empty': `"end date" cannot be an empty field`,
            'any.required': `"end date" is required`
        }),
        productType: Joi.string().valid('clothes', 'food', 'electronics', 'tickets', 
        'furniture', 'beauty', 'books', 'hobbies',
        'sports', 'accessories', 'media', 'music', 'pets').required(),
        status: Joi.string().valid('active', 'inactive').required()
    });

    return schema.validate(req);
}