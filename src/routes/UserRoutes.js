import {
    express, logout, editProfile, Upload, userSignUpSignInOtp,
    userSignInMpin, verifyOtp, loginFromMpin, Auth, forgotPassword, resetPassword, verifyForgotOtp,
    resendOtp, changePassword, getProfile, userEditProfile, accountDeactivate, userGuestLogin, transactionHistory, addEditQuery,
    deleteQuery, addEditRating, gameRatingAverage
} from "./../index.js";
const userRoutes = express.Router();

userRoutes.post('/signup-signin-otp', userSignUpSignInOtp);
userRoutes.post('/verify-otp', verifyOtp);
userRoutes.post('/resend-otp', resendOtp);
userRoutes.post('/mpin-signin', userSignInMpin);
userRoutes.post('/login-mpin', loginFromMpin);
userRoutes.get('/guest-login', userGuestLogin);
userRoutes.post('/forgot-password', forgotPassword);
userRoutes.post('/verify-forgot-otp', verifyForgotOtp);
userRoutes.post('/reset-password', resetPassword);
userRoutes.post('/profile-update', Auth, Upload, editProfile);
userRoutes.get('/profile', Auth, getProfile);
userRoutes.post('/change-mpin', Auth, changePassword);
userRoutes.post('/logout', Auth, logout);
userRoutes.post("/userEdit", Auth, Upload, userEditProfile);
userRoutes.post("/deactivate-user", Auth, accountDeactivate);

// Transaction History Routes
userRoutes.get("/transaction-history", Auth, transactionHistory);

// Query-Section Routes
userRoutes.post('/query/add-edit', Auth, addEditQuery);
userRoutes.post('/query/delete', Auth, deleteQuery);

// Rating Routes
userRoutes.post('/game/rating/add-edit', Auth, addEditRating);
userRoutes.post('/game/rating/average', Auth, gameRatingAverage);


export { userRoutes }