export const processPropertyKey = (key) => {
    //Replace underscores with space and capitalize first letter
    key = key.replaceAll("_", " ");
    let updatedKey = ''
    key.split(" ").forEach(word => {
        updatedKey += " " + word.charAt(0).toUpperCase() + word.slice(1)
    })
    if (key.includes("cnt")) {
        key = key.replace("cnt", "tweet count")
    }
    return updatedKey;
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