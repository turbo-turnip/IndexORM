// Create SQL for inserting an entity into a table
export const _createInsert = (entity, rowValues) => {
    return {
        SQL: `
                INSERT INTO ?? (${entity.columns.map(() => "??").join(', ')}) 
                VALUES (${rowValues.map(() => "?").join(', ')})
            `,
        params: [entity.entityName, ...entity.columns.map(col => col.name), ...rowValues]
    }
}