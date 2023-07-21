import { express, Auth, Upload, adminLogin, adminEditProfile, adminChangePassword, adminForgetPassword, adminVerifyOtp, adminResetPassword, adminLogout } from "./../index.js";
const adminRoutes = express.Router();

// adminRoutes.post('/register', adminRegister);
adminRoutes.post('/login', adminLogin);
adminRoutes.post('/forgot-password', adminForgetPassword);
adminRoutes.post('/verify-otp', adminVerifyOtp);
adminRoutes.post('/reset-password', adminResetPassword);
adminRoutes.post('/change-password', Auth, adminChangePassword);
adminRoutes.post('/profile-update', Auth, Upload, adminEditProfile);
adminRoutes.post('/logout', Auth, adminLogout);

export { adminRoutes }