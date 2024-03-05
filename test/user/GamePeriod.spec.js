// import { chai, chaiHttp, appServer, expect, fs, path, ResponseMessage } from "../../src/index.js";
// import { userToken } from "./User.spec.js";

// chai.use(chaiHttp);
// const gameId = '65268d56a84590a59bb33312';
// describe('Game wise game period - test case', () => {

//     //#region Get all game period game wise
//     it('Get all game period', (done) => {
//         chai.request(appServer)
//             .get(`/api/user/get-all-game-period/${gameId}`)
//             .set('auth', userToken)
//             .end((err, res) => {
//                 if (res.body.status == 200) {
//                     expect(res.body.status).to.be.equal(200)
//                 } else if (res.body.status == 400) {
//                     expect(res.body.status).to.be.equal(400)
//                 } else if (res.body.status == 404) {
//                     expect(res.body.status).to.be.equal(404)
//                 } else {
//                     expect(res.body.status).to.be.equal(500)
//                 }
//                 expect(res.body).to.have.all.keys('status', 'message', 'data')
//                 done()
//             })
//     })
//     //#endregion

//     //#region Get all game period game wise
//     it('Get single game period', (done) => {
//         chai.request(appServer)
//             .get(`/api/user/get-by-id-game-period/${gameId}`)
//             .set('auth', userToken)
//             .end((err, res) => {
//                 if (res.body.status == 200) {
//                     expect(res.body.status).to.be.equal(200)
//                 } else if (res.body.status == 400) {
//                     expect(res.body.status).to.be.equal(400)
//                 } else if (res.body.status == 404) {
//                     expect(res.body.status).to.be.equal(404)
//                 } else {
//                     expect(res.body.status).to.be.equal(500)
//                 }
//                 expect(res.body).to.have.all.keys('status', 'message', 'data')
//                 done()
//             })
//     })
//     //#endregion

// })