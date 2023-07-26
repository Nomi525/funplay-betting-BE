import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import bcryptjs from "bcrypt";
import jwt from "jsonwebtoken";
import multer from "multer";
import ejs from "ejs";
import fs from "fs";
import nodemailer from "nodemailer";
import { StatusCodes } from "http-status-codes";
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import path from 'path';
import { dbConnection } from "./config/Db.config.js";
import { ResponseMessage } from "./utils/ResponseMessage.js";
import {
    logout, editProfile, userSignUpSignInOtp, userSignInMpin, verifyOtp, loginFromMpin,
    forgotPassword, resetPassword, changePassword, verifyForgotOtp, resendOtp, getProfile , userEditProfile, accountDeactivate
} from "./controller/user/UserController.js";
import { userRoutes } from "./routes/UserRoutes.js";
import { dataCreate, dataUpdated, getSingleData, getAllData, getAllDataCount, deleteById } from "./services/QueryService.js";
import {
    adminLogin, adminEditProfile, adminLogout, adminChangePassword, adminForgetPassword,
    adminResetPassword, adminVerifyOtp, getAllUsers ,getwithdrwalcheck,adminDashboardCount
} from "./controller/admin/AdminController.js";
import { addEditPrivacyPolicy, addEditAboutUs, addEditTermsAndCondition, getCMSDetail } from "./controller/admin/CmsController.js";
import {
    createError, sendResponse, passwordHash, passwordCompare, genrateToken, generateOtp,
    genString, referralCode
} from "./services/CommonService.js";
import { Admin } from "./models/Admin.js";
import { User } from "./models/User.js";
import { adminRoutes } from "./routes/AdminRoutes.js";
import { sendMail } from "./config/Email.config.js";
import { Auth } from "./middleware/Auth.js";
import Upload from "./middleware/FileUpload.js";
import { appServer } from "../server.js";
import { CMS_Model } from "./models/CMS.js";
dotenv.config();

export {
    express, dotenv, cors, mongoose, StatusCodes, bcryptjs, jwt, multer, nodemailer, ejs, fs, chai, expect, chaiHttp, appServer, path,
    Admin, User, CMS_Model,
    dbConnection,
    ResponseMessage, sendMail, Auth, Upload,
    adminLogin, adminEditProfile, adminLogout, adminChangePassword, adminForgetPassword, adminResetPassword, adminVerifyOtp, getAllUsers,
    editProfile, logout, userSignUpSignInOtp, userSignInMpin, verifyOtp, loginFromMpin, forgotPassword, resetPassword, verifyForgotOtp,
    userRoutes, adminRoutes, resendOtp, changePassword, getProfile,
    createError, sendResponse, passwordHash, passwordCompare,
    dataCreate, dataUpdated, getSingleData, getAllData, getAllDataCount, deleteById,
    genrateToken, generateOtp, genString, referralCode,
    addEditPrivacyPolicy, addEditAboutUs, addEditTermsAndCondition, getCMSDetail,userEditProfile,accountDeactivate ,getwithdrwalcheck ,adminDashboardCount
}