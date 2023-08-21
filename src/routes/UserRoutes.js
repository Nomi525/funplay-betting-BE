import {
    express, logout, editProfile, Upload, userSignUpSignInOtp,
    userSignInMpin, verifyOtp, loginFromMpin, Auth, forgotPassword, resetPassword, verifyForgotOtp,
    resendOtp, changePassword, getProfile, userEditProfile, accountDeactivate, userGuestLogin, transactionHistory, addEditQuery,
    deleteQuery, addEditRating, gameRatingAverage, singupFromEmailPassword, singInFromEmailPassword, walletCreate,
    disconnectWallet, validatorMiddlware, setMpin, changeMpin, emailVerify, setPassword, addTransaction, getUserTransaction, userDashboard,
    addNewTransaction, getUserNewTransaction, getTotalUserAmountDiposit, withdrawalRequest,userDepositeWithdrawalHistory
} from "./../index.js";
const userRoutes = express.Router();

userRoutes.post('/signup-signin-otp', userSignUpSignInOtp);
userRoutes.post('/verify-otp', verifyOtp);
userRoutes.post('/resend-otp', resendOtp);
userRoutes.post('/signup-password', [validatorMiddlware("signupValidator")], singupFromEmailPassword);
userRoutes.post('/signin-password', singInFromEmailPassword);
userRoutes.post('/mpin-signin', userSignInMpin);
userRoutes.post('/login-mpin', loginFromMpin);
userRoutes.post('/set-mpin', setMpin);
userRoutes.get('/guest-login', userGuestLogin);
userRoutes.post('/forgot-password', forgotPassword);
userRoutes.post('/verify-forgot-otp', verifyForgotOtp);
userRoutes.post('/reset-password', resetPassword);
userRoutes.post('/profile-update', Auth, Upload, editProfile);
userRoutes.get('/profile', Auth, getProfile);
userRoutes.post('/change-mpin', Auth, changeMpin);
userRoutes.post('/change-password', Auth, changePassword);
userRoutes.post('/logout', Auth, logout);
userRoutes.post("/userEdit", Auth, Upload, userEditProfile);
userRoutes.post("/deactivate-user", Auth, accountDeactivate);
userRoutes.post('/set-password', Auth, setPassword);

// Email Verify
userRoutes.get("/verify-email", emailVerify);

// Transaction History Routes
userRoutes.get("/transaction-history", Auth, transactionHistory);

// Query-Section Routes
userRoutes.post('/query/add-edit', Auth, addEditQuery);
userRoutes.post('/query/delete', Auth, deleteQuery);

// Rating Routes
userRoutes.post('/game/rating/add-edit', Auth, addEditRating);
userRoutes.post('/game/rating/average', Auth, gameRatingAverage);

// Wallet login
userRoutes.post('/walletLogin/login', walletCreate);
userRoutes.post('/walletLogin/disconnect', disconnectWallet);

// Transction Routes
userRoutes.get('/transctions', Auth, getUserTransaction);
userRoutes.post('/transction/add', Auth, addTransaction);

userRoutes.get('/new-transctions', Auth, getUserNewTransaction);
userRoutes.post('/new-transction/add', Auth, addNewTransaction);
userRoutes.get('/total-amount-diposit', Auth, getTotalUserAmountDiposit);
userRoutes.post('/withdrawal-request', Auth, withdrawalRequest);
userRoutes.get('/get-deposite-withdrawal', Auth, userDepositeWithdrawalHistory);

//Dashboard
userRoutes.get('/dashboard', Auth, userDashboard)


export { userRoutes }