# IndexORM
![IndexORM](./indexorm.svg)

IndexORM is a simple JavaScript **Object-Relational-Mapping** library for **MySQL**.

<hr/>

## Requirements
- `yarn` or `npm`
- Node.js version 13.2 or higher

## Installation
Using `yarn`:
```
yarn add indexorm
```
Using `npm`:
```
npm install --save indexorm
```

## Documentation
**Note: The examples use modules and top-level async/await**
### Connect to a MySQL database and user
```js
import * as orm from 'indexorm';

// Connect to database
// Returns Promise<{ connected: boolean }>
await orm.connection.create({
    user: "[MySQL username]",
    pass: "[MySQL password]",
    host: "[MySQL hostname]",
    database: "[MySQL database to connect to]",
    // Or, just pass in connectionString:
    // connnectionString: "server=[host];uid=[user];pwd=[pass];database=[database]"
});

await orm.connection.terminate();
```

### Connect to database and create entity
```js
// import...

// create connection...

// Create entity class and extend `orm.Entity`
class MyEntity extends orm.Entity {
    constructor() {
        // Call super with the entity name (table name) as a string
        super("my_entity");
    }

    // Create columns through method returns
    column1() {
        return {
            column: true, // Optional; specify if the method should not be a column
            name: "column1", // Mandatory; the column name
            type: orm.types.VarChar(25), // Mandatory; the column type. See list of column types by clicking the link below the code snippet
            primaryKey: true, // Optional; boolean for if the column is a primary key or not
            autoIncrement: 0, // Optional; auto increment by integer
            notNull: true, // Optional; boolean for if the column cannot be null
        }
    }
}

// Add the entity
// Pass in array of entities to require
await orm.entities.require([MyEntity]);
// Or add entities individually with `orm.entities.add`
// await orm.entities.add(MyEntity);

// terminate connection...
```
[See list of column types](#column-types)

### Using entities
```js
// import...

// create connection...

// create entity... (MyEntity)

// require/add entity... (MyEntity)

// Entity classes will be stored in `orm.entities`
// Create a new object of the entity
const myEntity = new orm.entities.MyEntity();
myEntity.column1 = 5; // Error: Cannot set column of type VarChar(25) to integer
myEntity.column1 = "asdfasdfasdfasdfasdfasdfasdf"; // Error: String is greater than VarChar limit
myEntity.column1 = "Hello"; // Success
// Save the entity to MySQL
await myEntity.save((info) => {
    // Optional callback with info on insertion
});

// terminate connection...
```

### Select entities from a table
```js
// import...

// create connection...

// create entity... (MyEntity)

// require/add entity... (MyEntity)

// save some entities to the database...

// Access a table with `orm.tables.[entity table name]`
// Select all columns from all entities in table
const allEntities = await orm.tables['my_entity'].selectAll();
// Both methods return { rows: Array<Object>, ...(...) => ? }
// Select specific columns from all entities
const allEntityColumn1s = await orm.tables['my_entity'].select(["column1"]);

// terminate connection...
```

### Entity selection manipulation
```js
// import...

// create connection...

// create entity... (MyEntity)

// require/add entity... (MyEntity)

// save some entities to the database...

// Select all columns from all entities in table
const allEntities = await orm.tables['my_entity'].selectAll();
const specificEntity = allEntities.rows.where({ column1: orm.like('ello') });
// .limit(n) - limits amount of returned entities
// .order(orm.ascend("column")) - orders entities by the column name passed into orm.ascend()
// .order(orm.descend("column)) - orders entities by the column name passed into orm.descend()

// Comparison methods
// gt(n) - Greater than the number passed in
// lt(n) - Less than the number passed in
// gtOrEq(n) - Greater than or equal to the number passed in
// ltOrEq(n) - Less than or equal to the number passed in
// Example: 
// allEntities.rows.where({ column1: orm.gt(5) });

// terminate connection...
```

### Select table and join
```js
// import...

// create connection...

// create entity... (MyEntity)
class Entity2 extends orm.Entity {
    constructor() {
        super("entity2");
    }

    column1() {
        return {
            column: true,
            name: "column1",
            type: orm.types.VarChar(25),
            primaryKey: true, 
            notNull: true,
        }
    }
}

// require/add entity... (MyEntity)

// save some entities to the database...

// Join Entity2.column1 with MyEntity.column1
const joined = await orm.tables.entity2.selectJoin({
    // Columns to select
    columns: ["my_entity.column1"],
    // Table from
    from: "entity2",
    // Table to join
    join: "my_entity",
    // Join table on
    on: "entity2.column1 = my_entity.column1"
});

// terminate connection...
```




### Column Types
```js
// JS                        SQL Type
orm.types.SmallInt(p)        // SMALLINT(p)
orm.types.Int()              // INT
orm.types.BigInt(p)          // BIGINT(p)
orm.types.Decimal()          // DECIMAL
orm.types.Float()            // FLOAT
orm.types.Boolean()          // BOOL
orm.types.VarChar(p)         // VARCHAR(p)
orm.types.Text()             // TEXT
orm.types.Date()             // DATE
orm.types.Time()             // TIME
orm.types.DateTime()         // DATETIME
orm.types.TimeStamp()        // TIMESTAMP
orm.types.Year()             // YEAR
orm.types.JSON()             // JSON
```