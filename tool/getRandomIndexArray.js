export default function (lengthOfArr, numOfIndexToGet, ignore) {
    let arrRandomIndex = [];
    for (let index = 0; index < numOfIndexToGet; index++) {
        if (arrRandomIndex.length === lengthOfArr - 1) {
            break;
        } else {
            let random = Math.floor(Math.random() * lengthOfArr);
            while (arrRandomIndex.includes(random) || random === ignore) {
                random = Math.floor(Math.random() * lengthOfArr);
                console.log("🚀 ~ file: getRandomIndexArray.js:7 ~ random:", random);
            }
            arrRandomIndex.push(random);
        }
    }
    return arrRandomIndex;
}
