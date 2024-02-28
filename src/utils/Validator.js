import { Joi } from '../index.js'

const signupValidator = Joi.object().keys({
    fullName: Joi.string().description("fullName"),
    email: Joi.required(),
    password: Joi.string()
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])'))
        .min(8)
        .required()
        .label('password')
        .messages({
            'string.min': '{{#label}} must be at least {{#limit}} characters long',
            'any.required': '{{#label}} is required',
            'string.pattern.base': '{{#label}} must contain at least one uppercase letter, one lowercase letter, one digit, and one special character',
        }),
    currency: Joi.string().optional(),
    referralByCode: Joi.string().optional(),
    registerType: Joi.string().optional(),
    type: Joi.string().optional()
});


export const validatorRequest = {
    signupValidator
}