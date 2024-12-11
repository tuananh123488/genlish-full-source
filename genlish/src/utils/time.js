export const convertISODurationToSeconds = (duration) => {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);

    const hours = (parseInt(match[1]) || 0);
    const minutes = (parseInt(match[2]) || 0);
    const seconds = (parseInt(match[3]) || 0);

    // Tính tổng số giây
    return hours * 3600 + minutes * 60 + seconds;
};

export const convertSecondsToReadableFormat = (seconds) => {
    const days = Math.floor(seconds / (24 * 3600));
    seconds %= 24 * 3600;
    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    const minutes = Math.floor(seconds / 60);
    seconds %= 60;

    let result = '';
    if (days > 0) result += `${days}d`;
    if (hours > 0) result += `${hours}h`;
    if (minutes > 0) result += `${minutes}m`;

    return result;
};

export const convertSecondsToVietnameseFormat = (seconds) => {
    const days = Math.floor(seconds / (24 * 3600));
    seconds %= 24 * 3600;
    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    const minutes = Math.floor(seconds / 60);

    let result = '';
    if (days > 0) result += `${days} ngày `;
    if (hours > 0) result += `${hours} giờ `;
    if (minutes > 0) result += `${minutes} phút`;

    return result.trim(); // Xóa khoảng trắng thừa ở cuối
};

export const convertSecondsToTimeFormat = (seconds) => {
    const hours = Math.floor(seconds / 3600); // Lấy số giờ
    seconds %= 3600;
    const minutes = Math.floor(seconds / 60); // Lấy số phút
    const remainingSeconds = seconds % 60; // Lấy số giây còn lại

    // Đảm bảo định dạng phút và giây luôn có 2 chữ số
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;

    // Nếu giờ bằng 0, chỉ trả về phút và giây
    if (hours === 0) {
        return `${formattedMinutes}:${formattedSeconds}`;
    }

    // Trả về giờ:phút:giây
    return `${hours}:${formattedMinutes}:${formattedSeconds}`;
};

export const formatDate = (isoString) => {
    const date = new Date(isoString);

    const day = date.getDate();
    const month = date.getMonth() + 1; // Lấy tháng, cần cộng thêm 1 vì getMonth() trả về giá trị từ 0-11
    const year = date.getFullYear();

    return `Ngày ${day} tháng ${month} năm ${year}`;
};

export const formatDateTime = (isoString) => {
    const date = new Date(isoString);

    // Lấy giờ và phút
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');

    // Lấy ngày, tháng và năm
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // Tháng bắt đầu từ 0 nên cần +1
    const year = date.getUTCFullYear();

    // Trả về định dạng: 20:25 15-10-2024
    return `${hours}:${minutes} ${day}-${month}-${year}`;
};



export function formatDateNotify(isoString) {
    const date = new Date(isoString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Tháng bắt đầu từ 0
    const year = date.getFullYear();

    return `${hours}:${minutes} ${day}/${month}/${year}`;
}