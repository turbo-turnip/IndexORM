import * as orm from '../src/indexorm.js';

try {
    const connected = await orm.connection.create({
        user: "indexorm",
        host: "localhost",
        pass: "password",
        database: "my_database"
    });

    connected.connected && console.log('Database connected');
} catch (err) {
    console.log(err);
}