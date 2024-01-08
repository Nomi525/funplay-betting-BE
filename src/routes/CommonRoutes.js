import {
  express,
  Auth,
  Upload,
  addEditBanner,
  deleteBanner,
  allBannerGet,
  getSingleGameRule,
  getAllCurrency,
  getSingleGameTime,
  getPeriodsDetailsForAllGame,
  getAllGameRecodesGameWise,
  getChat,
  uploadImage,
} from "../index.js";
const commonRoutes = express.Router();
// Banner Api for admin and user
commonRoutes.post("/banner-add-edit", Auth, Upload, addEditBanner);
commonRoutes.get("/banners", allBannerGet);
commonRoutes.post("/banner-delete", Auth, deleteBanner);

//#region Get Game Rules
commonRoutes.get("/get-single-game-rule/:gameId", Auth, getSingleGameRule);

//#region Currecny Routes
commonRoutes.get("/get-all-currency", getAllCurrency);
//#endregion

//#region Get single game time
commonRoutes.get("/get-single-game-time/:gameId", getSingleGameTime);

//#region
commonRoutes.get(
  "/get-periods-details-all-game",
  Auth,
  getPeriodsDetailsForAllGame
);

//#region Get All Game period records game wise
commonRoutes.get(
  "/get-all-periods-game-wise/:gameType/:gameId",
  Auth,
  getAllGameRecodesGameWise
);
commonRoutes.get("/get-chat", getChat);
commonRoutes.post("/upload-image", Upload, uploadImage);

export { commonRoutes };
