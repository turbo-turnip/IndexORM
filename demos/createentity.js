import * as orm from '../src/indexorm.js';

const connected = await orm.connection.create({
    user: "indexorm",
    pass: "password",
    host: "localhost",
    database: "my_database"
});

connected.connected && console.log('Database connected.');

class Band extends orm.Entity {
    constructor() {
        super("bands");
    }

    band_id() {
        return {
            name: "band_id",
            type: orm.types.Int(),
            notNull: true,
            autoIncrement: 2,
            primaryKey: true
        };
    }

    band_name() {
        return {
            name: "band_name",
            type: orm.types.VarChar(30),
            notNull: true
        };
    }
}

const MrSotosBand = new orm.entities.Band();
MrSotosBand.band_name = "Mr Soto's Middle School Band";
await MrSotosBand.save(() => {
    console.log('Saved entity!');
});