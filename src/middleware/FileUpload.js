
import { StatusCodes, ResponseMessage, multer, fs, sendResponse } from '../index.js';

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
    },
    {
        name: "gameImage",
        maxCount: 1,
    },
    {
        name: "queryDocument",
        maxCount: 1,
    },
    {
        name: "bannerImage",
        maxCount: Infinity,
    },
    {
        name: "communityBettingImage",
        maxCount: 1,
    },
    {
        name: "qrCode",
        maxCount: 1,
    },
    {
        name: "transactionScreenShort",
        maxCount: 1,
    },
    {
        name: "rejectScreenShort",
        maxCount: 1,
    }
    
    
]);

export default function (req, res, next) {
    upload(req, res, (err) => {
        if (err) {
            return sendResponse(res, StatusCodes.BAD_REQUEST, err.message, [])
        } else {
            if (req.files) {
                var profile = req.files.profile ? req.files.profile[0].filename : "";
                req.profileUrl = profile;

                var image = req.files.image ? req.files.image[0].filename : "";
                req.imageUrl = image;

                var gameImage = req.files.gameImage ? req.files.gameImage[0].filename : "";
                req.gameImageUrl = gameImage;

                var queryDocument = req.files.queryDocument ? req.files.queryDocument[0].filename : "";
                req.queryDocumentUrl = queryDocument;

                var bannerImage = req.files.bannerImage || [];
                req.bannerImageUrl = bannerImage.map((file) => file.filename);

                var communityBettingImage = req.files.communityBettingImage ? req.files.communityBettingImage[0].filename : "";
                req.communityBettingImageUrl = communityBettingImage;

                var profile = req.files.profile ? req.files.profile[0].filename : "";
                req.profileUrl = profile;

                var transactionScreenShort = req.files.transactionScreenShort ? req.files.transactionScreenShort[0].filename : "";
                req.transactionScreenShortUrl = transactionScreenShort;

                var rejectScreenShort = req.files.rejectScreenShort ? req.files.rejectScreenShort[0].filename : "";
                req.rejectScreenShortUrl = rejectScreenShort;


                next();
            } else {
                next();
            }
        }
    });
};