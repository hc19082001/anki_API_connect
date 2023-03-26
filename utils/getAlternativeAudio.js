import { MERRIAM_WEBSTER_API_KEY } from "../assets/api_key.js";
import { getAudioLink } from "../tool/getAudioLink.js";

export default async function (word) {
    const def = await fetch(
        `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${MERRIAM_WEBSTER_API_KEY}`,
    );
    const data_def = await def.json();
    return getAudioLink(data_def[0].hwi.prs[0].sound.audio);
}
