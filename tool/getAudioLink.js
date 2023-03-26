import { MERRIAM_WEBSTER_API_KEY } from "../assets/api_key.js";

const checkbig = /^(big)/;
const checkgg = /^(gg)/;
const checknumber = /^[0-9]|[^A-Za-z0-9]/;

export const getAudioLink = (audio_value) => {
    let subdirectory;
    checkbig.test(audio_value)
        ? (subdirectory = "big")
        : checkgg.test(audio_value)
        ? (subdirectory = "gg")
        : checknumber.test(audio_value)
        ? (subdirectory = "number")
        : (subdirectory = audio_value[0]);
    return `https://media.merriam-webster.com/audio/prons/en/us/mp3/${subdirectory}/${audio_value}.mp3?key=${MERRIAM_WEBSTER_API_KEY}`;
};
