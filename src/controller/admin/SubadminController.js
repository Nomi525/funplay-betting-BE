import {
    ejs,
    ResponseMessage,
    StatusCodes,
    Admin,
    handleErrorResponse,
    sendResponse,
    sendMail,
    dataCreate,
    dataUpdated,
    getSingleData,
    getAllData,
    passwordCompare,
    jwt,
    generateOtp,
    hashedPassword,
  } from "./../../index.js";
  
  //#region Add subadmin
  export const addSubadmin = async (req, res) => {
    try {
      let {
        firstName,
        lastName,
        email,
        password,
        role,
        deviceId,
        ipAddress,
        id,
      } = req.body;
      // const exitsSubadmin = await Admin.findOne({
      //   email: { $regex: "^" + email + "$", $options: "i" },
      //   is_deleted: 0,
      // });
      // if (exitsSubadmin) {
      //   return sendResponse(
      //     res,
      //     StatusCodes.BAD_REQUEST,
      //     ResponseMessage.SUB_ADMIN_ALREADY_EXISTS,
      //     []
      //   );
      // }
  
      if (id) {
        const updateSubAdmin = await Admin.findOneAndUpdate(
          { _id: id },
          { $set: { firstName, lastName, email, role } },
          { new: true }
        );
        if (updateSubAdmin) {
          return res.status(200).json({
            status: StatusCodes.OK,
            message: ResponseMessage.SUB_ADMIN_UPDATED,
            data: updateSubAdmin,
          });
        } else {
          return res.status(400).json({
            status: StatusCodes.BAD_REQUEST,
            message: ResponseMessage.SUB_ADMIN_NOT_CREATED,
            data: [e.message],
          });
        }
      } else {
        const hashPassword = await hashedPassword(password);
        const createSubadmin = await dataCreate(
          {
            firstName,
            lastName,
            email,
            password: hashPassword,
            role,
            // deviceId,
            // ipAddress,
          },
          Admin
        );
        const subadmin = await createSubadmin.save();
        delete subadmin.password;
  
        let html = await ejs.renderFile("src/views/Subadmin.ejs", {
          email,
          password,
        });
        const sendEmail = await sendMail(email, "Betting account created", html);
        
        return sendResponse(
          res,
          StatusCodes.CREATED,
          ResponseMessage.SUB_ADMIN_CREATED,
          subadmin
        );
      }
    } catch (error) {
      return handleErrorResponse(res, error);
    }
  };
  //#endregion
  
  //#region Get Single Subadmin
  export const getSingleSubadmin = async (req, res) => {
    try {
      let { subadminId } = req.params;
      const findSubadmin = await Admin.findOne(
        { _id: subadminId, role: "subadmin", is_deleted: 0 },
        { password: 0 }
      );
      if (findSubadmin) {
        return sendResponse(
          res,
          StatusCodes.OK,
          ResponseMessage.SUBADMIN_GET,
          findSubadmin
        );
      } else {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          ResponseMessage.SUBADMIN_NOT_FOUND,
          []
        );
      }
    } catch (error) {
      return handleErrorResponse(res, error);
    }
  };
  //#endregion
  
  //#region Get All Subadmin
  export const getAllSubadmin = async (req, res) => {
    try {
      const findSubadmins = await Admin.find(
        { _id: { $ne: req.admin }, role: "subadmin", is_deleted: 0 },
        { password: 0 }
      );
      if (findSubadmins.length) {
        return sendResponse(
          res,
          StatusCodes.OK,
          ResponseMessage.SUBADMIN_GET,
          findSubadmins
        );
      } else {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          ResponseMessage.SUBADMIN_NOT_FOUND,
          []
        );
      }
    } catch (error) {
      return handleErrorResponse(res, error);
    }
  };
  //#endregion
  
  //#region Subadmin remove
  export const deleteSubadmin = async (req, res) => {
    try {
      const { subadminId } = req.body;
      const deleteSubadmin = await dataUpdated(
        { _id: subadminId },
        { is_deleted: 1 },
        Admin
      );
      if (deleteSubadmin) {
        return sendResponse(
          res,
          StatusCodes.OK,
          ResponseMessage.SUBADMIN_DELETED,
          []
        );
      } else {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          ResponseMessage.SUBADMIN_NOT_FOUND,
          []
        );
      }
    } catch (error) {
      return handleErrorResponse(res, error);
    }
  };
  //#endregion
  
  //#region Get login
  export const getLoginSubadmin = async (req, res) => {
    try {
      const findSubadmins = await Admin.find(
        {
          _id: { $ne: req.admin },
          role: "subadmin",
          is_deleted: 0,
          isLogin: true,
        },
        { password: 0 }
      );
      if (findSubadmins.length) {
        return sendResponse(
          res,
          StatusCodes.OK,
          ResponseMessage.SUBADMIN_GET,
          findSubadmins
        );
      } else {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          ResponseMessage.SUBADMIN_NOT_FOUND,
          []
        );
      }
    } catch (error) {
      return handleErrorResponse(res, error);
    }
  };
  //#endregion
  
  //#region Subadmin active and deactive
  export const subadminActiveDeactive = async (req, res) => {
    try {
      let { subadminId } = req.body;
      const findSubadmin = await getSingleData(
        { _id: subadminId, role: "subadmin", is_deleted: 0 },
        Admin
      );
      if (findSubadmin) {
        var message;
        if (findSubadmin.isActive) {
          findSubadmin.isActive = false;
          message = ResponseMessage.SUBADMIN_DEACTIVATE;
        } else {
          findSubadmin.isActive = true;
          message = ResponseMessage.SUBADMIN_ACTIVE;
        }
        await findSubadmin.save();
        return sendResponse(res, StatusCodes.BAD_REQUEST, message, []);
      } else {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          ResponseMessage.SUBADMIN_NOT_FOUND,
          []
        );
      }
    } catch (error) {
      return handleErrorResponse(res, error);
    }
  };
  //#endregion
  
  export const getAllSubAdmin = async (req, res) => {
    try {
      const findAllSubAdmin = await Admin.find({
        isAdmin: false,
        is_deleted: 0,
      })
        .populate("role")
        .sort({ createdAt: -1 });
      if (findAllSubAdmin) {
        return res.status(200).json({
          status: StatusCodes.OK,
          message: ResponseMessage.SUB_ADMIN_FETCHED,
          data: findAllSubAdmin,
        });
      } else {
        return res.status(400).json({
          status: StatusCodes.BAD_REQUEST,
          message: ResponseMessage.SUB_ADMIN_NOT_FETCHED,
          data: [],
        });
      }
    } catch (error) {
      return res.status(500).json({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: ResponseMessage.INTERNAL_SERVER_ERROR,
        data: [],
      });
    }
  };
  