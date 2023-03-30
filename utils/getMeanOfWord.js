import { mergeAttributevi, mergeAndAddnewAttribute, mergeAttributeen } from "../tool/mergeAttrb.js";

// 1: N, 2:V, 3: Adj, 4: Adv, 5: prep, 6: conj, 7: interj, 8 : pronoun, 9: other
//! API GET WORD INFO ENGLISH & VNESE
const getMeanOfWord = async (word) => {
    const [eng_mean, vi_mean] = await Promise.all([
        fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`),
        getMeanOfWordVNese(word),
    ]);
    let eng_obj = {};
    let arrWord = [];
    if (eng_mean.status != 404) {
        const data = await eng_mean.json();
        data.forEach((item) => {
            item.meanings.forEach((item) => {
                let engWordObj = {};
                let tmpArr = [];
                engWordObj.type = getType(item.partOfSpeech);
                item.definitions.forEach((def) => {
                    tmpArr.push(def.definition);
                });
                engWordObj.en = tmpArr;
                arrWord.push(engWordObj);
            });
        });
        eng_obj.defs = mergeAttributeen(arrWord);
    } else {
        eng_obj = { defs: [] };
    }
    const merge_en_vn = { ipa: vi_mean.ipa, defs: mergeAndAddnewAttribute(eng_obj.defs, vi_mean.defs) };
    return merge_en_vn;
};

export default getMeanOfWord;

//! MERGE DECTIONARY FROM SOHA AND LABAN
export const getMeanOfWordVNese = async (word) => {
    const [soha, laban] = await Promise.all([getMeanOfWordVNeseSoha(word), getMeanOfWordVNeseLaban(word)]);
    const merge = { ipa: laban.ipa, defs: mergeAttributevi([...laban.defs, ...soha.defs]) };
    return merge;
};

//! API GET WORD INFO VNESE (LABAN)
const getMeanOfWordVNeseLaban = async (word) => {
    return fetch(`https://dict.laban.vn/find?type=1&query=${word}`)
        .then((response) => response.text())
        .then((response) => {
            let word = {};
            const laban_container = document.querySelector(".container");
            laban_container.innerHTML = response;
            laban_container.querySelectorAll("script").forEach((item) => item.remove());
            laban_container.querySelectorAll("link").forEach((item) => item.remove());
            word.ipa = laban_container.querySelector(".color-black")
                ? laban_container.querySelector(".color-black").textContent
                : "";
            word.defs = [];
            laban_container.querySelectorAll(".slide_content:not(.hidden) .bg-grey.bold.font-large.m-top20").forEach((item) => {
                let defObj = {};
                let defArr = [];
                defObj.type = getType(item.textContent);
                let current = item.nextElementSibling;
                while (!current.className) {
                    current = current.nextElementSibling;
                }
                while (current.className != "bg-grey bold font-large m-top20") {
                    if (current.className == "green bold margin25 m-top15") {
                        defArr.push(current.textContent);
                    }
                    if (current.nextElementSibling && current.nextElementSibling.className != "bg-grey bold font-large m-top20") {
                        current = current.nextElementSibling;
                    } else {
                        defObj.vi = defArr;
                        word.defs.push(defObj);
                        break;
                    }
                }
            });
            const newDefsMerged = mergeAttributevi(word.defs);
            return { ...word, defs: newDefsMerged };
        });
};

//! API GET WORD INFO VNESE (SOHA)
async function getMeanOfWordVNeseSoha(word) {
    const result = await fetch(`http://tratu.soha.vn/dict/en_vn/${word}`);
    const data = await result.text();
    const soha_container = document.getElementById("soha");
    soha_container.innerHTML = data;
    soha_container.querySelectorAll("script").forEach((item) => item.remove());
    soha_container.querySelectorAll("link").forEach((item) => item.remove());
    const frame = soha_container.querySelector(".main-content #content-main #bodyContent");
    let ovr = { ipa: "", defs: [] };
    ovr.ipa = frame.querySelector("#bodyContent > #content-5")
        ? frame.querySelector("#bodyContent > #content-5").textContent
        : null; //IPA
    const formBlocks = frame.querySelectorAll("#show-alter #content-3")[0]
        ? frame.querySelectorAll("#show-alter #content-3")
        : frame.querySelectorAll("#show-alter #content-5");
    const forms = [];
    formBlocks.forEach((item) => {
        const form = item.querySelector("h3") ? item.querySelector("h3").textContent : item.querySelector("h5").textContent;
        let obj2 = [];
        if (
            form?.trim().toLocaleLowerCase() !== "hình thái từ" &&
            form?.trim().toLocaleLowerCase() !== "cấu trúc từ" &&
            form?.trim().toLocaleLowerCase() !== "hìmh thái từ"
        ) {
            const obj = { type: 0, vi: [] };
            obj.type = getType(form); // TYPE
            if (form?.trim().toLocaleLowerCase().includes("&")) {
                const arr = form?.split(" & ");
                arr?.forEach((item) => {
                    if (getType(item) !== obj.type) {
                        obj2.push(getType(item));
                    }
                });
            }
            item.querySelectorAll("#content-5").forEach((mean) => {
                const meanText = mean.querySelector("h5")?.textContent; // MEANS
                if (obj2.length > 0) {
                    obj2.forEach((item) => {
                        forms.push({ type: item, vi: [meanText] });
                    });
                }
                if (obj.type === 2) {
                    if (form?.trim().toLocaleLowerCase().includes("ngoại động từ")) {
                        obj.vi.push("[V.t]" + meanText);
                        return;
                    } else if (form?.trim().toLocaleLowerCase().includes("nội động từ")) {
                        obj.vi.push("[V.i]" + meanText);
                        return;
                    }
                }
                obj.vi.push(meanText);
            });
            forms.push(obj);
        }
    });
    ovr.defs = forms;
    const newDefsMerged = mergeAttributevi(ovr.defs);
    return { ...word, defs: newDefsMerged };
}

//! TOOL ASORT ATTRIBUTE
const getType = (text) => {
    let type = 10;
    const textCut = text?.trim().toLocaleLowerCase();
    if (textCut.includes("danh từ") || textCut.includes("noun")) {
        type = 1;
    }
    if (textCut.includes("động từ") || textCut.includes("verb")) {
        type = 2;
    }
    if (textCut.includes("tính từ") || textCut.includes("adjective")) {
        type = 3;
    }
    if (textCut.includes("phó từ") || textCut.includes("adverb")) {
        type = 4;
    }
    if (textCut.includes("giới từ") || textCut.includes("preposition")) {
        type = 5;
    }
    if (textCut.includes("liên từ") || textCut.includes("conjunction")) {
        type = 6;
    }
    if (textCut.includes("thán từ") || textCut.includes("interjection")) {
        type = 7;
    }
    if (textCut.includes("đại từ") || textCut.includes("pronoun")) {
        type = 8;
    }
    if (textCut.includes("định từ") || textCut.includes("determiner")) {
        type = 9;
    }
    return type;
};
