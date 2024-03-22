import {
    ResponseMessage,
    StatusCodes,
    handleErrorResponse,
    getSingleData,
    sendResponse,
    dataCreate,
    dataUpdated,
    getAllData,
    Permission,
    multipleDelete,
    updateApi
  } from "../../index.js";
  
  export const addEditPermission = async (req, res) => {
    try {
      if (req.body.id) {
        const updatePermission = await updateApi(req.body, Permission);
        if (updatePermission) {
          return res.status(200).json({
            status: StatusCodes.OK,
            message: ResponseMessage.PERMISSION_UPDATED,
            data: updatePermission,
          });
        } else {
          return res.status(400).json({
            status: StatusCodes.BAD_REQUEST,
            message: ResponseMessage.PERMISSION_NOT_UPDATED,
          });
        }
      } else {
        const savePermission = await dataCreate(req.body, Permission);
        if (savePermission) {
          return res.status(201).json({
            status: StatusCodes.CREATED,
            message: ResponseMessage.PERMISSION_CREATED,
            data: savePermission,
          });
        } else {
          return res.status(400).json({
            status: StatusCodes.OK,
            message: ResponseMessage.PERMISSION_NOT_CREATED,
            data: [],
          });
        }
      }
    } catch (error) {
      return res.status(500).json({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: ResponseMessage.INTERNAL_SERVER_ERROR,
        data: [error.message],
      });
    }
  };
  
  export const getAllPermission = async (req, res) => {
    try {
      const getAllPermission = await Permission.find({ isDeleted: false }).sort({
        createdAt: -1,
      });
      if (getAllPermission.length) {
        return res.status(200).json({
          status: StatusCodes.OK,
          message: ResponseMessage.PERMISSION_FETCHED,
          data: getAllPermission,
        });
      } else {
        return res.status(200).json({
          status: StatusCodes.BAD_REQUEST,
          message: ResponseMessage.PERMISSION_LIST_NOT_FOUND,
          data: [],
        });
      }
    } catch (error) {
      return res.status(500).json({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: ResponseMessage.INTERNAL_SERVER_ERROR,
        data: [error.message],
      });
    }
  };
  
  export const permissionGetById = async (req, res) => {
    try {
      const getSinglePermission = await getSingleData(
        { _id: req.params.permissionId, is_deleted: 0 },
        Permission
      );
      if (getSinglePermission) {
        return sendResponse(
          res,
          StatusCodes.OK,
          ResponseMessage.PERMISSION_GET,
          getSinglePermission
        );
      } else {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          ResponseMessage.PERMISSION_NOT_FOUND,
          []
        );
      }
    } catch (error) {
      return handleErrorResponse(res, error);
    }
  };
  
  export const permissionActiveDeActive = async (req, res) => {
    try {
      const { permissionId } = req.body;
      const findPermission = await getSingleData(
        { _id: permissionId },
        Permission
      );
      if (findPermission) {
        var message;
        if (findPermission.isActive) {
          findPermission.isActive = false;
          message = ResponseMessage.PERMISSION_DEACTIVE;
        } else {
          findPermission.isActive = true;
          message = ResponseMessage.PERMISSION_ACTIVE;
        }
        await findPermission.save();
        return sendResponse(res, StatusCodes.OK, message, []);
      } else {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          ResponseMessage.PERMISSION_NOT_FOUND,
          []
        );
      }
    } catch (error) {
      return handleErrorResponse(res, error);
    }
  };
  
  //#region Delete multiple permission
  export const multiplePermissionDeletes = async (req, res) => {
    try {
      const DeletemultiplePermission = await multipleDelete(req.body, Permission);
  
      if (DeletemultiplePermission) {
        return sendResponse(
          res,
          StatusCodes.OK,
          ResponseMessage.DELETED_ALL_PERMISSION,
          DeletemultiplePermission
        );
      } else {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          ResponseMessage.PERMISSION_NOT_DELETED,
          []
        );
      }
    } catch (error) {
      return handleErrorResponse(res, error);
    }
  };
  
  //#endregion
  
  export const deletePermission = async (req, res) => {
    try {
      const permissionDelete = await Permission.findOneAndUpdate(
        { _id: req.body.id },
        { $set: { isDeleted: true } },
        { new: true }
      );
      if (permissionDelete) {
        return res.status(200).json({
          status: StatusCodes.OK,
          message: ResponseMessage.PARTNER_DELETED,
          data: [],
        });
      } else {
        return res.status(400).json({
          status: StatusCodes.BAD_REQUEST,
          message: ResponseMessage.PARTNER_NOT_DELETED,
          data: [],
        });
      }
    } catch (error) {
      return res.status(500).json({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: ResponseMessage.INTERNAL_SERVER_ERROR,
        data: [error.message],
      });
    }
  };
  