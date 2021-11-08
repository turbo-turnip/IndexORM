import * as orm from '../src/indexorm.js';

try {
    const connected = await orm.connection.create({
        user: "indexorm",
        host: "localhost",
        pass: "password",
        database: "my_database"
    });

    connected.connected && console.log('Database connected');

    class Band extends orm.Entity {
        constructor() {
            super("bands_entity");
        }

        column1() {
            return {
                name: 'column1',
                type: orm.types.VarChar(25)
            };
        }
    }

    await orm.entities.require([Band]);

    console.log(orm.entities);
} catch (err) {
    console.log(err);
}