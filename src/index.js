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
import { dataCreate, dataUpdated, getSingleData, getAllData, getAllDataCount, deleteById } from "./services/QueryService.js";

// Controllers
import {
    adminLogin, adminEditProfile, adminLogout, adminChangePassword, adminForgetPassword,
    adminResetPassword, adminVerifyOtp, getAllUsers, getwithdrwalcheck, adminDashboardCount, adminSetting, adminWithdrawalRequest,
    getTransactionList, hwoToReferralWork, adminEditUser, adminDeleteUser,showRating
} from "./controller/admin/AdminController.js";
import {
    logout, editProfile, userSignUpSignInOtp, userSignInMpin, verifyOtp, loginFromMpin,
    forgotPassword, resetPassword, changePassword, verifyForgotOtp, resendOtp, getProfile, userEditProfile, accountDeactivate,
    userGuestLogin,
    transactionHistory
} from "./controller/user/UserController.js";
import { addEditPrivacyPolicy, addEditAboutUs, addEditTermsAndCondition, getCMSDetail } from "./controller/admin/CmsController.js";
import { addEditBanner, deleteBanner, allBannerGet } from "./controller/common/CommonController.js";
import { addEditQuery, deleteQuery } from "./controller/user/QuerySectionController.js";
import { getAllQuery } from "./controller/admin/QuerySectionController.js";
import { addEditRating,gameRatingAverage } from "./controller/user/RatingController.js";


// Routes
import { adminRoutes } from "./routes/AdminRoutes.js";
import { userRoutes } from "./routes/UserRoutes.js";
import { commonRoutes } from "./routes/CommonRoutes.js";


// Models
import { Admin } from "./models/Admin.js";
import { User } from "./models/User.js";
import { CMS_Model } from "./models/CMS.js";
import { AdminSetting } from "./models/AdminSetting.js";
import { Referral_Work } from "./models/Referral_Work.js";
import { BannerModel } from "./models/Banner.js";
import { Query } from "./models/Query.js";
import { Rating } from "./models/Rating.js";


// Services
import { sendMail } from "./config/Email.config.js";
import { Auth } from "./middleware/Auth.js";
import Upload from "./middleware/FileUpload.js";
import { appServer } from "../server.js";
import {
    createError, sendResponse, passwordHash, passwordCompare, genrateToken, generateOtp,
    genString, referralCode
} from "./services/CommonService.js";

dotenv.config();

export {
    express, dotenv, cors, mongoose, StatusCodes, bcryptjs, jwt, multer, nodemailer, ejs, fs, chai, expect, chaiHttp, appServer, path,
    Admin, User, CMS_Model, AdminSetting, Referral_Work, BannerModel, Query, Rating,
    dbConnection,
    ResponseMessage, sendMail, Auth, Upload,
    adminLogin, adminEditProfile, adminLogout, adminChangePassword, adminForgetPassword, adminResetPassword,
    adminVerifyOtp, getAllUsers, adminSetting, adminWithdrawalRequest, getTransactionList, hwoToReferralWork,
    adminEditUser, adminDeleteUser, showRating,
    getAllQuery,
    editProfile, logout, userSignUpSignInOtp, userSignInMpin, verifyOtp, loginFromMpin, forgotPassword, resetPassword, verifyForgotOtp,
    userRoutes, adminRoutes, commonRoutes, resendOtp, changePassword, getProfile, userGuestLogin, transactionHistory,gameRatingAverage,
    addEditQuery, deleteQuery,
    createError, sendResponse, passwordHash, passwordCompare,
    addEditBanner, deleteBanner, allBannerGet,
    dataCreate, dataUpdated, getSingleData, getAllData, getAllDataCount, deleteById,
    genrateToken, generateOtp, genString, referralCode,
    addEditRating,
    addEditPrivacyPolicy, addEditAboutUs, addEditTermsAndCondition, getCMSDetail, userEditProfile, accountDeactivate, getwithdrwalcheck, adminDashboardCount
}