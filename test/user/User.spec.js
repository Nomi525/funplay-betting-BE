// import { chai, chaiHttp, appServer, expect, fs, path, ResponseMessage, User } from "../../src/index.js";

// chai.use(chaiHttp);
// const should = chai.should();
// let userId;
// let data;
// let userOtp;
// let userToken;
// let otp = 4444;
// let userDetails = {
//     email: "UserTest@gmail.com",
//     password: "User@123",
//     otp: "",
//     newPassword: "User@1234",
//     confirm_password: "User@1234",
//     mobileNumber: 8965231470,
//     profile: path.join(path.resolve(), 'test/image/profile.jpg')
// };
// let image;
// let filePath = path.join(path.resolve(), 'public/uploads/');
// describe('User test case', () => {
//     //  *********  User signup signin *********** //    
//     it('**** User user-signup-signin ****', (done) => {
//         chai.request(appServer)
//             .post('/api/user/signup-signin-otp')
//             .send({ email: userDetails.email })
//             .end((err, res) => {
//                 userId = res.body.data._id;
//                 // userToken = res.body.data.token;
//                 if (res.body.status == 200) {
//                     userOtp = res.body.data.otp;
//                     res.body.should.have.status(200)
//                     res.body.should.have.property("message").eql(ResponseMessage.SENT_OTP_ON_YOUR_EMAIL);
//                 } else if (res.body.status == 400) {
//                     res.body.should.have.status(400)
//                     res.body.should.have.property("message").eql(ResponseMessage.THIS_USER_IS_DEACTIVATED);
//                 } else if (res.body.status == 404) {
//                     res.body.should.have.status(404)
//                     res.body.should.have.property("message").eql(ResponseMessage.DATA_NOT_FOUND);
//                 } else {
//                     res.body.should.have.status(500)
//                     res.body.should.have.property("message").eql(ResponseMessage.INTERNAL_SERVER_ERROR);
//                 }
//                 done();
//             });
//     });

//     //  *********  User Forgot Password *********** //
//     // it('**** User forgot password ****', (done) => {
//     //     chai.request(appServer)
//     //         .post('/api/user/forgot-password')
//     //         .send({ email: userDetails.email })
//     //         .end((err, res) => {
//     //             if (res.body.status == 200) {
//     //                 res.body.should.have.status(200)
//     //                 res.body.should.have.property("message").eql(ResponseMessage.RESET_PASSWORD_MAIL);
//     //             } else if (res.body.status == 400) {
//     //                 res.body.should.have.status(400)
//     //                 res.body.should.have.property("message").eql(ResponseMessage.SOMETHING_WENT_WRONG);
//     //             } else if (res.body.status == 404) {
//     //                 res.body.should.have.status(404)
//     //                 res.body.should.have.property("message").eql(ResponseMessage.ACCOUNT_NOT_EXIST);
//     //             } else {
//     //                 res.body.should.have.status(500)
//     //                 res.body.should.have.property("message").eql(ResponseMessage.INTERNAL_SERVER_ERROR);
//     //             }
//     //             done();
//     //         });
//     // });

//     //  *********  User Verify Otp *********** //
//     it('**** User verify otp ****', (done) => {
//         console.log('userOtp2222',userOtp);
//         chai.request(appServer)
//             .post('/api/user/verify-otp')
//             .send({ userId, otp: userOtp })
//             .end((err, res) => {
//                 if (res.body.status == 200) {
//                     userToken = res.body.data.token;
//                     res.body.should.have.status(200)
//                     res.body.should.have.property("message").eql(ResponseMessage.VERIFICATION_COMPLETED);
//                 } else if (res.body.status == 400) {
//                     res.body.should.have.status(400)
//                     res.body.should.have.property("message").eql(ResponseMessage.USER_NOT_FOUND);
//                 } else if (res.body.status == 404) {
//                     res.body.should.have.status(404)
//                     res.body.should.have.property("message").eql(ResponseMessage.DATA_NOT_FOUND);
//                 } else {
//                     res.body.should.have.status(500)
//                     res.body.should.have.property("message").eql(ResponseMessage.INTERNAL_SERVER_ERROR);
//                 }
//                 done();
//             });
//     });

//     //  *********  User Reset Password *********** //
//     // it('**** User Reset password ****', (done) => {
//     //     chai.request(appServer)
//     //         .post('/api/user/reset-password')
//     //         .send({ userId, password: userDetails.newPassword, confirm_password: userDetails.newPassword })
//     //         .end((err, res) => {
//     //             if (res.body.status == 200) {
//     //                 res.body.should.have.status(200)
//     //                 res.body.should.have.property("message").eql(ResponseMessage.RESET_PASSWORD);
//     //             } else if (res.body.status == 400) {
//     //                 res.body.should.have.status(400)
//     //                 res.body.should.have.property("message").eql(ResponseMessage.OTP_NOT_VERIFY);
//     //             } else if (res.body.status == 404) {
//     //                 res.body.should.have.status(404)
//     //                 res.body.should.have.property("message").eql(ResponseMessage.ACCOUNT_NOT_EXIST);
//     //             } else {
//     //                 res.body.should.have.status(500)
//     //                 res.body.should.have.property("message").eql(ResponseMessage.INTERNAL_SERVER_ERROR);
//     //             }
//     //             done();
//     //         });
//     // });

//     //  *********  User Change Password *********** //
//     // it('**** User Change password ****', (done) => {
//     //     chai.request(appServer)
//     //         .post('/api/user/change-password')
//     //         .set('auth', userToken)
//     //         .send({ oldPassword: userDetails.newPassword, newPassword: userDetails.password })
//     //         .end((err, res) => {
//     //             if (res.body.status == 200) {
//     //                 res.body.should.have.status(200)
//     //                 res.body.should.have.property("message").eql(ResponseMessage.PASSWORD_CHANGED);
//     //             } else if (res.body.status == 400) {
//     //                 res.body.should.have.status(400)
//     //                 res.body.should.have.property("message").eql(ResponseMessage.YOU_ENTER_WRONG_PASSWORD);
//     //             } else if (res.body.status == 404) {
//     //                 res.body.should.have.status(404)
//     //                 res.body.should.have.property("message").eql(ResponseMessage.DATA_NOT_FOUND);
//     //             } else {
//     //                 res.body.should.have.status(500)
//     //                 res.body.should.have.property("message").eql(ResponseMessage.INTERNAL_SERVER_ERROR);
//     //             }
//     //             done();
//     //         });
//     // });

//     //  *********  User Profile Update *********** //
//     it('**** User Profile Update ****', (done) => {
//         chai.request(appServer)
//             .post('/api/user/profile-update')
//             .set('auth', userToken)
//             // .field({ email : userDetails.email})
//             .attach('profile', userDetails.profile)
//             .end((err, res) => {
//                 if (res.body.status == 200) {
//                     image = res.body.data.profile;
//                     res.body.should.have.status(200)
//                     res.body.should.have.property("message").eql(ResponseMessage.USER_UPDATED);
//                 } else if (res.body.status == 400) {
//                     res.body.should.have.status(400)
//                     res.body.should.have.property("message").eql(ResponseMessage.DATA_NOT_FOUND);
//                 } else if (res.body.status == 404) {
//                     res.body.should.have.status(404)
//                     res.body.should.have.property("message").eql(ResponseMessage.DATA_NOT_FOUND);
//                 } else {
//                     res.body.should.have.status(500)
//                     res.body.should.have.property("message").eql(ResponseMessage.INTERNAL_SERVER_ERROR);
//                 }
//                 if (fs.existsSync(filePath+image)) {
//                     fs.unlinkSync(filePath+image, () => {})
//                 }
//                 done();
//             });
//     });

//     //  *********  User logout *********** //
//     it('**** User logout ****', (done) => {
//         chai.request(appServer)
//             .post('/api/user/logout')
//             .set('auth', userToken)
//             .end((err, res) => {
//                 if (res.body.status == 200) {
//                     res.body.should.have.status(200)
//                     res.body.should.have.property("message").eql(ResponseMessage.USER_LOGOUT);
//                 } else if (res.body.status == 400) {
//                     res.body.should.have.status(400)
//                     res.body.should.have.property("message").eql(ResponseMessage.DATA_NOT_FOUND);
//                 } else if (res.body.status == 404) {
//                     res.body.should.have.status(404)
//                     res.body.should.have.property("message").eql(ResponseMessage.DATA_NOT_FOUND);
//                 } else {
//                     res.body.should.have.status(500)
//                     res.body.should.have.property("message").eql(ResponseMessage.INTERNAL_SERVER_ERROR);
//                 }
//                 done();
//             });
//     });


// });