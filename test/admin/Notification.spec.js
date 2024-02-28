// import { chai, chaiHttp, appServer, expect, Notification } from "../../src/index.js";
// import { adminToken } from "./Admin.spec.js";

// chai.use(chaiHttp);

// var notificationDetails = {
//     notificationId: null,
//     title: "test demo",
//     description: "dummt notificaton"
// }

// describe("Admin, Notification test case", () => {

//     //#region Create notification
//     it("Create notification", (done) => {
//         chai.request(appServer)
//             .post('/api/admin/notification-add-edit')
//             .set('auth', adminToken)
//             .send({ title: notificationDetails.title, description: notificationDetails.description })
//             .end((error, res) => {
//                 if (res.body.status == 201) {
//                     notificationDetails.notificationId = res.body.data._id
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

//     //#region Edit notification
//     it("Edit notification", (done) => {
//         notificationDetails.title = "test demo updated"
//         chai.request(appServer)
//             .post('/api/admin/notification-add-edit')
//             .set('auth', adminToken)
//             .send({ notificationId: notificationDetails.notificationId, title: notificationDetails.title, description: notificationDetails.description })
//             .end((error, res) => {
//                 if (res.body.status == 201) {
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

//     //#region Get all notification
//     it("Get all notification", (done) => {
//         chai.request(appServer)
//             .get('/api/admin/notifications')
//             .set('auth', adminToken)
//             .send({})
//             .end((error, res) => {
//                 if (res.body.status == 201) {
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

//     //#region Get single notification
//     it("Get single notification", (done) => {
//         chai.request(appServer)
//             .post('/api/admin/single-notification')
//             .set('auth', adminToken)
//             .send({ notificationId: notificationDetails.notificationId })
//             .end((error, res) => {
//                 if (res.body.status == 201) {
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

//     //#region Delete notification
//     it("Delete notification", (done) => {
//         chai.request(appServer)
//             .post('/api/admin/notification-delete')
//             .set('auth', adminToken)
//             .send({ notificationId: notificationDetails.notificationId })
//             .end((error, res) => {
//                 if (res.body.status == 201) {
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

//     async function deleteDummyNotification() {
//         await Notification.deleteMany({ title: "test demo updated" })
//     }
//     deleteDummyNotification();
// })