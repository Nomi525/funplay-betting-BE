// import { chai, chaiHttp, appServer, expect, fs, path, ResponseMessage, User } from "../../src/index.js";
// import { userToken } from "./User.spec.js";

// chai.use(chaiHttp);

// const transactionDetails = {
//     walletAddress : "0x8CFDb99B115b54a1D1bf2A4234eb27fa5fd1112D",
//     networkChainId : 80001,
//     tokenName : "BNB",
//     tokenAmount : 3,
//     tetherType : null,
//     tetherType : null
// }

// describe('Transaction test case', () => {
//     //#region Add transaction
//     it("Add transaction", (done) => {
//         chai.request(appServer)
//             .post('/api/user/new-transction/add')
//             .set('auth', userToken)
//             .send(transactionDetails)
//             .end((err, res) => {
//                 if (res.body.status == 201) {
//                     expect(res.body.status).to.be.equal(201);
//                 } else if (res.body.status == 200) {
//                     expect(res.body.status).to.be.equal(200);
//                 } else if (res.body.status == 404) {
//                     expect(res.body.status).to.be.equal(404);
//                 } else if (res.body.status == 400) {
//                     expect(res.body.status).to.be.equal(400);
//                 }  else {
//                     expect(res.body.status).to.be.equal(500);
//                 }
//                 expect(res.body).to.have.all.keys('status', 'message', 'data')
//                 done();
//             })
//     });
//     //#endregion

//     //#region Get all specific user transaction
//     it("Get all transaction", (done) => {
//         chai.request(appServer)
//             .get('/api/user/new-transctions')
//             .set('auth', userToken)
//             .end((err, res) => {
//                 if (res.body.status == 201) {
//                     expect(res.body.status).to.be.equal(201);
//                 } else if (res.body.status == 200) {
//                     expect(res.body.status).to.be.equal(200);
//                 } else if (res.body.status == 404) {
//                     expect(res.body.status).to.be.equal(404);
//                 } else if (res.body.status == 400) {
//                     expect(res.body.status).to.be.equal(400);
//                 }  else {
//                     expect(res.body.status).to.be.equal(500);
//                 }
//                 expect(res.body).to.have.all.keys('status', 'message', 'data')
//                 done();
//             })
//     });
//     //#endregion

//     //#region Total amount deposit
//     it("Total amount deposit", (done) => {
//         chai.request(appServer)
//             .get('/api/user/total-amount-deposit')
//             .set('auth', userToken)
//             .end((err, res) => {
//                 if (res.body.status == 201) {
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
//             })
//     });
//     //#endregion

//     //#region Get deposit withdrawal transaction
//     it("Get deposit withdrawal", (done) => {
//         chai.request(appServer)
//             .get('/api/user/get-deposit-withdrawal')
//             .set('auth', userToken)
//             .end((err, res) => {
//                 if (res.body.status == 201) {
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
//             })
//     });
//     //#endregion

// })