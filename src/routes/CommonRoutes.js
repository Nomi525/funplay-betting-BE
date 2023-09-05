import { express, Auth, Upload, addEditBanner,deleteBanner,allBannerGet } from "../index.js"
const commonRoutes = express.Router();
// Banner Api for admin and user
commonRoutes.post('/banner-add-edit', Auth, Upload, addEditBanner);
commonRoutes.get('/banners', allBannerGet);
commonRoutes.post('/banner-delete', Auth, deleteBanner);

export { commonRoutes }