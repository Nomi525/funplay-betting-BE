import { socketRoute } from "../config/Socket.config.js";
import { deleteBankDetail, updateEmail, userCheckEmail } from "../controller/user/UserController.js";
import {
  Auth,
  Upload,
  accountDeactivate,
  addColourBet,
  addEditCommunityBets,
  addEditNumberBet,
  addEditQuery,
  addEditRating,
  addNewTransaction,
  changeMpin,
  changePassword,
  checkWalletAddress,
  colourBetResult,
  connectToWallet,
  deleteNumberBet,
  deleteQuery,
  disconnectWallet,
  editProfile,
  emailVerify,
  express,
  forgotPassword,
  gameRatingAverage,
  getAllCommunityGamePeriod,
  getAllGamePeriod,
  getAllGameWiseWinner,
  getAllLastDayCommunityBettingWinners,
  getAllLiveCommunityBets,
  getAllNumberBet,
  getAllNumberGamePeriod,
  getByIdGamePeriod,
  getCommunityGamePeriodById,
  getCommunityWinList,
  getLoginUserColourBet,
  getLoginUserCommunityBets,
  getNumberGamePeriodById,
  getPeriod,
  getProfile,
  getSingleGameWiseWinner,
  getSingleNumberBet,
  getTotalUserAmountDiposit,
  getUserNewTransaction,
  loginFromMpin,
  logout,
  resendOtp,
  resetPassword,
  setMpin,
  setPassword,
  singInFromEmailPassword,
  singInWalletAddress,
  singupFromEmailPassword,
  topWeeklyMonthlyPlayers,
  updateLoginStatus,
  userDashboard,
  userDepositeWithdrawalHistory,
  userEditProfile,
  userGetAllGame,
  userGetCMSDetail,
  userSignUpSignInOtp,
  validatorMiddlware,
  verifyForgotOtp,
  // updateEmail,
  // userCheckEmail,
  verifyOtp,
  walletCreate,
  withdrawalRequest,
  getPeriodsDetailsForAllGame,
  numberBettingWinnerResult,
  colourBettingWinnerResult,
  addPenaltyBet,
  getAllGamePeriodOfPenaltyBetting,
  getByIdGamePeriodOfPenaltyBetting,
  penaltyBettingWinnerResult,
  addCardBet,
  getByIdGamePeriodOfCardBetting,
  getAllGamePeriodOfCardBetting,
  cardBettingWinnerResult,
  getAllBettingHistory,
  uploadImage,
  getSlotsBookedByPeriod,
} from "./../index.js";
import {getUserNotifications} from "../controller/user/UserNotificationController.js"

// import { numberBettingSocket, colorBettingSocket } from "../controller/user/Gamesocket.js";
import { addFaintCurrency, getUserFaintCurrency } from "../controller/admin/FaintCurrency.js";
import { totalCoin, userDashboard1 } from "../controller/user/DashboardController.js";
import { withdrawalUserRequest } from "../controller/user/TransactionController.js";
import { getUserWithdrawalRequest } from "../controller/admin/WithdrawalUser.js";
const userRoutes = express.Router();
userRoutes.post("/signup-signin-otp", userSignUpSignInOtp);
userRoutes.post("/signup-signin-with-wallet", connectToWallet);
userRoutes.post("/update-login-status", updateLoginStatus);
userRoutes.post("/update-email", updateEmail);
userRoutes.post("/verify-otp", verifyOtp);
userRoutes.post("/resend-otp", resendOtp);
userRoutes.post(
  "/signup-password",
  singupFromEmailPassword
);
userRoutes.post("/check-wallet-connectivity", checkWalletAddress);
userRoutes.post("/signin-password", singInFromEmailPassword);
userRoutes.post("/signin-wallet", singInWalletAddress);
userRoutes.post("/check-email", userCheckEmail);
userRoutes.post("/login-mpin", loginFromMpin);
userRoutes.post("/set-mpin", setMpin);
userRoutes.post("/forgot-password", forgotPassword);
userRoutes.post("/verify-forgot-otp", verifyForgotOtp);
userRoutes.post("/reset-password", resetPassword);
userRoutes.post("/profile-update", Auth, Upload, editProfile);
userRoutes.get("/profile", Auth, getProfile);
userRoutes.post("/change-mpin", Auth, changeMpin);
userRoutes.post("/change-password", Auth, changePassword);
userRoutes.post("/logout", Auth, logout);
userRoutes.post("/userEdit", Auth, Upload, userEditProfile);
userRoutes.post("/deactivate-user", Auth, accountDeactivate);
userRoutes.post("/set-password", Auth, setPassword);

// Email Verify
userRoutes.get("/verify-email", emailVerify);

// Transaction History Routes

// Query-Section Routes
userRoutes.post("/query/add-edit", Auth, Upload, addEditQuery);
userRoutes.post("/query/delete", Auth, deleteQuery);

// Rating Routes
userRoutes.post("/game/rating/add-edit", Auth, addEditRating);
userRoutes.get("/game/rating/average/:gameId", gameRatingAverage);

// Wallet login
userRoutes.post("/walletLogin/login", walletCreate);
userRoutes.post("/walletLogin/disconnect", disconnectWallet);

// Transction Routes
userRoutes.get("/new-transctions", Auth, getUserNewTransaction);
userRoutes.post("/new-transction/add", Auth, addNewTransaction);
userRoutes.get("/total-amount-deposit", Auth, getTotalUserAmountDiposit);
userRoutes.post("/withdrawal-request", Auth, withdrawalRequest);
userRoutes.get("/get-deposit-withdrawal", Auth, userDepositeWithdrawalHistory);

//Dashboard
userRoutes.get("/dashboard", Auth, userDashboard);
userRoutes.get("/get-top-weekly-monthly-users", topWeeklyMonthlyPlayers);

//#region Game
userRoutes.get("/games", userGetAllGame);

//#region CMS
userRoutes.get("/cms-details", userGetCMSDetail);

// Number Betting Routes
userRoutes.post("/create-number-bet", Auth, addEditNumberBet);
userRoutes.get("/get-number-bets", Auth, getAllNumberBet);
userRoutes.get("/get-single-number-bet/:numberBetId", Auth, getSingleNumberBet);
userRoutes.post("/delete-number-bet", Auth, deleteNumberBet);
userRoutes.get(
  "/get-single-number-game-period/:gameId",
  Auth,
  getNumberGamePeriodById
);
userRoutes.get(
  "/get-all-number-game-period/:gameId",
  Auth,
  getAllNumberGamePeriod
);
userRoutes.get('/get-number-betting-winner/:gameId/:period', Auth, numberBettingWinnerResult)

//Colour betting
userRoutes.post("/create-colour-bet", Auth, addColourBet);
userRoutes.get(
  "/colour-bet-result/:gameType/:type/:gameId/:period",
  Auth,
  colourBetResult
);
userRoutes.get(
  "/get-all-color-game-winners/:gameId",
  Auth,
  getAllGameWiseWinner
);
userRoutes.get(
  "/get-single-color-game-winners/:gameId",
  Auth,
  getSingleGameWiseWinner
);
userRoutes.get("/get-login-user-bet", Auth, getLoginUserColourBet);

//#region Winner api
userRoutes.get('/get-color-betting-winner/:gameType/:gameId/:period', Auth, colourBettingWinnerResult)

// Color Period
userRoutes.get("/get-all-game-period/:gameId", Auth, getAllGamePeriod);
userRoutes.get("/get-by-id-game-period/:gameId", Auth, getByIdGamePeriod);

// Community Betting Routes
userRoutes.post("/add-edit-community-bets", Auth, addEditCommunityBets);
userRoutes.get(
  "/get-login-user-community-bets/:gameId",
  Auth,
  getLoginUserCommunityBets
);
userRoutes.get(
  "/get-all-live-community-bets/:gameId/:period",
  Auth,
  getAllLiveCommunityBets
);
userRoutes.get(
  "/get-all-last-day-community-betting-winners/:gameId",
  Auth,
  getAllLastDayCommunityBettingWinners
);

userRoutes.get("/community-winners", Auth, getCommunityWinList);

userRoutes.get(
  "/get-single-community-game-period/:gameId",
  Auth,
  getCommunityGamePeriodById
);
userRoutes.get(
  "/get-all-community-game-period/:gameId",
  Auth,
  getAllCommunityGamePeriod
);
userRoutes.get("/get-period/:gameId", Auth, getPeriod);
// userRoutes.get("/get-periods-details-all-game", Auth, getPeriodsDetailsForAllGame);

//#region Penalty Betting All Routes
userRoutes.post('/create-penalty-bet', Auth, addPenaltyBet)
userRoutes.get('/get-by-id-penalty-betting-period/:gameId', Auth, getByIdGamePeriodOfPenaltyBetting)
userRoutes.get('/get-all-penalty-betting-period/:gameId', Auth, getAllGamePeriodOfPenaltyBetting)
userRoutes.get('/get-penalty-betting-winner/:gameId/:period', Auth, penaltyBettingWinnerResult)

//#endregion Penalty Betting Routes

//#region card Betting All Routes
userRoutes.post('/create-card-bet', Auth, addCardBet)
userRoutes.get('/get-by-id-card-betting-period/:gameId', Auth, getByIdGamePeriodOfCardBetting)
userRoutes.get('/get-all-card-betting-period/:gameId', Auth, getAllGamePeriodOfCardBetting)
userRoutes.get('/get-card-betting-winner/:gameId/:period', Auth, cardBettingWinnerResult)

//#endregion card Betting Routes

// socketRoute('/number-betting').on('connection', numberBettingSocket)
// socketRoute('/color-betting').on('connection', colorBettingSocket)

userRoutes.get('/get-all-betting-history', getAllBettingHistory)
userRoutes.post('/add-faint-currency', Auth, Upload, addFaintCurrency)
userRoutes.get("/total-coin", Auth, totalCoin)

userRoutes.get('/userDashboard1', Auth, userDashboard1)
userRoutes.post('/user-withdrawal-request', Auth, withdrawalUserRequest)
userRoutes.post('/community-betting-slots-booked', Auth, getSlotsBookedByPeriod)


userRoutes.post('/remove-bankDetail', Auth, deleteBankDetail)

userRoutes.get('/get-user-faint-currency', Auth, getUserFaintCurrency)
userRoutes.get('/get-user-withdrawal-currency', Auth, getUserWithdrawalRequest)
userRoutes.get('/get-notifications', Auth, getUserNotifications)



export { userRoutes };

