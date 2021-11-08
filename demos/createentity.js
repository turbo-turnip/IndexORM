import * as orm from '../src/indexorm.js';

try {
    const connected = await orm.connection.create({
        user: "indexorm",
        host: "localhost",
        pass: "password",
        database: "my_database"
    });

    connected.connected && console.log('Database connected');

    class Bands extends orm.Entity {
        constructor() {
            super("bands_entity");
        }

        column1() {
            return {
                a: 5
            };
        }
    }

    const b = new Bands();
} catch (err) {
    console.log(err);
}