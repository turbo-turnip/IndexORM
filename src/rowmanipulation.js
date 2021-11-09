// Query where properties are equal to or like each other
export const _where = (obj, rows) => {
    return {
        rows: rows.filter(row => {
            const objKeys = Object.keys(obj);

            // Check if all the properties match
            const matching = objKeys.filter(key => {
                const hasProperty = row.hasOwnProperty(key);
                
                if (typeof obj[key] === 'object') {
                    if (obj[key].likeMethod)
                        return hasProperty && row[key].includes(obj[key].str);
                }

                return hasProperty && row[key] === obj[key];
                return false;
            });

            return matching.length === objKeys.length;
        }),
        where: (obj) => _where(obj, rows),
        limit: (n) => _limit(n, rows)
    }
}

export const _limit = (n, rows) => ({
    rows: rows.slice(0, n),
    where: (obj) => _where(obj, rows),
    limit: (n) => _limit(n, rows)
});