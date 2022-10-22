export const filteringService = (options, list) => {
    let chosenElements = [];
    if (options.length === 0) {
        return list;
    }
    options.forEach(option => {
        const {type, value} = option;
        const selectedItems = list.filter(item => item[type] === value);
        chosenElements.push(...selectedItems);
    })
    let chosenElementsWithRelations = [];
    /*options.forEach(option => {
        const {type, value} = option;
        const selectedItems = chosenElements.filter(item => item[type] === value);
        chosenElementsWithRelations.push(...selectedItems);
    })*/
    chosenElements = Array.from(new Set([...chosenElements]));
    return chosenElements;
}