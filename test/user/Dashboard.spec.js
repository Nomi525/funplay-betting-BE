// import { chai, chaiHttp, appServer, expect, fs, path, ResponseMessage, User } from "../../src/index.js";
// import { userToken } from "./User.spec.js";

// chai.use(chaiHttp);

// describe('User dashboard test case', () => {

//     //#region User dashboard api
//     it("Dashboard", (done) => {
//         chai.request(appServer)
//             .get('/api/user/dashboard')
//             .set('auth', userToken)
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
//             })
//     });
//     //#endregion

//     //#region Top weekly monthly playes (users)
//     it("Top weekly monthly playes (users)", (done) => {
//         chai.request(appServer)
//             .get('/api/user/get-top-weekly-monthly-users')
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
//             })
//     });
//     //#endregion

// })