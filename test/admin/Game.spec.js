import { chai, chaiHttp, appServer, expect, fs, path, ResponseMessage, Admin, CMS_Model } from "../../src/index.js";
import { adminToken } from "./Admin.spec.js";

chai.use(chaiHttp);
// const should = chai.should();
// let gameId;
let data;
// let userToken;

let gameDetails = {
    gameId: null,
    gameName: "footbal",
    gameImage: path.join(path.resolve(), 'test/image/profile.jpg'),
    gameDuration: 8965231470
};

describe('Admin test case', () => {
    //  *********  CMS Api *********** //
    it('**** Game Add Edit Privacy Policy ****', (done) => {
        chai.request(appServer)
            .post('/api/admin/game/add-edit')
            .set('auth', adminToken)
            .send(gameDetails)
            .end((err, res) => {
                if (res.body.status == 201) {
                    gameDetails.gameId = res.body.data._id
                    expect(res.body.status).to.be.equal(201);
                } else if (res.body.status == 200) {
                    expect(res.body.status).to.be.equal(200);
                } else if (res.body.status == 400) {
                    expect(res.body.status).to.be.equal(400);
                } else if (res.body.status == 404) {
                    expect(res.body.status).to.be.equal(404);
                } else {
                    expect(res.body.status).to.be.equal(500);
                }
                expect(res.body).to.have.all.keys('status', 'message', 'data')
                done();
            });
    });

    // ------ about us  ------- //
    it('**** Game ****', (done) => {
        gameDetails.gameName = "lodo"
        chai.request(appServer)
            .post('/api/admin/game/add-edit')
            .set('auth', adminToken)
            .send(gameDetails)
            .end((err, res) => {
                if (res.body.status == 201) {
                    expect(res.body.status).to.be.equal(201);
                } else if (res.body.status == 200) {
                    expect(res.body.status).to.be.equal(200);
                } else if (res.body.status == 400) {
                    expect(res.body.status).to.be.equal(400);
                } else if (res.body.status == 404) {
                    expect(res.body.status).to.be.equal(404);
                } else {
                    expect(res.body.status).to.be.equal(500);
                }
                expect(res.body).to.have.all.keys('status', 'message', 'data')
                done();
            });
    });

    // CMS Terms and condition
    it('**** Game delete ****', (done) => {
        chai.request(appServer)
            .post('/api/admin/game/delete')
            .set('auth', adminToken)
            .send({ gameId : gameDetails.gameId })
            .end((err, res) => {
                if (res.body.status == 201) {
                    expect(res.body.status).to.be.equal(201);
                } else if (res.body.status == 200) {
                    expect(res.body.status).to.be.equal(200);
                } else if (res.body.status == 400) {
                    expect(res.body.status).to.be.equal(400);
                } else if (res.body.status == 404) {
                    expect(res.body.status).to.be.equal(404);
                } else {
                    expect(res.body.status).to.be.equal(500);
                }
                expect(res.body).to.have.all.keys('status', 'message', 'data')
                done();
            });
    });

    // CMS Get
    it('**** Game details ****', (done) => {
        chai.request(appServer)
            .get('/api/admin/games')
            .set('auth', adminToken)
            .end((err, res) => {
                if (res.body.status == 200) {
                    expect(res.body.status).to.be.equal(200);
                } else {
                    expect(res.body.status).to.be.equal(500);
                }
                expect(res.body).to.have.all.keys('status', 'message', 'data')
                done();
            });
    });



});
