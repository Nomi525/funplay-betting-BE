// import { chai, chaiHttp, appServer, expect, fs, path, ResponseMessage } from "../../src/index.js";
// import { adminToken } from "./Admin.spec.js";

// chai.use(chaiHttp);

// let roleDetails = {
//     roleId: null,
//     roleName: "test role"
// };

// describe('Role test case', () => {
//     //#region Role Add Edit
//     it('**** Role Add Edit ****', (done) => {
//         chai.request(appServer)
//             .post('/api/admin/role-add-edit')
//             .set('auth', adminToken)
//             .send(roleDetails)
//             .end((err, res) => {
//                 if (res.body.status == 201) {
//                     roleDetails.roleId = res.body.data._id
//                     expect(res.body.status).to.be.equal(201);
//                 } else if (res.body.status == 200) {
//                     expect(res.body.status).to.be.equal(200);
//                 } else if (res.body.status == 400) {
//                     expect(res.body.status).to.be.equal(400);
//                 } else if (res.body.status == 404) {
//                     expect(res.body.status).to.be.equal(404);
//                 } else {
//                     expect(res.body.status).to.be.equal(500);
//                 }
//                 expect(res.body).to.have.all.keys('status', 'message', 'data')
//                 done();
//             });
//     });
//     //#endregion

//     //#region Role Update
//     it('**** Role Update ****', (done) => {
//         chai.request(appServer)
//             .post('/api/admin/role-add-edit')
//             .set('auth', adminToken)
//             .send(roleDetails)
//             .end((err, res) => {
//                 if (res.body.status == 200) {
//                     expect(res.body.status).to.be.equal(200);
//                 } else if (res.body.status == 400) {
//                     expect(res.body.status).to.be.equal(400);
//                 } else if (res.body.status == 404) {
//                     expect(res.body.status).to.be.equal(404);
//                 } else {
//                     expect(res.body.status).to.be.equal(500);
//                 }
//                 expect(res.body).to.have.all.keys('status', 'message', 'data')
//                 done();
//             });
//     });
//     //#endregion

//     //#region Get Single Role
//     it('**** Get Single Role ****', (done) => {
//         chai.request(appServer)
//             .get(`/api/admin/get-single-role/${roleDetails.roleId}`)
//             .set('auth', adminToken)
//             .end((err, res) => {
//                 if (res.body.status == 200) {
//                     expect(res.body.status).to.be.equal(200);
//                 } else if (res.body.status == 400) {
//                     expect(res.body.status).to.be.equal(400);
//                 } else if (res.body.status == 404) {
//                     expect(res.body.status).to.be.equal(404);
//                 } else {
//                     expect(res.body.status).to.be.equal(500);
//                 }
//                 expect(res.body).to.have.all.keys('status', 'message', 'data')
//                 done();
//             });
//     });
//     //#endregion

//     //#region Get All Role
//     it('**** Get All Role ****', (done) => {
//         chai.request(appServer)
//             .get('/api/admin/get-roles')
//             .set('auth', adminToken)
//             .end((err, res) => {
//                 if (res.body.status == 200) {
//                     expect(res.body.status).to.be.equal(200);
//                 } else if (res.body.status == 400) {
//                     expect(res.body.status).to.be.equal(400);
//                 } else if (res.body.status == 404) {
//                     expect(res.body.status).to.be.equal(404);
//                 } else {
//                     expect(res.body.status).to.be.equal(500);
//                 }
//                 expect(res.body).to.have.all.keys('status', 'message', 'data')
//                 done();
//             });
//     });
//     //#endregion

//      //#region Delete Role
//      it('**** Delete role ****', (done) => {
//         chai.request(appServer)
//             .post('/api/admin/delete-role')
//             .set('auth', adminToken)
//             .send({roleId : roleDetails.roleId})
//             .end((err, res) => {
//                 if (res.body.status == 200) {
//                     expect(res.body.status).to.be.equal(200);
//                 } else if (res.body.status == 400) {
//                     expect(res.body.status).to.be.equal(400);
//                 } else if (res.body.status == 404) {
//                     expect(res.body.status).to.be.equal(404);
//                 } else {
//                     expect(res.body.status).to.be.equal(500);
//                 }
//                 expect(res.body).to.have.all.keys('status', 'message', 'data')
//                 done();
//             });
//     });
//     //#endregion

// });
