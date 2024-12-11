export function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Hoán đổi các phần tử
    }
    return array;
}

export function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function formatMoney(num) {
    if (num === 0) {
        return '0 '
    }
    if (num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
}

export const removeVietnameseTones = (str) => {
    return str
        .normalize("NFD") // Tách các ký tự tổ hợp (dấu)
        .replace(/[\u0300-\u036f]/g, '') // Xóa dấu
        .replace(/đ/g, 'd') // Thay thế 'đ' thành 'd'
        .replace(/Đ/g, 'D') // Thay thế 'Đ' thành 'D'
        .replace(/[^a-zA-Z0-9\s-]/g, '') // Loại bỏ các ký tự đặc biệt nhưng giữ lại dấu '-'
        .trim(); // Loại bỏ khoảng trắng dư thừa
};

export const getPosition = (width, index) => {
    const end = width / 3
    const a = index % 5
    const b = Math.floor(index / 5) % 2
    if (index === 21) {
        return 0
    }
    if (b === 0) {
        if (index < 10) {
            switch (a) {
                case 1:
                    return 0
                case 2:
                    return end / 2
                case 3:
                    return end - (end / 4)
                case 4:
                    return end / 2
                case 5:
                    return 0
            }
        } else {
            switch (a) {
                case 0:
                    return end / 2
                case 1:
                    return end - (end / 4)
                case 2:
                    return end / 2
                case 3:
                    return 0
                case 4:
                    return -end / 2
                case 5:
                    return (end - (end / 4)) * -1
            }
        }
    } else {
        if (index < 10) {
            switch (a) {
                case 1:
                    return -end / 2
                case 2:
                    return (end - (end / 4)) * -1
                case 3:
                    return -end / 2
                case 4:
                    return 0
            }
        } else {
            switch (a) {
                case 0:
                    return (end - (end / 4)) * -1
                case 1:
                    return -end / 2
                case 2:
                    return 0
                case 3:
                    return end / 2
                case 4:
                    return (end - (end / 4))
            }
        }
    }
}

// Mảng cho các câu phản hồi đúng
export const correctResponses = [
    "Correct!",
    "Very good!",
    "Well done!",
    "Excellent!",
    "Outstanding!",
    "Perfect!",
    "Spot on!",
    "Great job!",
    "Not bad at all!",
    "Top-notch!"
];

// Mảng cho các câu phản hồi sai
export const incorrectResponses = [
    "That's okay, try again!",
    "Keep trying, you can do it!",
    "You can do better!",
    "Not quite, but don't give up!",
    "Take another look!",
    "Close, but not quite right!",
    "Not correct, but keep going!",
    "Give it another try!",
    "Don't worry, you'll get it next time!",
    "Try once more!"
];


export function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}


export function parseISO8601Duration(durationString) {
    const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
    const matches = durationString?.match(regex);

    if (matches !== null) {
        const hours = parseInt(matches[1]) || 0;
        const minutes = parseInt(matches[2]) || 0;
        const seconds = parseInt(matches[3]) || 0;

        return hours * 3600 + minutes * 60 + seconds;
    } else {
        return 0;
    }
}

export function removeSpecialChars(str) {
    // Biểu thức chính quy để khớp với tất cả các ký tự đặc biệt
    const specialCharsRegex = /[\/\\.,\-()'"[\]{}_+=*!@#$%^&~|;:?]/g;
    return str.replace(specialCharsRegex, '');
}
export const dateCrateComment = (dateString) => {
    const date = new Date(dateString);
    const currentDate = new Date();

    // Tính toán sự khác biệt giữa hai thời điểm
    const differenceInTime = currentDate.getTime() - date.getTime();

    // Chuyển đổi sự khác biệt từ mili giây sang ngày, giờ, phút và giây
    const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));
    const differenceInHours = Math.floor((differenceInTime % (1000 * 3600 * 24)) / (1000 * 3600));
    const differenceInMinutes = Math.floor((differenceInTime % (1000 * 3600)) / (1000 * 60));
    const differenceInSeconds = Math.floor((differenceInTime % (1000 * 60)) / 1000);

    if (differenceInDays > 0) {
        return `${differenceInDays} ngày trước`;
    } else if (differenceInHours > 0) {
        return `${differenceInHours} giờ trước`;
    } else if (differenceInMinutes > 0) {
        return `${differenceInMinutes} phút trước`;
    } else {
        return `${differenceInSeconds} giây trước`;
    }
};

export const typePayments = {
    studentTranfer: 'STUDENT_TRANFER',
    waitingForTeacher: 'WAITING_FOR_TEACHER',
    moneyToTeacher: 'MONEY_TO_TEACHER'
}