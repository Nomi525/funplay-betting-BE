// import { chai, chaiHttp, appServer, expect, fs, path, ResponseMessage, Admin, BannerModel } from "../../src/index.js";
// import { adminToken } from "./../admin/Admin.spec.js";
// import { userToken } from "./../user/User.spec.js";
// chai.use(chaiHttp);
// const should = chai.should();
// let image;
// let updatedImage;
// let bannerId;
// let gameId = '65268d56a84590a59bb33312';
// let filePath = path.join(path.resolve(), 'public/uploads/');
// let bannerDetails = {
//     bannerName: "Test Demo",
//     bannerDescription: "Test description",
//     image: path.join(path.resolve(), 'test/image/Blue-Banner.jpg')
// }


// describe("Common apis test case", () => {

//     // // Banner Created
//     // it("Add banner api", (done) => {
//     //     chai.request(appServer)
//     //         .post('/api/common/banner-add-edit')
//     //         .set('auth', userToken ? userToken : adminToken)
//     //         .field({ bannerName: bannerDetails.bannerName, bannerDescription: bannerDetails.bannerDescription })
//     //         .attach('image', bannerDetails.image)
//     //         .end((err, res) => {
//     //             if (res.body.status == 201) {
//     //                 bannerId = res.body.data._id
//     //                 image = res.body.data.bannerImage
//     //                 expect(res.body.status).to.be.equal(201);
//     //             } else if (res.body.status == 404) {
//     //                 expect(res.body.status).to.be.equal(404);
//     //             } else if (res.body.status == 401) {
//     //                 expect(res.body.status).to.be.equal(401);
//     //             } else {
//     //                 expect(res.body.status).to.be.equal(500);
//     //             }
//     //             expect(res.body).to.have.all.keys('status', 'message', 'data')
//     //             fs.unlinkSync(filePath + image);
//     //             done();
//     //         })
//     // })

//     // // Banner Updated
//     // it("Updated banner api", (done) => {
//     //     chai.request(appServer)
//     //         .post(`/api/common/banner-add-edit?bannerId=${bannerId}`)
//     //         .set('auth', userToken ? userToken : adminToken)
//     //         .field({ bannerName: "Test banner update", bannerDescription: bannerDetails.bannerDescription })
//     //         .attach('image', bannerDetails.image)
//     //         .end((err, res) => {
//     //             if (res.body.status == 200) {
//     //                 updatedImage = res.body.data.bannerImage
//     //                 expect(res.body.status).to.be.equal(200);
//     //             } else if (res.body.status == 404) {
//     //                 expect(res.body.status).to.be.equal(404);
//     //             } else if (res.body.status == 401) {
//     //                 expect(res.body.status).to.be.equal(401);
//     //             } else {
//     //                 expect(res.body.status).to.be.equal(500);
//     //             }
//     //             expect(res.body).to.have.all.keys('status', 'message', 'data')
//     //             fs.unlinkSync(filePath + updatedImage);
//     //             done();
//     //         })
//     // });

//     // // Banner Get
//     // it("Get banner api", (done) => {
//     //     chai.request(appServer)
//     //         .get("/api/common/banners")
//     //         .set('auth', userToken ? userToken : adminToken)
//     //         .end((err, res) => {
//     //             if (res.body.status == 200) {
//     //                 expect(res.body.status).to.be.equal(200);
//     //             } else if (res.body.status == 404) {
//     //                 expect(res.body.status).to.be.equal(404);
//     //             } else if (res.body.status == 401) {
//     //                 expect(res.body.status).to.be.equal(401);
//     //             } else {
//     //                 expect(res.body.status).to.be.equal(500);
//     //             }
//     //             expect(res.body).to.have.all.keys('status', 'message', 'data')
//     //             done();
//     //         })
//     // });
//     // // Banner Delete
//     // it("Delete banner api", (done) => {
//     //     chai.request(appServer)
//     //         .post("/api/common/banner-delete")
//     //         .set('auth', userToken ? userToken : adminToken)
//     //         .send({ bannerId })
//     //         .end((err, res) => {
//     //             if (res.body.status == 200) {
//     //                 expect(res.body.status).to.be.equal(200);
//     //             } else if (res.body.status == 404) {
//     //                 expect(res.body.status).to.be.equal(404);
//     //             } else if (res.body.status == 401) {
//     //                 expect(res.body.status).to.be.equal(401);
//     //             } else {
//     //                 expect(res.body.status).to.be.equal(500);
//     //             }
//     //             expect(res.body).to.have.all.keys('status', 'message', 'data')
//     //             done();
//     //         })
//     // });

//     // //#region Currency List api
//     // it("Currency List api", (done) => {
//     //     chai.request(appServer)
//     //         .get("/api/common/get-all-currency")
//     //         .end((err, res) => {
//     //             if (res.body.status == 200) {
//     //                 expect(res.body.status).to.be.equal(200);
//     //             } else if (res.body.status == 404) {
//     //                 expect(res.body.status).to.be.equal(404);
//     //             } else if (res.body.status == 401) {
//     //                 expect(res.body.status).to.be.equal(401);
//     //             } else {
//     //                 expect(res.body.status).to.be.equal(500);
//     //             }
//     //             expect(res.body).to.have.all.keys('status', 'message', 'data')
//     //             done();
//     //         })
//     // });
//     // //#endregion

//     // //#region Get single game time
//     // it("Get single game time", (done) => {
//     //     chai.request(appServer)
//     //         .get(`/api/common/get-single-game-time/${gameId}`)
//     //         .end((err, res) => {
//     //             if (res.body.status == 200) {
//     //                 expect(res.body.status).to.be.equal(200);
//     //             } else if (res.body.status == 404) {
//     //                 expect(res.body.status).to.be.equal(404);
//     //             } else if (res.body.status == 401) {
//     //                 expect(res.body.status).to.be.equal(401);
//     //             } else {
//     //                 expect(res.body.status).to.be.equal(500);
//     //             }
//     //             expect(res.body).to.have.all.keys('status', 'message', 'data')
//     //             done();
//     //         })
//     // });
//     // //#endregion

//     //#region get-periods-details-all-game
//     it("Get period details all games", (done) => {
//         chai.request(appServer)
//             .get(`/api/common/get-periods-details-all-game`)
//             .set('auth',adminToken)
//             .end((err, res) => {
//                 // console.log('res',res);
//                 if (res.body.status == 200) {
//                     expect(res.body.status).to.be.equal(200);
//                 } else if (res.body.status == 404) {
//                     expect(res.body.status).to.be.equal(404);
//                 } else if (res.body.status == 401) {
//                     expect(res.body.status).to.be.equal(401);
//                 } else {
//                     expect(res.body.status).to.be.equal(500);
//                 }
//                 expect(res.body).to.have.all.keys('status', 'message', 'data')
//                 done();
//             })
//     })
//     //#endregion

//     // (async function (){
//     //     await BannerModel.deleteOne({ bannerName: "Test banner update" });
//     // })()
//     // const deleteTestBanner = async () => {
//     //     await BannerModel.deleteOne({ bannerName: "Test banner update" });
//     // }
//     // deleteTestBanner();

// })