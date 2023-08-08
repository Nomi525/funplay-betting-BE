import { Joi } from '../index.js'

const signupValidator = Joi.object().keys({
    email: Joi.string().email().required().max(100).description("email"),
    password: Joi.string()
        .regex(/[ -~]*[a-z][ -~]*/) // at least one digit in any position
        .regex(/[ -~]*[A-Z][ -~]*/) // at least one letter in any position
        .regex(/[ -~]*(?=[ -~])[^0-9a-zA-Z][ -~]*/) // at least one letter in any position
        .regex(/[ -~]*[0-9][ -~]*/)
        .min(8)
        .required(),
    currency: Joi.string().optional()
})

export const validatorRequest = {
    signupValidator
}