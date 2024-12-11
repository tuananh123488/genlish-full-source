function removeVietnameseTones(str) {
    return str
        .normalize("NFD") // Tách các ký tự tổ hợp (dấu)
        .replace(/[\u0300-\u036f]/g, '') // Xóa dấu
        .replace(/đ/g, 'd') // Thay thế 'đ' thành 'd'
        .replace(/Đ/g, 'D') // Thay thế 'Đ' thành 'D'
        .replace(/[^a-zA-Z0-9\s-]/g, '') // Loại bỏ các ký tự đặc biệt nhưng giữ lại dấu '-'
        .trim(); // Loại bỏ khoảng trắng dư thừa
};

module.exports = { removeVietnameseTones }