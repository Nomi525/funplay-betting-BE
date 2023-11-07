import {
  express,
  logout,
  editProfile,
  Upload,
  connectToWallet,
  updateEmail,
  userCheckEmail,
  verifyOtp,
  loginFromMpin,
  Auth,
  forgotPassword,
  resetPassword,
  verifyForgotOtp,
  resendOtp,
  changePassword,
  getProfile,
  userEditProfile,
  accountDeactivate,
  addEditQuery,
  deleteQuery,
  addEditRating,
  gameRatingAverage,
  singupFromEmailPassword,
  singInFromEmailPassword,
  walletCreate,
  disconnectWallet,
  validatorMiddlware,
  setMpin,
  changeMpin,
  emailVerify,
  setPassword,
  userDashboard,
  addNewTransaction,
  getUserNewTransaction,
  getTotalUserAmountDiposit,
  withdrawalRequest,
  userDepositeWithdrawalHistory,
  singInWalletAddress,
  updateLoginStatus,
  userSignUpSignInOtp,
  userGetAllGame,
  userGetCMSDetail,
  addEditNumberBet,
  getAllNumberBet,
  getSingleNumberBet,
  deleteNumberBet,
  checkWalletAddress,
  addColourBet,
  colourBetResult,
  getAllGameWiseWinner,
  getSingleGameWiseWinner,
  getLoginUserColourBet,
  topWeeklyMonthlyPlayers,
  getAllGamePeriod,
  getByIdGamePeriod,
} from "./../index.js";
const userRoutes = express.Router();

userRoutes.post("/signup-signin-otp", userSignUpSignInOtp);
userRoutes.post("/signup-signin-with-wallet", connectToWallet);
userRoutes.post("/update-login-status", updateLoginStatus);
userRoutes.post("/update-email", updateEmail);
userRoutes.post("/verify-otp", verifyOtp);
userRoutes.post("/resend-otp", resendOtp);
userRoutes.post(
  "/signup-password",
  [validatorMiddlware("signupValidator")],
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
userRoutes.get('/games', userGetAllGame)

//#region CMS
userRoutes.get('/cms-details', userGetCMSDetail)

// Number Betting Routes
userRoutes.post('/create-number-bet', Auth, addEditNumberBet);
userRoutes.get('/get-number-bets', Auth, getAllNumberBet);
userRoutes.get('/get-single-number-bet/:numberBetId', Auth, getSingleNumberBet);
userRoutes.post('/delete-number-bet', Auth, deleteNumberBet);

//Colour betting
userRoutes.post('/create-colour-bet', Auth, addColourBet);
userRoutes.get('/colour-bet-result/:gameType/:type/:gameId/:period', Auth, colourBetResult);
userRoutes.get('/get-all-color-game-winners/:gameId', Auth, getAllGameWiseWinner);
userRoutes.get('/get-single-color-game-winners/:gameId', Auth, getSingleGameWiseWinner);
userRoutes.get('/get-login-user-bet', Auth, getLoginUserColourBet);

// Color Period
userRoutes.get('/get-all-game-period/:gameId', Auth, getAllGamePeriod)
userRoutes.get("/get-by-id-game-period/:gameId", Auth, getByIdGamePeriod);



export { userRoutes };
