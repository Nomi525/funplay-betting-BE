// import { chai, chaiHttp, appServer, expect } from "../../src/index.js";
// import { adminToken } from "./Admin.spec.js";

// chai.use(chaiHttp);

// describe('Admin User manegment test case', () => {

//     // //     //#region  Get User Referral By Sign In
//     // //     it("Get User Referral By Sign In", (done) => {
//     // //         chai.request(appServer)
//     // //             .post('/api/admin/user-signin-by-referral')
//     // //             .set('auth', adminToken)
//     // //             .send({ userId: "64e5e0cfbf45fe605a72dcf4" })
//     // //             .end((err, res) => {
//     // //                 if (res.body.status == 201) {
//     // //                     expect(res.body.status).to.be.equal(201);
//     // //                 } else if (res.body.status == 200) {
//     // //                     expect(res.body.status).to.be.equal(200);
//     // //                 } else if (res.body.status == 404) {
//     // //                     expect(res.body.status).to.be.equal(404);
//     // //                 } else if (res.body.status == 400) {
//     // //                     expect(res.body.status).to.be.equal(400);
//     // //                 } else {
//     // //                     expect(res.body.status).to.be.equal(500);
//     // //                 }
//     // //                 expect(res.body).to.have.all.keys('status', 'message', 'data')
//     // //                 done();
//     // //             })
//     // //     });
//     // //     //#endregion

//     // //     //#region Get all users
//     // //     it("Get get all users", (done) => {
//     // //         chai.request(appServer)
//     // //             .get('/api/admin/users')
//     // //             .set('auth', adminToken)
//     // //             .send({})
//     // //             .end((err, res) => {
//     // //                 if (res.body.status == 201) {
//     // //                     expect(res.body.status).to.be.equal(201);
//     // //                 } else if (res.body.status == 200) {
//     // //                     expect(res.body.status).to.be.equal(200);
//     // //                 } else if (res.body.status == 404) {
//     // //                     expect(res.body.status).to.be.equal(404);
//     // //                 } else if (res.body.status == 400) {
//     // //                     expect(res.body.status).to.be.equal(400);
//     // //                 } else {
//     // //                     expect(res.body.status).to.be.equal(500);
//     // //                 }
//     // //                 expect(res.body).to.have.all.keys('status', 'message', 'data')
//     // //                 done();
//     // //             })
//     // //     });
//     // //     //#endregion

//     // //     //#region Get single user
//     // //     it("Get get single user", (done) => {
//     // //         chai.request(appServer)
//     // //             .post('/api/admin/single-user')
//     // //             .set('auth', adminToken)
//     // //             .send({ userId: "64e706838c55dede240492eb" })
//     // //             .end((err, res) => {
//     // //                 if (res.body.status == 201) {
//     // //                     expect(res.body.status).to.be.equal(201);
//     // //                 } else if (res.body.status == 200) {
//     // //                     expect(res.body.status).to.be.equal(200);
//     // //                 } else if (res.body.status == 404) {
//     // //                     expect(res.body.status).to.be.equal(404);
//     // //                 } else if (res.body.status == 400) {
//     // //                     expect(res.body.status).to.be.equal(400);
//     // //                 } else {
//     // //                     expect(res.body.status).to.be.equal(500);
//     // //                 }
//     // //                 expect(res.body).to.have.all.keys('status', 'message', 'data')
//     // //                 done();
//     // //             })
//     // //     });
//     // //     //#endregion

//     // //     //#region Change user status deactive
//     // //     it("User deactivate", (done) => {
//     // //         chai.request(appServer)
//     // //             .post('/api/admin/user/activate/deactivate')
//     // //             .set('auth', adminToken)
//     // //             .send({ id: "64e706838c55dede240492eb" })
//     // //             .end((err, res) => {
//     // //                 if (res.body.status == 201) {
//     // //                     expect(res.body.status).to.be.equal(201);
//     // //                 } else if (res.body.status == 200) {
//     // //                     expect(res.body.status).to.be.equal(200);
//     // //                 } else if (res.body.status == 404) {
//     // //                     expect(res.body.status).to.be.equal(404);
//     // //                 } else if (res.body.status == 400) {
//     // //                     expect(res.body.status).to.be.equal(400);
//     // //                 } else {
//     // //                     expect(res.body.status).to.be.equal(500);
//     // //                 }
//     // //                 expect(res.body).to.have.all.keys('status', 'message', 'data')
//     // //                 done();
//     // //             })
//     // //     });
//     // //     //#endregion

//     // //     //#region Change user status active
//     // //     it("User activate", (done) => {
//     // //         chai.request(appServer)
//     // //             .post('/api/admin/user/activate/deactivate')
//     // //             .set('auth', adminToken)
//     // //             .send({ id: "64e706838c55dede240492eb" })
//     // //             .end((err, res) => {
//     // //                 if (res.body.status == 201) {
//     // //                     expect(res.body.status).to.be.equal(201);
//     // //                 } else if (res.body.status == 200) {
//     // //                     expect(res.body.status).to.be.equal(200);
//     // //                 } else if (res.body.status == 404) {
//     // //                     expect(res.body.status).to.be.equal(404);
//     // //                 } else if (res.body.status == 400) {
//     // //                     expect(res.body.status).to.be.equal(400);
//     // //                 } else {
//     // //                     expect(res.body.status).to.be.equal(500);
//     // //                 }
//     // //                 expect(res.body).to.have.all.keys('status', 'message', 'data')
//     // //                 done();
//     // //             })
//     // //     });
//     // //     //#endregion


//     // //     //#region Get single user transaction
//     // //     it("Get single transaction", (done) => {
//     // //         chai.request(appServer)
//     // //             .post('/api/admin/single-user/transaction')
//     // //             .set('auth', adminToken)
//     // //             .send({ userId: "64e706838c55dede240492eb" })
//     // //             .end((err, res) => {
//     // //                 if (res.body.status == 201) {
//     // //                     expect(res.body.status).to.be.equal(201);
//     // //                 } else if (res.body.status == 200) {
//     // //                     expect(res.body.status).to.be.equal(200);
//     // //                 } else if (res.body.status == 404) {
//     // //                     expect(res.body.status).to.be.equal(404);
//     // //                 } else if (res.body.status == 400) {
//     // //                     expect(res.body.status).to.be.equal(400);
//     // //                 } else {
//     // //                     expect(res.body.status).to.be.equal(500);
//     // //                 }
//     // //                 expect(res.body).to.have.all.keys('status', 'message', 'data')
//     // //                 done();
//     // //             })
//     // //     });
//     // //     //#endregion

//     // //     //#region Get single user transaction
//     // //     it("Get all transaction", (done) => {
//     // //         chai.request(appServer)
//     // //             .get('/api/admin/get-all-transaction')
//     // //             .set('auth', adminToken)
//     // //             .send({})
//     // //             .end((err, res) => {
//     // //                 if (res.body.status == 201) {
//     // //                     expect(res.body.status).to.be.equal(201);
//     // //                 } else if (res.body.status == 200) {
//     // //                     expect(res.body.status).to.be.equal(200);
//     // //                 } else if (res.body.status == 404) {
//     // //                     expect(res.body.status).to.be.equal(404);
//     // //                 } else if (res.body.status == 400) {
//     // //                     expect(res.body.status).to.be.equal(400);
//     // //                 } else {
//     // //                     expect(res.body.status).to.be.equal(500);
//     // //                 }
//     // //                 expect(res.body).to.have.all.keys('status', 'message', 'data')
//     // //                 done();
//     // //             })
//     // //     });
//     // //     //#endregion 


//     // //     //#region Get deposite withdrawal list
//     // //     it(" Get deposite withdrawal list", (done) => {
//     // //         chai.request(appServer)
//     // //             .post('/api/admin/get-deposite-withdrawal-list')
//     // //             .set('auth', adminToken)
//     // //             .send({ userId: "64e706838c55dede240492eb" })
//     // //             .end((err, res) => {
//     // //                 if (res.body.status == 201) {
//     // //                     expect(res.body.status).to.be.equal(201);
//     // //                 } else if (res.body.status == 200) {
//     // //                     expect(res.body.status).to.be.equal(200);
//     // //                 } else if (res.body.status == 404) {
//     // //                     expect(res.body.status).to.be.equal(404);
//     // //                 } else if (res.body.status == 400) {
//     // //                     expect(res.body.status).to.be.equal(400);
//     // //                 } else {
//     // //                     expect(res.body.status).to.be.equal(500);
//     // //                 }
//     // //                 expect(res.body).to.have.all.keys('status', 'message', 'data')
//     // //                 done();
//     // //             })
//     // //     });
//     // //     //#endregion

//     // //#region Convert currency
//     // it("Convert currency", (done) => {
//     //     chai.request(appServer)
//     //         .post('/api/admin/currency-convert')
//     //         .set('auth', adminToken)
//     //         .send({ amount: 1, fromCurrency: "EUR", toCurrency: "INR" })
//     //         .end((err, res) => {
//     //             if (res.body.status == 201) {
//     //                 expect(res.body.status).to.be.equal(201);
//     //             } else if (res.body.status == 200) {
//     //                 expect(res.body.status).to.be.equal(200);
//     //             } else if (res.body.status == 404) {
//     //                 expect(res.body.status).to.be.equal(404);
//     //             } else if (res.body.status == 400) {
//     //                 expect(res.body.status).to.be.equal(400);
//     //             } else {
//     //                 expect(res.body.status).to.be.equal(500);
//     //             }
//     //             expect(res.body).to.have.all.keys('status', 'message', 'data')
//     //             done();
//     //         })
//     // });
//     // // #endregion  

//     //#region Accept reject withdrawal request
//     // it("Accept reject withdrawal request", (done) => {
//     //     chai.request(appServer)
//     //         .post('/api/admin/accept-reject-withdrawal-request')
//     //         .set('auth', adminToken)
//     //         .send({ status: "reject", withdrawalRequestId: "64edc4daed7d6c857bd64c8a" })
//     //         .end((err, res) => {
//     //             if (res.body.status == 201) {
//     //                 expect(res.body.status).to.be.equal(201);
//     //             } else if (res.body.status == 200) {
//     //                 expect(res.body.status).to.be.equal(200);
//     //             } else if (res.body.status == 404) {
//     //                 expect(res.body.status).to.be.equal(404);
//     //             } else if (res.body.status == 400) {
//     //                 expect(res.body.status).to.be.equal(400);
//     //             } else {
//     //                 expect(res.body.status).to.be.equal(500);
//     //             }
//     //             expect(res.body).to.have.all.keys('status', 'message', 'data')
//     //             done();
//     //         })
//     // });
//     // #endregion  

//     // //#region Get user wise game list
//     // it("Get user wise game list", (done) => {
//     //     chai.request(appServer)
//     //         .get(`/api/admin/get-user-wise-game-list/64e706838c55dede240492eb`)
//     //         .set('auth', adminToken)
//     //         .end((err, res) => {
//     //             if (res.body.status == 200) {
//     //                 expect(res.body.status).to.be.equal(200);
//     //             } else if (res.body.status == 404) {
//     //                 expect(res.body.status).to.be.equal(404);
//     //             } else if (res.body.status == 400) {
//     //                 expect(res.body.status).to.be.equal(400);
//     //             } else {
//     //                 expect(res.body.status).to.be.equal(500);
//     //             }
//     //             expect(res.body).to.have.all.keys('status', 'message', 'data')
//     //             done();
//     //         })
//     // });
//     // //#endregion

//     // //#region Get user wise game list
//     // it("Get game wise user list", (done) => {
//     //     chai.request(appServer)
//     //         .get(`/api/admin/get-game-wise-user-list/652e24f7fd4a9824d5504038`)
//     //         .set('auth', adminToken)
//     //         .end((err, res) => {
//     //             if (res.body.status == 200) {
//     //                 expect(res.body.status).to.be.equal(200);
//     //             } else if (res.body.status == 404) {
//     //                 expect(res.body.status).to.be.equal(404);
//     //             } else if (res.body.status == 400) {
//     //                 expect(res.body.status).to.be.equal(400);
//     //             } else {
//     //                 expect(res.body.status).to.be.equal(500);
//     //             }
//     //             expect(res.body).to.have.all.keys('status', 'message', 'data')
//     //             done();
//     //         })
//     // });
//     // //#endregion

// })