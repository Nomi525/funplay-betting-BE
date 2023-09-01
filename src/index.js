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
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import path from "path";
import Joi from "joi";
import crypto from "crypto";
import axios from "axios";
import CurrencyConverter from "currency-converter-lt";

// Common
import { dbConnection } from "./config/Db.config.js";
import { ResponseMessage } from "./utils/ResponseMessage.js";
import {
  dataCreate,
  dataUpdated,
  getSingleData,
  getAllData,
  getAllDataCount,
  deleteById,
} from "./services/QueryService.js";
import { validatorRequest } from "./utils/Validator.js";
import { validatorMiddlware } from "./middleware/Validation.js";

// Controllers
import {
  adminLogin,
  adminEditProfile,
  adminLogout,
  adminChangePassword,
  adminForgetPassword,
  adminResetPassword,
  adminVerifyOtp,
  getAllUsers,
  getwithdrwalcheck,
  adminDashboardCount,
  adminSetting,
  adminWithdrawalRequest,
  getTransactionList,
  howToReferralWork,
  adminEditUser,
  adminDeleteUser,
  showRating,
  getWithdrawalList,
  getAdminProfile,
  getAdminSingleUser,
  changeStatusOfUser,
  getSingleGameRating,
  deleteRating,
  getAdminSetting
} from "./controller/admin/AdminController.js";
import {
  logout,
  editProfile,
  connectToWallet,
  updateLoginStatus,
  userSignInMpin,
  verifyOtp,
  loginFromMpin,
  singupFromEmailPassword,
  forgotPassword,
  resetPassword,
  changePassword,
  verifyForgotOtp,
  resendOtp,
  getProfile,
  userEditProfile,
  accountDeactivate,
  userGuestLogin,
  setPassword,
  transactionHistory,
  singInFromEmailPassword,
  setMpin,
  changeMpin,
  emailVerify,
  singInWalletAddress,
  updateEmail,
  userSignUpSignInOtp,
  userGetAllGame,
} from "./controller/user/UserController.js";
import {
  addEditPrivacyPolicy,
  addEditAboutUs,
  addEditTermsAndCondition,
  getCMSDetail,
} from "./controller/admin/CmsController.js";
import {
  addEditBanner,
  deleteBanner,
  allBannerGet,
} from "./controller/common/CommonController.js";
import {
  addEditQuery,
  deleteQuery,
} from "./controller/user/QuerySectionController.js";
import { 
  getAllQuery,
  getSingleQuery,
  adminDeleteQuery
} from "./controller/admin/QuerySectionController.js";
import {
  addEditRating,
  gameRatingAverage,
} from "./controller/user/RatingController.js";
import {
  walletCreate,
  disconnectWallet,
} from "./controller/user/WalletLoginController.js";
import {
  addEditGame,
  addEditGameRule,
  getGameRules,
  gameDelete,
  getAllGame,
  getSingleGame,
  getSingleGameRules,
  gameRuleDelete,
  gameActiveDeactive,
} from "./controller/admin/GameController.js";
import {
  addNewTransaction,
  addTransaction,
  getUserTransaction,
  getUserNewTransaction,
  getTotalUserAmountDiposit,
  withdrawalRequest,
  userDepositeWithdrawalHistory,
} from "./controller/user/TransactionController.js";
import { adminDashboard } from "./controller/admin/DashboardController.js";
import { userDashboard } from "./controller/user/DashboardController.js";
import {
  acceptWithdrawalRequest,
  getSingleUserTransaction,
  getUserReferralBySignIn,
  gelAllUserDepositeAndWithdrawal,
  getAllTransaction,
  allCurrencyConverter,
} from "./controller/admin/UserManegment.js";
import {
  notificationAddEdit,
  getAllNotification,
  getSingleNotification,
  deleteNotification,
} from "./controller/admin/NotificationController.js";
import {
  addEditCoinSetting,
  getCoinSetting,
  getListCoinSetting,
} from "./controller/admin/SettingController.js";

// Routes
import { adminRoutes } from "./routes/AdminRoutes.js";
import { userRoutes } from "./routes/UserRoutes.js";
import { commonRoutes } from "./routes/CommonRoutes.js";

// Models
import { Admin } from "./models/Admin.js";
import { User } from "./models/User.js";
import { CMS } from "./models/CMS.js";
import { AdminSetting } from "./models/AdminSetting.js";
import { BannerModel } from "./models/Banner.js";
import { Query } from "./models/Query.js";
import { Rating } from "./models/Rating.js";
import { DummyTransaction, Wallet } from "./models/Wallet.js";
import { WalletLogin } from "./models/WalletLogin.js";
import { Game } from "./models/Game.js";
import { GameRules } from "./models/GameRules.js";
import { Transaction } from "./models/Transaction.js";
import { NewTransaction } from "./models/NewTransaction.js";
import { WithdrawalRequest } from "./models/WithdrawalRequest.js";
import { TransactionHistory } from "./models/TransactionHistory.js";
import { ReferralUser } from "./models/ReferralUser.js";
import { Notification } from "./models/Notification.js";
import { CoinSetting } from "./models/CoinsSetting.js";
// Services
import { sendMail } from "./config/Email.config.js";
import { Auth } from "./middleware/Auth.js";
import Upload from "./middleware/FileUpload.js";
import { appServer } from "../server.js";

import {
  createError,
  sendResponse,
  passwordHash,
  passwordCompare,
  genrateToken,
  generateOtp,
  genString,
  referralCode,
  encryptObject,
  decryptObject,
  handleErrorResponse,
  hashedPassword,
  currencyConverter
} from "./services/CommonService.js";

dotenv.config();

export {
  express,
  dotenv,
  cors,
  mongoose,
  StatusCodes,
  bcryptjs,
  jwt,
  axios,
  crypto,
  multer,
  nodemailer,
  ejs,
  fs,
  chai,
  expect,
  chaiHttp,
  appServer,
  path,
  Admin,
  User,
  CMS,
  AdminSetting,
  BannerModel,
  Query,
  Rating,
  Wallet,
  WalletLogin,
  Joi,
  NewTransaction,
  Game,
  GameRules,
  Transaction,
  DummyTransaction,
  WithdrawalRequest,
  TransactionHistory,
  ReferralUser,
  CoinSetting,
  dbConnection,
  setMpin,
  changeMpin,
  emailVerify,
  setPassword,
  ResponseMessage,
  sendMail,
  Auth,
  Upload,
  adminLogin,
  adminEditProfile,
  adminLogout,
  adminChangePassword,
  adminForgetPassword,
  adminResetPassword,
  getAdminProfile,
  adminVerifyOtp,
  getAllUsers,
  adminSetting,
  adminWithdrawalRequest,
  getTransactionList,
  howToReferralWork,
  getAdminSingleUser,
  adminEditUser,
  adminDeleteUser,
  showRating,
  getWithdrawalList,
  singupFromEmailPassword,
  singInFromEmailPassword,
  getAllQuery,
  editProfile,
  logout,
  connectToWallet, //userSignup,
  updateEmail,
  userSignInMpin,
  verifyOtp,
  loginFromMpin,
  forgotPassword,
  resetPassword,
  verifyForgotOtp,
  userRoutes,
  adminRoutes,
  commonRoutes,
  resendOtp,
  changePassword,
  getProfile,
  userGuestLogin,
  transactionHistory,
  gameRatingAverage,
  addEditQuery,
  deleteQuery,
  createError,
  sendResponse,
  passwordHash,
  passwordCompare,
  addEditBanner,
  deleteBanner,
  allBannerGet,
  dataCreate,
  dataUpdated,
  getSingleData,
  getAllData,
  getAllDataCount,
  deleteById,
  genrateToken,
  generateOtp,
  genString,
  referralCode,
  encryptObject,
  decryptObject,
  handleErrorResponse,
  hashedPassword,
  addEditRating,
  addEditPrivacyPolicy,
  addEditAboutUs,
  addEditTermsAndCondition,
  getCMSDetail,
  userEditProfile,
  accountDeactivate,
  getwithdrwalcheck,
  adminDashboardCount,
  walletCreate,
  disconnectWallet,
  validatorRequest,
  validatorMiddlware,
  addEditGame,
  gameDelete,
  getAllGame,
  addEditGameRule,
  getGameRules,
  getSingleGameRules,
  gameRuleDelete,
  getSingleGame,
  addTransaction,
  getUserTransaction,
  userDashboard,
  adminDashboard,
  addNewTransaction,
  getUserNewTransaction,
  getUserReferralBySignIn,
  getTotalUserAmountDiposit,
  withdrawalRequest,
  acceptWithdrawalRequest,
  changeStatusOfUser,
  getSingleUserTransaction,
  gelAllUserDepositeAndWithdrawal,
  userDepositeWithdrawalHistory,
  singInWalletAddress,
  getAllTransaction,
  updateLoginStatus,
  userSignUpSignInOtp,
  CurrencyConverter,
  getSingleGameRating,
  deleteRating,
  notificationAddEdit,
  getAllNotification,
  getSingleNotification,
  deleteNotification,
  Notification,
  allCurrencyConverter,
  gameActiveDeactive,
  currencyConverter,
  addEditCoinSetting,
  getCoinSetting,
  getListCoinSetting,
  userGetAllGame,
  getAdminSetting,
  getSingleQuery,
  adminDeleteQuery
};
