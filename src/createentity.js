// Create entity constructor with columns
export const _createEntity = (entity) => {
    return function() {
        const _this = this;

        // Loop through columns and create getters/setters
        entity.columns.forEach(column => {
            Object.defineProperty(_this, column.name, {
                // Get property
                get() {
                    return _this["_" + column.name];
                },

                // Set property
                set(value) {
                    // Validate value based on column's properties
                    if (column.notNull && value == null)
                        throw Error(`Cannot set column \`${column.name}\` to null.`);

                    if (column.type?.custom === "array" && !(value instanceof Array))
                        throw Error(`\`${column.name}\` must be assigned to an array.`);

                    if ((column.type.SQLType.includes('VARCHAR') || column.type.SQLType === 'TEXT') && typeof value !== 'string')
                        throw Error(`\`${column.name}\` must be assigned to a string.`);

                    if (column.type.SQLType.includes('INT') && typeof value !== 'number')
                        throw Error(`\`${column.name}\` must be assigned to a number.`);

                    if (column.type.SQLType.includes('VARCHAR')) {
                        if (value.length > parseInt(column.type.params[0]))
                            throw Error(`\`${column.name}\` must be assigned to a string that is less than ${column.type.params[0] + 1} characters long.`);
                    }

                    if (column.type.SQLType === 'JSON' && typeof value !== 'object')
                        throw Error(`\`${column.name}\` must be assigned to an object or array.`);

                    _this["_" + column.name] = value;
                }
            });
        });
    }
}