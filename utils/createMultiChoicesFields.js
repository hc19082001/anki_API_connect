import getRandomIndexArray from "../tool/getRandomIndexArray.js";
import { invoke } from "./addNewCard.js";

export default async function (deckName, step = 0) {
    return await invoke("findNotes", 6, {
        query: `deck:"${deckName}"`,
    }).then(async (result) => {
        //~ GET ID OF ALL CARDS IN DECK
        const cardsId = result.result;
        // console.log(cardsId);

        //~ GET ALL INFO OF CARDS
        const dt = await invoke("notesInfo", 6, {
            notes: cardsId,
        });
        // console.log(dt);

        //~ GET ALL VNese MEAN OF WORD
        const a = dt.result.map((card) => card.fields);
        const c = a.map((field) => field["Mặt sau"].value);
        console.log(c);

        //~ GET ALL SYNONYMS OF WORD
        const syns = a.map((card, index) => ({
            id: index,
            sys: card["Từ đồng nghĩa"].value,
        }));
        // console.log(syns);
        const arrHaveSyns = syns
            .filter((syn1) => syn1.sys !== "")
            .map((syn2) => syn2.sys.trim())
            .join(",")
            .split(",");
        console.log(arrHaveSyns);

        //~ SET ACTIONS ARRAY FOR UPDATE
        const arrActions = cardsId.map((cardId, index) => {
            const w_syn = syns.find((syn) => syn.id === index);
            let final_sysn = "";
            let final_means = "";
            if (w_syn.sys) {
                const arrSyns = w_syn.sys.split(",");
                let data = []; // DATA RANDOM
                let arrIndexRandom = [];
                for (let index = 0; index < arrSyns.length + step; index++) {
                    if (arrIndexRandom.length === arrHaveSyns.length - arrSyns.length) {
                        break;
                    } else {
                        let randomIndex = Math.floor(Math.random() * arrHaveSyns.length);
                        while (
                            arrSyns.filter((item) => item === arrHaveSyns[randomIndex]).length > 0 ||
                            arrIndexRandom.includes(randomIndex)
                        ) {
                            randomIndex = Math.floor(Math.random() * arrHaveSyns.length);
                        }
                        data.push(arrHaveSyns[randomIndex]);
                        arrIndexRandom.push(randomIndex);
                    }
                }
                final_sysn = data.join(",");
            }
            console.log("🚀 ~ file: createMultiChoicesFields.js:63 ~ arrActions ~ c:", c);

            if (c.length === 0 || c.length === 1) {
                final_means = "";
            }

            if (c.length === 2) {
                let randomIndex = getRandomIndexArray(2, 1, index);
                final_means = c[randomIndex[0]];
            }

            if (c.length === 3) {
                let randomIndex = getRandomIndexArray(3, 2, index);
                final_means = `${c[randomIndex[0]]}|${c[randomIndex[1]]}`;
            }

            if (c.length > 3) {
                let randomIndex = getRandomIndexArray(c.length, 3, index);
                final_means = `${c[randomIndex[0]]}|${c[randomIndex[1]]}|${c[randomIndex[2]]}`;
            }

            return {
                action: "updateNoteFields",
                version: 6,
                params: {
                    note: {
                        id: cardId,
                        fields: {
                            Choices: `${final_means}`,
                            Syn_Wr_Field: `${final_sysn}`,
                        },
                    },
                },
            };
        });
        //~ UPDATE MULTIPLE CARDS
        const z = await invoke("multi", 6, {
            actions: arrActions,
        });
        return z.result;
    });
}
