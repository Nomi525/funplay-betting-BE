import { jwt, StatusCodes, ResponseMessage, sendResponse, User } from '../index.js'

// export async function Auth(req, res, next) {
//     const token = req.header("auth");
//     if (!token) {
//         return sendResponse(res,StatusCodes.UNAUTHORIZED,ResponseMessage.TOKEN_NOT_AUTHORIZED,[])
//     } else {
//         try {
//             const decode = await jwt.verify(token, process.env.JWT_SECRET_KEY);
//             if (decode.user) {
//                 req.user = decode.user.id;
//             } else if (decode.admin) {
//                 req.admin = decode.admin.id;
//             }
//             next();
//         } catch (error) {
//             return sendResponse(res,StatusCodes.UNAUTHORIZED,ResponseMessage.TOKEN_NOT_VALID_AUTHORIZED,[]);
//         }
//     }
// }

export async function Auth(req, res, next) {
    const token = req.header("auth");
    if (!token) {
        return sendResponse(res, StatusCodes.UNAUTHORIZED, ResponseMessage.TOKEN_NOT_AUTHORIZED, [])
    } else {
        try {
            const decode = await jwt.verify(token, process.env.JWT_SECRET_KEY);
            if (decode.user) {
                let findUser = await User.findOne({
                    _id: decode.user.id,
                    isActive: false,
                });
                if (findUser) {
                    return res.status(401).json({
                        status: StatusCodes.UNAUTHORIZED,
                        message: ResponseMessage.USER_DISABLE_BY_ADMIN,
                        data: [],
                    });
                } else {
                    const validUser = await User.findOne({
                        _id: decode.user.id,
                        is_deleted: 0,
                        isActive: true,
                    });
                    if (validUser) {
                        req.user = decode.user.id;
                    } else {
                        return res.status(401).json({
                            status: StatusCodes.UNAUTHORIZED,
                            message: ResponseMessage.TOKEN_NOT_AUTHORIZED,
                            data: [],
                        });
                    }
                }
            } else if (decode.admin) {
                req.admin = decode.admin.id;
            } else {
                throw new Error("Token not valid");
            }
            next();
        } catch (error) {
            return sendResponse(res, StatusCodes.UNAUTHORIZED, ResponseMessage.TOKEN_NOT_VALID_AUTHORIZED, []);
        }
    }
}
