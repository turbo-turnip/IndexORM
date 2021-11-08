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
    
    const MrSotosBand = new orm.entities.Band();
    MrSotosBand.column1 = 'hello';
    await MrSotosBand.save((res) => {
        console.log('Successfully inserted item into database! Response data: ');
        console.log(res);
    });
} catch (err) {
    console.log(err);
}