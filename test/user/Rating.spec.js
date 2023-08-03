import { chai, chaiHttp, appServer, expect, fs, path, ResponseMessage, User } from "../../src/index.js";
import { userToken } from "./User.spec.js";

chai.use(chaiHttp);
// const should = chai.should();
let queryId;
let data;
// let userToken;
let ratingDetails = {
    rating: 4.5,
    gameId: "64c9ffac7ea983a6405655fv"
};

describe('Rating test case', () => {
    it("Add rating", (done) => {
        chai.request(appServer)
            .post('/api/user/game/rating/add-edit')
            .set('auth', userToken)
            .send(ratingDetails)
            .end((err, res) => {
                if (res.body.status == 201) {
                    expect(res.body.status).to.be.equal(201);
                } else if (res.body.status == 200) {
                    expect(res.body.status).to.be.equal(200);
                } else if (res.body.status == 404) {
                    expect(res.body.status).to.be.equal(404);
                } else {
                    expect(res.body.status).to.be.equal(500);
                }
                expect(res.body).to.have.all.keys('status', 'message', 'data')
                done();
            })
    });

    it("Average rating", (done) => {
        chai.request(appServer)
            .post(`/api/user/game/rating/average`)
            .set('auth', userToken)
            .send({ gameId: ratingDetails.gameId })
            .end((err, res) => {
                if (res.body.status == 201) {
                    queryId = res.body.data._id
                    expect(res.body.status).to.be.equal(201);
                } else if (res.body.status == 200) {
                    expect(res.body.status).to.be.equal(200);
                } else if (res.body.status == 404) {
                    expect(res.body.status).to.be.equal(404);
                } else {
                    expect(res.body.status).to.be.equal(500);
                }
                expect(res.body).to.have.all.keys('status', 'message', 'data')
                done();
            })
    });
});