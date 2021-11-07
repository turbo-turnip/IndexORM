import { _extends } from "./extends.js";

export const _connection = {
    async create(connectionObject = {}) {
        return new Promise((resolve, reject) => {
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

            const connectionString = 
                extendsConnectionString.extends ? connectionObject.connectionString :
                `server=${connectionObject.host};uid=${connectionObject.user};pwd=${connectionObject.pass};database=${connectionObject.database}`;

            resolve(connectionString);
        });
    }
}