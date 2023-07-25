import {
    express, Auth, Upload, adminLogin, adminEditProfile, adminChangePassword, adminForgetPassword, adminVerifyOtp, adminResetPassword,
    adminLogout, addEditPrivacyPolicy, addEditAboutUs, addEditTermsAndCondition, getCMSDetail
} from "./../index.js";
const adminRoutes = express.Router();

// ******** Admin Authentication Api ********* //
// adminRoutes.post('/register', adminRegister);
adminRoutes.post('/login', adminLogin);
adminRoutes.post('/forgot-password', adminForgetPassword);
adminRoutes.post('/verify-otp', adminVerifyOtp);
adminRoutes.post('/reset-password', adminResetPassword);
adminRoutes.post('/change-password', Auth, adminChangePassword);
adminRoutes.post('/profile-update', Auth, Upload, adminEditProfile);
adminRoutes.post('/logout', Auth, adminLogout);

// ********* CMS Api ************ //
adminRoutes.post('/cms/add-edit-privacy-policy', Auth, addEditPrivacyPolicy)
adminRoutes.post('/cms/about-us', Auth, addEditAboutUs)
adminRoutes.post('/cms/terms-and-condition', Auth, addEditTermsAndCondition)
adminRoutes.get('/cms', Auth, getCMSDetail)

export { adminRoutes }