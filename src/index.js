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
import http from "http";
import path from "path";
import Joi from "joi";
import crypto from "crypto";
import axios from "axios";
import CurrencyConverter from "currency-converter-lt";
import Decimal from "decimal.js";
import cron from "node-cron";
Decimal.set({ precision: 100 });

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
  createReward,
  updateApi,
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
  adminSetting,
  adminWithdrawalRequest,
  howToReferralWork,
  showRating,
  getAdminProfile,
  getSingleGameRating,
  deleteRating,
  getAdminSetting,
  adminResendOtp,
  getUpdatedUser,
} from "./controller/admin/AdminController.js";
import {
  logout,
  editProfile,
  connectToWallet,
  updateLoginStatus,
  // userCheckEmail,
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
  setPassword,
  singInFromEmailPassword,
  setMpin,
  changeMpin,
  emailVerify,
  singInWalletAddress,
  updateEmail,
  userSignUpSignInOtp,
  userGetAllGame,
  userGetCMSDetail,
  checkWalletAddress,
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
  getPeriodsDetailsForAllGame,
  getAllGameRecodesGameWise,
} from "./controller/common/CommonController.js";
import {
  addEditQuery,
  deleteQuery,
} from "./controller/user/QuerySectionController.js";
import { getAllQuery } from "./controller/admin/QuerySectionController.js";
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
  gameActiveDeactive,
  getSingleGame,
  getSingleGameRules,
  gameRuleDelete,
} from "./controller/admin/GameController.js";
// import {
//   addEditPrivacyPolicy,
//   addEditAboutUs,
//   addEditTermsAndCondition,
//   getCMSDetail,
// } from "./controller/admin/CmsController.js";
import {
  //   addEditBanner,
  //   deleteBanner,
  //   allBannerGet,
  getSingleGameRule,
  getAllCurrency,
  getSingleGameTime,
} from "./controller/common/CommonController.js";
// import {
//   addEditQuery,
//   deleteQuery,
// } from "./controller/user/QuerySectionController.js";
import {
  //   getAllQuery,
  getSingleQuery,
  adminDeleteQuery,
} from "./controller/admin/QuerySectionController.js";
// import {
//   addEditRating,
//   gameRatingAverage,
// } from "./controller/user/RatingController.js";
// import {
//   walletCreate,
//   disconnectWallet,
// } from "./controller/user/WalletLoginController.js";
import {
  // addEditGame,
  // addEditGameRule,
  // getGameRules,
  // gameDelete,
  // getAllGame,
  // getSingleGame,
  // getSingleGameRules,
  // gameRuleDelete,
  // gameActiveDeactive,
  getGameHistory,
  addEditGameWiseTime,
  getAllGameTime,
  gameIsRepeat,
} from "./controller/admin/GameController.js";
import {
  addNewTransaction,
  getUserNewTransaction,
  getTotalUserAmountDiposit,
  withdrawalRequest,
  userDepositeWithdrawalHistory,
} from "./controller/user/TransactionController.js";
import { adminDashboard } from "./controller/admin/DashboardController.js";
import {
  userDashboard,
  topWeeklyMonthlyPlayers,
} from "./controller/user/DashboardController.js";
import {
  acceptWithdrawalRequest,
  getSingleUserTransaction,
  getUserReferralBySignIn,
  gelAllUserDepositeAndWithdrawal,
  getAllTransaction,
  allCurrencyConverter,
  adminEditUser,
  getAllUsers,
  getAdminSingleUser,
  adminDeleteUser,
  changeStatusOfUser,
  getGameWiseUserList,
  getUserWiseGameList,
  getNumberGameTotal,
  getAllWithdrawalRequest,
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

// Role
import {
  addEditRole,
  getRole,
  getListRole,
  deleteRole,
} from "./controller/admin/RoleCotroller.js";

// Permission
import {
  addEditPermission,
  getAllPermission,
  permissionGetById,
  permissionActiveDeActive,
  deletePermission,
} from "./controller/admin/PermissionController.js";

import {
  addSubadmin,
  deleteSubadmin,
  getLoginSubadmin,
  subadminActiveDeactive,
  getSingleSubadmin,
  getAllSubadmin,
  getAllSubAdmin,
} from "./controller/admin/SubadminController.js";

// Number Betting
import {
  addEditNumberBet,
  getAllNumberBet,
  getSingleNumberBet,
  deleteNumberBet,
  getAllNumberGamePeriod,
  getNumberGamePeriodById,
  createAllGamePeriodFromCronJob,
  createAllGameWinnerFromCronJob,
  getPeriod,
  numberBettingWinnerResult,
} from "./controller/user/NumberBettingController.js";

// Currency Coin
import {
  addEditCurrencyCoin,
  getAllCurrencyCoin,
  getSingleCurrencyCoin,
  currenyCoinDelete,
} from "./controller/admin/CurrencyCoinController.js";

//Colour Betting
import {
  addColourBet,
  colourBetResult,
  getAllGameWiseWinner,
  getSingleGameWiseWinner,
  getLoginUserColourBet,
  getAllGamePeriod,
  getByIdGamePeriod,
  getCommunityWinList,
  colourBettingWinnerResult,
} from "./controller/user/ColourBettingController.js";

// Coumunnity Betting

import {
  addEditCommunityBetting,
  getAllCommunityBetting,
  getSingleCommunityBetting,
  deleteCommunityBetting,
} from "./controller/admin/CommunityBettingManagmentController.js";
import {
  addEditCommunityBets,
  getAllLiveCommunityBets,
  getAllLastDayCommunityBettingWinners,
  getLoginUserCommunityBets,
  getCommunityGamePeriodById,
  getAllCommunityGamePeriod,
} from "./controller/user/CommunityController.js";
import {
  getAllWinnersUser,
  getAllUsersAndWinnersCommunityBetting,
  declareWinnerOfCommunityBetting,
  declareWinnerOfNumberBetting,
  declareWinnerOfColorBetting,
  declareWinnerOfPenaltyBetting,
  declareWinnerOfCardBetting,
} from "./controller/admin/GameWinnerController.js";

// Penalty Controller
import {
  addPenaltyBet,
  getAllGamePeriodOfPenaltyBetting,
  getByIdGamePeriodOfPenaltyBetting,
  penaltyBettingWinnerResult,
} from "./controller/user/PenaltyBettingController.js";

// Crad Controller

import {
  addCardBet,
  getByIdGamePeriodOfCardBetting,
  getAllGamePeriodOfCardBetting,
  cardBettingWinnerResult,
} from "./controller/user/CardBettingController.js";

// *********** Routes **************** //
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
import { Wallet } from "./models/Wallet.js";
import { WalletLogin } from "./models/WalletLogin.js";
import { Game } from "./models/Game.js";
import { GameRules } from "./models/GameRules.js";
import { NewTransaction } from "./models/NewTransaction.js";
import { WithdrawalRequest } from "./models/WithdrawalRequest.js";
import { TransactionHistory } from "./models/TransactionHistory.js";
import { ReferralUser } from "./models/ReferralUser.js";
import { ReferralWork } from "./models/ReferralWork.js";
import { Notification } from "./models/Notification.js";
import { CoinSetting } from "./models/CoinsSetting.js";
import { Reward } from "./models/Reward.js";
import { Role } from "./models/Role.js";
import { Permission } from "./models/Permissions.js";
import { GameHistory } from "./models/GameHistory.js";
import { NumberBetting } from "./models/NumberBetting.js";
import { CurrencyCoin } from "./models/CurrencyCoin.js";
import { GameTime } from "./models/GameTime.js";
import { ColourBetting } from "./models/ColourBetting.js";
import { GameReward } from "./models/GameReward.js";
import { CommunityBetting } from "./models/CommunityBetting.js";
import { Period } from "./models/Period.js";
import { PenaltyBetting } from "./models/PenaltyBetting.js";
import { CardBetting } from "./models/CardBetting.js";
import { Chat } from "./models/Chat.js";

// Services
import { sendMail } from "./config/Email.config.js";
import { Auth } from "./middleware/Auth.js";
import Upload from "./middleware/FileUpload.js";
import { appServer } from "../server.js";
import {
  multipleDelete,
  multipleDeleteUpdate,
} from "./services/AdminServices.js";

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
  currencyConverter,
  minusLargeSmallValue,
  plusLargeSmallValue,
  checkDecimalValueGreaterThanOrEqual,
  checkLargeDecimalValueGreaterThan,
  checkLargeDecimalValueLessThan,
  multiplicationLargeSmallValue,
  checkLargeDecimalValueEquals,
  calculateTotalReward,
  calculateAllGameReward,
  getAllBids,
  getRandomElement,
  winCardNumberFun,
} from "./services/CommonService.js";
dotenv.config();

export {
  getRandomElement,
  winCardNumberFun,
  getAllBids,
  calculateAllGameReward,
  calculateTotalReward,
  addCardBet,
  getByIdGamePeriodOfCardBetting,
  getAllGamePeriodOfCardBetting,
  cardBettingWinnerResult,
  CardBetting,
  declareWinnerOfCardBetting,
  declareWinnerOfPenaltyBetting,
  penaltyBettingWinnerResult,
  getAllGamePeriodOfPenaltyBetting,
  getByIdGamePeriodOfPenaltyBetting,
  addPenaltyBet,
  PenaltyBetting,
  updateApi,
  getAllSubAdmin,
  deletePermission,
  getAllWithdrawalRequest,
  getUpdatedUser,
  multipleDelete,
  multipleDeleteUpdate,
  colourBettingWinnerResult,
  numberBettingWinnerResult,
  getPeriodsDetailsForAllGame,
  getAllGameRecodesGameWise,
  declareWinnerOfColorBetting,
  declareWinnerOfNumberBetting,
  getPeriod,
  Period,
  cron,
  createAllGamePeriodFromCronJob,
  createAllGameWinnerFromCronJob,
  getCommunityGamePeriodById,
  getAllCommunityGamePeriod,
  getAllNumberGamePeriod,
  getNumberGamePeriodById,
  gameIsRepeat,
  declareWinnerOfCommunityBetting,
  getAllUsersAndWinnersCommunityBetting,
  getAllWinnersUser,
  getLoginUserCommunityBets,
  getAllLastDayCommunityBettingWinners,
  getAllLiveCommunityBets,
  addEditCommunityBets,
  getAllGamePeriod,
  getByIdGamePeriod,
  topWeeklyMonthlyPlayers,
  getLoginUserColourBet,
  getAllGameWiseWinner,
  getSingleGameWiseWinner,
  addEditCommunityBetting,
  getAllCommunityBetting,
  getSingleCommunityBetting,
  deleteCommunityBetting,
  CommunityBetting,
  GameReward,
  checkDecimalValueGreaterThanOrEqual,
  multiplicationLargeSmallValue,
  checkLargeDecimalValueGreaterThan,
  checkLargeDecimalValueLessThan,
  checkLargeDecimalValueEquals,
  getAllGameTime,
  getSingleGameTime,
  GameTime,
  checkWalletAddress,
  addEditGameWiseTime,
  CurrencyCoin,
  addEditCurrencyCoin,
  getAllCurrencyCoin,
  getSingleCurrencyCoin,
  currenyCoinDelete,
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
  Reward,
  Role,
  Permission,
  Joi,
  NewTransaction,
  Game,
  GameRules,
  WithdrawalRequest,
  TransactionHistory,
  ReferralUser,
  ReferralWork,
  CoinSetting,
  GameHistory,
  NumberBetting,
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
  howToReferralWork,
  getAdminSingleUser,
  adminEditUser,
  adminDeleteUser,
  showRating,
  singupFromEmailPassword,
  singInFromEmailPassword,
  getAllQuery,
  editProfile,
  logout,
  connectToWallet,
  // updateEmail,
  // userCheckEmail,
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
  userDashboard,
  adminDashboard,
  addNewTransaction,
  getUserNewTransaction,
  getUserReferralBySignIn,
  getTotalUserAmountDiposit,
  withdrawalRequest,
  acceptWithdrawalRequest,
  changeStatusOfUser,
  getGameWiseUserList,
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
  getGameHistory,
  currencyConverter,
  addEditCoinSetting,
  getCoinSetting,
  getListCoinSetting,
  userGetAllGame,
  getAdminSetting,
  getSingleQuery,
  adminDeleteQuery,
  userGetCMSDetail,
  createReward,
  addEditRole,
  getRole,
  getListRole,
  deleteRole,
  adminResendOtp,
  minusLargeSmallValue,
  plusLargeSmallValue,
  Decimal,
  addSubadmin,
  deleteSubadmin,
  getLoginSubadmin,
  subadminActiveDeactive,
  getSingleSubadmin,
  getAllSubadmin,
  getSingleGameRule,
  addEditPermission,
  getAllPermission,
  permissionGetById,
  permissionActiveDeActive,
  getAllCurrency,
  getUserWiseGameList,
  addEditNumberBet,
  getAllNumberBet,
  getSingleNumberBet,
  deleteNumberBet,
  ColourBetting,
  addColourBet,
  colourBetResult,
  getNumberGameTotal,
  getCommunityWinList,
  http,
  Chat
  // updateEmail,
};
