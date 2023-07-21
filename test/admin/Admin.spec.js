import { chai, chaiHttp, appServer, expect, fs, path, ResponseMessage, Admin } from "../../src/index.js";

chai.use(chaiHttp);
const should = chai.should();
let adminId;
let data;
let adminotp;
let adminToken;
let otp = 4444;
let adminDetails = {
    email: "adminTest@gmail.com",
    password: "Admin@123",
    otp: "",
    newPassword: "Admin@1234",
    confirm_password: "Admin@1234",
    profile: path.join(path.resolve(), 'test/image/profile.jpg')
};
let image;
let filePath = path.join(path.resolve(), 'public/uploads/');
describe('Admin test case', () => {
    //  *********  Admin Login *********** //
    it('**** Admin login ****', (done) => {
        chai.request(appServer)
            .post('/api/admin/login')
            .send({ email: adminDetails.email, password: adminDetails.password })
            .end((err, res) => {
                if (res.body.status == 200) {
                    adminId = res.body.data._id;
                    adminToken = res.body.data.token;
                    // expect(res.body).to.have.equal(200);
                    // expect(res.body).to.have.all.keys('status','message','data');
                    res.body.should.have.status(200)
                    res.body.should.have.property("message").eql(ResponseMessage.ADMIN_LOGGED_IN);
                } else if (res.body.status == 400) {
                    res.body.should.have.status(400)
                    res.body.should.have.property("message").eql(ResponseMessage.PLEASE_USE_VALID_PASSWORD);
                } else if (res.body.status == 404) {
                    res.body.should.have.status(404)
                    res.body.should.have.property("message").eql(ResponseMessage.DATA_NOT_FOUND);
                } else {
                    res.body.should.have.status(500)
                    res.body.should.have.property("message").eql(ResponseMessage.INTERNAL_SERVER_ERROR);
                }
                done();
            });
    });

    //  *********  Admin Forgot Password *********** //
    it('**** Admin forgot password ****', (done) => {
        chai.request(appServer)
            .post('/api/admin/forgot-password')
            .send({ email: adminDetails.email })
            .end((err, res) => {
                if (res.body.status == 200) {
                    res.body.should.have.status(200)
                    res.body.should.have.property("message").eql(ResponseMessage.RESET_PASSWORD_MAIL);
                } else if (res.body.status == 400) {
                    res.body.should.have.status(400)
                    res.body.should.have.property("message").eql(ResponseMessage.SOMETHING_WENT_WRONG);
                } else if (res.body.status == 404) {
                    res.body.should.have.status(404)
                    res.body.should.have.property("message").eql(ResponseMessage.ACCOUNT_NOT_EXIST);
                } else {
                    res.body.should.have.status(500)
                    res.body.should.have.property("message").eql(ResponseMessage.INTERNAL_SERVER_ERROR);
                }
                done();
            });
    });

    //  *********  Admin Verify Otp *********** //
    it('**** Admin verify otp ****', (done) => {
        chai.request(appServer)
            .post('/api/admin/verify-otp')
            .send({ id: adminId, otp })
            .end((err, res) => {
                if (res.body.status == 200) {
                    res.body.should.have.status(200)
                    res.body.should.have.property("message").eql(ResponseMessage.VERIFICATION_COMPLETED);
                } else if (res.body.status == 400) {
                    res.body.should.have.status(400)
                    res.body.should.have.property("message").eql(ResponseMessage.INVALID_OTP);
                } else if (res.body.status == 404) {
                    res.body.should.have.status(404)
                    res.body.should.have.property("message").eql(ResponseMessage.DATA_NOT_FOUND);
                } else {
                    res.body.should.have.status(500)
                    res.body.should.have.property("message").eql(ResponseMessage.INTERNAL_SERVER_ERROR);
                }
                done();
            });
    });

    //  *********  Admin Reset Password *********** //
    it('**** Admin Reset password ****', (done) => {
        chai.request(appServer)
            .post('/api/admin/reset-password')
            .send({ adminId, password: adminDetails.newPassword, confirm_password: adminDetails.newPassword })
            .end((err, res) => {
                if (res.body.status == 200) {
                    res.body.should.have.status(200)
                    res.body.should.have.property("message").eql(ResponseMessage.RESET_PASSWORD);
                } else if (res.body.status == 400) {
                    res.body.should.have.status(400)
                    res.body.should.have.property("message").eql(ResponseMessage.OTP_NOT_VERIFY);
                } else if (res.body.status == 404) {
                    res.body.should.have.status(404)
                    res.body.should.have.property("message").eql(ResponseMessage.ACCOUNT_NOT_EXIST);
                } else {
                    res.body.should.have.status(500)
                    res.body.should.have.property("message").eql(ResponseMessage.INTERNAL_SERVER_ERROR);
                }
                done();
            });
    });

    //  *********  Admin Change Password *********** //
    it('**** Admin Change password ****', (done) => {
        chai.request(appServer)
            .post('/api/admin/change-password')
            .set('auth', adminToken)
            .send({ oldPassword: adminDetails.newPassword, newPassword: adminDetails.password })
            .end((err, res) => {
                if (res.body.status == 200) {
                    res.body.should.have.status(200)
                    res.body.should.have.property("message").eql(ResponseMessage.PASSWORD_CHANGED);
                } else if (res.body.status == 400) {
                    res.body.should.have.status(400)
                    res.body.should.have.property("message").eql(ResponseMessage.YOU_ENTER_WRONG_PASSWORD);
                } else if (res.body.status == 404) {
                    res.body.should.have.status(404)
                    res.body.should.have.property("message").eql(ResponseMessage.DATA_NOT_FOUND);
                } else {
                    res.body.should.have.status(500)
                    res.body.should.have.property("message").eql(ResponseMessage.INTERNAL_SERVER_ERROR);
                }
                done();
            });
    });

    //  *********  Admin Profile Update *********** //
    it('**** Admin Profile Update ****', (done) => {
        chai.request(appServer)
            .post('/api/admin/profile-update')
            .set('auth', adminToken)
            .field({ email : adminDetails.email})
            .attach('profile', adminDetails.profile)
            .end((err, res) => {
                if (res.body.status == 200) {
                    image = res.body.data.profile;
                    res.body.should.have.status(200)
                    res.body.should.have.property("message").eql(ResponseMessage.ADMIN_UPDATED);
                } else if (res.body.status == 400) {
                    res.body.should.have.status(400)
                    res.body.should.have.property("message").eql(ResponseMessage.DATA_NOT_FOUND);
                } else if (res.body.status == 404) {
                    res.body.should.have.status(404)
                    res.body.should.have.property("message").eql(ResponseMessage.DATA_NOT_FOUND);
                } else {
                    res.body.should.have.status(500)
                    res.body.should.have.property("message").eql(ResponseMessage.INTERNAL_SERVER_ERROR);
                }
                if (fs.existsSync(filePath+image)) {
                    fs.unlinkSync(filePath+image, () => {})
                }
                done();
            });
    });

     //  *********  Admin logout *********** //
     it('**** Admin logout ****', (done) => {
        chai.request(appServer)
            .post('/api/admin/logout')
            .set('auth', adminToken)
            .end((err, res) => {
                if (res.body.status == 200) {
                    res.body.should.have.status(200)
                    res.body.should.have.property("message").eql(ResponseMessage.ADMIN_LOGOUT);
                } else if (res.body.status == 400) {
                    res.body.should.have.status(400)
                    res.body.should.have.property("message").eql(ResponseMessage.DATA_NOT_FOUND);
                } else if (res.body.status == 404) {
                    res.body.should.have.status(404)
                    res.body.should.have.property("message").eql(ResponseMessage.DATA_NOT_FOUND);
                } else {
                    res.body.should.have.status(500)
                    res.body.should.have.property("message").eql(ResponseMessage.INTERNAL_SERVER_ERROR);
                }
                done();
            });
    });


});