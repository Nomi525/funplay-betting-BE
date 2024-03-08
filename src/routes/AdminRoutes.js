import { getTransactionList, getwithdrwalcheck, topAllPlayers, topWeeklyPlayers } from "../controller/admin/AdminController.js";
import { addEditBankDetail, getBankDetail } from "../controller/admin/BankController.js";
import { changeStatusOfFaintCurrency, getAllFaintCurrency } from "../controller/admin/FaintCurrency.js";
import { getAllGamePeriodData } from "../controller/admin/GameController.js";
import { addUPIMethod, changeStatusOfUPIMethod, deleteUPIMethod, getUPIMethod } from "../controller/admin/UPIController.js";
import { approveRejectWithdrawalRequest, getAllUserWithdrawalRequest, getUserWithdrawalRequest } from "../controller/admin/WithdrawalUser.js";
import { UPIMethod } from "../models/UPIMethod.js";
import {
  Auth,
  Upload,
  acceptWithdrawalRequest,
  addEditAboutUs,
  addEditCoinSetting,
  addEditCommunityBetting,
  addEditCurrencyCoin,
  addEditGame,
  addEditGameRule,
  addEditGameWiseTime,
  addEditPermission,
  addEditPrivacyPolicy,
  addEditRole,
  addEditTermsAndCondition,
  addSubadmin,
  adminChangePassword,
  adminDashboard,
  adminDeleteQuery,
  adminDeleteUser,
  adminEditProfile,
  adminEditUser,
  adminForgetPassword,
  adminLogin,
  adminLogout,
  adminResendOtp,
  adminResetPassword,
  adminSetting,
  adminVerifyOtp,
  adminWithdrawalRequest,
  allCurrencyConverter,
  changeStatusOfUser,
  currenyCoinDelete,
  declareWinnerOfColorBetting,
  declareWinnerOfCommunityBetting,
  declareWinnerOfNumberBetting,
  deleteCommunityBetting,
  deleteNotification,
  deleteRating,
  deleteRole,
  deleteSubadmin,
  express,
  gameActiveDeactive,
  gameDelete,
  gameIsRepeat,
  gameRuleDelete,
  gelAllUserDepositeAndWithdrawal,
  getAdminProfile,
  getAdminSetting,
  getAdminSingleUser,
  getAllCommunityBetting,
  getAllCurrencyCoin,
  getAllGame,
  getAllGameTime,
  getAllNotification,
  getAllPermission,
  getAllQuery,
  getAllSubadmin,
  getAllTransaction,
  getAllUsers,
  getAllUsersAndWinnersCommunityBetting,
  getAllWinnersUser,
  getCMSDetail,
  getCoinSetting,
  getGameHistory,
  getGameRules,
  getGameWiseUserList,
  getListCoinSetting,
  getListRole,
  getLoginSubadmin,
  getNumberGameTotal,
  getRole,
  getSingleCommunityBetting,
  getSingleCurrencyCoin,
  getSingleGame,
  getSingleGameRating,
  getSingleGameRules,
  getSingleNotification,
  getSingleQuery,
  getSingleSubadmin,
  getSingleUserTransaction,
  getUserReferralBySignIn,
  getUserWiseGameList,
  howToReferralWork,
  notificationAddEdit,
  permissionActiveDeActive,
  permissionGetById,
  showRating,
  subadminActiveDeactive,
  getUpdatedUser,
  getAllWithdrawalRequest,
  deletePermission,
  getAllSubAdmin,
  declareWinnerOfPenaltyBetting,
  declareWinnerOfCardBetting,
  getAllGamePeriodSelectedTimeList, addupdateUPiorQr, getCommunityGameperiod

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
adminRoutes.get("/get-role-admin", Auth, getUpdatedUser);

//#region Role routes
adminRoutes.post("/role-add-edit", Auth, addEditRole);
adminRoutes.get("/get-single-role/:roleId", Auth, getRole);
adminRoutes.get("/get-roles", Auth, getListRole);
adminRoutes.post("/delete-role", Auth, deleteRole);

//#region Permission Routes
adminRoutes.post("/permission-add-edit", Auth, addEditPermission);
adminRoutes.get("/get-all-permission", getAllPermission);
adminRoutes.get(
  "/get-single-permission/:permissionId",
  Auth,
  permissionGetById
);
adminRoutes.post("/permission-active-deactive", Auth, permissionActiveDeActive);
adminRoutes.post("/permission-delete", deletePermission);

// #region Subadmin routes
adminRoutes.post("/add-subadmin", addSubadmin);
adminRoutes.get("/get-single-subadmin/:subadminId", Auth, getSingleSubadmin);
// adminRoutes.get("/get-all-subadmin", Auth, getAllSubadmin);
adminRoutes.post("/delete-subadmin", deleteSubadmin);
adminRoutes.get("/get-login-subadmin", Auth, getLoginSubadmin);
adminRoutes.post("/active-deactive-subadmin", Auth, subadminActiveDeactive);

adminRoutes.get("/get-sub-admin", getAllSubAdmin);

//#endregion

// ********* CMS Api ************ //
adminRoutes.post("/cms/add-edit-privacy-policy", Auth, addEditPrivacyPolicy);
adminRoutes.post("/cms/about-us", Auth, addEditAboutUs);
adminRoutes.post("/cms/terms-and-condition", Auth, addEditTermsAndCondition);
adminRoutes.get("/cms", Auth, getCMSDetail);

adminRoutes.get('/checkWallet', Auth, getwithdrwalcheck)
adminRoutes.post("/transaction", Auth, getTransactionList)
adminRoutes.post("/how-referral-work", Auth, howToReferralWork)

// -------- Setting -------- //
adminRoutes.get("/setting-get", Auth, getAdminSetting);
adminRoutes.post("/setting-add-edit", Auth, adminSetting);

//#region Withdrawal
adminRoutes.post("/withdrawal-request", Auth, adminWithdrawalRequest);
adminRoutes.get("/get-all-withdrawal-request", Auth, getAllWithdrawalRequest);
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

// ------ User Manegment
adminRoutes.get('/users', Auth, getAllUsers);
adminRoutes.post('/single-user', Auth, getAdminSingleUser);
adminRoutes.post('/user-edit', Auth, Upload, adminEditUser);
adminRoutes.post('/user-delete', Auth, adminDeleteUser);
adminRoutes.post("/user/activate/deactivate", Auth, changeStatusOfUser)
adminRoutes.post("/single-user/transaction", Auth, getSingleUserTransaction)

// User Query
adminRoutes.get("/queries", Auth, getAllQuery);
adminRoutes.post("/get-single-query", Auth, getSingleQuery);
adminRoutes.post("/query-delete", Auth, adminDeleteQuery);

// Rating
adminRoutes.get('/game/ratings', Auth, showRating)
adminRoutes.post('/single-game-rating', Auth, getSingleGameRating)
adminRoutes.post('/rating-delete', Auth, deleteRating)

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
adminRoutes.post("/game-active-deactive", Auth, gameActiveDeactive);
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
adminRoutes.post('/notification-add-edit', Auth, notificationAddEdit)
adminRoutes.get('/notifications', Auth, getAllNotification)
adminRoutes.post('/single-notification', Auth, getSingleNotification)
adminRoutes.post('/notification-delete', Auth, deleteNotification)
//#endregion

//#region 
adminRoutes.post('/currency-convert', allCurrencyConverter);
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
adminRoutes.post("/get-all-and-update-winners-user", Auth, getAllWinnersUser);
adminRoutes.get(
  "/get-all-users-and-winners-community-betting/:gameType",
  Auth,
  getAllUsersAndWinnersCommunityBetting
);
adminRoutes.post("/declare-community-betting-winner", Auth, declareWinnerOfCommunityBetting);
adminRoutes.post("/declare-number-betting-winner", Auth, declareWinnerOfNumberBetting);
adminRoutes.post("/declare-colour-betting-winner", Auth, declareWinnerOfColorBetting);
adminRoutes.post("/declare-penalty-betting-winner", Auth, declareWinnerOfPenaltyBetting);
adminRoutes.post("/declare-card-betting-winner", Auth, declareWinnerOfCardBetting);

adminRoutes.get("/get-all-game-periods/:gameType/:gameId", getAllGamePeriodData);
adminRoutes.get("/get-all-game-period-selected-time/:gameType/:gameId", Auth, getAllGamePeriodSelectedTimeList);
adminRoutes.post("/add-update-qr-upi", Upload, addupdateUPiorQr)

adminRoutes.post('/change-status-faint-currency', Upload, changeStatusOfFaintCurrency)
adminRoutes.get('/get-all-faint-currency', Auth, getAllFaintCurrency)

adminRoutes.get('/get-single-withdrawal-request/:id', Auth, getUserWithdrawalRequest);
adminRoutes.get('/get-all-request-withdrawal', Auth, getAllUserWithdrawalRequest);
adminRoutes.post('/accept-reject-withdrawal-request/:id', Auth, Upload, approveRejectWithdrawalRequest);
adminRoutes.get("/get-all-community-periods/:gameType/:gameId", getCommunityGameperiod);
adminRoutes.get('/top-player', Auth, topWeeklyPlayers)
adminRoutes.get('/top-all-player', Auth, topAllPlayers)

adminRoutes.post('/add-upi-method', Auth, Upload, addUPIMethod);
adminRoutes.get('/get-all-upi-method', Auth, getUPIMethod)
adminRoutes.post('/upi-status-update', Auth, changeStatusOfUPIMethod)
adminRoutes.post('/upi-method-delete', Auth, deleteUPIMethod)

adminRoutes.post('/add-edit-bank-detail', Auth, addEditBankDetail);
adminRoutes.get('/get-all-bank-detail', Auth, getBankDetail)



export { adminRoutes };



