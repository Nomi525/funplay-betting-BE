// import { chai, chaiHttp, appServer, expect, fs, path, ResponseMessage, User } from "../../src/index.js";

// chai.use(chaiHttp);
// const should = chai.should();
// let userId;
// let userOtp;
// let userToken;
// let otp = 4444;
// let userDetails = {
//     fullName: "User Test",
//     email: "UserTest@yopmail.com",
//     wallet: {
//         walletType: "web3model",
//         walletAddress: "JHJjhfsjkdfhskjfskdfjsdfsdk"
//     },
//     walletAddress: "JHJjhfsjkdfhskjfskdfjsdfsdk",
//     password: "User@123",
//     otp: "",
//     currency: "USD",
//     newPassword: "User@1234",
//     confirm_password: "User@1234",
//     mobileNumber: 8965231470,
//     profile: path.join(path.resolve(), 'test/image/profile.jpg'),
//     type: "login"
// };
// let image;
// let filePath = path.join(path.resolve(), 'public/uploads/');
// describe('User test case', () => {
//     //     //  *********  User signup signin *********** //    
//     //     // it('**** User user-signup-signin ****', (done) => {
//     //     //     chai.request(appServer)
//     //     //         .post('/api/user/signup-signin-otp')
//     //     //         .send({ email: userDetails.email, currency: userDetails.currency })
//     //     //         .end((err, res) => {
//     //     //             userId = res.body.data._id;
//     //     //             // userToken = res.body.data.token;
//     //     //             if (res.body.status == 200) {
//     //     //                 userOtp = res.body.data.otp;
//     //     //                 res.body.should.have.status(200);
//     //     //             } else if (res.body.status == 201) {
//     //     //                 userOtp = res.body.data.otp;
//     //     //                 res.body.should.have.status(201)
//     //     //             } else if (res.body.status == 400) {
//     //     //                 res.body.should.have.status(400)
//     //     //             } else if (res.body.status == 404) {
//     //     //                 res.body.should.have.status(404)
//     //     //             } else {
//     //     //                 res.body.should.have.status(500)
//     //     //             }
//     //     //             expect(res.body).to.have.all.keys('status', 'message', 'data')
//     //     //             done();
//     //     //         });
//     //     // });

//     //     //  *********  User Verify Otp login *********** //
//     //     // it('**** User verify otp For login ****', (done) => {
//     //     //     chai.request(appServer)
//     //     //         .post('/api/user/verify-otp')
//     //     //         .send({ userId, otp: userOtp, type: "login" })
//     //     //         .end((err, res) => {
//     //     //             console.log(res.body)
//     //     //             if (res.body.status == 200) {
//     //     //                 userToken = res.body.data.token;
//     //     //                 res.body.should.have.status(200)
//     //     //             } else if (res.body.status == 400) {
//     //     //                 res.body.should.have.status(400)
//     //     //             } else if (res.body.status == 404) {
//     //     //                 res.body.should.have.status(404)
//     //     //             } else {
//     //     //                 res.body.should.have.status(500)
//     //     //             }
//     //     //             expect(res.body).to.have.all.keys('status', 'message', 'data')
//     //     //             done();
//     //     //         });
//     //     // });

//     //     //#region  Sign up with password
//     it('**** User user-signup-signin ****', (done) => {
//         chai.request(appServer)
//             .post('/api/user/signup-password')
//             .send({ fullName: userDetails.fullName, email: userDetails.email, password: userDetails.password, currency: userDetails.currency, type: userDetails.type })
//             .end((err, res) => {
//                 if (res.body.status == 200) {
//                     userId = res.body.data._id;
//                     res.body.should.have.status(200);
//                     userToken = res.body.data.token
//                 } else if (res.body.status == 201) {
//                     userId = res.body.data._id;
//                     userOtp = res.body.data.otp;
//                     userToken = res.body.data.token
//                     res.body.should.have.status(201)
//                 } else if (res.body.status == 400) {
//                     res.body.should.have.status(400)
//                 } else if (res.body.status == 404) {
//                     res.body.should.have.status(404)
//                 } else {
//                     res.body.should.have.status(500)
//                 }
//                 expect(res.body).to.have.all.keys('status', 'message', 'data')
//                 done();
//             });
//     });
//     //     //#endregion

//     //     //#region Sign in with password
//     //     // it('**** User Sign In ****', (done) => {
//     //     //     chai.request(appServer)
//     //     //         .post('/api/user/signup-password')
//     //     //         .send({ email: userDetails.email, password: userDetails.password, type: "login" })
//     //     //         .end((err, res) => {
//     //     //             if (res.body.status == 200) {
//     //     //                 userId = res.body.data._id;
//     //     //                 userToken = res.body.data.token;
//     //     //                 res.body.should.have.status(200);
//     //     //             } else if (res.body.status == 201) {
//     //     //                 res.body.should.have.status(201)
//     //     //             } else if (res.body.status == 400) {
//     //     //                 res.body.should.have.status(400)
//     //     //             } else if (res.body.status == 404) {
//     //     //                 res.body.should.have.status(404)
//     //     //             } else {
//     //     //                 res.body.should.have.status(500)
//     //     //             }
//     //     //             expect(res.body).to.have.all.keys('status', 'message', 'data')
//     //     //             done();
//     //     //         });
//     //     // });
//     //     //#endregion

//     //     //  *********  User Forgot Password *********** //
//     //     // it('**** User forgot password ****', (done) => {
//     //     //     chai.request(appServer)
//     //     //         .post('/api/user/forgot-password')
//     //     //         .send({ email: userDetails.email })
//     //     //         .end((err, res) => {
//     //     //             if (res.body.status == 200) {
//     //     //                 res.body.should.have.status(200)
//     //     //             } else if (res.body.status == 400) {
//     //     //                 res.body.should.have.status(400)
//     //     //             } else if (res.body.status == 404) {
//     //     //                 res.body.should.have.status(404)
//     //     //             } else {
//     //     //                 res.body.should.have.status(500)
//     //     //             }
//     //     //             expect(res.body).to.have.all.keys('status', 'message', 'data')
//     //     //             done();
//     //     //         });
//     //     // });

//     //     //  *********  User Verify Otp forgot password *********** //
//     //     // it('**** User verify otp forgot password ****', (done) => {
//     //     //     chai.request(appServer)
//     //     //         .post('/api/user/verify-otp')
//     //     //         .send({ userId, otp: userOtp, type: "forgotPassword" })
//     //     //         .end((err, res) => {
//     //     //             if (res.body.status == 200) {
//     //     //                 res.body.should.have.status(200)
//     //     //             } else if (res.body.status == 400) {
//     //     //                 res.body.should.have.status(400)
//     //     //             } else if (res.body.status == 404) {
//     //     //                 res.body.should.have.status(404)
//     //     //             } else {
//     //     //                 res.body.should.have.status(500)
//     //     //             }
//     //     //             expect(res.body).to.have.all.keys('status', 'message', 'data')
//     //     //             done();
//     //     //         });
//     //     // });

//     //     //  *********  User Reset Password *********** //
//     //     // it('**** User Reset password ****', (done) => {
//     //     //     chai.request(appServer)
//     //     //         .post('/api/user/reset-password')
//     //     //         .send({ userId, password: userDetails.newPassword, confirm_password: userDetails.newPassword })
//     //     //         .end((err, res) => {
//     //     //             if (res.body.status == 200) {
//     //     //                 res.body.should.have.status(200)
//     //     //             } else if (res.body.status == 400) {
//     //     //                 res.body.should.have.status(400)
//     //     //             } else if (res.body.status == 404) {
//     //     //                 res.body.should.have.status(404)
//     //     //             } else {
//     //     //                 res.body.should.have.status(500)
//     //     //             }
//     //     //             expect(res.body).to.have.all.keys('status', 'message', 'data')
//     //     //             done();
//     //     //         });
//     //     // });

//     //     //  *********  User Change Password *********** //
//     //     // it('**** User Change password ****', (done) => {
//     //     //     chai.request(appServer)
//     //     //         .post('/api/user/change-password')
//     //     //         .set('auth', userToken)
//     //     //         .send({ oldPassword: userDetails.newPassword, newPassword: userDetails.password })
//     //     //         .end((err, res) => {
//     //     //             if (res.body.status == 200) {
//     //     //                 res.body.should.have.status(200)
//     //     //             } else if (res.body.status == 400) {
//     //     //                 res.body.should.have.status(400)
//     //     //             } else if (res.body.status == 404) {
//     //     //                 res.body.should.have.status(404)
//     //     //             } else {
//     //     //                 res.body.should.have.status(500)
//     //     //             }
//     //     //             expect(res.body).to.have.all.keys('status', 'message', 'data')
//     //     //             done();
//     //     //         });
//     //     // });

//     //     //  *********  User Set Password *********** //
//     //     // it('**** User set password ****', (done) => {
//     //     //     chai.request(appServer)
//     //     //         .post('/api/user/set-password')
//     //     //         .set('auth', userToken)
//     //     //         .send({ password: userDetails.password })
//     //     //         .end((err, res) => {
//     //     //             if (res.body.status == 200) {
//     //     //                 res.body.should.have.status(200)
//     //     //             } else if (res.body.status == 400) {
//     //     //                 res.body.should.have.status(400)
//     //     //             } else if (res.body.status == 404) {
//     //     //                 res.body.should.have.status(404)
//     //     //             } else {
//     //     //                 res.body.should.have.status(500)
//     //     //             }
//     //     //             expect(res.body).to.have.all.keys('status', 'message', 'data')
//     //     //             done();
//     //     //         });
//     //     // });

//     //     //  *********  User Profile Update *********** //
//     //     // it('**** User Profile Update ****', (done) => {
//     //     //     chai.request(appServer)
//     //     //         .post('/api/user/profile-update')
//     //     //         .set('auth', userToken)
//     //     //         // .field({ email : userDetails.email})
//     //     //         .attach('profile', userDetails.profile)
//     //     //         .end((err, res) => {
//     //     //             if (res.body.status == 200) {
//     //     //                 image = res.body.data.profile;
//     //     //                 res.body.should.have.status(200)
//     //     //             } else if (res.body.status == 400) {
//     //     //                 res.body.should.have.status(400)
//     //     //             } else if (res.body.status == 404) {
//     //     //                 res.body.should.have.status(404)
//     //     //             } else {
//     //     //                 res.body.should.have.status(500)
//     //     //             }
//     //     //             if (fs.existsSync(filePath + image)) {
//     //     //                 fs.unlinkSync(filePath + image, () => { })
//     //     //             }
//     //     //             expect(res.body).to.have.all.keys('status', 'message', 'data')
//     //     //             done();
//     //     //         });
//     //     // });

//     //     //  *********  User logout *********** //
//     //     // it('**** User logout ****', (done) => {
//     //     //     chai.request(appServer)
//     //     //         .post('/api/user/logout')
//     //     //         .set('auth', userToken)
//     //     //         .end((err, res) => {
//     //     //             if (res.body.status == 200) {
//     //     //                 res.body.should.have.status(200)
//     //     //             } else if (res.body.status == 400) {
//     //     //                 res.body.should.have.status(400)
//     //     //             } else if (res.body.status == 404) {
//     //     //                 res.body.should.have.status(404)
//     //     //             } else {
//     //     //                 res.body.should.have.status(500)
//     //     //             }
//     //     //             expect(res.body).to.have.all.keys('status', 'message', 'data')
//     //     //             done();
//     //     //         });
//     //     // });

//     //     //#region Get All Active Game
//     //     // it('**** Get All Active Game ****', (done) => {
//     //     //     chai.request(appServer)
//     //     //         .get('/api/user/games')
//     //     //         .set('auth', userToken)
//     //     //         .end((err, res) => {
//     //     //             if (res.body.status == 201) {
//     //     //                 expect(res.body.status).to.be.equal(201);
//     //     //             } else if (res.body.status == 200) {
//     //     //                 expect(res.body.status).to.be.equal(200);
//     //     //             } else if (res.body.status == 400) {
//     //     //                 expect(res.body.status).to.be.equal(400);
//     //     //             } else if (res.body.status == 404) {
//     //     //                 expect(res.body.status).to.be.equal(404);
//     //     //             } else {
//     //     //                 expect(res.body.status).to.be.equal(500);
//     //     //             }
//     //     //             expect(res.body).to.have.all.keys('status', 'message', 'data')
//     //     //             done();
//     //     //         });
//     //     // });
//     //     //#endregion

//     //     //#region Get CMS details
//     //     // it('**** Get CMS details ****', (done) => {
//     //     //     console.log(userToken, 'userToken');
//     //     //     chai.request(appServer)
//     //     //         .get('/api/user/cms-details')
//     //     //         .set('auth', userToken)
//     //     //         .end((err, res) => {
//     //     //             if (res.body.status == 201) {
//     //     //                 expect(res.body.status).to.be.equal(201);
//     //     //             } else if (res.body.status == 200) {
//     //     //                 expect(res.body.status).to.be.equal(200);
//     //     //             } else if (res.body.status == 400) {
//     //     //                 expect(res.body.status).to.be.equal(400);
//     //     //             } else if (res.body.status == 404) {
//     //     //                 expect(res.body.status).to.be.equal(404);
//     //     //             } else {
//     //     //                 expect(res.body.status).to.be.equal(500);
//     //     //             }
//     //     //             expect(res.body).to.have.all.keys('status', 'message', 'data')
//     //     //             done();
//     //     //         });
//     //     // });
//     //     //#endregion

// });

// export { userToken }