
const multer = require('multer');

const storage = multer.memoryStorage(); // đọc file từ memory
const upload = multer({ storage });

module.exports = upload;
