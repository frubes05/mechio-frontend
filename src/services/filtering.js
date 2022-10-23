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
    chosenElements = Array.from(new Set([...chosenElements]));
    const changed = options.map(opt => {
        return {
            [`${opt.type}`]: opt.value
        }
    })
    const filteringObject = Object.assign(...changed);
    chosenElements = chosenElements.map(elem => {
        const togetherParts = [];
        for(let key in filteringObject) {
            if (elem[key] === filteringObject[key]) {
                togetherParts.push(true);
            }
        }
        if (togetherParts.length === Object.keys(filteringObject).length) {
            return elem;
        }
    }).filter(elem => elem !== undefined);
    return chosenElements;
}