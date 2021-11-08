import { _extends } from './extends.js';

export class _Entity {
    constructor(entityName = "") {
        this.entityName = entityName;

        // Get methods from entity (child class)
        this.methods = Object.getOwnPropertyNames(this.constructor.prototype);
        // Find all methods that exist as columns
        this.columns = this.methods.filter(method => {
            if (method === "constructor") return false;

            if (typeof this[method]() === 'object') {
                // Check if column property exists and evaluate for output
                if (this[method]().hasOwnProperty('column'))
                    return this[method]().column;
                else return true;
            } else
                throw Error(`Method \`${method}\` in entity \`${entityName}\` must return object.\nIf this method is not a column, return an object with the property \`column\` set to \`false\`.`);
        });
        
        // Check if all columns have correct properties and types
        this.columns.forEach(column => {
            const columnValue = this[column]();

            const extendsTarget = _extends(
                {
                    name: 'string',
                    type: 'object'
                },
                columnValue,
                {
                    autoIncrement: 'number',
                    primaryKey: 'boolean',
                    notNull: 'boolean'
                }
            );

            if (!extendsTarget.extends && extendsTarget.invalidKeys.length > 0)
                throw Error(`Found invalid key \`${extendsTarget.invalidKeys[0]}\` in column \`${column}\` in entity \`${entityName}\`.`);
            if (!extendsTarget.extends && extendsTarget.invalidTypes.length > 0)
                throw Error(`Found invalid type for column property \`${extendsTarget.invalidTypes[0]}\` in column \`${column}\` in entity \`${entityName}\`.`);
        });
    }
}