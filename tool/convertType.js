export default function convertType(type, lang) {
    if (lang === "vi") {
        switch (type) {
            case 1:
                return "Danh từ";
            case 2:
                return "Động từ";
            case 3:
                return "Tính từ";
            case 4:
                return "Phó từ";
            case 5:
                return "Giới từ";
            case 6:
                return "Liên từ";
            case 7:
                return "Thán từ";
            case 8:
                return "Đại từ";
            default:
                return "Khác";
        }
    } else {
        switch (type) {
            case 1:
                return "n";
            case 2:
                return "v";
            case 3:
                return "adj";
            case 4:
                return "adv";
            case 5:
                return "prep";
            case 6:
                return "conj";
            case 7:
                return "interj";
            case 8:
                return "pron";
            default:
                return "oth";
        }
    }
}
