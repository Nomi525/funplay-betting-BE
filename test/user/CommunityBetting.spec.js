// import { chai, chaiHttp, appServer, expect, fs, path, ResponseMessage } from "../../src/index.js";
// import { userToken } from "./User.spec.js";

// chai.use(chaiHttp);
// const communityBetDeatils = {
//     communityBetId : null,
//     gameId : "652e254186b9550a29c04654",
//     betAmount : 1,
//     count : "0001",
//     period : 2023117
// }

// describe('Community betting test case', () => {
// //     //#region Add community bets
// //     it('Add community bets', (done) => {
// //         chai.request(appServer)
// //             .post('/api/user/add-edit-community-bets')
// //             .set('auth', userToken)
// //             .send(communityBetDeatils)
// //             .end((err, res) => {
// //                 if (res.body.status == 201) {
// //                     communityBetDeatils.communityBetId = res.body.data._id
// //                     expect(res.body.status).to.be.equal(201)
// //                 } else if (res.body.status == 400) {
// //                     expect(res.body.status).to.be.equal(400)
// //                 } else if (res.body.status == 404) {
// //                     expect(res.body.status).to.be.equal(404)
// //                 } else {
// //                     expect(res.body.status).to.be.equal(500)
// //                 }
// //                 expect(res.body).to.have.all.keys('status', 'message', 'data')
// //                 done();
// //             })
// //     })
// //     //#endregion

// //      //#region Edit community bets
// //      it('Edit community bets', (done) => {
// //         communityBetDeatils.betAmount = 2
// //         chai.request(appServer)
// //             .post('/api/user/add-edit-community-bets')
// //             .set('auth', userToken)
// //             .send(communityBetDeatils)
// //             .end((err, res) => {
// //                 if (res.body.status == 200) {
// //                     expect(res.body.status).to.be.equal(200)
// //                 } else if (res.body.status == 400) {
// //                     expect(res.body.status).to.be.equal(400)
// //                 } else if (res.body.status == 404) {
// //                     expect(res.body.status).to.be.equal(404)
// //                 } else {
// //                     expect(res.body.status).to.be.equal(500)
// //                 }
// //                 expect(res.body).to.have.all.keys('status', 'message', 'data')
// //                 done();
// //             })
// //     })
// //     //#endregion

// //     //#region Get login user community bets
// //     it('get-login-user-community-bets',(done)=>{
// //         chai.request(appServer)
// //         .get(`/api/user/get-login-user-community-bets/${communityBetDeatils.gameId}`)
// //         .set('auth', userToken)
// //         .end((err, res) => {
// //             if (res.body.status == 200) {
// //                 expect(res.body.status).to.be.equal(200)
// //             } else if (res.body.status == 400) {
// //                 expect(res.body.status).to.be.equal(400)
// //             } else if (res.body.status == 404) {
// //                 expect(res.body.status).to.be.equal(404)
// //             } else {
// //                 expect(res.body.status).to.be.equal(500)
// //             }
// //             expect(res.body).to.have.all.keys('status', 'message', 'data')
// //             done();
// //         })
// //     })
// //     //#endregion

// //      //#region Get all live community bets
// //      it('get-all-live-community-bets',(done)=>{
// //         chai.request(appServer)
// //         .get(`/api/user/get-all-live-community-bets/${communityBetDeatils.gameId}`)
// //         .set('auth', userToken)
// //         .end((err, res) => {
// //             if (res.body.status == 200) {
// //                 expect(res.body.status).to.be.equal(200)
// //             } else if (res.body.status == 400) {
// //                 expect(res.body.status).to.be.equal(400)
// //             } else if (res.body.status == 404) {
// //                 expect(res.body.status).to.be.equal(404)
// //             } else {
// //                 expect(res.body.status).to.be.equal(500)
// //             }
// //             expect(res.body).to.have.all.keys('status', 'message', 'data')
// //             done();
// //         })
// //     })
// //     //#endregion

// //      //#region Get all last day community betting winners
// //      it('get-all-last-day-community-betting-winners',(done)=>{
// //         chai.request(appServer)
// //         .get(`/api/user/get-all-last-day-community-betting-winners/${communityBetDeatils.gameId}`)
// //         .set('auth', userToken)
// //         .end((err, res) => {
// //             if (res.body.status == 200) {
// //                 expect(res.body.status).to.be.equal(200)
// //             } else if (res.body.status == 400) {
// //                 expect(res.body.status).to.be.equal(400)
// //             } else if (res.body.status == 404) {
// //                 expect(res.body.status).to.be.equal(404)
// //             } else {
// //                 expect(res.body.status).to.be.equal(500)
// //             }
// //             expect(res.body).to.have.all.keys('status', 'message', 'data')
// //             done();
// //         })
// //     })
// //     //#endregion

// //     //#region Get community winners
// //     it('community-winners',(done)=>{
// //         chai.request(appServer)
// //         .get(`/api/user/community-winners`)
// //         .set('auth', userToken)
// //         .end((err, res) => {
// //             if (res.body.status == 200) {
// //                 expect(res.body.status).to.be.equal(200)
// //             } else if (res.body.status == 400) {
// //                 expect(res.body.status).to.be.equal(400)
// //             } else if (res.body.status == 404) {
// //                 expect(res.body.status).to.be.equal(404)
// //             } else {
// //                 expect(res.body.status).to.be.equal(500)
// //             }
// //             expect(res.body).to.have.all.keys('status', 'message', 'data')
// //             done();
// //         })
// //     })
// //     //#endregion

// //#region Community bets login user period 
// it('Community bets login user period',(done) => {
//     chai.request(appServer)
//     .get(`/api/user/get-single-community-game-period/${communityBetDeatils.gameId}`)
//     .set('auth',userToken)
//     .end((err,res)=>{
//         if(res.body.status == 200){
//             expect(res.body.status).to.be.equal(200)
//         }else if(res.body.status == 400){
//             expect(res.body.status).to.be.equal(400)
//         }else if(res.body.status == 404){
//             expect(res.body.status).to.be.equal(404)
//         }else{
//             expect(res.body.status).to.be.equal(500)
//         }
//         expect(res.body).to.have.all.keys('status','message','data')
//         done()
//     })
// })
// //#endregion

// //#region Community bets all period  
// it('Community bets all period',(done) => {
//     chai.request(appServer)
//     .get(`/api/user/get-all-community-game-period/${communityBetDeatils.gameId}`)
//     .set('auth',userToken)
//     .end((err,res)=>{
//         if(res.body.status == 200){
//             expect(res.body.status).to.be.equal(200)
//         }else if(res.body.status == 400){
//             expect(res.body.status).to.be.equal(400)
//         }else if(res.body.status == 404){
//             expect(res.body.status).to.be.equal(404)
//         }else{
//             expect(res.body.status).to.be.equal(500)
//         }
//         expect(res.body).to.have.all.keys('status','message','data')
//         done()
//     })
// })
// //#endregion

// })