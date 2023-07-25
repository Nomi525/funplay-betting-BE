import {
    express, logout, editProfile, Upload, userSignUpSignInOtp,
    userSignInMpin, verifyOtp, loginFromMpin, Auth, forgotPassword, resetPassword, verifyForgotOtp,
    resendOtp, changePassword,getProfile
} from "./../index.js";
const userRoutes = express.Router();

userRoutes.post('/signup-signin-otp', userSignUpSignInOtp);
userRoutes.post('/verify-otp', verifyOtp);
userRoutes.post('/resend-otp', resendOtp);
userRoutes.post('/mpin-signin', userSignInMpin);
userRoutes.post('/login-mpin', loginFromMpin);
userRoutes.post('/forgot-password', forgotPassword);
userRoutes.post('/verify-forgot-otp', verifyForgotOtp);
userRoutes.post('/reset-password', resetPassword);
userRoutes.post('/profile-update', Auth, Upload, editProfile);
userRoutes.get('/profile', Auth, getProfile);
userRoutes.post('/change-mpin', Auth, changePassword);
userRoutes.post('/logout', Auth, logout);


export { userRoutes }