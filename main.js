const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

import convertType from "./tool/convertType.js";
import getImageLinksAPI from "./utils/getImageLinkAPI.js";
import getMeanOfWord from "./utils/getMeanOfWord.js";
import getExample from "./utils/getExample.js";
import getAudio from "./utils/getAudio.js";
import addCard from "./utils/addNewCard.js";

//^ DOM ELEMENTS
const iptype_image = $$('.images .setting-img input[name="radio-img-type"]');
const ippage_image = $$('.images .setting-img input[name="radio-img-page"]');
const images_anki = $(".frame .image-anki");
const left_arr = $(".frame .arr.arr-left");
const right_arr = $(".frame .arr.arr-right");
const fl_boxs = $(".fl-boxs");
const examples = $(".examples");
const loading_icon = $(".loading");
const audio = $(".audio");
// Anki Template
const anki_review = $(".anki-review");
const anki_card = $(".anki-review .card");
const btn_review = $(".btn-show-hide-review");
const front_anki = $(".card .front-anki");
const back_anki = $(".card .back-anki");
const back_en_anki = $(".card .back-en-anki");
const ipa_anki = $(".card .ipa-anki");
const audio_anki = $(".card .audio-anki");
const img_anki = $(".card .img-anki");
const exp_anki = $(".card .exp-anki");
const submit = $(".card .submit-addcard");

const WORD_SEARCH = "integrity";

front_anki.innerText = WORD_SEARCH;

//^ Utilities
const setImageByLinkAndTitle = (link, title) => {
    images_anki.src = link;
    images_anki.alt = title;
    img_anki.src = link;
    img_anki.alt = link;
};
const removeFacebookDisplayLink = (arrImageData) => arrImageData.filter((item) => item.displayLink != "www.facebook.com");

//^ Attr contain data
let eng_def_choose = "";
let vi_def_choose = "";
let ipa = "";
let aud = "";
let img_link = "";
let ex_data = "";

//^ GET IMAGE LINKS SOURCE
const fetchImagesData = await getImageLinksAPI(WORD_SEARCH).catch((err) => alert("Rate Limit Exceeded!"));
let arrImagesData = removeFacebookDisplayLink(fetchImagesData);
//^ SET FIRST IMAGE TO FRAME AND ENABLE LEFT AND RIGHT ARROW
let imageIndex = 0;
setImageByLinkAndTitle(arrImagesData[imageIndex].image.thumbnailLink, arrImagesData[imageIndex].title);
left_arr.classList.add("show");
right_arr.classList.add("show");

right_arr.addEventListener("mousedown", () => {
    if (imageIndex < arrImagesData.length - 1) {
        imageIndex++;
    } else {
        imageIndex = 0;
    }
    setImageByLinkAndTitle(arrImagesData[imageIndex].image.thumbnailLink, arrImagesData[imageIndex].title);
});
left_arr.addEventListener("mousedown", () => {
    if (imageIndex > 0) {
        imageIndex--;
    } else {
        imageIndex = arrImagesData.length - 1;
    }
    setImageByLinkAndTitle(arrImagesData[imageIndex].image.thumbnailLink, arrImagesData[imageIndex].title);
});

btn_review.addEventListener("click", () => {
    anki_review.style.display = "flex";
});

anki_review.addEventListener("click", (e) => {
    if (e.target.contains(anki_review)) {
        anki_card.style.animation = "move-up 0.3s ease-in-out";
        setTimeout(() => {
            anki_review.style.display = "none";
            anki_card.style.animation = "move-down 0.3s ease-in-out";
        }, 200);
    }
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
        const fetchData = await getImageLinksAPI(WORD_SEARCH, checked_page, radio.value).catch((err) =>
            alert("Rate Limit Exceeded!"),
        );
        arrImagesData = removeFacebookDisplayLink(fetchData);
        imageIndex = 0;
        setImageByLinkAndTitle(arrImagesData[imageIndex].image.thumbnailLink, arrImagesData[imageIndex].title);
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
        const fetchData = await getImageLinksAPI(WORD_SEARCH, radio.value, checked_type).catch((err) =>
            alert("Rate Limit Exceeded!"),
        );
        arrImagesData = removeFacebookDisplayLink(fetchData);
        imageIndex = 0;
        setImageByLinkAndTitle(arrImagesData[imageIndex].link, arrImagesData[imageIndex].title);
        left_arr.classList.add("show");
        right_arr.classList.add("show");
    });
});

//^ GET DATA OF MEANINGS SECTION
const word_data = await getMeanOfWord(WORD_SEARCH).catch((err) =>
    alert("We can't find this word in our database. Please try again!"),
);
let HTMLs = "";
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
//^ Render audio
const audio_dom = await getAudio(WORD_SEARCH).catch((err) => {
    console.log(err);
});
if (audio_dom) {
    audio_anki.style.display = "inline";
    aud = audio_dom;
}
audio.innerHTML = `<audio controls>
                <source src="${audio_dom}" type="audio/mp3" />
                Your browser does not support the audio element.
                </audio>`;

//^ Render examples
loading_icon.style.display = "inline-block";
const exs = await getExample(WORD_SEARCH).catch((err) => {
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

//^ submit add card handle
submit.addEventListener("click", async (e) => {
    const cardInfoEx = {
        front: WORD_SEARCH /* Y */,
        back: vi_def_choose,
        phonetic_symbols: ipa /* Y */,
        family_words: "",
        synonyms: "",
        example: ex_data,
        english_meaning: eng_def_choose /* Y */,
        image: arrImagesData[imageIndex].link /* Y */,
        audio: aud /* Y */,
    };
    console.log(cardInfoEx);
    await addCard("test1", "Flash Card", cardInfoEx).catch((err) => {
        console.log(err);
    });
    anki_card.style.animation = "move-up 0.3s ease-in-out";
    setTimeout(() => {
        anki_review.style.display = "none";
        anki_card.style.animation = "move-down 0.3s ease-in-out";
    }, 200);
});
