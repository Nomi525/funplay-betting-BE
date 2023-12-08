// import { chai, chaiHttp, appServer, expect, fs, path, ResponseMessage } from "../../src/index.js";
// import { userToken } from "./User.spec.js";

chai.use(chaiHttp);
const numberBetDeatils = {
    numberBetId: null,
    period: null,
    number: 5,
    gameId: "65324846c25f9658073a7cc6",
    betAmount: 50,
    rewardsCoins: 20,
    winAmount: 0,
    lossAmount: 0
}
describe('Number Betting test case', () => {
    //#region Create Bet for Number Betting
    // it("Create Bet", (done) => {
    //     chai.request(appServer)
    //         .post('/api/user/create-number-bet')
    //         .set('auth', userToken)
    //         .send(numberBetDeatils)
    //         .end((err, res) => {
    //             if (res.body.status == 201) {
    //                 numberBetDeatils.numberBetId = res.body.data._id
    //                 expect(res.body.status).to.be.equal(201);
    //             } else if (res.body.status == 200) {
    //                 expect(res.body.status).to.be.equal(200);
    //             } else if (res.body.status == 404) {
    //                 expect(res.body.status).to.be.equal(404);
    //             } else if (res.body.status == 400) {
    //                 expect(res.body.status).to.be.equal(400);
    //             } else {
    //                 expect(res.body.status).to.be.equal(500);
    //             }
    //             expect(res.body).to.have.all.keys('status', 'message', 'data')
    //             done();
    //         })
    // });
    //#endregion
// chai.use(chaiHttp);
// const numberBetDeatils = {
//     numberBetId: null,
//     number: 5,
//     gameId: "652fb1c18b1bfc632822408f",
//     betAmount: 50,
//     rewardsCoins: 20,
//     winAmount: 0,
//     lossAmount: 0
// }
// describe('Number Betting test case', () => {
//     //#region Create Bet for Number Betting
//     it("Create Bet", (done) => {
//         chai.request(appServer)
//             .post('/api/user/create-number-bet')
//             .set('auth', userToken)
//             .send(numberBetDeatils)
//             .end((err, res) => {
//                 if (res.body.status == 201) {
//                     numberBetDeatils.numberBetId = res.body.data._id
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

    //#region Get All Number Bets
    it("Get All Number Bets", (done) => {
        chai.request(appServer)
            .get('/api/user/get-number-bets')
            .set('auth', userToken)
            .end((err, res) => {
                if (res.body.status == 200) {
                    expect(res.body.status).to.be.equal(200);
                } else if (res.body.status == 404) {
                    expect(res.body.status).to.be.equal(404);
                } else if (res.body.status == 400) {
                    expect(res.body.status).to.be.equal(400);
                } else {
                    expect(res.body.status).to.be.equal(500);
                }
                expect(res.body).to.have.all.keys('status', 'message', 'data')
                done();
            })
    });
    //#endregion

//     //#region Get Single Number Bet
//     it("Get Single Number Bet", (done) => {
//         chai.request(appServer)
//             .get(`/api/user/get-single-number-bet/${numberBetDeatils.numberBetId}`)
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

    //#region Number bet result get winner user 
    // it("Number Bet result", (done) => {
    //     chai.request(appServer)
    //         .get(`/api/user/colour-bet-result/numberBetting/${numberBetDeatils.gameId}`)
    //         .set('auth', userToken)
    //         .end((err, res) => {
    //             if (res.body.status == 200) {
    //                 expect(res.body.status).to.be.equal(200);
    //             } else if (res.body.status == 404) {
    //                 expect(res.body.status).to.be.equal(404);
    //             } else if (res.body.status == 400) {
    //                 expect(res.body.status).to.be.equal(400);
    //             } else {
    //                 expect(res.body.status).to.be.equal(500);
    //             }
    //             expect(res.body).to.have.all.keys('status', 'message', 'data')
    //             done();
    //         })
    // });
    //#endregion

//     //#region Delete Bet
//     it("Delete Bet", (done) => {
//         chai.request(appServer)
//             .post(`/api/user/delete-number-bet`)
//             .set('auth', userToken)
//             .send({ numberBetId: numberBetDeatils.numberBetId })
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
    //#region Get single number game period
    it("Get single number game period", (done) => {
        chai.request(appServer)
            .get(`/api/user/get-single-number-game-period/${numberBetDeatils.gameId}`)
            .set('auth', userToken)
            .end((err, res) => {
                if (res.body.status == 200) {
                    numberBetDeatils.period = res.body.data.period
                    expect(res.body.status).to.be.equal(200);
                } else if (res.body.status == 404) {
                    expect(res.body.status).to.be.equal(404);
                } else if (res.body.status == 400) {
                    expect(res.body.status).to.be.equal(400);
                } else {
                    expect(res.body.status).to.be.equal(500);
                }
                expect(res.body).to.have.all.keys('status', 'message', 'data')
                done();
            })
    })
    //#endregion

    //#region Get all number game period
    it("Get all number game period", (done) => {
        chai.request(appServer)
            .get(`/api/user/get-all-number-game-period/${numberBetDeatils.gameId}`)
            .set('auth', userToken)
            .end((err, res) => {
                if (res.body.status == 200) {
                    expect(res.body.status).to.be.equal(200);
                } else if (res.body.status == 404) {
                    expect(res.body.status).to.be.equal(404);
                } else if (res.body.status == 400) {
                    expect(res.body.status).to.be.equal(400);
                } else {
                    expect(res.body.status).to.be.equal(500);
                }
                expect(res.body).to.have.all.keys('status', 'message', 'data')
                done();
            })
    });
    //#endregion

    //#region Get number betting winner
    it("Get number betting winner", (done) => {
        chai.request(appServer)
            .get(`/api/user/get-number-betting-winner/${numberBetDeatils.gameId}/${numberBetDeatils.period}`)
            .set('auth', userToken)
            .end((err, res) => {
                if (res.body.status == 200) {
                    expect(res.body.status).to.be.equal(200);
                } else if (res.body.status == 404) {
                    expect(res.body.status).to.be.equal(404);
                } else if (res.body.status == 400) {
                    expect(res.body.status).to.be.equal(400);
                } else {
                    expect(res.body.status).to.be.equal(500);
                }
                expect(res.body).to.have.all.keys('status', 'message', 'data')
                done();
            })
    });
    //#endregion

    //#region Get period for timmer for all game
    it("Get period for timmer for all game", (done) => {
        chai.request(appServer)
            .get(`/api/user/get-period/${numberBetDeatils.gameId}`)
            .set('auth', userToken)
            .end((err, res) => {
                if (res.body.status == 200) {
                    expect(res.body.status).to.be.equal(200);
                } else if (res.body.status == 404) {
                    expect(res.body.status).to.be.equal(404);
                } else if (res.body.status == 400) {
                    expect(res.body.status).to.be.equal(400);
                } else {
                    expect(res.body.status).to.be.equal(500);
                }
                expect(res.body).to.have.all.keys('status', 'message', 'data')
                done();
            })
    });
    //#endregion

})