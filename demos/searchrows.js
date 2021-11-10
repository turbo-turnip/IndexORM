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

class Musician extends orm.Entity {
    constructor() {
        super("musicians");
    }

    musician_id() {
        return {
            name: "musician_id",
            type: orm.types.Int(),
            notNull: true,
            autoIncrement: 2,
            primaryKey: true
        }
    }

    musician_instrument() {
        return {
            name: "musician_instrument",
            type: orm.types.VarChar(50),
            notNull: true
        }
    }

    musician_band_id() {
        return {
            name: "musician_band_id",
            type: orm.types.Int(),
            notNull: true
        }
    }
}

await orm.entities.require([Band, Musician]);

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
// orm.entities.bands.select(["band_name"]).where({ band_name: like("Band1") });
// orm.entities.bands.select(["band_name"]).where({ band_name: like("Band1") });
// orm.entities.bands.selectAll().limit(3).order(ascend());
// orm.entities.bands.selectAll().limit(3).order(descend());
// Comparison functions: lt, gt, ltOrEq, gtOrEq

const musicians = await orm.tables.musicians.selectAll();
musicians.rows.forEach(async musician => {
    const bandRelation = await orm.tables.bands.selectJoin({
        columns: ["bands.band_name", "musicians.musician_id"],
        from: "musicians",
        join: "bands",
        on: "musicians.musician_band_id = bands.band_id"
    });
    const band = bandRelation.where({ musician_id: musician.musician_id });
    console.log('Instrument:', musician.musician_instrument, 'Band:', band.rows[0].band_name);
});

await orm.connection.terminate();