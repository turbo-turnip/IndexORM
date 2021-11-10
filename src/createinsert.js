// Create SQL for inserting an entity into a table
export const _createInsert = (entity, columns, rowValues) => {
    return {
        SQL: `
                INSERT INTO ?? (${columns.map(() => "??").join(', ')}) 
                VALUES (${rowValues.map(() => "?").join(', ')})
            `,
        // params: [entity.entityName, ...columns.map(col => col.name), ...rowValues.map(value => typeof value != 'object' ? value : JSON.stringify(value))]
        params: [
            entity.entityName, 
            ...columns.map(col => col.name), 
            // Order the column values correctly
            ...columns.map(col => { 
                const value = (rowValues.filter(v => v.name === col.name)[0]).value; 
                return typeof value != 'object' ? value : JSON.stringify(value); 
            })
        ]
    };
}