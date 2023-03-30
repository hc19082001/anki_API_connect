import { GOOGLE_CUSTOM_SEARCH_API, GOOGLE_CUSTOM_SEARCH_ENGINE_ID } from "../assets/api_key.js";

//! API GET IMAGE LINK
const getImageLinksAPI = async (word, start = 1, imgType = "IMG_TYPE_UNDEFINED") => {
    console.log(
        `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_CUSTOM_SEARCH_API}&cx=${GOOGLE_CUSTOM_SEARCH_ENGINE_ID}&searchType=image&safe=active&num=10&start=${start}&imgType=${imgType}&q=${word}`,
    );
    const result = await fetch(
        `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_CUSTOM_SEARCH_API}&cx=${GOOGLE_CUSTOM_SEARCH_ENGINE_ID}&searchType=image&safe=active&num=10&start=${start}&imgType=${imgType}&q=${word}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        },
    );
    const data = await result.json();
    return data.items;
};

export default getImageLinksAPI;

// GG SEARCH API
// https://www.googleapis.com/customsearch/v1?key=AIzaSyDrB6rpc9AWFqjGAPA5VuJaMiPCnZSZ5g0&cx=51c835d925c4d4339&searchType=image&safe=active&num=10&start=1&q=hello
// PARAMETER: https://developers.google.com/custom-search/v1/reference/rest/v1/cse/list?hl=vi#request
