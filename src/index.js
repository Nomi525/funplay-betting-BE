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
import { register, login, logout, sendOtp, editProfile, userSignupSignin, verifyOtp } from "./controller/user/UserController.js";
import { userRoutes } from "./routes/UserRoutes.js";
import { dataCreate, dataUpdated, getSingleData, getAllData, getAllDataCount, deleteById } from "./services/QueryService.js";
import { createError, sendResponse, passwordHash, passwordCompare, genrateToken, generateOtp } from "./services/CommonService.js";
import { Admin } from "./models/Admin.js";
import { User } from "./models/User.js";
import { adminLogin, adminEditProfile, adminLogout, adminChangePassword, adminForgetPassword, adminResetPassword, adminVerifyOtp } from "./controller/admin/AdminController.js";
import { adminRoutes } from "./routes/AdminRoutes.js";
import { sendMail } from "./config/Email.config.js";
import { Auth } from "./middleware/Auth.js";
import Upload from "./middleware/FileUpload.js";
import { appServer } from "../server.js";
dotenv.config();

export {
    express, dotenv, cors, mongoose, StatusCodes, bcryptjs, jwt, multer, nodemailer, ejs, fs, chai, expect, chaiHttp, appServer, path,
    Admin, User,
    dbConnection,
    ResponseMessage, sendMail, Auth, Upload,
    adminLogin, adminEditProfile, adminLogout, adminChangePassword, adminForgetPassword, adminResetPassword, adminVerifyOtp,
    register, login, sendOtp, editProfile, logout, userSignupSignin, verifyOtp,
    userRoutes, adminRoutes,
    createError, sendResponse, passwordHash, passwordCompare,
    dataCreate, dataUpdated, getSingleData, getAllData, getAllDataCount, deleteById,
    genrateToken, generateOtp
}