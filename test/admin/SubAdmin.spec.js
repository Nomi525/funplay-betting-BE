import { chai, chaiHttp, appServer, expect, fs, path, ResponseMessage, Admin } from "../../src/index.js";
import { adminToken } from "./Admin.spec.js";

chai.use(chaiHttp);
let subAdminDetails = {
    subadminId: null,
    firstName: "subadmin",
    lastName: "lastname",
    email: "subadmin@test.com",
    password: "Subadmin@123",
    role: "subadmin"
    // profile: path.join(path.resolve(), 'test/image/profile.jpg')
}

let filePath = path.join(path.resolve(), 'public/uploads/');

describe('Subadmin test case', () => {
    
    //#region Add subadmin 
    it('Add subadmin', (done) => {
        chai.request(appServer)
            .post('/api/admin/add-subadmin')
            .set('auth', adminToken)
            .send(subAdminDetails)
            .end((error, res) => {
                if (res.body.status == 201) {
                    subAdminDetails.subadminId = res.body.data._id
                    expect(res.body.status).to.be.equal(201);
                } else if (res.body.status == 200) {
                    expect(res.body.status).to.be.equal(200);
                } else if (res.body.status == 400) {
                    expect(res.body.status).to.be.equal(400);
                } else if (res.body.status == 404) {
                    expect(res.body.status).to.be.equal(404);
                } else {
                    expect(res.body.status).to.be.equal(500);
                }
                expect(res.body).to.have.all.keys('status', 'message', 'data')
                done();
            })
    })
    //#endregion

    //#region Get single subadmin 
    it('Get single subadmin', (done) => {
        chai.request(appServer)
            .get(`/api/admin/get-single-subadmin/${subAdminDetails.subadminId}`)
            .set('auth', adminToken)
            .end((error, res) => {
                if (res.body.status == 200) {
                    expect(res.body.status).to.be.equal(200);
                } else if (res.body.status == 400) {
                    expect(res.body.status).to.be.equal(400);
                } else if (res.body.status == 404) {
                    expect(res.body.status).to.be.equal(404);
                } else {
                    expect(res.body.status).to.be.equal(500);
                }
                expect(res.body).to.have.all.keys('status', 'message', 'data')
                done();
            })
    })
    //#endregion

    //#region Get all subadmin 
    it('Get all subadmin', (done) => {
        chai.request(appServer)
            .get(`/api/admin/get-all-subadmin`)
            .set('auth', adminToken)
            .end((error, res) => {
                if (res.body.status == 200) {
                    expect(res.body.status).to.be.equal(200);
                } else if (res.body.status == 400) {
                    expect(res.body.status).to.be.equal(400);
                } else if (res.body.status == 404) {
                    expect(res.body.status).to.be.equal(404);
                } else {
                    expect(res.body.status).to.be.equal(500);
                }
                expect(res.body).to.have.all.keys('status', 'message', 'data')
                done();
            })
    })
    //#endregion

    //#region Get login subadmin
    it('Get login subadmin', (done) => {
        chai.request(appServer)
            .get(`/api/admin/get-login-subadmin`)
            .set('auth', adminToken)
            .end((error, res) => {
                if (res.body.status == 200) {
                    expect(res.body.status).to.be.equal(200);
                } else if (res.body.status == 400) {
                    expect(res.body.status).to.be.equal(400);
                } else if (res.body.status == 404) {
                    expect(res.body.status).to.be.equal(404);
                } else {
                    expect(res.body.status).to.be.equal(500);
                }
                expect(res.body).to.have.all.keys('status', 'message', 'data')
                done();
            })
    })
    //#endregion 

    //#region Active deactive subadmin
    it('Active deactive subadmin', (done) => {
        chai.request(appServer)
            .post(`/api/admin/active-deactive-subadmin`)
            .set('auth', adminToken)
            .send({ subadminId: subAdminDetails.subadminId })
            .end((error, res) => {
                if (res.body.status == 200) {
                    expect(res.body.status).to.be.equal(200);
                } else if (res.body.status == 400) {
                    expect(res.body.status).to.be.equal(400);
                } else if (res.body.status == 404) {
                    expect(res.body.status).to.be.equal(404);
                } else {
                    expect(res.body.status).to.be.equal(500);
                }
                expect(res.body).to.have.all.keys('status', 'message', 'data')
                done();
            })
    })
    //#endregion

    //#region Delete subadmin
    it('Delete subadmin', (done) => {
        chai.request(appServer)
            .post(`/api/admin/delete-subadmin`)
            .set('auth', adminToken)
            .send({ subadminId: subAdminDetails.subadminId })
            .end((error, res) => {
                if (res.body.status == 200) {
                    expect(res.body.status).to.be.equal(200);
                } else if (res.body.status == 400) {
                    expect(res.body.status).to.be.equal(400);
                } else if (res.body.status == 404) {
                    expect(res.body.status).to.be.equal(404);
                } else {
                    expect(res.body.status).to.be.equal(500);
                }
                expect(res.body).to.have.all.keys('status', 'message', 'data')
                done();
            })
    })
    //#endregion 

})