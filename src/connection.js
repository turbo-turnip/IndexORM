import { _extends } from "./extends.js";
import { createConnection } from "mysql2/promise";

export const _connection = {
    // Create a connection to MySQL and database
    create(connectionObject = {}) {
        const _this = this;

        return new Promise(async (resolve, reject) => {
            // Check if `connectionObject` has the right properties and types
            const extendsConnectionString = _extends({
                connectionString: 'string'
            }, connectionObject, {});
            const extendsConnectionObj = _extends({
                user: 'string',
                host: 'string',
                pass: 'string',
                database: 'string'
            }, connectionObject, {});

            if (!extendsConnectionString.extends && !extendsConnectionObj.extends)
                reject('You must pass an object with a connectionString or user, host, pass, and database to the `connection.create` method.');

            // Generate MySQL connection string based off of `connectionObject`
            const connectionString = 
                extendsConnectionString.extends ? connectionObject.connectionString :
                `mysql2://${connectionObject.user}:${connectionObject.pass}@${connectionObject.host}/${connectionObject.database}`;

            try {
                // Connect to database
                const connection = await createConnection(connectionString);

                _this.connection = connection;

                resolve({ connected: true });
            } catch (err) {
                reject({ connected: false, error: err.message ? err.message : err });
            }
        });
    },

    // Close MySQL connection
    terminate() {
        return new Promise(async (resolve, reject) => {
            if (this.connection.connection) {
                this.connection.end();

                resolve();
            } else reject('There is no connection to the database.');
        });
    }
}