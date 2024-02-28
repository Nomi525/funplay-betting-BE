// import { chai, chaiHttp, appServer, expect, fs, path, ResponseMessage, Admin, CMS_Model } from "../../src/index.js";
// import { adminToken } from "./Admin.spec.js";

// chai.use(chaiHttp);
// // let gameRuleId;
// // let data;
// // let userToken;

// let gameRuleDetails = {
//     gameRuleId: null,
//     gameId: "64d37e2cbe22139624ec7102",
//     gameRules: [
//         "Only use two digit1",
//         "Only use two digit2",
//         "Only use two digit3",
//         "Only use two digit4",
//         "Only use two digit5"
//     ]
// };
// describe('Admin test case', () => {
//     // *********  Game rules Api *********** //
//     it('**** Game rule add ****', (done) => {
//         chai.request(appServer)
//             .post('/api/admin/game-rules/add-edit')
//             .set('auth', adminToken)
//             .send(gameRuleDetails)
//             .end((err, res) => {
//                 if (res.body.status == 201) {
//                     gameRuleDetails.gameRuleId = res.body.data._id
//                     expect(res.body.status).to.be.equal(201);
//                 } else if (res.body.status == 200) {
//                     gameRuleDetails.gameRuleId = res.body.data._id
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

//     // ------ Game rules add edit  ------- //
//     it('**** Game Rules Edit ****', (done) => {
//         gameRuleDetails.gameRules[4] = "Only use two digit updated rule"
//         chai.request(appServer)
//             .post('/api/admin/game-rules/add-edit')
//             .set('auth', adminToken)
//             .send(gameRuleDetails)
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

//     // Get All game rules
//     it('**** Game details ****', (done) => {
//         chai.request(appServer)
//             .get('/api/admin/game-rules')
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

//     // Get game rules
//     it('**** Game single details ****', (done) => {
//         console.log(gameRuleDetails.gameRuleId,'kkk');
//         chai.request(appServer)
//             .post('/api/admin/single-game-rules')
//             .set('auth', adminToken)
//             .send({ gameRuleId: gameRuleDetails.gameRuleId })
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

//     // Game rule delete
//     it('**** Game delete ****', (done) => {
//         chai.request(appServer)
//             .post('/api/admin/game-rules/delete')
//             .set('auth', adminToken)
//             .send({ gameRuleId: gameRuleDetails.gameRuleId })
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


// });
