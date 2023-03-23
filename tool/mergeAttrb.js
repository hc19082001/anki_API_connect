export const mergeAttributevi = (defs) => {
    let newArr = [];
    let numberOfType = [];
    defs.forEach((obj) => {
        numberOfType.includes(obj.type) ? null : numberOfType.push(obj.type);
    });
    numberOfType.forEach((type) => {
        const objfilter = defs.filter((obj) => obj.type === type);
        const data = objfilter.reduce((acc, cur) => {
            return [...acc, ...cur.vi];
        }, []);
        newArr.push({ type, vi: data });
    });
    return newArr;
};

export const mergeAttributeen = (defs) => {
    let newArr = [];
    let numberOfType = [];
    defs.forEach((obj) => {
        numberOfType.includes(obj.type) ? null : numberOfType.push(obj.type);
    });
    numberOfType.forEach((type) => {
        const objfilter = defs.filter((obj) => obj.type === type);
        const data = objfilter.reduce((acc, cur) => {
            return [...acc, ...cur.en];
        }, []);
        newArr.push({ type, en: data });
    });
    return newArr;
};

// const a = [
//     {
//         type: 1,
//         vi: ["hello1a", "hi1a", "greeting1a"],
//     },
//     {
//         type: 2,
//         vi: ["hello2a", "hi2a", "greeting2a"],
//     },
//     {
//         type: 3,
//         vi: ["hello3a", "hi3a", "greeting3a"],
//     },
// ];

// const b = [
//     {
//         type: 1,
//         en: ["hello1b", "hi1b", "greeting1b"],
//     },
//     {
//         type: 2,
//         en: ["hello2b", "hi2b", "greeting2b"],
//     },
//     {
//         type: 3,
//         en: ["hello3b", "hi3b", "greeting3b"],
//     },
//     {
//         type: 4,
//         en: ["hello4b", "hi4b", "greeting4b"],
//     },
// ];

export const mergeAndAddnewAttribute = (defs1, defs2) => {
    let mergerdArr = [];
    defs1.forEach((obj) => {
        const objfilter = defs2.filter((obj2) => obj2.type === obj.type);
        objfilter.length > 0
            ? (mergerdArr = [...mergerdArr, { ...obj, ...objfilter[0] }])
            : (mergerdArr = [...mergerdArr, { ...obj }]);
    });
    defs2.forEach((obj) => {
        const objfilter = defs1.filter((obj1) => obj1.type === obj.type);
        objfilter.length > 0 ? null : (mergerdArr = [...mergerdArr, { ...obj }]);
    });
    return mergerdArr;
};
