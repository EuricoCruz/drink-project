const cloudinary = require('cloudinary');
const cloudinaryStorage = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

let storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: 'drinkbuddy', // The name of the folder in cloudinary
  allowedFormats: ['jpg', 'png', 'jpeg'],
  filename: function (req, file, cb) {
    cb(null, file.filename); // The file on cloudinary would have the same name as the original file name
  }
});

const uploadCloud = multer({ storage: storage });

let storageUser = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: 'userBuddy', // The name of the folder in cloudinary
  allowedFormats: ['jpg', 'png'],
  filename: function (req, file, cb) {
    cb(null, file.filename); // The file on cloudinary would have the same name as the original file name
  }
});

const uploadCloudUser = multer({ storage: storageUser });

module.exports = {uploadCloud, uploadCloudUser};