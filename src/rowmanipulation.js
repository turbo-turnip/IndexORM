// Query where properties are equal to or like each other
export const _where = (obj, rows) => {
    const newRows = rows.filter(row => {
        const objKeys = Object.keys(obj);

        // Check if all the properties match
        const matching = objKeys.filter(key => {
            const hasProperty = row.hasOwnProperty(key);
            
            if (typeof obj[key] === 'object') {
                if (obj[key].likeMethod)
                    return hasProperty && row[key].includes(obj[key].str);
                if (obj[key].notMethod)
                    return hasProperty && row[key] !== obj[key].value;
            }

            return hasProperty && row[key] === obj[key];
            return false;
        });

        return matching.length === objKeys.length;
    });

    return {
        rows: newRows,
        where: (obj) => _where(obj, newRows),
        limit: (n) => _limit(n, newRows)
    }
}

export const _limit = (n, rows) => ({
    rows: rows.slice(0, n),
    where: (obj) => _where(obj, rows.slice(0, n)),
    limit: (n) => _limit(n, rows.slice(0, n))
});