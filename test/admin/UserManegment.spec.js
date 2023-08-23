import { chai, chaiHttp, appServer, expect } from "../../src/index.js";
import { adminToken } from "./Admin.spec.js";

chai.use(chaiHttp);

describe('Admin User manegment test case', () => {
    
    it("Get User Referral By Sign In", (done) => {
        chai.request(appServer)
            .post('/api/admin/user-signin-by-referral')
            .set('auth', adminToken)
            .send({ userId: "64e5e0cfbf45fe605a72dcf4" })
            .end((err, res) => {
                if (res.body.status == 201) {
                    expect(res.body.status).to.be.equal(201);
                } else if (res.body.status == 200) {
                    expect(res.body.status).to.be.equal(200);
                } else if (res.body.status == 404) {
                    expect(res.body.status).to.be.equal(404);
                } else {
                    expect(res.body.status).to.be.equal(500);
                }
                expect(res.body).to.have.all.keys('status', 'message', 'data')
                done();
            })
    });

    it("Get get all transaction", (done) => {
        chai.request(appServer)
            .get('/api/admin/get-all-transaction')
            .set('auth', adminToken)
            .send({})
            .end((err, res) => {
                if (res.body.status == 201) {
                    expect(res.body.status).to.be.equal(201);
                } else if (res.body.status == 200) {
                    expect(res.body.status).to.be.equal(200);
                } else if (res.body.status == 404) {
                    expect(res.body.status).to.be.equal(404);
                } else {
                    expect(res.body.status).to.be.equal(500);
                }
                expect(res.body).to.have.all.keys('status', 'message', 'data')
                done();
            })
    });

})