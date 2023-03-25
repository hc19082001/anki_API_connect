export default function (lengthOfArr, numOfIndexToGet, ignore) {
    let arrRandomIndex = [];
    for (let index = 0; index < numOfIndexToGet; index++) {
        let random = Math.floor(Math.random() * lengthOfArr);
        while (arrRandomIndex.includes(random) || random === ignore) {
            random = Math.floor(Math.random() * lengthOfArr + 1);
        }
        arrRandomIndex.push(random);
    }
    return arrRandomIndex;
}
