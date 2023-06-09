const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

import convertType from "./tool/convertType.js";
import getImageLinksAPI from "./utils/getImageLinkAPI.js";
import getMeanOfWord, { getMeanOfWordVNese } from "./utils/getMeanOfWord.js";
import getExample from "./utils/getExample.js";
import getAudio from "./utils/getAudio.js";
import addCard from "./utils/addNewCard.js";
import { getAudioLink } from "./tool/getAudioLink.js";
import createMultiChoicesFields from "./utils/createMultiChoicesFields.js";
import getAlternativeAudio from "./utils/getAlternativeAudio.js";
import getAllDecksName from "./utils/getAllDecksName.js";

//^ DOM ELEMENTS
const currentDeck = $(".decks .current-deck");
const deckPanel = $(".decks .deck-panel");
const syncChoices = $(".word-search-section .sync");

const word_details = $(".word-details");
const word_search_ip = $(".word-search-section .word-search-ip");

const iptype_image = $$('.images .setting-img input[name="radio-img-type"]');
const ippage_image = $$('.images .setting-img input[name="radio-img-page"]');
const images_anki = $(".frame .image-anki");
const left_arr = $(".frame .arr.arr-left");
const right_arr = $(".frame .arr.arr-right");

const fl_boxs = $(".fl-boxs");
const examples = $(".examples");
const loading_icon = $(".loading");
const loading_bg = $(".loading-bg");

const not_found_word = $(".word-empty");

const audio = $(".audio");
// Anki Template
let image_custom_link;
const anki_review = $(".anki-review");
const anki_card = $(".anki-review .card");
const btn_review = $(".btn-show-hide-review");
const front_anki = $(".card .front-anki");
const back_anki = $(".card .back-anki");
const back_en_anki = $(".card .back-en-anki");
const ipa_anki = $(".card .ipa-anki");
const audio_anki = $(".card .audio-anki");
const audio_anki_mute = $(".card .audio-anki-mute");
const img_anki = $(".card .img-anki");
const exp_anki = $(".card .exp-anki");
const submit = $(".card .submit-addcard");

let wordSearch = "";

let isWrongWord = false;
let currentDeckName = "";

//^ Attr contain data
let eng_def_choose = "";
let vi_def_choose = "";
let ipa = "";
let aud = "";
let img_link = "";
let ex_data = "";
not_found_word.classList.replace("hide", "show-flex");
//^ Utilities
const setImageByLinkAndTitle = (thumb, title, link) => {
    image_custom_link.value = link;
    images_anki.src = thumb;
    images_anki.alt = title;
    img_anki.src = thumb;
    img_anki.alt = thumb;
    img_link = link;
};
const removeFacebookDisplayLink = (arrImageData) => arrImageData.filter((item) => item.displayLink != "www.facebook.com");

const clearData = () => {
    front_anki.innerText = "";
    ipa_anki.innerText = "";
    back_anki.innerText = "";
    back_en_anki.innerText = "";
    exp_anki.innerText = "";
    eng_def_choose = "";
    vi_def_choose = "";
    ipa = "";
    aud = "";
    img_link = "";
    ex_data = "";
};

//* ASSORT
//^ Connect to Anki to get Decks information:
const decks_anki = await getAllDecksName().catch((err) => {
    Swal.fire({
        title: "Lỗi kết nối!",
        text: "Chưa mở ứng dụng Anki",
        icon: "error",
        confirmButtonText: "OK",
    });
});
decks_anki.forEach((deck) => {
    const div = document.createElement("div");
    div.setAttribute("class", "deck");
    div.innerText = deck;
    deckPanel.appendChild(div);
});
syncChoices.addEventListener("click", async (e) => {
    if (currentDeckName === "") {
        Swal.fire({
            title: "Lỗi",
            text: "Chưa chọn deck",
            icon: "error",
            confirmButtonText: "OK",
        });
        return;
    }
    const result = await createMultiChoicesFields(currentDeckName, 2).catch((err) => {
        Swal.fire({
            title: "Lỗi",
            text: err,
            icon: "error",
            confirmButtonText: "OK",
        });
    });
    Swal.fire({
        title: "Thành công",
        text: "Đồng bộ các trường có lựa chọn thành công",
        icon: "success",
        confirmButtonText: "OK",
    });
});
const optionalDeck = $$(".decks .deck-panel .deck");
optionalDeck.forEach((deck) => {
    deck.addEventListener("click", (e) => {
        currentDeckName = deck.textContent;
        currentDeck.textContent = deck.textContent;
    });
});
//^ Handle input
word_search_ip.addEventListener("keypress", async (e) => {
    if (e.key === "Enter") {
        clearData();
        const word = word_search_ip.value.trim();
        wordSearch = word_search_ip.value.trim();
        await handleMeansAndIPASection(word);
        if (!isWrongWord) {
            await handleImageSection(word);
            //^ GET IMAGE LINKS SOURCE
            // ^Handle custom image link field
            image_custom_link.addEventListener("change", () => {
                setImageByLinkAndTitle(image_custom_link.value, image_custom_link.value, image_custom_link.value);
                img_link = image_custom_link.value;
            });
            await handleAudioSection(word);
            await handleExampleSection(word);
        }
    }
});
//^ Handle click to review card
btn_review.addEventListener("click", () => {
    if (!isWrongWord) {
        front_anki.innerText = wordSearch;
        anki_review.style.display = "flex";
        console.log("btn_review.addEventListener");
    }
});
//^ submit add card handle
submit.addEventListener("click", async (e) => {
    if (!isWrongWord) {
        console.log("submit.addEventListener");
        if (currentDeckName === "") {
            Swal.fire({
                title: "Lỗi",
                text: "Chưa chọn deck",
                icon: "error",
                confirmButtonText: "OK",
            });
            return;
        }
        const cardInfoEx = {
            front: wordSearch /* Y */,
            back: vi_def_choose,
            phonetic_symbols: ipa /* Y */,
            family_words: "",
            synonyms: "",
            example: ex_data,
            english_meaning: eng_def_choose /* Y */,
            image: img_link /* Y */,
            audio: aud /* Y */,
        };
        loading_bg.classList.replace("hide", "show-flex");
        await addCard(currentDeckName, "Flash Card", cardInfoEx).catch((err) => {
            console.log(err);
        });
        loading_bg.classList.replace("show-flex", "hide");
        Swal.fire({
            title: "Thành công",
            text: "Đã thêm một từ mới vào deck của bạn",
            icon: "success",
            confirmButtonText: "OK",
        });
        anki_card.style.animation = "move-up 0.3s ease-in-out";
        setTimeout(() => {
            anki_review.style.display = "none";
            anki_card.style.animation = "move-down 0.3s ease-in-out";
        }, 200);
    }
});
//^ Handle close review card when click outside
anki_review.addEventListener("click", (e) => {
    if (!isWrongWord) {
        console.log("anki_review.addEventListener");
        if (e.target.contains(anki_review)) {
            anki_card.style.animation = "move-up 0.3s ease-in-out";
            setTimeout(() => {
                anki_review.style.display = "none";
                anki_card.style.animation = "move-down 0.3s ease-in-out";
            }, 200);
        }
    }
});
word_search_ip.addEventListener("click", async (e) => {
    e.target.select();
});
//* ASSORT

//^ Handle UI logic
async function handleImageSection(word) {
    image_custom_link = $(".setting-img .image-custom-link");
    const fetchImagesData = await getImageLinksAPI(word).catch((err) => alert(err));
    let arrImagesData = removeFacebookDisplayLink(fetchImagesData);
    //^ SET FIRST IMAGE TO FRAME AND ENABLE LEFT AND RIGHT ARROW
    let imageIndex = 0;
    setImageByLinkAndTitle(
        arrImagesData[imageIndex].image.thumbnailLink,
        arrImagesData[imageIndex].title,
        arrImagesData[imageIndex].link,
    );
    left_arr.classList.add("show");
    right_arr.classList.add("show");
    right_arr.addEventListener("mousedown", () => {
        if (imageIndex < arrImagesData.length - 1) {
            imageIndex++;
        } else {
            imageIndex = 0;
        }
        setImageByLinkAndTitle(
            arrImagesData[imageIndex].image.thumbnailLink,
            arrImagesData[imageIndex].title,
            arrImagesData[imageIndex].link,
        );
    });
    left_arr.addEventListener("mousedown", () => {
        if (imageIndex > 0) {
            imageIndex--;
        } else {
            imageIndex = arrImagesData.length - 1;
        }
        setImageByLinkAndTitle(
            arrImagesData[imageIndex].image.thumbnailLink,
            arrImagesData[imageIndex].title,
            arrImagesData[imageIndex].link,
        );
    });
    //^ Set event for radio button 'type'
    iptype_image.forEach((radio) => {
        radio.addEventListener("change", async (e) => {
            images_anki.src = "https://hackernoon.com/images/0*4Gzjgh9Y7Gu8KEtZ.gif";
            left_arr.classList.remove("show");
            right_arr.classList.remove("show");
            let checked_page;
            ippage_image.forEach((radio) => {
                if (radio.checked) {
                    checked_page = radio.value;
                    return;
                }
            });
            const fetchData = await getImageLinksAPI(word, checked_page, radio.value).catch((err) => alert(err));
            arrImagesData = removeFacebookDisplayLink(fetchData);
            imageIndex = 0;
            setImageByLinkAndTitle(
                arrImagesData[imageIndex].image.thumbnailLink,
                arrImagesData[imageIndex].title,
                arrImagesData[imageIndex].link,
            );
            left_arr.classList.add("show");
            right_arr.classList.add("show");
        });
    });
    ippage_image.forEach((radio) => {
        radio.addEventListener("change", async (e) => {
            images_anki.src = "https://hackernoon.com/images/0*4Gzjgh9Y7Gu8KEtZ.gif";
            left_arr.classList.remove("show");
            right_arr.classList.remove("show");
            let checked_type;
            iptype_image.forEach((radio) => {
                if (radio.checked) {
                    checked_type = radio.value;
                    return;
                }
            });
            const fetchData = await getImageLinksAPI(word, radio.value, checked_type).catch((err) => alert(err));
            arrImagesData = removeFacebookDisplayLink(fetchData);
            imageIndex = 0;
            setImageByLinkAndTitle(
                arrImagesData[imageIndex].link,
                arrImagesData[imageIndex].title,
                arrImagesData[imageIndex].link,
            );
            left_arr.classList.add("show");
            right_arr.classList.add("show");
        });
    });
}
async function handleMeansAndIPASection(word) {
    loading_bg.classList.replace("hide", "show-flex");
    //^ GET DATA OF MEANINGS SECTION
    const word_data = await getMeanOfWord(word).catch((err) => {
        console.log(err);
        return;
    });
    if (word_data.defs.length == 0) {
        isWrongWord = true;
        word_details.classList.replace("block", "hide");
        not_found_word.classList.replace("hide", "show-flex");
    } else {
        isWrongWord = false;
        not_found_word.classList.replace("show-flex", "hide");
        word_details.classList.replace("hide", "block");
        let HTMLs = "";
        //^ Handle get IPA
        ipa = word_data.ipa;
        ipa_anki.innerText = ipa;
        word_data.defs.forEach((item) => {
            let en_base = `<div class="fl-options en">
        ${item.en ? item.en.map((item1) => `<div class="sub-option"><span>${item1}</span></div>`).join("") : ""}
                    </div>`;
            let vi_base = `<div class="fl-options vi">
                ${item.vi ? item.vi.map((item1) => `<div class="sub-option"><span>${item1}</span></div>`).join("") : ""}
                    </div>`;
            let base = `
                <div class="fl-box ${convertType(item.type, "en")}">
                <h1 class="fl">${convertType(item.type, "vi")}</h1>
                <div class="options">
                ${en_base}
                ${vi_base}
                </div>
            </div>`;
            HTMLs += base;
        });
        loading_bg.classList.replace("show-flex", "hide");
        fl_boxs.innerHTML = HTMLs;

        //^ Handle click defintion
        const en_defs = $$(".fl-options.en .sub-option");
        const vi_defs = $$(".fl-options.vi .sub-option");
        const frame = $$(".fl-box");

        en_defs.forEach((def) => {
            def.addEventListener("mousedown", (e) => {
                en_defs.forEach((def) => def.classList.remove("hightlight"));
                def.classList.add("hightlight");
                eng_def_choose = def.innerText;
                back_en_anki.innerText = eng_def_choose;
            });
        });

        vi_defs.forEach((def) => {
            def.addEventListener("mousedown", (e) => {
                vi_defs.forEach((def) => def.classList.remove("hightlight"));
                def.classList.add("hightlight");
                frame.forEach((frame) => frame.classList.remove("frame-hightlight"));
                const mostParent = def.parentNode.parentNode.parentNode;
                mostParent.classList.add("frame-hightlight");
                vi_def_choose = `(${mostParent.className.split(" ")[1]}) ${def.innerText}`;
                back_anki.innerText = vi_def_choose;
            });
        });
    }
    loading_bg.classList.replace("show-flex", "hide");
}
async function handleAudioSection(word) {
    //^ Render audio
    const audio_dom1 = await getAudio(word).catch((err) => {
        console.log(err);
    });
    const audio_dom2 = await getAlternativeAudio(word).catch((err) => {
        console.log(err);
    });
    if (audio_dom1 || audio_dom2) {
        audio_anki.style.display = "inline";
        audio_anki_mute.style.display = "none";
        aud = audio_dom1 ? audio_dom1 : audio_dom2;
        audio.innerHTML = `<audio controls>
                <source src="${audio_dom1 ? audio_dom1 : audio_dom2}" type="audio/mp3" />
                Your browser does not support the audio element.
                </audio>`;
    } else {
        audio_anki.style.display = "none";
        audio_anki_mute.style.display = "inline";
        audio.innerHTML = `<h1>We can't find audio source</h1>`;
    }
}
async function handleExampleSection(word) {
    //^ Render examples
    loading_icon.style.display = "inline-block";
    const exs = await getExample(word).catch((err) => {
        console.log(err);
    });
    loading_icon.style.display = "none";
    examples.innerHTML = exs
        .map(
            (item) => `<div class="example">
                            <li>${item.en}</li>
                            <span>(${item.vi})</span>
                       </div>`,
        )
        .join("");
    const exs_dom = $$(".examples .example");
    exs_dom.forEach((ex) => {
        ex.addEventListener("mousedown", (e) => {
            exs_dom.forEach((ex) => ex.classList.remove("frame-hightlight"));
            ex.classList.add("frame-hightlight");
            ex_data = ex.querySelector("li").innerHTML;
            exp_anki.innerHTML = ex_data;
        });
    });
}
