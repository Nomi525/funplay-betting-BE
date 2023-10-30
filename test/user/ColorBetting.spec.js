// import { chai, chaiHttp, appServer, expect, fs, path, ResponseMessage } from "../../src/index.js";
// import { userToken } from "./User.spec.js";

// chai.use(chaiHttp);
// const colorBetDeatils = {
//     colorBetId: null,
//     gameId: "65268d56a84590a59bb33312",
//     colourName: "Green",
//     colourName: "Green",
//     betAmount: 50,
//     gameType: "2colorBetting"
// }
// describe('Color Betting test case', () => {
//     //#region Create Bet for Number Betting
//     it("Create Color Bet", (done) => {
//         chai.request(appServer)
//             .post('/api/user/create-colour-bet')
//             .set('auth', userToken)
//             .send(colorBetDeatils)
//             .end((err, res) => {
//                 if (res.body.status == 201) {
//                     colorBetDeatils.colorBetId = res.body.data._id
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

//     //#region Color bet result get winner user 
//     it("Color Bet result", (done) => {
//         chai.request(appServer)
//             .get(`/api/user/colour-bet-result/2colorBetting/colorBetting/${colorBetDeatils.gameId}`)
//             .set('auth', userToken)
//             .end((err, res) => {
//                 if (res.body.status == 200) {
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

//     //#region Get all color game winners
//     it("Get all color game winners", (done) => {
//         chai.request(appServer)
//             .get(`/api/user/get-all-color-game-winners/${colorBetDeatils.gameId}`)
//             .set('auth', userToken)
//             .end((err, res) => {
//                 if (res.body.status == 200) {
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

// })