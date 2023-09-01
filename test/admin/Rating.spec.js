// import { chai, chaiHttp, appServer, expect, fs, path, ResponseMessage, User } from "../../src/index.js";
// import { adminToken } from "./Admin.spec.js";

// chai.use(chaiHttp);
// // const should = chai.should();
// let queryId;
// let data;
// // let userToken;
// let ratingDetails = {
//     rating: 4.5,
//     gameId: "64c9ffac7ea983a6405655fv"
// };

// describe('Admin Rating test case', () => {
//     //#region Gel all ratings
//     it("Get rating", (done) => {
//         chai.request(appServer)
//             .get('/api/admin/game/ratings')
//             .set('auth', adminToken)
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

//     //#region Gel Single ratings
//     it("Get Single rating", (done) => {
//         const gameId = "64e87c66776138ff31940593";
//         chai.request(appServer)
//             .post('/api/admin/single-game-rating')
//             .set('auth', adminToken)
//             .send({ gameId })
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

//     //#region Delete rating
//     it("Delete rating", (done) => {
//         const ratingId = "64e88af5f35063d5b7a3aa07"
//         chai.request(appServer)
//             .post('/api/admin/rating-delete')
//             .set('auth', adminToken)
//             .send({ ratingId })
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
// });