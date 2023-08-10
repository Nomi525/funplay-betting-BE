// import { chai, chaiHttp, appServer, expect, fs, path, ResponseMessage, User } from "../../src/index.js";
// import { adminToken } from "./Admin.spec.js";

// chai.use(chaiHttp);
// // const should = chai.should();
// let queryId;
// let data;
// // let userToken;
// let queryDetails = {
//     userName: "UserTes",
//     email: "UserTest@gmail.com",
//     mobileNumber: 8965231470,
//     description: "Tes case demo",
// };

// describe('Admin Query test case', () => {
//     it("Add query", (done) => {
//         chai.request(appServer)
//             .get('/api/admin/queries')
//             .set('auth', adminToken)
//             .end((err, res) => {
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
// })