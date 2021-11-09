import { _where } from './rowmanipulation.js';

export const _createTable = (entity, connection) => {
    return {
        // Select all columns from a table
        selectAll() {
            return new Promise(async (resolve, reject) => {
                if (connection.connection) {
                    const [values] = await connection.connection.query(`SELECT * FROM ${entity.entityName}`);

                    resolve({
                        rows: values,
                        where: (obj) => _where(obj, values)
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
                        where: (obj) => _where(obj, values)
                    });
                } else reject('There is no connection to the database.');
            });
        }
    };
}