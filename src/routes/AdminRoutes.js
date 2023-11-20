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
  adminSetting,
  adminWithdrawalRequest,
  howToReferralWork,
  adminEditUser,
  adminDeleteUser,
  getAllQuery,
  showRating,
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
  adminResendOtp,
  addSubadmin,
  deleteSubadmin,
  getLoginSubadmin,
  subadminActiveDeactive,
  getSingleSubadmin,
  getAllSubadmin,
  addEditPermission,
  getAllPermission,
  permissionGetById,
  permissionActiveDeActive,
  getGameWiseUserList,
  getGameHistory,
  getUserWiseGameList,
  addEditCurrencyCoin,
  getAllCurrencyCoin,
  getSingleCurrencyCoin,
  currenyCoinDelete,
  addEditGameWiseTime,
  getAllGameTime,
  addEditCommunityBetting,
  getAllCommunityBetting,
  getSingleCommunityBetting,
  deleteCommunityBetting,
  getNumberGameTotal,
  getAllWinnersUser,
  getAllUsersAndWinnersCommunityBetting,
  declareWinnerOfCommunityBetting,
  gameIsRepeat
} from "./../index.js";
const adminRoutes = express.Router();

// ******** Admin Authentication Api ********* //
// adminRoutes.post('/register', adminRegister);
adminRoutes.post("/login", adminLogin);
adminRoutes.post("/forgot-password", adminForgetPassword);
adminRoutes.post("/verify-otp", adminVerifyOtp);
adminRoutes.post("/resend-otp", adminResendOtp);
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

//#region Permission Routes
adminRoutes.post("/permission-add-edit", Auth, addEditPermission);
adminRoutes.get("/get-all-permission", Auth, getAllPermission);
adminRoutes.get(
  "/get-single-permission/:permissionId",
  Auth,
  permissionGetById
);
adminRoutes.post("/permission-active-deactive", Auth, permissionActiveDeActive);

//#region Subadmin routes
adminRoutes.post("/add-subadmin", Auth, addSubadmin);
adminRoutes.get("/get-single-subadmin/:subadminId", Auth, getSingleSubadmin);
adminRoutes.get("/get-all-subadmin", Auth, getAllSubadmin);
adminRoutes.post("/delete-subadmin", Auth, deleteSubadmin);
adminRoutes.get("/get-login-subadmin", Auth, getLoginSubadmin);
adminRoutes.post("/active-deactive-subadmin", Auth, subadminActiveDeactive);
//#endregion

// ********* CMS Api ************ //
adminRoutes.post("/cms/add-edit-privacy-policy", Auth, addEditPrivacyPolicy);
adminRoutes.post("/cms/about-us", Auth, addEditAboutUs);
adminRoutes.post("/cms/terms-and-condition", Auth, addEditTermsAndCondition);
adminRoutes.get("/cms", Auth, getCMSDetail);

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
adminRoutes.get("/get-game-wise-user-list/:gameId", Auth, getGameWiseUserList);
adminRoutes.get("/get-user-wise-game-list/:userId", Auth, getUserWiseGameList);
adminRoutes.get("/get-game-history", Auth, getGameHistory);

// User Query
adminRoutes.get("/queries", Auth, getAllQuery);
adminRoutes.post("/get-single-query", Auth, getSingleQuery);
adminRoutes.post("/query-delete", Auth, adminDeleteQuery);

// Rating
adminRoutes.get("/game/ratings", Auth, showRating);
adminRoutes.post("/single-game-rating", Auth, getSingleGameRating);
adminRoutes.post("/rating-delete", Auth, deleteRating);

// Get WithdrwalList
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

// Game Routes
adminRoutes.post("/game/add-edit", Auth, Upload, addEditGame);
adminRoutes.get("/games", Auth, getAllGame);
adminRoutes.post("/single-game", Auth, getSingleGame);
adminRoutes.post("/game/delete", Auth, gameDelete);
adminRoutes.post("/game-active-deactive", Auth, gameActiveDeactive);
adminRoutes.post("/add-edit-game-wise-time", Auth, addEditGameWiseTime);
adminRoutes.get("/get-all-game-time", Auth, getAllGameTime);
adminRoutes.post("/game-repeat", Auth, gameIsRepeat);

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

// Currency Coin Routes
adminRoutes.post("/add-edit-currency-coin", Auth, addEditCurrencyCoin);
adminRoutes.get("/get-all-currency-coin", Auth, getAllCurrencyCoin);
adminRoutes.get(
  "/get-single-currency-coin/:currencyCoinId",
  Auth,
  getSingleCurrencyCoin
);
adminRoutes.post("/delete-currency-coin", Auth, currenyCoinDelete);

// Community betting
adminRoutes.post(
  "/add-edit-community-betting",
  Auth,
  Upload,
  addEditCommunityBetting
);
adminRoutes.get("/get-all-community-betting", Auth, getAllCommunityBetting);
adminRoutes.get(
  "/get-single-community-betting",
  Auth,
  getSingleCommunityBetting
);
adminRoutes.post("/delete-community-betting", Auth, deleteCommunityBetting);

//Number betting
adminRoutes.post("/get-number-total", Auth, getNumberGameTotal);




// All winners
adminRoutes.post('/get-all-and-update-winners-user', Auth, getAllWinnersUser)
adminRoutes.get('/get-all-users-and-winners-community-betting/:gameId', Auth, getAllUsersAndWinnersCommunityBetting)
adminRoutes.post('/declare-winner', Auth, declareWinnerOfCommunityBetting)

export { adminRoutes };
