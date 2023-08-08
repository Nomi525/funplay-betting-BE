import { validatorRequest } from "../index.js";
export const validatorMiddlware = function (validator) {
    // console.log('hiiii',validator);
  return async function (req, res, next) {
    try {
      const validated = await validatorRequest[validator].validateAsync(req.body)
      req.body = validated
      next()
    } catch (err) {
      if (err.isJoi)
        return res.status(400).json({
          success: false,
          data: null,
          message: err.details[0].message.replaceAll('\"', ''),
        })
    }
  }
}
