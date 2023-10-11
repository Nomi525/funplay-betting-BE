import {
    express, Auth, Upload,
    addEditBanner, deleteBanner, allBannerGet, getSingleGameRule, getAllCurrency
} from "../index.js"
const commonRoutes = express.Router();
// Banner Api for admin and user
commonRoutes.post('/banner-add-edit', Auth, Upload, addEditBanner);
commonRoutes.get('/banners', allBannerGet);
commonRoutes.post('/banner-delete', Auth, deleteBanner);

//#region Get Game Rules
commonRoutes.get('/get-single-game-rule/:gameId', Auth, getSingleGameRule);

//#region Currecny Routes
commonRoutes.get('/get-all-currency', getAllCurrency)
//#endregion

export { commonRoutes }