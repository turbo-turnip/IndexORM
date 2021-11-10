import { _where } from './rowmanipulation.js';
import { _extends } from './extends.js';

export const _createTable = (entity, connection) => {
    return {
        // Select all columns from a table
        selectAll() {
            return new Promise(async (resolve, reject) => {
                if (connection.connection) {
                    const [values] = await connection.connection.query(`SELECT * FROM ${entity.entityName}`);

                    resolve({
                        rows: values,
                        where: (obj) => _where(obj, values),
                        limit: (n) => _limit(n, rows),
                        order: (direction) => _order(direction, newRows)
                    });
                }
            });
        },

        // Select from a table specific columns
        select(columns) {
            return new Promise(async (resolve, reject) => {
                // Check if `columns` is an array or not
                if (!(columns instanceof Array))
                    reject('You must pass in an array of column names to the `select` method.');

                if (connection.connection) {
                    // Check if the columns are all valid
                    const [validColumns] = await connection.connection.query(
                        `
                        SELECT column_name FROM INFORMATION_SCHEMA.COLUMNS 
                        WHERE table_schema = (SELECT database()) 
                        AND table_name = ?
                        `,
                        [entity.entityName]
                    );

                    const validColumnNames = validColumns.map(c => c.COLUMN_NAME);
                    columns.forEach(column => {
                        if (!validColumnNames.includes(column))
                            reject(`Column \`${column}\` is not valid.`);
                    });

                    // Select all columns
                    const [values] = await connection.connection.query(
                        `
                        SELECT ${columns.map(() => '??').join(', ')} FROM ${entity.entityName}
                        `,
                        [columns]
                    );

                    resolve({
                        rows: values,  
                        where: (obj) => _where(obj, values),
                        limit: (n) => _limit(n, rows),
                        order: (direction) => _order(direction, newRows)
                    });
                } else reject('There is no connection to the database.');
            });
        },

        // Select columns and join with another entity
        selectJoin(obj) {
            return new Promise(async (resolve, reject) => {
                if (typeof obj !== 'object')
                    reject('Paramater to `selectJoin` method must be of type object.');

                const extendsTarget = _extends({
                    columns: 'object',
                    from: 'string',
                    join: 'string',
                    on: 'string'
                }, obj, {});

                if (!extendsTarget.extends && extendsTarget.invalidKeys.length > 0)
                    reject(`Found invalid key \`${extendsTarget.invalidKeys[0]}\` in object parameter for \`selectJoin\` method.`);
                if (!extendsTarget.extends && extendsTarget.invalidTypes.length > 0)
                    reject(`Found invalid type for object property \`${extendsTarget.invalidTypes[0]}\` in object parameter for \`selectJoin\` method.`);

                if (connection.connection) {
                    const selectSQL = `
                    SELECT ${obj.columns.map(() => '??').join(', ')} FROM ??
                    JOIN ??
                    ON ${obj.on}
                    `;
                    const params = [...obj.columns, obj.from, obj.join];

                    const [data] = await connection.connection.query(selectSQL, params);

                    resolve({
                        rows: data,  
                        where: (obj) => _where(obj, data),
                        limit: (n) => _limit(n, data),
                        order: (direction) => _order(direction, data)
                    });
                } else reject('There is no connection to the database.');
            });
        }
    };
}