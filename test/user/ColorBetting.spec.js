import {
  chai,
  chaiHttp,
  appServer,
  expect,
  fs,
  path,
  ResponseMessage,
} from "../../src/index.js";
import { userToken } from "./User.spec.js";

chai.use(chaiHttp);
const colorBetDeatils = {
  colorBetId: null,
  gameId: "65268d56a84590a59bb33312",
  colourName: "Green",
  betAmount: 1,
  gameType: "2colorBetting",
  period: 20231170001,
};
const threeColorBetDeatils = {
  colorBetId: null,
  gameId: "653660a514fbee8efb9c148c",
  colourName: "Green",
  betAmount: 2,
  gameType: "Color Prediction",
  period: 20231170001,
};
describe("Color Betting test case", () => {
  // ****************** 2 Colour Betting test case ******************* //

  //#region 2 Create Bet for Color Betting
  it("Create 2 Color Bet", (done) => {
    chai
      .request(appServer)
      .post("/api/user/create-colour-bet")
      .set("auth", userToken)
      .send(colorBetDeatils)
      .end((err, res) => {
        if (res.body.status == 201) {
          colorBetDeatils.colorBetId = res.body.data._id;
          expect(res.body.status).to.be.equal(201);
        } else if (res.body.status == 200) {
          expect(res.body.status).to.be.equal(200);
        } else if (res.body.status == 404) {
          expect(res.body.status).to.be.equal(404);
        } else if (res.body.status == 400) {
          expect(res.body.status).to.be.equal(400);
        } else {
          expect(res.body.status).to.be.equal(500);
        }
        expect(res.body).to.have.all.keys("status", "message", "data");
        done();
      });
  });
  //#endregion

  //#region 2 Color bet result get winner user
  // it("2 Color Bet result", (done) => {
  //     chai.request(appServer)
  //         .get(`/api/user/colour-bet-result/2colorBetting/colorBetting/${colorBetDeatils.gameId}`)
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

  //#region Get all 2 color game winners
  it("Get all 2 color game winners", (done) => {
    chai
      .request(appServer)
      .get(`/api/user/get-all-color-game-winners/${colorBetDeatils.gameId}`)
      .set("auth", userToken)
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
        expect(res.body).to.have.all.keys("status", "message", "data");
        done();
      });
  });
  //#endregion

  //#region Get Single 2 color game winners
  it("Get Single 2 color Single game winners", (done) => {
    chai
      .request(appServer)
      .get(`/api/user/get-single-color-game-winners/${colorBetDeatils.gameId}`)
      .set("auth", userToken)
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
        expect(res.body).to.have.all.keys("status", "message", "data");
        done();
      });
  });
  //#endregion

  //#region Get login user 2 color game bets
  it("Get login user 2 color game bets", (done) => {
    chai
      .request(appServer)
      .get(`/api/user/get-login-user-bet`)
      .set("auth", userToken)
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
        expect(res.body).to.have.all.keys("status", "message", "data");
        done();
      });
  });
  //#endregion

  //#region Get 2 color betting winner
  it("Get 2 color betting winner", (done) => {
    chai
      .request(appServer)
      .get(
        `/api/user/get-color-betting-winner/2colorBetting/${colorBetDeatils.gameId}/${colorBetDeatils.period}`
      )
      .set("auth", userToken)
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
        expect(res.body).to.have.all.keys("status", "message", "data");
        done();
      });
  });
  //#endregion

  //#region Get get by id game period 2 color
  it("Get get by id game period 2 color", (done) => {
    chai
      .request(appServer)
      .get(`/api/user/get-by-id-game-period/${colorBetDeatils.gameId}`)
      .set("auth", userToken)
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
        expect(res.body).to.have.all.keys("status", "message", "data");
        done();
      });
  });
  //#endregion

  //#region Get get all game period 2 color
  it("Get get all game period 2 color", (done) => {
    chai
      .request(appServer)
      .get(`/api/user/get-all-game-period/${colorBetDeatils.gameId}`)
      .set("auth", userToken)
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
        expect(res.body).to.have.all.keys("status", "message", "data");
        done();
      });
  });
  //#endregion

  // ******************  End ******************* //

  // ****************** 3 Colour Betting test case ******************* //

  //#region 3 Create Bet for Colour Betting
  it("Create 3 Color Bet", (done) => {
    chai
      .request(appServer)
      .post("/api/user/create-colour-bet")
      .set("auth", userToken)
      .send(threeColorBetDeatils)
      .end((err, res) => {
        if (res.body.status == 201) {
          threeColorBetDeatils.colorBetId = res.body.data._id;
          threeColorBetDeatils.period = res.body.data.period;
          expect(res.body.status).to.be.equal(201);
        } else if (res.body.status == 200) {
          expect(res.body.status).to.be.equal(200);
        } else if (res.body.status == 404) {
          expect(res.body.status).to.be.equal(404);
        } else if (res.body.status == 400) {
          expect(res.body.status).to.be.equal(400);
        } else {
          expect(res.body.status).to.be.equal(500);
        }
        expect(res.body).to.have.all.keys("status", "message", "data");
        done();
      });
  });
  //#endregion

  //#region Get all 3 color game winners
  it("Get all 3 color game winners", (done) => {
    chai
      .request(appServer)
      .get(
        `/api/user/get-all-color-game-winners/${threeColorBetDeatils.gameId}`
      )
      .set("auth", userToken)
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
        expect(res.body).to.have.all.keys("status", "message", "data");
        done();
      });
  });
  //#endregion

  //#region Get Single 3 color game winners
  it("Get Single 3 color Single game winners", (done) => {
    chai
      .request(appServer)
      .get(
        `/api/user/get-single-color-game-winners/${threeColorBetDeatils.gameId}`
      )
      .set("auth", userToken)
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
        expect(res.body).to.have.all.keys("status", "message", "data");
        done();
      });
  });
  //#endregion

  //#region Get login user 3 color game bets
  it("Get login user 3 color game bets", (done) => {
    chai
      .request(appServer)
      .get(`/api/user/get-login-user-bet`)
      .set("auth", userToken)
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
        expect(res.body).to.have.all.keys("status", "message", "data");
        done();
      });
  });
  //#endregion

  //#region Get 3 color betting winner
  it("Get Color Prediction winner", (done) => {
    chai
      .request(appServer)
      .get(
        `/api/user/get-color-betting-winner/Color Prediction/${threeColorBetDeatils.gameId}/${threeColorBetDeatils.period}`
      )
      .set("auth", userToken)
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
        expect(res.body).to.have.all.keys("status", "message", "data");
        done();
      });
  });
  //#endregion

  //#region Get get by id game period 3 color
  it("Get get by id game period 3 color", (done) => {
    chai
      .request(appServer)
      .get(`/api/user/get-by-id-game-period/${threeColorBetDeatils.gameId}`)
      .set("auth", userToken)
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
        expect(res.body).to.have.all.keys("status", "message", "data");
        done();
      });
  });
  //#endregion

  //#region Get get all game period 3 color
  it("Get get all game period 3 color", (done) => {
    chai
      .request(appServer)
      .get(`/api/user/get-all-game-period/${threeColorBetDeatils.gameId}`)
      .set("auth", userToken)
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
        expect(res.body).to.have.all.keys("status", "message", "data");
        done();
      });
  });
  //#endregion

  // ******************  End ******************* //
});
