const ANKI_CONNECT_API = "http://127.0.0.1:8765";

const invoke = async (action, version = 6, params = {}) => {
    await fetch(ANKI_CONNECT_API, {
        method: "POST",
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({ action, version, params }),
    });
};

const addCard = async (deckName, modelName, cardInfo) => {
    const { front, back, phonetic_symbols, family_words, synonyms, example, english_meaning, image, audio } = cardInfo;
    await invoke("addNote", 6, {
        note: {
            deckName,
            modelName,
            fields: {
                "Mặt trước": front,
                "Mặt sau": back,
                "Phiên âm": phonetic_symbols,
                "Họ từ vựng": family_words,
                "Từ đồng nghĩa": synonyms,
                "Ví dụ": example,
                "Nghĩa tiếng anh": english_meaning,
            },
            options: {
                allowDuplicate: true,
            },
            picture: [
                {
                    url: image,
                    filename: `${front}.jpeg`,
                    fields: ["Hình ảnh"],
                },
            ],
            audio: [
                {
                    url: audio,
                    filename: `${front}.mp3`,
                    fields: ["MP3 Phát âm"],
                },
            ],
        },
    }).catch((err) => console.log(err));
};

export default addCard;
