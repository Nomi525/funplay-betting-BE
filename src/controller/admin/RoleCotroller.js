import {
    ResponseMessage,
    StatusCodes,
    handleErrorResponse,
    getSingleData,
    sendResponse,
    dataCreate,
    dataUpdated,
    getAllData,
    Role,
} from "../../index.js";

//#region create and update ROLE
export const addEditRole = async (req, res) => {
    try {
        const { roleId, roleName } = req.body;
        const findRoleQuery = {
            roleName: { $regex: "^" + roleName + "$", $options: "i" },
            is_deleted: 0,
        };
        if (roleId) {
            findRoleQuery._id = { $ne: roleId };
        }
        const findRole = await getSingleData(findRoleQuery, Role);
        if (findRole) {
            return sendResponse(
                res,
                StatusCodes.BAD_REQUEST,
                ResponseMessage.ROLE_EXIST,
                []
            );
        }
        if (!roleId) {
            const addRole = await dataCreate(
                { roleName },
                Role
            );
            const createRole = await addRole.save();
            if (createRole) {
                return sendResponse(
                    res,
                    StatusCodes.CREATED,
                    ResponseMessage.ROLE_CREATED,
                    createRole
                );
            } else {
                return sendResponse(
                    res,
                    StatusCodes.BAD_REQUEST,
                    ResponseMessage.FAILED_TO_CREATE,
                    []
                );
            }
        } else {
            const updateRole = await dataUpdated(
                { _id: roleId },
                { roleName },
                Role
            );
            if (updateRole) {
                return sendResponse(
                    res,
                    StatusCodes.OK,
                    ResponseMessage.ROLE_UPDATED,
                    updateRole
                );
            } else {
                return sendResponse(
                    res,
                    StatusCodes.BAD_REQUEST,
                    ResponseMessage.FAILED_TO_UPDATE,
                    []
                );
            }
        }
    } catch (error) {
        return handleErrorResponse(res, error);
    }
};
//#endregion


//#region Get  Role
export const getRole = async (req, res) => {
    try {
        const { roleId } = req.params;
        const findRole = await getSingleData(
            { _id: roleId, is_deleted: 0 },
            Role
        );
        if (findRole) {
            return sendResponse(
                res,
                StatusCodes.OK,
                ResponseMessage.ROLE_GET,
                findRole
            );
        } else {
            return sendResponse(
                res,
                StatusCodes.BAD_REQUEST,
                ResponseMessage.FAILED_TO_FETCH,
                []
            );
        }
    } catch (error) {
        return handleErrorResponse(res, error);
    }
};
//#endregion

//#region get list of coin setting
export const getListRole = async (req, res) => {
    try {
        const listRole = await getAllData({ is_deleted: 0 }, Role);
        if (listRole.length) {
            return sendResponse(
                res,
                StatusCodes.OK,
                ResponseMessage.ROLE_LIST,
                listRole
            );
        } else {
            return sendResponse(
                res,
                StatusCodes.BAD_REQUEST,
                ResponseMessage.FAILED_TO_FETCH,
                []
            );
        }
    } catch (error) {
        return handleErrorResponse(res, error);
    }
};
//#endregion

//#region Role delete
export const deleteRole = async (req, res) => {
    try {
        const { roleId } = req.body;
        const deleteRole = await dataUpdated({ _id: roleId }, { is_deleted: 1 }, Role);
        if (deleteRole) {
            return sendResponse(
                res,
                StatusCodes.OK,
                ResponseMessage.ROLE_DELETE,
                []
            );
        } else {
            return sendResponse(
                res,
                StatusCodes.BAD_REQUEST,
                ResponseMessage.FAILED_TO_DELETE,
                []
            );
        }
    } catch (error) {
        return handleErrorResponse(res, error);
    }
};
//#endregion
