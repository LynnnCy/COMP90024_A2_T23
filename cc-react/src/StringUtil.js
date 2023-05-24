/*
 * 
 * ** COMP90024 Assignment 2 
 * Team: 23 
 * City: Victoria 
 * Members: Abrar Hayat(1220445) Yalin Chen(1218310) Qianchu Li(1433672) Jie Yang(1290106) Yadvika Jayam Nagaraj Yadav(1406716)
 * 
 */
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