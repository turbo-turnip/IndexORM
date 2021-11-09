import { _createInsert } from './createinsert.js';

// Create entity constructor with columns
export const _createEntity = (entity, connection) => {
    return function() {
        const _this = this;
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

        this.save = (callback = (_) => {}) => {
            return new Promise(async (resolve, reject) => {
                const properties = Object.keys(this);
                // Find values of all columns inside all the valid columns for row
                const rowValues = properties.filter(prop => prop.startsWith('_') && entity.columnNames.includes(prop.substring(1, prop.length)) && this[prop] != null).map(prop => this[prop]);
                const insertedColumns = entity.columns.filter(column => this[column.name] != null);

                // Get insert data based on `entity` and `rowValues`
                const insertData = _createInsert(entity, insertedColumns, rowValues);
                if (connection.connection) {
                    try {
                        const [data] = await connection.connection.query(insertData.SQL, insertData.params);
                        
                        callback(data);
                        resolve(data);
                    } catch (err) {
                        reject(err.sqlMessage ? `[${err.errno}] ${err.sqlMessage}` : err);
                    }
                } else reject('There is no connection to the database.');
            });
        }
    }
}