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
                if (obj[key].ltMethod)
                    return hasProperty && row[key] < obj[key].value;
                if (obj[key].gtMethod)
                    return hasProperty && row[key] > obj[key].value;
                if (obj[key].ltOrEqMethod)
                    return hasProperty && row[key] <= obj[key].value;
                if (obj[key].gtOrEqMethod)
                    return hasProperty && row[key] >= obj[key].value;
            }

            return hasProperty && row[key] === obj[key];
        });

        return matching.length === objKeys.length;
    });

    return {
        rows: newRows,
        where: (obj) => _where(obj, newRows),
        limit: (n) => _limit(n, newRows),
        order: (direction) => _order(direction, newRows)
    }
}

export const _order = (direction, rows) => {
    if (typeof direction !== 'object') 
        throw Error('You must pass in `ascend()` or `descend()` to the `order` method.');

    const dir = direction?.dir;
    const col = direction?.col;

    const newRows = rows.sort((a, b) => {
        return a[col] > b[col] ? (dir === "ASC" ? 1 : dir === "DES" ? -1 : null) : (dir === "ASC" ? -1 : dir === "DES" ? 1 : null);
    });

    return {
        rows: newRows,
        where: (obj) => _where(obj, newRows),
        limit: (n) => _limit(n, newRows),
        order: (direction) => _order(direction, newRows)
    }
}

export const _limit = (n, rows) => ({
    rows: rows.slice(0, n),
    where: (obj) => _where(obj, rows.slice(0, n)),
    limit: (n) => _limit(n, rows.slice(0, n)),
    order: (direction) => _order(direction, newRows)
});

export const like = (str) => ({
    likeMethod: true,
    str
});

export const not = (value) => ({
    notMethod: true,
    value
});

export const lt = (value) => ({
    ltMethod: true,
    value
});

export const gt = (value) => ({
    gtMethod: true,
    value
});

export const gtOrEq = (value) => ({
    gtOrEqMethod: true,
    value
});

export const ltOrEq = (value) => ({
    ltOrEqMethod: true,
    value
});

export const ascend = (col) => ({
    dir: "ASC",
    col
});

export const descend = (col) => ({
    dir: "DES",
    col
});