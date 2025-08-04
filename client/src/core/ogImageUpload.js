import bodyParser from "body-parser";
import multer from "multer";
const crypto = require('crypto');
import sharp from 'sharp';
import { ogImageuploadDir } from "../config";

const ogImageUpload = app => {
    try {
        let storage, upload, file, ext;
        storage = multer.diskStorage({
            destination: ogImageuploadDir,
            filename: function (req, file, cb) {
                crypto.pseudoRandomBytes(16, function (err, raw) {
                    console.log(err, 'err')
                    if (err) return cb(err);

                    switch (file.mimetype) {
                        case 'image/jpeg':
                            ext = '.jpeg';
                            break;
                        case 'image/png':
                            ext = '.png';
                            break;
                        case 'image/jpg':
                            ext = '.jpg';
                            break;
                    }
                    cb(null, raw.toString('hex') + ext);
                })
            }
        })

        upload = multer({ storage: storage });
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json());

        app.post('/uploadOgImage', function (req, res, next) {
            if (!req.user) {
                res.send(403);
            } else {
                next();
            }
        }, upload.single('file'), async (req, res, next) => {
            file = req.file;

            sharp(file.path)
                .resize(1280)
                .toFile(ogImageuploadDir + 'small_' + file.filename, function (err) {
                    console.log("Error from resizing files", err);
                });

            sharp(file.path)
                .resize(1280)
                .toFile(ogImageuploadDir + 'medium_' + file.filename, function (err) {
                    console.log("Error from resizing files", err);
                });

            res.send({ status: 'SuccessFully uploaded!', file });

        });
    } catch (error) {
        console.log(error)
    }
}

export default ogImageUpload;
