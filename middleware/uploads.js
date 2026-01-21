const multer = require('multer');
const path = require('path');
const maxSize = 2 * 1024 * 1024; // 2MB

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === "profilePicture") {
            cb(null, path.join("public" , "profile_picture" ));
        } else if (file.fieldname === "ItemPhoto") {
            cb(null, path.join("public" , "item_photo" ));
        } else {
            return cb(new Error("Invalid field name for upload"), false);
        }
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        let prefix = "file";
        if (file.fieldname === "profilePicture") {
            prefix = "pro-pic";
        } else if (file.fieldname === "ItemPhoto") {
            prefix = "item-pic";
        }
        cb(null, `${prefix}-${Date.now()}${ext}`);
    },
});

const fileFilter = (req, file, cb) => {
    if (file.fieldname === "profilePicture" || file.fieldname === "ItemPhoto") {
        console.log("Im here");
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
            cb(new Error("Only image files are allowed!"), false);
            return;
        }
        cb(null, true);
        return;
    } else {
        cb(new Error("Invalid field name for upload"), false);
        return;
    }
};

// For images (profile pictures and item photos)
const uploadImage = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: maxSize },
});

// Export single upload for backward compatibility
const upload = uploadImage;

module.exports = upload;
module.exports.uploadImage = uploadImage;
