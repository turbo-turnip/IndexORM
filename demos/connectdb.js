import * as orm from '../src/indexorm.js';

try {

    await orm.connection.create({
        user: "indexorm",
        host: "localhost",
        pass: "password",
        database: "my_database"
    });

//     await orm.entities.require([Entity1, Entity2, Entity3]);
//     await orm.entities.add(Entity4);
} catch (err) {
    console.log(err);
}