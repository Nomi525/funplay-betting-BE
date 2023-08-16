import {
    express, Auth, Upload, adminLogin, adminEditProfile, adminChangePassword, adminForgetPassword, adminVerifyOtp, adminResetPassword,
    adminLogout, addEditPrivacyPolicy, addEditAboutUs, addEditTermsAndCondition, getCMSDetail, getwithdrwalcheck,
    adminDashboardCount, adminSetting, adminWithdrawalRequest, getTransactionList, hwoToReferralWork, adminEditUser,
    adminDeleteUser, getAllQuery, showRating, getWithdrawalList, addEditGame, gameDelete, getAllGame, addEditGameRule, getGameRules,
    getSingleGame, getSingleGameRules, gameRuleDelete
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

adminRoutes.get('/checkWallet', Auth, getwithdrwalcheck)
adminRoutes.get("/dashboard", Auth, adminDashboardCount)
adminRoutes.post("/transaction", Auth, getTransactionList)
adminRoutes.post("/how-referral-work", Auth, hwoToReferralWork)

// -------- Setting -------- //
adminRoutes.post("/setting", Auth, adminSetting)
adminRoutes.post("/withdrawal-request", Auth, adminWithdrawalRequest)

// ------ User 
adminRoutes.post('/user-edit', Auth, Upload, adminEditUser);
adminRoutes.post('/user-delete', Auth, adminDeleteUser);

// User Query
adminRoutes.get('/queries', Auth, getAllQuery);

// Rating
adminRoutes.get('/game/ratings', Auth, showRating)

// Get WithdrwalList
adminRoutes.get('/withdrawal-list', Auth, getWithdrawalList)

// game Routes 
adminRoutes.post("/game/add-edit", Auth, Upload, addEditGame);
adminRoutes.get("/games", Auth, getAllGame);
adminRoutes.post("/single-game", Auth, getSingleGame);
adminRoutes.post("/game/delete", Auth, gameDelete);

// Game Rules Routes
adminRoutes.get("/game-rules", Auth, getGameRules);
adminRoutes.post("/single-game-rules", Auth, getSingleGameRules);
adminRoutes.post("/game-rules/add-edit", Auth, addEditGameRule);
adminRoutes.post("/game-rules/delete", Auth, gameRuleDelete);

export { adminRoutes }