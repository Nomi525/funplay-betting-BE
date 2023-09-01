import { Joi } from '../index.js'

const signupValidator = Joi.object().keys({
    email: Joi.string().email().required().max(100).description("email"),
    password: Joi.string()
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])'))
        .min(8)
        .required()
        .label('password')
        .messages({
            'string.min': '{{#label}} must be at least {{#limit}} characters long',
            'any.required': '{{#label}} is required',
            'string.pattern.base': '{{#label}} must contain at least one uppercase letter',
            'string.pattern.base': '{{#label}} must contain at least one lowercase letter',
            'string.pattern.base': '{{#label}} must contain at least one special character',
            'string.pattern.base': '{{#label}} must contain at least one digit',
            'string.pattern.base': '{{#label}} must contain at least one uppercase letter, one lowercase letter, one digit, and one special character',
        }),
    currency: Joi.string().optional(),
    referralByCode: Joi.string().optional(),
    registerType: Joi.string().optional(),
    type: Joi.string().optional()
})

export const validatorRequest = {
    signupValidator
}