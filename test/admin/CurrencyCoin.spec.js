// import { chai, chaiHttp, appServer, expect, fs, path, ResponseMessage, User } from "../../src/index.js";
// import { adminToken } from "./Admin.spec.js";

// chai.use(chaiHttp);
// let currenctCoinDetails = {
//     currencyCoinId: null,
//     currencyName: "INR",
//     coin: 20,
//     price: 1,
// }
// describe('Currency Coin Apis', () => {
//     //#region Add Currency coin 
//     it("Add Currency coin", (done) => {
//         chai.request(appServer)
//             .post('/api/admin/add-edit-currency-coin')
//             .set('auth', adminToken)
//             .send(currenctCoinDetails)
//             .end((err, res) => {
//                 if (res.body.status == 201) {
//                     currenctCoinDetails.currencyCoinId = res.body.data._id
//                     expect(res.body.status).to.be.equal(201);
//                 } else if (res.body.status == 400) {
//                     expect(res.body.status).to.be.equal(400);
//                 } else {
//                     expect(res.body.status).to.be.equal(500);
//                 }
//                 expect(res.body).to.have.all.keys('status', 'message', 'data')
//                 done();
//             })
//     });
//     //#endregion

//     //#region Edit Currency coin 
//     it("Edit Currency coin", (done) => {
//         currenctCoinDetails.currencyName = "INR2";
//         chai.request(appServer)
//             .post('/api/admin/add-edit-currency-coin')
//             .set('auth', adminToken)
//             .send(currenctCoinDetails)
//             .end((err, res) => {
//                 if (res.body.status == 200) {
//                     currenctCoinDetails.currencyCoinId = res.body.data._id
//                     expect(res.body.status).to.be.equal(200);
//                 } else if (res.body.status == 400) {
//                     expect(res.body.status).to.be.equal(400);
//                 } else {
//                     expect(res.body.status).to.be.equal(500);
//                 }
//                 expect(res.body).to.have.all.keys('status', 'message', 'data')
//                 done();
//             })
//     });
//     //#endregion

//     //#region Get All Currency coin 
//     it("Get All Currency coin", (done) => {
//         chai.request(appServer)
//             .get('/api/admin/get-all-currency-coin')
//             .set('auth', adminToken)
//             .end((err, res) => {
//                 if (res.body.status == 200) {
//                     expect(res.body.status).to.be.equal(200);
//                 } else if (res.body.status == 400) {
//                     expect(res.body.status).to.be.equal(400);
//                 } else {
//                     expect(res.body.status).to.be.equal(500);
//                 }
//                 expect(res.body).to.have.all.keys('status', 'message', 'data')
//                 done();
//             })
//     });
//     //#endregion

//     //#region Get Single Currency coin 
//     it("Get Single Currency coin", (done) => {
//         chai.request(appServer)
//             .get(`/api/admin/get-single-currency-coin/${currenctCoinDetails.currencyCoinId}`)
//             .set('auth', adminToken)
//             .end((err, res) => {
//                 if (res.body.status == 200) {
//                     expect(res.body.status).to.be.equal(200);
//                 } else if (res.body.status == 400) {
//                     expect(res.body.status).to.be.equal(400);
//                 } else {
//                     expect(res.body.status).to.be.equal(500);
//                 }
//                 expect(res.body).to.have.all.keys('status', 'message', 'data')
//                 done();
//             })
//     });
//     //#endregion

//     //#region Delete Currency coin 
//     it("Delete Currency coin", (done) => {
//         chai.request(appServer)
//             .post(`/api/admin/delete-currency-coin`)
//             .set('auth', adminToken)
//             .send({ currencyCoinId: currenctCoinDetails.currencyCoinId })
//             .end((err, res) => {
//                 if (res.body.status == 200) {
//                     expect(res.body.status).to.be.equal(200);
//                 } else if (res.body.status == 400) {
//                     expect(res.body.status).to.be.equal(400);
//                 } else {
//                     expect(res.body.status).to.be.equal(500);
//                 }
//                 expect(res.body).to.have.all.keys('status', 'message', 'data')
//                 done();
//             })
//     });
//     //#endregion

// })