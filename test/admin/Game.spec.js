// import { chai, chaiHttp, appServer, expect, fs, path, ResponseMessage, Admin } from "../../src/index.js";
// import { adminToken } from "./Admin.spec.js";

// chai.use(chaiHttp);
// // const should = chai.should();
// // let gameId;
// let data;
// // let userToken;

// let gameDetails = {
//     userId: null,
//     gameId: null,
//     gameName: "footbal",
//     gameImage: path.join(path.resolve(), 'test/image/profile.jpg'),
//     gameDuration: 8965231470
// };

// describe('Admin Game test case', () => {
//     //  *********  Game Api *********** //
//     it('**** Game Add Edit ****', (done) => {
//         chai.request(appServer)
//             .post('/api/admin/game/add-edit')
//             .set('auth', adminToken)
//             .send(gameDetails)
//             .end((err, res) => {
//                 if (res.body.status == 201) {
//                     gameDetails.gameId = res.body.data._id
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

//     // ------ Game add edit  ------- //
//     it('**** Game ****', (done) => {
//         gameDetails.gameName = "lodo"
//         chai.request(appServer)
//             .post('/api/admin/game/add-edit')
//             .set('auth', adminToken)
//             .send(gameDetails)
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
//             });
//     });

//     // Game delete
//     // it('**** Game delete ****', (done) => {
//     //     chai.request(appServer)
//     //         .post('/api/admin/game/delete')
//     //         .set('auth', adminToken)
//     //         .send({ gameId : gameDetails.gameId })
//     //         .end((err, res) => {
//     //             if (res.body.status == 201) {
//     //                 expect(res.body.status).to.be.equal(201);
//     //             } else if (res.body.status == 200) {
//     //                 expect(res.body.status).to.be.equal(200);
//     //             } else if (res.body.status == 400) {
//     //                 expect(res.body.status).to.be.equal(400);
//     //             } else if (res.body.status == 404) {
//     //                 expect(res.body.status).to.be.equal(404);
//     //             } else {
//     //                 expect(res.body.status).to.be.equal(500);
//     //             }
//     //             expect(res.body).to.have.all.keys('status', 'message', 'data')
//     //             done();
//     //         });
//     // });

//     // Get game
//     it('**** Game details ****', (done) => {
//         chai.request(appServer)
//             .get('/api/admin/games')
//             .set('auth', adminToken)
//             .end((err, res) => {
//                 if (res.body.status == 200) {
//                     expect(res.body.status).to.be.equal(200);
//                 } else {
//                     expect(res.body.status).to.be.equal(500);
//                 }
//                 expect(res.body).to.have.all.keys('status', 'message', 'data')
//                 done();
//             });
//     });

//      // Get game wise user list
//      it('**** Get game wise user list ****', (done) => {
//         chai.request(appServer)
//             .get(`/api/admin/get-game-wise-user-list/${gameDetails.gameId}`)
//             .set('auth', adminToken)
//             .end((err, res) => {
//                 if (res.body.status == 200) {
//                     expect(res.body.status).to.be.equal(200);
//                 } else {
//                     expect(res.body.status).to.be.equal(500);
//                 }
//                 expect(res.body).to.have.all.keys('status', 'message', 'data')
//                 done();
//             });
//     });

//      // Get user wise game list
//      it('**** Get user wise game list ****', (done) => {
//         gameDetails.userId = "6526602f5542ef6738805792";
//         chai.request(appServer)
//             .get(`/api/admin/get-user-wise-game-list/${gameDetails.userId}`)
//             .set('auth', adminToken)
//             .end((err, res) => {
//                 if (res.body.status == 200) {
//                     expect(res.body.status).to.be.equal(200);
//                 } else {
//                     expect(res.body.status).to.be.equal(500);
//                 }
//                 expect(res.body).to.have.all.keys('status', 'message', 'data')
//                 done();
//             });
//     });



// });
