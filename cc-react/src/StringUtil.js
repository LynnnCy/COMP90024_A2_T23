export const processPropertyKey = (key) => {
    //Replace underscores with space and capitalize first letter
    key = key.replaceAll("_", " ");
    const firstLetterCap = key.charAt(0).toUpperCase()
    return firstLetterCap + key.slice(1);
}

export const getWordCloudValueList = (wordCountMap) => {
    let wordCloudValueList = []
    // let wordCountMap = new Map()
    wordCountMap.forEach((value, key) => {
        wordCloudValueList.push({
            "text": key,
            "value": value
        })
    })
    return wordCloudValueList;
}