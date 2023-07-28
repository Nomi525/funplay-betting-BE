import { chai, chaiHttp, appServer, expect, fs, path, ResponseMessage, Admin, CMS_Model } from "../../src/index.js";
import { adminToken } from "./Admin.spec.js";
describe('Admin test case', () => {
    //  *********  CMS Api *********** //
    it('**** CMS Add Edit Privacy Policy ****', (done) => {
        chai.request(appServer)
            .post('/api/admin/cms/add-edit-privacy-policy')
            .set('auth', adminToken)
            .send({ description: "Dummmy data" })
            .end((err, res) => {
                if (res.body == 201) {
                    res.body.should.have.status(201)
                    res.body.should.have.property("message").eql(ResponseMessage.PRIVACY_POLICY_ADDED);
                } else if (res.body.status == 200) {
                    res.body.should.have.status(200)
                    res.body.should.have.property("message").eql(ResponseMessage.PRIVACY_POLICY_UPDATED);
                } else if (res.body.status == 400) {
                    res.body.should.have.status(400)
                    res.body.should.have.property("message").eql(ResponseMessage.BAD_REQUEST);
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

    // ------ about us  ------- //
    it('**** CMS about us ****', (done) => {
        chai.request(appServer)
            .post('/api/admin/cms/about-us')
            .set('auth', adminToken)
            .send({ description: "Dummmy data" })
            .end((err, res) => {
                if (res.body == 201) {
                    res.body.should.have.status(201)
                    res.body.should.have.property("message").eql(ResponseMessage.RULE_ADDED);
                } else if (res.body.status == 200) {
                    res.body.should.have.status(200)
                    res.body.should.have.property("message").eql(ResponseMessage.RULE_UPDATE);
                } else if (res.body.status == 400) {
                    res.body.should.have.status(400)
                    res.body.should.have.property("message").eql(ResponseMessage.BAD_REQUEST);
                } else if (res.body.status == 404) {
                    res.body.should.have.status(404)
                    res.body.should.have.property("message").eql(ResponseMessage.ADMIN_NOT_EXIST);
                } else {
                    res.body.should.have.status(500)
                    res.body.should.have.property("message").eql(ResponseMessage.INTERNAL_SERVER_ERROR);
                }
                done();
            });
    });

    // CMS Terms and condition
    it('**** CMS terms-and-condition ****', (done) => {
        chai.request(appServer)
            .post('/api/admin/cms/terms-and-condition')
            .set('auth', adminToken)
            .send({ description: "Dummmy data" })
            .end((err, res) => {
                if (res.body == 201) {
                    res.body.should.have.status(201)
                    res.body.should.have.property("message").eql(ResponseMessage.RULE_ADDED);
                } else if (res.body.status == 200) {
                    res.body.should.have.status(200)
                    res.body.should.have.property("message").eql(ResponseMessage.RULE_UPDATE);
                } else if (res.body.status == 400) {
                    res.body.should.have.status(400)
                    res.body.should.have.property("message").eql(ResponseMessage.BAD_REQUEST);
                } else if (res.body.status == 404) {
                    res.body.should.have.status(404)
                    res.body.should.have.property("message").eql(ResponseMessage.ADMIN_NOT_EXIST);
                } else {
                    res.body.should.have.status(500)
                    res.body.should.have.property("message").eql(ResponseMessage.INTERNAL_SERVER_ERROR);
                }
                done();
            });
    });

    // CMS Get
    it('**** CMS details ****', (done) => {
        chai.request(appServer)
            .get('/api/admin/cms')
            .set('auth', adminToken)
            .end((err, res) => {
                if (res.body.status == 200) {
                    res.body.should.have.status(200)
                    res.body.should.have.property("message").eql(ResponseMessage.CMS_DETAILS);
                } else {
                    res.body.should.have.status(500)
                    res.body.should.have.property("message").eql(ResponseMessage.INTERNAL_SERVER_ERROR);
                }
                done();
            });
    });



});
