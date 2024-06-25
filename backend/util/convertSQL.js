function generateCreateTableQuery(metadata) {
    if (metadata.length === 0) {
        return "";
    }

    const schemaName = metadata[0].SCHEMA_NAME;
    const tableName = metadata[0].TABLE_NAME;

    const columns = metadata.map(column => {
        const columnName = column.COLUMN_NAME.toUpperCase();
        const dataType = column.DATA_TYPE_NAME;
        const length = column.LENGTH;
        const scale = column.SCALE;
        const isNullable = column.IS_NULLABLE === "TRUE" ? "" : "NOT NULL";

        if (dataType === "DECIMAL") {
            return `"${columnName}" ${dataType}(${length}, ${scale}) ${isNullable}`;
        } else if (dataType === "NVARCHAR" || dataType === "VARCHAR") {
            return `"${columnName}" ${dataType}(1000) ${isNullable}`;
        } else {
            return `"${columnName}" ${dataType} ${isNullable}`;
        }
    });

    const columnsDefinition = columns.join(",\n    ");

    return `CREATE COLUMN TABLE "${process.env.CLOUD_SCHEMA_NAME}"."${tableName}" (\n    ${columnsDefinition}\n);`;
}

// const query = generateCreateTableQuery(metadata);
// console.log(query);

module.exports = { generateCreateTableQuery }
