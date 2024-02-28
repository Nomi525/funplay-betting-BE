// import { chai, chaiHttp, appServer, expect, fs, path, ResponseMessage, User } from "../../src/index.js";

// chai.use(chaiHttp);
// const should = chai.should();
// let userId;
// let userOtp;
// let userToken;
// let otp = 4444;
// let userDetails = {
//     email: "UserTest@gmail.com",
//     wallet: {
//         walletType: "web3model",
//         walletAddress: "JHJjhfsjkdfhskjfskdfjsdfsdk",
//     },
//     newWalletAddress: "JHJjhfsjkdfhskjfskdfjsdfsdk",
//     newWalletType: "web3Polygon",
//     walletEmail: "wallet@yopmail.com",
//     password: "User@123",
//     otp: "",
//     currency: "USD",
//     newPassword: "User@1234",
//     confirm_password: "User@1234",
//     mobileNumber: 8965231470,
//     profile: path.join(path.resolve(), 'test/image/profile.jpg')
// };
// let image;
// let filePath = path.join(path.resolve(), 'public/uploads/');
// describe('Wallet Login test case', () => {
//     //#region signin with wallet
//     // it('**** User signin with wallet ****', (done) => {
//     //     chai.request(appServer)
//     //         .post('/api/user/signup-signin-with-wallet')
//     //         .send({ wallet: JSON.stringify(userDetails.wallet) })
//     //         .end((err, res) => {
//     //             if (res.body.status == 200) {
//     //                 userId = res.body.data._id;
//     //                 userToken = res.body.data.token;
//     //                 res.body.should.have.status(200);
//     //             } else if (res.body.status == 201) {
//     //                 userId = res.body.data._id;
//     //                 userToken = res.body.data.token;
//     //                 res.body.should.have.status(201)
//     //             } else if (res.body.status == 400) {
//     //                 res.body.should.have.status(400)
//     //             } else if (res.body.status == 404) {
//     //                 res.body.should.have.status(404)
//     //             } else {
//     //                 res.body.should.have.status(500)
//     //             }
//     //             expect(res.body).to.have.all.keys('status', 'message', 'data')
//     //             done();
//     //         });
//     // });
//     //#endregion

//     //#region Check wallet connectivity
//     // it('**** Check wallet connectivity ****', (done) => {
//     //     chai.request(appServer)
//     //         .post('/api/user/check-wallet-connectivity')
//     //         .send({ walletAddress: userDetails.wallet.walletAddress })
//     //         .end((err, res) => {
//     //             if (res.body.status == 200) {
//     //                 userId = res.body.data._id;
//     //                 userToken = res.body.data.token;
//     //                 res.body.should.have.status(200);
//     //             } else if (res.body.status == 201) {
//     //                 res.body.should.have.status(201)
//     //             } else if (res.body.status == 400) {
//     //                 res.body.should.have.status(400)
//     //             } else if (res.body.status == 404) {
//     //                 res.body.should.have.status(404)
//     //             } else {
//     //                 res.body.should.have.status(500)
//     //             }
//     //             expect(res.body).to.have.all.keys('status', 'message', 'data')
//     //             done();
//     //         });
//     // });
//     //#endregion

//     //#region Update email Address when give wallet
//     // it('**** Update email Address when give wallet ****', (done) => {
//     //     chai.request(appServer)
//     //         .post('/api/user/update-email')
//     //         .send({ email: userDetails.walletEmail, walletAddress: userDetails.wallet.walletAddress,walletType: userDetails.wallet.walletType })
//     //         .end((err, res) => {
//     //             if (res.body.status == 200) {
//     //                 userId = res.body.data._id;
//     //                 userToken = res.body.data.token;
//     //                 res.body.should.have.status(200);
//     //             } else if (res.body.status == 201) {
//     //                 res.body.should.have.status(201)
//     //             } else if (res.body.status == 400) {
//     //                 res.body.should.have.status(400)
//     //             } else if (res.body.status == 404) {
//     //                 res.body.should.have.status(404)
//     //             } else {
//     //                 res.body.should.have.status(500)
//     //             }
//     //             expect(res.body).to.have.all.keys('status', 'message', 'data')
//     //             done();
//     //         });
//     // });
//     //#endregion

//     //#region Update Wallet Address when give email
//     // it('**** Update Wallet Address when give email ****', (done) => {
//     //     chai.request(appServer)
//     //         .post('/api/user/update-email')
//     //         .send({ email: userDetails.walletEmail, walletAddress: userDetails.newWalletAddress,walletType: userDetails.newWalletType })
//     //         .end((err, res) => {
//     //             if (res.body.status == 200) {
//     //                 userId = res.body.data._id;
//     //                 userToken = res.body.data.token;
//     //                 res.body.should.have.status(200);
//     //             } else if (res.body.status == 201) {
//     //                 res.body.should.have.status(201)
//     //             } else if (res.body.status == 400) {
//     //                 res.body.should.have.status(400)
//     //             } else if (res.body.status == 404) {
//     //                 res.body.should.have.status(404)
//     //             } else {
//     //                 res.body.should.have.status(500)
//     //             }
//     //             expect(res.body).to.have.all.keys('status', 'message', 'data')
//     //             done();
//     //         });
//     // });
//     //#endregion

//     //#region Update login status
//     // it('**** Update login status ****', (done) => {
//     //     chai.request(appServer)
//     //         .post('/api/user/update-login-status')
//     //         .send({ walletAddress: userDetails.wallet.walletAddress,walletType: userDetails.wallet.walletType })
//     //         .end((err, res) => {
//     //             console.log(res.body);
//     //             if (res.body.status == 200) {
//     //                 res.body.should.have.status(200);
//     //             } else if (res.body.status == 201) {
//     //                 res.body.should.have.status(201)
//     //             } else if (res.body.status == 400) {
//     //                 res.body.should.have.status(400)
//     //             } else if (res.body.status == 404) {
//     //                 res.body.should.have.status(404)
//     //             } else {
//     //                 res.body.should.have.status(500)
//     //             }
//     //             expect(res.body).to.have.all.keys('status', 'message', 'data')
//     //             done();
//     //         });
//     // });
//     //#endregion

// })

// export { userToken }