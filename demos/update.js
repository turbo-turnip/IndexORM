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

(async () => {
  console.log('Before update:');
  const bands = await orm.tables['bands'].selectAll();
  console.log(bands);

  await orm.tables['bands'].update({ band_name: "Band Number 3" }, { band_id: 251 });

  console.log('Post update:');
  const newBands = await orm.tables['bands'].selectAll();
  console.log(newBands);
})();