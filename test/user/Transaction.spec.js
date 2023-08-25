// import { chai, chaiHttp, appServer, expect, fs, path, ResponseMessage, User } from "../../src/index.js";
// import { userToken } from "./User.spec.js";

// chai.use(chaiHttp);

// describe('Transaction test case', () => {
//     //#region Get all transaction
//     it("Get all transaction", (done) => {
//         chai.request(appServer)
//             .get('/api/user/new-transctions')
//             .set('auth', userToken)
//             .end((err, res) => {
//                 console.log(res.body);
//                 if (res.body.status == 201) {
//                     expect(res.body.status).to.be.equal(201);
//                 } else if (res.body.status == 200) {
//                     expect(res.body.status).to.be.equal(200);
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