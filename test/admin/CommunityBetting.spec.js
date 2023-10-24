// import { chai, chaiHttp, appServer, expect, fs, path, ResponseMessage } from "../../src/index.js";
// import { adminToken } from "./Admin.spec.js";

// chai.use(chaiHttp);
// var communityBettingImage = path.join(path.resolve(), 'test/image/profile.jpg');
// var communityBettingId = null;
// const communityBettingDeatils = {
//     startDate: "24-10-2023",
//     endDate: "24-10-2023",
//     gameRounds: "5",
//     winningAmount: "50",
//     noOfWinners: 5,
//     winner1: "winner1",
//     winner2: "winner2",
//     winner3: "winner3",
//     winner4: "winner4",
//     gameFromTime: "1:60:00",
//     gameToTime: "1:60:00",
//     gameMode: "auto",
//     gameMinimumCoin: 5,
//     gameMaximumCoin: 6,
// }
// describe('Community betting test case', () => {

//     //#region Add community betting
//     it("Add edit community betting", (done) => {
//         chai.request(appServer)
//             .post('/api/admin/add-edit-community-betting')
//             .set('auth', adminToken)
//             .field(communityBettingDeatils)
//             .attach('communityBettingImage', communityBettingImage)
//             .end((err, res) => {
//                 if (res.body.status == 201) {
//                     communityBettingId = res.body.data._id
//                     expect(res.body.status).to.be.equal(201);
//                 } else if (res.body.status == 200) {
//                     expect(res.body.status).to.be.equal(200);
//                 } else if (res.body.status == 404) {
//                     expect(res.body.status).to.be.equal(404);
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

//     //#region Edit community betting
//     it("Edit community betting", (done) => {
//         communityBettingDeatils.communityBettingId = communityBettingId
//         communityBettingDeatils.gameMode = "mannual"
//         chai.request(appServer)
//             .post('/api/admin/add-edit-community-betting')
//             .set('auth', adminToken)
//             .field(communityBettingDeatils)
//             .attach('communityBettingImage', communityBettingImage)
//             .end((err, res) => {
//                 if (res.body.status == 201) {
//                     communityBettingId = res.body.data._id
//                     expect(res.body.status).to.be.equal(201);
//                 } else if (res.body.status == 200) {
//                     expect(res.body.status).to.be.equal(200);
//                 } else if (res.body.status == 404) {
//                     expect(res.body.status).to.be.equal(404);
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

//     //#region Get All community betting
//     it("Get all community betting", (done) => {
//         chai.request(appServer)
//             .get('/api/admin/get-all-community-betting')
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

//     //#region Get single community betting
//     it("Get single community betting", (done) => {
//         chai.request(appServer)
//             .get(`/api/admin/get-single-community-betting`)
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

//     //#region Delete community betting
//     it("Delete community betting", (done) => {
//         chai.request(appServer)
//             .post(`/api/admin/delete-community-betting`)
//             .set('auth', adminToken)
//             .send({ communityBettingId })
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