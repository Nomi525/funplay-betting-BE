// import { chai, chaiHttp, appServer, expect, fs, path, ResponseMessage, User } from "../../src/index.js";

// chai.use(chaiHttp);
// // const should = chai.should();
// let queryId;
// let data;
// let userToken;
// let queryDetails = {
//     userName: "UserTes",
//     email: "UserTest@gmail.com",
//     mobileNumber: 8965231470,
//     description: "Tes case demo",
// };

// describe('Query test case', () => {
//     it("Add query", (done) => {
//         chai.request(appServer)
//             .post('/api/user/query/add-edit')
//             .set('auth', userToken)
//             .send(queryDetails)
//             .end((err, res) => {
//                 if (res.body.status == 201) {
//                     queryId = res.body.data._id
//                     expect(res.body.status).to.be.equal(201);
//                 } else if (res.body.status == 404) {
//                     expect(res.body.status).to.be.equal(404);
//                 } else if (res.body.status == 401) {
//                     expect(res.body.status).to.be.equal(401);
//                 } else {
//                     expect(res.body.status).to.be.equal(500);
//                 }
//                 expect(res.body).to.have.all.keys('status', 'message', 'data')
//                 done();
//             })
//     });
// })