export class _Entity {
    constructor(entityName = "") {
        this.entityName = entityName;

        // Get methods from entity (child class)
        this.methods = Object.getOwnPropertyNames(this.constructor.prototype);
        // Find all methods that exist as columns
        this.columns = this.methods.filter(method => {
            if (method === "constructor") return false;

            if (typeof this[method]() === 'object') {
                if (this[method]().hasOwnProperty('column'))
                    return this[method]().column;
                else return true;
            } else 
                throw Error(`Method \`${method}\` in entity \`${entityName}\` must return object.\nIf this method is not a column, return an object with the property \`column\` set to \`false\`.`);
        });
        
        
    }
}