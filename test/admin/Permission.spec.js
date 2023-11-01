import { chai, chaiHttp, appServer, expect, fs, path, ResponseMessage } from "../../src/index.js";
import { adminToken } from "./Admin.spec.js";

chai.use(chaiHttp);

let permissionDetails = {
    permissionId: null,
    RoleType: "test-subadmin",
    Game: {
        all: true,
        create: true,
        update: true,
        view: true,
        delete: true
    }
}

describe('Permission test case', () => {
    //#region Add permission
    it('Add permission', (done) => {
        chai.request(appServer)
            .post('/api/admin/permission-add-edit')
            .set('auth', adminToken)
            .send(permissionDetails)
            .end((err, res) => {
                if (res.status == 201) {
                    permissionDetails.permissionId = res.body.data._id
                    expect(res.body.status).to.be.equal(201)
                } else if (res.status == 400) {
                    expect(res.body.status).to.be.equal(400)
                } else if (res.status == 404) {
                    expect(res.body.status).to.be.equal(404)
                } else {
                    expect(res.body.status).to.be.equal(500)
                }
                expect(res.body).to.have.all.keys('status', 'message', 'data')
                done()
            })
    })
    //#endregion

    //#region Edit permission
    it('Edit permission', (done) => {
        chai.request(appServer)
            .post('/api/admin/permission-add-edit')
            .set('auth', adminToken)
            .send(permissionDetails)
            .end((err, res) => {
                if (res.status == 200) {
                    expect(res.body.status).to.be.equal(200)
                } else if (res.status == 400) {
                    expect(res.body.status).to.be.equal(400)
                } else if (res.status == 404) {
                    expect(res.body.status).to.be.equal(404)
                } else {
                    expect(res.body.status).to.be.equal(500)
                }
                expect(res.body).to.have.all.keys('status', 'message', 'data')
                done()
            })
    })
    //#endregion

     //#region Get single permission
     it('Get single permission', (done) => {
        chai.request(appServer)
            .get(`/api/admin/get-single-permission/${permissionDetails.permissionId}`)
            .set('auth', adminToken)
            .end((err, res) => {
                if (res.status == 200) {
                    expect(res.body.status).to.be.equal(200)
                } else if (res.status == 400) {
                    expect(res.body.status).to.be.equal(400)
                } else if (res.status == 404) {
                    expect(res.body.status).to.be.equal(404)
                } else {
                    expect(res.body.status).to.be.equal(500)
                }
                expect(res.body).to.have.all.keys('status', 'message', 'data')
                done()
            })
    })
    //#endregion

    //#region Get single permission
    it('Get all permission', (done) => {
        chai.request(appServer)
            .get(`/api/admin/get-all-permission`)
            .set('auth', adminToken)
            .end((err, res) => {
                if (res.status == 200) {
                    expect(res.body.status).to.be.equal(200)
                } else if (res.status == 400) {
                    expect(res.body.status).to.be.equal(400)
                } else if (res.status == 404) {
                    expect(res.body.status).to.be.equal(404)
                } else {
                    expect(res.body.status).to.be.equal(500)
                }
                expect(res.body).to.have.all.keys('status', 'message', 'data')
                done()
            })
    })
    //#endregion

    //#region Active deactive permission
    it('Active deactive permission', (done) => {
        chai.request(appServer)
            .post('/api/admin/permission-active-deactive')
            .set('auth', adminToken)
            .send({permissionId : permissionDetails.permissionId})
            .end((err, res) => {
                if (res.status == 200) {
                    expect(res.body.status).to.be.equal(200)
                } else if (res.status == 400) {
                    expect(res.body.status).to.be.equal(400)
                } else if (res.status == 404) {
                    expect(res.body.status).to.be.equal(404)
                } else {
                    expect(res.body.status).to.be.equal(500)
                }
                expect(res.body).to.have.all.keys('status', 'message', 'data')
                done()
            })
    })
    //#endregion
    
})