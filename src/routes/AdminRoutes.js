import {
  express,
  Auth,
  Upload,
  adminLogin,
  adminEditProfile,
  adminChangePassword,
  adminForgetPassword,
  adminVerifyOtp,
  adminResetPassword,
  adminLogout,
  addEditPrivacyPolicy,
  addEditAboutUs,
  addEditTermsAndCondition,
  getCMSDetail,
  getwithdrwalcheck,
  adminDashboardCount,
  adminSetting,
  adminWithdrawalRequest,
  getTransactionList,
  howToReferralWork,
  adminEditUser,
  adminDeleteUser,
  getAllQuery,
  showRating,
  getWithdrawalList,
  addEditGame,
  gameDelete,
  getAllGame,
  addEditGameRule,
  getGameRules,
  getSingleGame,
  getSingleGameRules,
  gameRuleDelete,
  getAllUsers,
  getAdminProfile,
  adminDashboard,
  getAdminSingleUser,
  changeStatusOfUser,
  getUserReferralBySignIn,
  acceptWithdrawalRequest,
  getSingleUserTransaction,
  gelAllUserDepositeAndWithdrawal,
  getAllTransaction,
  getSingleGameRating,
  deleteRating,
  notificationAddEdit,
  getAllNotification,
  getSingleNotification,
  deleteNotification,
  allCurrencyConverter,
  gameActiveDeactive,
  addEditCoinSetting,
  getCoinSetting,
  getListCoinSetting,
  getAdminSetting,
  getSingleQuery,
  adminDeleteQuery,
  addEditRole, 
  getRole, 
  getListRole, 
  deleteRole,
  adminResendOtp
} from "./../index.js";
const adminRoutes = express.Router();

// ******** Admin Authentication Api ********* //
// adminRoutes.post('/register', adminRegister);
adminRoutes.post("/login", adminLogin);
adminRoutes.post("/forgot-password", adminForgetPassword);
adminRoutes.post("/verify-otp", adminVerifyOtp);
adminRoutes.post('/resend-otp', adminResendOtp);
adminRoutes.post("/reset-password", adminResetPassword);
adminRoutes.post("/change-password", Auth, adminChangePassword);
adminRoutes.get("/profile", Auth, getAdminProfile);
adminRoutes.post("/profile-update", Auth, Upload, adminEditProfile);
adminRoutes.post("/logout", Auth, adminLogout);

//#region Role routes
adminRoutes.post("/role-add-edit", Auth, addEditRole);
adminRoutes.get("/get-single-role/:roleId", Auth, getRole);
adminRoutes.get("/get-roles", Auth, getListRole);
adminRoutes.post("/delete-role", Auth, deleteRole);


// ********* CMS Api ************ //
adminRoutes.post("/cms/add-edit-privacy-policy", Auth, addEditPrivacyPolicy);
adminRoutes.post("/cms/about-us", Auth, addEditAboutUs);
adminRoutes.post("/cms/terms-and-condition", Auth, addEditTermsAndCondition);
adminRoutes.get("/cms", Auth, getCMSDetail);

adminRoutes.get("/checkWallet", Auth, getwithdrwalcheck);
// adminRoutes.get("/dashboard", Auth, adminDashboardCount)
adminRoutes.post("/transaction", Auth, getTransactionList);
adminRoutes.post("/how-referral-work", Auth, howToReferralWork);

// -------- Setting -------- //
adminRoutes.get("/setting-get", Auth, getAdminSetting);
adminRoutes.post("/setting-add-edit", Auth, adminSetting);

//#region Withdrawal
adminRoutes.post("/withdrawal-request", Auth, adminWithdrawalRequest);
adminRoutes.post("/add-edit-coin-setting", Auth, addEditCoinSetting);
adminRoutes.get("/get-coin-setting/:coinId", Auth, getCoinSetting);
adminRoutes.get("/get-list-coin-setting", Auth, getListCoinSetting);

// ------ User
adminRoutes.get("/users", Auth, getAllUsers);
adminRoutes.post("/single-user", Auth, getAdminSingleUser);
adminRoutes.post("/user-edit", Auth, Upload, adminEditUser);
adminRoutes.post("/user-delete", Auth, adminDeleteUser);
adminRoutes.post("/user/activate/deactivate", Auth, changeStatusOfUser);
adminRoutes.post("/single-user/transaction", Auth, getSingleUserTransaction);
// User Query
adminRoutes.get("/queries", Auth, getAllQuery);
adminRoutes.post("/get-single-query", Auth,  getSingleQuery);
adminRoutes.post("/query-delete", Auth, adminDeleteQuery);

// Rating
adminRoutes.get("/game/ratings", Auth, showRating);
adminRoutes.post("/single-game-rating", Auth, getSingleGameRating);
adminRoutes.post("/rating-delete", Auth, deleteRating);

// Get WithdrwalList
adminRoutes.get("/withdrawal-list", Auth, getWithdrawalList);
adminRoutes.post(
  "/accept-reject-withdrawal-request",
  Auth,
  acceptWithdrawalRequest
);
adminRoutes.post(
  "/get-deposite-withdrawal-list",
  Auth,
  gelAllUserDepositeAndWithdrawal
);

// game Routes
adminRoutes.post("/game/add-edit", Auth, Upload, addEditGame);
adminRoutes.get("/games", Auth, getAllGame);
adminRoutes.post("/single-game", Auth, getSingleGame);
adminRoutes.post("/game/delete", Auth, gameDelete);
adminRoutes.post("/game-active-deactive", Auth, gameActiveDeactive);

// Game Rules Routes
adminRoutes.get("/game-rules", Auth, getGameRules);
adminRoutes.post("/single-game-rules", Auth, getSingleGameRules);
adminRoutes.post("/game-rules/add-edit", Auth, addEditGameRule);
adminRoutes.post("/game-rules/delete", Auth, gameRuleDelete);

// Dashboard
adminRoutes.get("/dashboard", Auth, adminDashboard);
adminRoutes.post("/user-signin-by-referral", Auth, getUserReferralBySignIn);

// Transaction
adminRoutes.get("/get-all-transaction", Auth, getAllTransaction);

//#region Notification
adminRoutes.post("/notification-add-edit", Auth, notificationAddEdit);
adminRoutes.get("/notifications", Auth, getAllNotification);
adminRoutes.post("/single-notification", Auth, getSingleNotification);
adminRoutes.post("/notification-delete", Auth, deleteNotification);
//#endregion

adminRoutes.post("/currency-convert", allCurrencyConverter);
//#endregion

export { adminRoutes };
