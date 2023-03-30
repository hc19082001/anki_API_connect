import { invoke } from "./addNewCard.js";

export default async function () {
    const data = await invoke("deckNames");
    return data.result;
}
