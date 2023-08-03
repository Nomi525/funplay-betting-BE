import { chai, chaiHttp, appServer, expect, fs, path, ResponseMessage, User } from "../../src/index.js";

chai.use(chaiHttp);
const should = chai.should();
let userId;
let data;
let userOtp;
let userToken;
let otp = 4444;
let userDetails = {
    email: "UserTest@gmail.com",
    password: "User@123",
    otp: "",
    newPassword: "User@1234",
    confirm_password: "User@1234",
    mobileNumber: 8965231470,
    profile: path.join(path.resolve(), 'test/image/profile.jpg')
};
let image;
let filePath = path.join(path.resolve(), 'public/uploads/');
describe('User test case', () => {
    //  *********  User signup signin *********** //    
    it('**** User user-signup-signin ****', (done) => {
        chai.request(appServer)
            .post('/api/user/signup-signin-otp')
            .send({ email: userDetails.email })
            .end((err, res) => {
                userId = res.body.data._id;
                // userToken = res.body.data.token;
                if (res.body.status == 200) {
                    userOtp = res.body.data.otp;
                    res.body.should.have.status(200);
                } else if (res.body.status == 201) {
                    res.body.should.have.status(201)
                } else if (res.body.status == 400) {
                    res.body.should.have.status(400)
                } else if (res.body.status == 404) {
                    res.body.should.have.status(404)
                } else {
                    res.body.should.have.status(500)
                }
                expect(res.body).to.have.all.keys('status', 'message', 'data')
                done();
            });
    });

    //  *********  User Forgot Password *********** //
    // it('**** User forgot password ****', (done) => {
    //     chai.request(appServer)
    //         .post('/api/user/forgot-password')
    //         .send({ email: userDetails.email })
    //         .end((err, res) => {
    //             if (res.body.status == 200) {
    //                 res.body.should.have.status(200)
    //             } else if (res.body.status == 400) {
    //                 res.body.should.have.status(400)
    //             } else if (res.body.status == 404) {
    //                 res.body.should.have.status(404)
    //             } else {
    //                 res.body.should.have.status(500)
    //             }
    //             expect(res.body).to.have.all.keys('status', 'message', 'data')
    //             done();
    //         });
    // });

    //  *********  User Verify Otp *********** //
    it('**** User verify otp ****', (done) => {
        console.log('userOtp2222', userOtp);
        chai.request(appServer)
            .post('/api/user/verify-otp')
            .send({ userId, otp: userOtp })
            .end((err, res) => {
                if (res.body.status == 200) {
                    userToken = res.body.data.token;
                    res.body.should.have.status(200)
                } else if (res.body.status == 400) {
                    res.body.should.have.status(400)
                } else if (res.body.status == 404) {
                    res.body.should.have.status(404)
                } else {
                    res.body.should.have.status(500)
                }
                expect(res.body).to.have.all.keys('status', 'message', 'data')
                done();
            });
    });

    //  *********  User Reset Password *********** //
    // it('**** User Reset password ****', (done) => {
    //     chai.request(appServer)
    //         .post('/api/user/reset-password')
    //         .send({ userId, password: userDetails.newPassword, confirm_password: userDetails.newPassword })
    //         .end((err, res) => {
    //             if (res.body.status == 200) {
    //                 res.body.should.have.status(200)
    //             } else if (res.body.status == 400) {
    //                 res.body.should.have.status(400)
    //             } else if (res.body.status == 404) {
    //                 res.body.should.have.status(404)
    //             } else {
    //                 res.body.should.have.status(500)
    //             }
    //             expect(res.body).to.have.all.keys('status', 'message', 'data')
    //             done();
    //         });
    // });

    //  *********  User Change Password *********** //
    // it('**** User Change password ****', (done) => {
    //     chai.request(appServer)
    //         .post('/api/user/change-password')
    //         .set('auth', userToken)
    //         .send({ oldPassword: userDetails.newPassword, newPassword: userDetails.password })
    //         .end((err, res) => {
    //             if (res.body.status == 200) {
    //                 res.body.should.have.status(200)
    //             } else if (res.body.status == 400) {
    //                 res.body.should.have.status(400)
    //             } else if (res.body.status == 404) {
    //                 res.body.should.have.status(404)
    //             } else {
    //                 res.body.should.have.status(500)
    //             }
    //             expect(res.body).to.have.all.keys('status', 'message', 'data')
    //             done();
    //         });
    // });

    //  *********  User Profile Update *********** //
    // it('**** User Profile Update ****', (done) => {
    //     chai.request(appServer)
    //         .post('/api/user/profile-update')
    //         .set('auth', userToken)
    //         // .field({ email : userDetails.email})
    //         .attach('profile', userDetails.profile)
    //         .end((err, res) => {
    //             if (res.body.status == 200) {
    //                 image = res.body.data.profile;
    //                 res.body.should.have.status(200)
    //             } else if (res.body.status == 400) {
    //                 res.body.should.have.status(400)
    //             } else if (res.body.status == 404) {
    //                 res.body.should.have.status(404)
    //             } else {
    //                 res.body.should.have.status(500)
    //             }
    //             if (fs.existsSync(filePath + image)) {
    //                 fs.unlinkSync(filePath + image, () => { })
    //             }
    //             expect(res.body).to.have.all.keys('status', 'message', 'data')
    //             done();
    //         });
    // });

    //  *********  User logout *********** //
    // it('**** User logout ****', (done) => {
    //     chai.request(appServer)
    //         .post('/api/user/logout')
    //         .set('auth', userToken)
    //         .end((err, res) => {
    //             if (res.body.status == 200) {
    //                 res.body.should.have.status(200)
    //             } else if (res.body.status == 400) {
    //                 res.body.should.have.status(400)
    //             } else if (res.body.status == 404) {
    //                 res.body.should.have.status(404)
    //             } else {
    //                 res.body.should.have.status(500)
    //             }
    //             expect(res.body).to.have.all.keys('status', 'message', 'data')
    //             done();
    //         });
    // });


});

export { userToken }