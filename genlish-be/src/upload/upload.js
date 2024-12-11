const multer = require('multer')
const AWS = require('aws-sdk')
const path = require('path')

const storage = multer.memoryStorage({
    destination(req, file, callback) {
        callback(null, "");
    },
});
const upload = multer({
    storage,
    limits: { fileSize: 50000000 }, // Chỉ cho phép file tối đa là 50MB
    fileFilter(req, file, cb) {
        checkFileType(file, cb);
    },
});
function checkFileType(file, cb) {
    // Bỏ qua kiểm tra kiểu file
    // Bạn có thể kiểm tra kích thước file nếu cần
    const allowedSize = 50000000; // 50MB

    // Kiểm tra kích thước file
    if (file.size > allowedSize) {
        return cb("Error: File size exceeds the allowed limit of 50MB");
    }

    // Cho phép tất cả các loại file
    cb(null, true);
}
// Cấu hình AWS
process.env.AWS_SDK_JS_SUPPRESS_MAINTENANCE_MODE_MESSAGE = "1"; // Kể từ 2023 v2 đã deprecated, ta chọn sử dụng aws-sdk javascript v2 thay vì v3
AWS.config.update({
    region: process.env.REGION,
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
});

module.exports = upload