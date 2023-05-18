export const processPropertyKey = (key) => {
    //Replace underscores with space and capitalize first letter
    key = key.replaceAll("_", " ");
    const firstLetterCap = key.charAt(0).toUpperCase()
    return firstLetterCap + key.slice(1);
}