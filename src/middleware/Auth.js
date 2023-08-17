import { jwt,StatusCodes, ResponseMessage, sendResponse } from '../index.js'

export async function Auth(req, res, next) {
    const token = req.header("auth");
    if (!token) {
        return sendResponse(res,StatusCodes.UNAUTHORIZED,ResponseMessage.TOKEN_NOT_AUTHORIZED,[])
    } else {
        try {
            const decode = await jwt.verify(token, process.env.JWT_SECRET_KEY);
            if (decode.user) {
                req.user = decode.user.id;
            } else if (decode.admin) {
                req.admin = decode.admin.id;
            }
            next();
        } catch (error) {
            return sendResponse(res,StatusCodes.UNAUTHORIZED,ResponseMessage.TOKEN_NOT_VALID_AUTHORIZED,[]);
        }
    }
}
