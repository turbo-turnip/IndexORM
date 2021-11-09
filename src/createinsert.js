// Create SQL for inserting an entity into a table
export const _createInsert = (entity, columns, rowValues) => {
    return {
        SQL: `
                INSERT INTO ?? (${columns.map(() => "??").join(', ')}) 
                VALUES (${rowValues.map(() => "?").join(', ')})
            `,
        params: [entity.entityName, ...columns.map(col => col.name), ...rowValues.map(value => typeof value != 'object' ? value : JSON.stringify(value))]
    };
}