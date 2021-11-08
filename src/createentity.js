import { _createInsert } from './createinsert.js';

// Create entity constructor with columns
export const _createEntity = (entity, connection) => {
    return function() {
        const _this = this;
        _this.connection = connection;
        _this.entityName = entity.entityName;

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

        this.save = (callback) => {
            return new Promise(async (resolve, reject) => {
                const properties = Object.keys(this);
                // Find values of all columns inside all the valid columns for row
                const rowValues = properties.filter(prop => prop.startsWith('_') && entity.columnNames.includes(prop.substring(1, prop.length))).map(prop => this[prop]);

                console.log(_createInsert(entity, rowValues));
            });
        }
    }
}