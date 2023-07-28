
import { StatusCodes, ResponseMessage, multer, fs } from '../index.js';

var storage = multer.diskStorage({
    destination: function (request, file, callback) {
        let path = 'public/uploads/';
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path, { recursive: true });
        }
        callback(null, path);
    },
    filename: function (request, file, callback) {
        var ext = file.originalname.split(".");
        callback(
            null,
            Date.now() +
            (Math.random() + 1).toString(36).substring(7) +
            "." +
            ext[ext.length - 1]
        );
    },
});

var upload = multer({ storage }).fields([
    {
        name: "profile",
        maxCount: 1,
    },
    {
        name: "image",
        maxCount: 1,
    }
]);

export default function (req, res, next) {
    upload(req, res, (err) => {
        if (err) {
            return res.status(400).json({
                status: StatusCodes.BAD_REQUEST,
                message: ResponseMessage.SOMETHING_WENT_WRONG,
                data: [err.message],
            });
        } else {
            if (req.files) {
                var profile = req.files.profile ? req.files.profile[0].filename : "";
                req.profileUrl = profile;

                var image = req.files.image ? req.files.image[0].filename : "";
                req.imageUrl = image;
                next();
            } else {
                next();
            }
        }
    });
};