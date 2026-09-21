const multer = require("multer");

const {
  CloudinaryStorage,
} = require("multer-storage-cloudinary");

const cloudinary =
  require("cloudinary").v2;


// ========================================
// CLOUDINARY CONFIGURATION
// ========================================

cloudinary.config({
  cloud_name:
    process.env.CLOUDINARY_CLOUD_NAME,

  api_key:
    process.env.CLOUDINARY_API_KEY,

  api_secret:
    process.env.CLOUDINARY_API_SECRET,
});


// ========================================
// CLOUDINARY STORAGE
// ========================================

const storage =
  new CloudinaryStorage({

    cloudinary: cloudinary,

    params: {
      folder: "tripvault",

      allowed_formats: [
        "jpg",
        "jpeg",
        "png",
        "webp",
      ],
    },

  });


// ========================================
// MULTER
// ========================================

const upload = multer({

  storage: storage,

  limits: {
    fileSize:
      5 * 1024 * 1024,
  },

});


// ========================================
// EXPORT
// ========================================

module.exports = upload;