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
                        [...columns]
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
        },

        // Delete rows
        delete(where) {
            return new Promise(async (resolve, reject) => {
                if (typeof where !== 'object')
                    reject('Parameter to `delete` method must be of type object.');

                if (connection.connection) {
                    const deleteSQL = `
                    DELETE FROM ??
                    WHERE ${Object.keys(where).map(() => '?? = ?').join(' AND ')}
                    `;
                    const whereKeysAndValues = [];
                    for (let i = 0; i < Object.keys(where).length; i++) {
                        whereKeysAndValues.push(Object.keys(where)[i]);
                        whereKeysAndValues.push(Object.values(where)[i]);
                    }

                    const deleteParams = [entity.entityName, ...whereKeysAndValues];
                    const [] = await connection.connection.query(deleteSQL, deleteParams);
                    resolve(true);
                }
            });
        },

        // Update rows
        update(updater, where) {
            return new Promise(async (resolve, reject) => {
                if (typeof where !== 'object' || typeof updater !== 'object')
                    reject('Parameters to `update` method must be of type object.');

                if (connection.connection) {
                    const updateSQL = `
                    UPDATE ??
                    SET ${Object.getOwnPropertyNames(updater).map(() => '?? = ?').join(', ')}
                    WHERE ${Object.getOwnPropertyNames(where).map(() => '?? = ?').join(' AND ')}
                    `;
                    const updaterProps = Object.getOwnPropertyNames(updater);
                    const updaterValues = Object.getOwnPropertyNames(updater).map(prop => updater[prop]);
                    const updaterPropsParams = [];
                    let updaterPropsIter = 0;
                    let updaterValuesIter = 0;
                    for (let i = 0; i < updaterProps.length + updaterValues.length; i++) {
                        if (i % 2 === 0) {
                            updaterPropsParams[i] = updaterProps[updaterPropsIter];
                            updaterPropsIter++;
                        } else {
                            updaterPropsParams[i] = updaterValues[updaterValuesIter];
                            updaterValuesIter++;
                        }
                    }
                    
                    const whereProps = Object.getOwnPropertyNames(where);
                    const whereValues = Object.getOwnPropertyNames(where).map(prop => where[prop]);
                    const wherePropsParams = [];
                    let wherePropsIter = 0;
                    let whereValuesIter = 0;
                    for (let i = 0; i < whereProps.length + whereValues.length; i++) {
                        if (i % 2 === 0) {
                            wherePropsParams[i] = whereProps[wherePropsIter];
                            wherePropsIter++;
                        } else {
                            wherePropsParams[i] = whereValues[whereValuesIter];
                            whereValuesIter++;
                        }
                    }

                    const params = [entity.entityName, ...updaterPropsParams, ...wherePropsParams];

                    const [] = await connection.connection.query(updateSQL, params);

                    resolve(true);
                } else reject('There is no connection to the database.');
            });
        }
    };
}
