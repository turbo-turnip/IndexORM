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

await orm.entities.require([Band]);

// const bandsData = [
//     {name: "Band1"},
//     {name: "Band2"},
//     {name: "Band3"},
//     {name: "Band4"}
// ];

// bandsData.forEach(async band => {
//     const newBand = new orm.entities.Band();
//     newBand.band_name = band.name;
//     await newBand.save(() => console.log(`Saved ${band.name}`));
// });

// orm.entities.bands.selectAll();
// orm.entities.bands.select(["band_name"]);
// orm.entities.bands.select(["band_name"]).where({ band_name: "Band1" });
// orm.entities.bands.select(["band_name"]).where({ band_name: like("Band1") });
// orm.entities.bands.select(["band_name"]).where({ band_name: like("Band1") }).and({ band_id: ltOrEq(1000) });
// orm.entities.bands.select(["band_name"]).where({ band_name: like("Band1") }).and({ band_id: ltOrEq(1000) }).or({ band_id: eq(2000) });
// orm.entities.bands.selectAll().limit(3).order(ascend());
// orm.entities.bands.selectAll().limit(3).order(decend());
// Comparison functions: lt, gt, eq, ltOrEq, gtOrEq

const bands = await orm.tables.bands.selectAll(["band_name"]);
console.log(bands.rows);