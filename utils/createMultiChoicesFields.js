import getRandomIndexArray from "../tool/getRandomIndexArray.js";
import { invoke } from "./addNewCard.js";

export default function (deckName) {
    invoke("findNotes", 6, {
        query: `deck:"${deckName}"`,
    }).then(async (result) => {
        //~ GET ID OF ALL CARDS IN DECK
        const cardsId = result.result;
        console.log(cardsId);

        //~ GET ALL VNese MEAN OF WORD
        const dt = await invoke("notesInfo", 6, {
            notes: cardsId,
        });
        console.log(dt);

        const a = dt.result.map((card) => card.fields);
        const c = a.map((field) => field["Mặt sau"].value);
        console.log(c);

        //~ SET ACTIONS ARRAY FOR UPDATE
        const arrActions = cardsId.map((cardId, index) => {
            let randomIndex = getRandomIndexArray(c.length, 3, index);
            return {
                action: "updateNoteFields",
                version: 6,
                params: {
                    note: {
                        id: cardId,
                        fields: {
                            Choices: `${c[randomIndex[0]]}|${c[randomIndex[1]]}|${c[randomIndex[2]]}`,
                        },
                    },
                },
            };
        });

        console.log(arrActions);

        //~ UPDATE MULTIPLE CARDS
        const z = await invoke("multi", 6, {
            actions: arrActions,
        });
        console.log(z);
    });
}
