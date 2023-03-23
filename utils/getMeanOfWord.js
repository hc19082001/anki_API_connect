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
                switch (item.partOfSpeech) {
                    case "noun":
                        engWordObj.type = 1;
                        break;
                    case "verb":
                        engWordObj.type = 2;
                        break;
                    case "adjective":
                        engWordObj.type = 3;
                        break;
                    case "adverb":
                        engWordObj.type = 4;
                        break;
                    case "preposition":
                        engWordObj.type = 5;
                        break;
                    case "conjunction":
                        engWordObj.type = 6;
                        break;
                    case "interjection":
                        engWordObj.type = 7;
                        break;
                    case "pronoun":
                        engWordObj.type = 8;
                        break;
                    default:
                        engWordObj.type = 9;
                        break;
                }
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
    console.log(merge_en_vn);
    return merge_en_vn;
};

export default getMeanOfWord;

//! API GET WORD INFO VNESE
const getMeanOfWordVNese = async (word) => {
    return fetch(`https://dict.laban.vn/find?type=1&query=${word}`)
        .then((response) => response.text())
        .then((response) => {
            let word = {};
            const laban_container = document.querySelector(".container");
            laban_container.innerHTML = response;
            laban_container.querySelectorAll("script").forEach((item) => item.remove());
            laban_container.querySelectorAll("link").forEach((item) => item.remove());
            word.ipa = laban_container.querySelector(".color-black").textContent;
            word.defs = [];
            laban_container.querySelectorAll(".slide_content:not(.hidden) .bg-grey.bold.font-large.m-top20").forEach((item) => {
                let defObj = {};
                let defArr = [];
                switch (item.textContent) {
                    case "Danh từ":
                        defObj.type = 1;
                        break;
                    case "Động từ":
                        defObj.type = 2;
                        break;
                    case "Tính từ":
                        defObj.type = 3;
                        break;
                    case "Phó từ":
                        defObj.type = 4;
                        break;
                    case "Giới từ":
                        defObj.type = 5;
                        break;
                    case "Liên từ":
                        defObj.type = 6;
                        break;
                    case "Thán từ":
                        defObj.type = 7;
                        break;
                    case "Đại từ":
                        defObj.type = 8;
                        break;
                    default:
                        defObj.type = 9;
                        break;
                }
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
