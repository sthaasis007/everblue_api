const multer = require('multer');
const fs = require('fs');
const path = require('path');
const maxSize = 50 * 1024 * 1024; // 50MB

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        try {
            if (file.fieldname === "profilePicture") {
                const profilePath = path.resolve(__dirname, '..', 'public', 'profile_picture');
                fs.mkdirSync(profilePath, { recursive: true });
                cb(null, profilePath);
                return;
            } else if (file.fieldname === "ItemPhoto") {
                const itemsPath = path.resolve(__dirname, '..', 'public', 'item_photo');
                fs.mkdirSync(itemsPath, { recursive: true });
                cb(null, itemsPath);
                return;
            } else {
                return cb(new Error("Invalid field name for upload"), false);
            }
        } catch (err) {
            return cb(err);
        }
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        let filename;
        
        if (file.fieldname === "profilePicture") {
            const userId = req.user ? req.user._id : "unknown";
            filename = `profile_${userId}${ext}`;
        } else if (file.fieldname === "ItemPhoto") {
            const timestamp = Date.now();
            filename = `item-pic-${timestamp}${ext}`;
        }
        
        cb(null, filename);
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
  limits: { 
    fileSize: maxSize,
    fieldNameSize: 200,
    fieldSize: 200,
    fields: 10,
    files: 10,
  },
});

// Export single upload for backward compatibility
const upload = uploadImage;

module.exports = upload;
module.exports.uploadImage = uploadImage;