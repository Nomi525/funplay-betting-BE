import { express, register, login, logout, sendOtp, editProfile, Upload, userSignupSignin, verifyOtp, Auth } from "./../index.js";
const userRoutes = express.Router();

userRoutes.post('/user-signup-signin', userSignupSignin);
userRoutes.post('/verify-otp', verifyOtp);
userRoutes.post('/register', register);
userRoutes.post('/send-otp', sendOtp);
userRoutes.post('/login', login);
userRoutes.post('/profile-update', Auth, Upload, editProfile);
userRoutes.post('/logout', Auth, logout);


export { userRoutes }