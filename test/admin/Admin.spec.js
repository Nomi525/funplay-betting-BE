// import { chai, chaiHttp, appServer, expect, fs, path, ResponseMessage, Admin } from "../../src/index.js";

// chai.use(chaiHttp);
// const should = chai.should();
// let adminId;
// let data;
// let adminotp;
// let adminToken;
// let otp = 4444;
// let adminDetails = {
//     email: "admintest@gmail.com",
//     password: "Admin@123",
//     otp: "",
//     newPassword: "Admin@1234",
//     confirm_password: "Admin@1234",
//     profile: path.join(path.resolve(), 'test/image/profile.jpg')
// };
// let image;
// let filePath = path.join(path.resolve(), 'public/uploads/');
// describe('Admin test case', () => {
//     //  *********  Admin Login *********** //
//     it('**** Admin login ****', (done) => {
//         chai.request(appServer)
//             .post('/api/admin/login')
//             .send({ email: adminDetails.email, password: adminDetails.password })
//             .end((err, res) => {
//                 if (res.body.status == 200) {
//                     adminId = res.body.data._id;
//                     adminToken = res.body.data.token;
//                     // expect(res.body).to.have.equal(200);
//                     // expect(res.body).to.have.all.keys('status','message','data');
//                     res.body.should.have.status(200)
//                     res.body.should.have.property("message").eql(ResponseMessage.ADMIN_LOGGED_IN);
//                 } else if (res.body.status == 400) {
//                     res.body.should.have.status(400)
//                     res.body.should.have.property("message").eql(ResponseMessage.PLEASE_USE_VALID_PASSWORD);
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

//     //  *********  Admin Forgot Password *********** //
//     // it('**** Admin forgot password ****', (done) => {
//     //     chai.request(appServer)
//     //         .post('/api/admin/forgot-password')
//     //         .send({ email: adminDetails.email })
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

//     //  *********  Admin Verify Otp *********** //
//     // it('**** Admin verify otp ****', (done) => {
//     //     chai.request(appServer)
//     //         .post('/api/admin/verify-otp')
//     //         .send({ id: adminId, otp })
//     //         .end((err, res) => {
//     //             if (res.body.status == 200) {
//     //                 res.body.should.have.status(200)
//     //                 res.body.should.have.property("message").eql(ResponseMessage.VERIFICATION_COMPLETED);
//     //             } else if (res.body.status == 400) {
//     //                 res.body.should.have.status(400)
//     //                 res.body.should.have.property("message").eql(ResponseMessage.INVALID_OTP);
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

//     //  *********  Admin Reset Password *********** //
//     // it('**** Admin Reset password ****', (done) => {
//     //     chai.request(appServer)
//     //         .post('/api/admin/reset-password')
//     //         .send({ adminId, password: adminDetails.newPassword, confirm_password: adminDetails.newPassword })
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

//     //  *********  Admin Change Password *********** //
//     // it('**** Admin Change password ****', (done) => {
//     //     chai.request(appServer)
//     //         .post('/api/admin/change-password')
//     //         .set('auth', adminToken)
//     //         .send({ oldPassword: adminDetails.newPassword, newPassword: adminDetails.password })
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

//     //  *********  Admin Profile Update *********** //
//     // it('**** Admin Profile Update ****', (done) => {
//     //     chai.request(appServer)
//     //         .post('/api/admin/profile-update')
//     //         .set('auth', adminToken)
//     //         // .field({ email : adminDetails.email})
//     //         .attach('profile', adminDetails.profile)
//     //         .end((err, res) => {
//     //             if (res.body.status == 200) {
//     //                 image = res.body.data.profile;
//     //                 res.body.should.have.status(200)
//     //                 res.body.should.have.property("message").eql(ResponseMessage.ADMIN_UPDATED);
//     //             } else if (res.body.status == 400) {
//     //                 res.body.should.have.status(400)
//     //                 res.body.should.have.property("message").eql(ResponseMessage.DATA_NOT_FOUND);
//     //             } else if (res.body.status == 404) {
//     //                 res.body.should.have.status(404)
//     //                 res.body.should.have.property("message").eql(ResponseMessage.DATA_NOT_FOUND);
//     //             } else {
//     //                 res.body.should.have.status(500)
//     //                 res.body.should.have.property("message").eql(ResponseMessage.INTERNAL_SERVER_ERROR);
//     //             }
//     //             if (fs.existsSync(filePath + image)) {
//     //                 fs.unlinkSync(filePath + image, () => { })
//     //             }
//     //             done();
//     //         });
//     // });

//     //  *********  Admin logout *********** //
//     // it('**** Admin logout ****', (done) => {
//     //     chai.request(appServer)
//     //         .post('/api/admin/logout')
//     //         .set('auth', adminToken)
//     //         .end((err, res) => {
//     //             if (res.body.status == 200) {
//     //                 res.body.should.have.status(200)
//     //                 res.body.should.have.property("message").eql(ResponseMessage.ADMIN_LOGOUT);
//     //             } else if (res.body.status == 400) {
//     //                 res.body.should.have.status(400)
//     //                 res.body.should.have.property("message").eql(ResponseMessage.DATA_NOT_FOUND);
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

//     //  *********  Admin Setting *********** //
//     // it('**** Admin Setting ****', (done) => {
//     //     chai.request(appServer)
//     //         .post('/api/admin/setting')
//     //         .set('auth', adminToken)
//     //         .end((err, res) => {
//     //             if (res.body.status == 201) {
//     //                 res.body.should.have.status(201)
//     //                 res.body.should.have.property("message").eql(ResponseMessage.DATA_CREATED);
//     //             } else if (res.body.status == 200) {
//     //                 res.body.should.have.status(200)
//     //                 res.body.should.have.property("message").eql(ResponseMessage.DATA_UPDATED);
//     //             }else {
//     //                 res.body.should.have.status(500)
//     //                 res.body.should.have.property("message").eql(ResponseMessage.INTERNAL_SERVER_ERROR);
//     //             }
//     //             done();
//     //         });
//     // });

//     //  *********  Admin Setting Get *********** //
//     // it('**** Admin Setting Get ****', (done) => {
//     //     chai.request(appServer)
//     //         .get('/api/admin/setting-get')
//     //         .set('auth', adminToken)
//     //         .end((err, res) => {
//     //             if (res.body.status == 201) {
//     //                 expect(res.body.status).to.be.equal(201);
//     //             } else if (res.body.status == 200) {
//     //                 expect(res.body.status).to.be.equal(200);
//     //             } else if (res.body.status == 400) {
//     //                 expect(res.body.status).to.be.equal(400);
//     //             } else if (res.body.status == 404) {
//     //                 expect(res.body.status).to.be.equal(404);
//     //             } else {
//     //                 expect(res.body.status).to.be.equal(500);
//     //             }
//     //             expect(res.body).to.have.all.keys('status', 'message', 'data')
//     //             done();
//     //         });
//     // });

//     //  *********  Admin withdrawal-request *********** //
//     // it('**** Admin withdrawal-request ****', (done) => {
//     //     chai.request(appServer)
//     //         .post('/api/admin/withdrawal-request')
//     //         .set('auth', adminToken)
//     //         .send({ transactionId: "64c22c267467ab958dfd333e", requestType: "reject" })
//     //         .end((err, res) => {
//     //             if (res.body.status == 200) {
//     //                 res.body.should.have.status(200)
//     //                 res.body.should.have.property("message").eql(ResponseMessage.DATA_UPDATED);
//     //             } else if (res.body.status == 404) {
//     //                 res.body.should.have.status(404)
//     //                 res.body.should.have.property("message").eql(ResponseMessage.USER_NOT_FOUND);
//     //             } else {
//     //                 res.body.should.have.status(500)
//     //                 res.body.should.have.property("message").eql(ResponseMessage.INTERNAL_SERVER_ERROR);
//     //             }
//     //             done();
//     //         });
//     // });

//     //  *********  Admin how-referral-work *********** //  
//     // it('**** Admin how-referral-work ****', (done) => {
//     //     chai.request(appServer)
//     //         .post('/api/admin/how-referral-work')
//     //         .set('auth', adminToken)
//     //         .send({ referralWork : ["fsjfhsk"] })
//     //         .end((err, res) => {
//     //             if (res.body.status == 201) {
//     //                 res.body.should.have.status(201)
//     //                 res.body.should.have.property("message").eql(ResponseMessage.HOW_TO_WORK_REFERRAL_CREATED);
//     //             } else if (res.body.status == 200) {
//     //                 res.body.should.have.status(200)
//     //                 res.body.should.have.property("message").eql(ResponseMessage.HOW_TO_WORK_REFERRAL_UPDATED);
//     //             } else {
//     //                 res.body.should.have.status(500)
//     //                 res.body.should.have.property("message").eql(ResponseMessage.INTERNAL_SERVER_ERROR);
//     //             }
//     //             done();
//     //         });
//     // });

//     //  *********  Admin User Update *********** //
//     // it('**** Admin Edit User ****', (done) => {
//     //     const userDetails = {
//     //         userId : "64bfc6032af437be9c481f6d",
//     //         fullName : "chetan patidar",
//     //         userName : "chetanpatidar123"
//     //     }
//     //     chai.request(appServer)
//     //         .post('/api/admin/user-edit')
//     //         .set('auth', adminToken)
//     //         .send(userDetails)
//     //         .end((err, res) => {
//     //             if (res.body.status == 200) {
//     //                 image = res.body.data.profile;
//     //                 res.body.should.have.status(200)
//     //                 res.body.should.have.property("message").eql(ResponseMessage.DATA_UPDATED);
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

//     //  *********  Admin User deleted *********** //
//     // it('**** Admin User Deleted ****', (done) => {
//     //     const userDetails = {
//     //         userId : "64bfc6032af437be9c481f6d"
//     //     }
//     //     chai.request(appServer)
//     //         .post('/api/admin/user-delete')
//     //         .set('auth', adminToken)
//     //         .send(userDetails)
//     //         .end((err, res) => {
//     //             if (res.body.status == 200) {
//     //                 image = res.body.data.profile;
//     //                 res.body.should.have.status(200)
//     //                 res.body.should.have.property("message").eql(ResponseMessage.DATA_DELETED);
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
// });

// export { adminToken }