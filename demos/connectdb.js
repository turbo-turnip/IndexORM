import * as orm from '../src/indexorm';

try {
//     await orm.connection.create({
//         user: "indexorm",
//         host: "localhost",
//         pass: "password",
//         database: "my_database"
//         // connectionString: "..."
//     });

//     await orm.entities.require([Entity1, Entity2, Entity3]);
//     await orm.entities.add(Entity4);
} catch (err) {
    console.log(err.message);
}