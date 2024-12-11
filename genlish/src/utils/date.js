export function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `ngày ${day} tháng ${month} năm ${year}`;
}

export function formatDateTime(dateString) {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `ngày ${day} tháng ${month} năm ${year} lúc ${hours}:${minutes}:${seconds}`;
}

export function getMondayAndSunday() {
    const today = new Date();

    // Tính ngày Thứ Hai
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + 1);

    // Tính ngày Chủ Nhật
    const sunday = new Date(today);
    sunday.setDate(today.getDate() - today.getDay() + 7);

    return {
        monday,
        sunday,
    };
}

export function date1GetterThanDate2(date1, date2) {
    const d1 = new Date(date1)
    const d2 = new Date(date2)
    return d1 >= d2
}