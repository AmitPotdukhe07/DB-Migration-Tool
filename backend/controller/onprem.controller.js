const { fetchTables, fetchTableData, fetchSchema, fetchProcedures, fetchFunctions, fetchViews, getEntityCount } = require("../util/util");
const pool = require("../config/onPrem.dbconfig")

let connectionPool
(async () => {
    connectionPool = await pool.acquire()
})()

const getTables = async (req, res) => {
    try {
        const { dbName } = req.body;
        const tables = await fetchTables(dbName);
        res.status(200).json({
            success: true,
            tables
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            msg: error.message
        })
    }
}

const getTableData = async (req, res) => {
    try {
        const { tables } = req.body;
        console.log(tables);
        const response = [];
        const promises = tables.map(async (table) => {
            let data = await fetchTableData(table);
            return data;
        });
        const results = await Promise.all(promises);
        results.forEach(data => response.push(data));
        res.status(200).json({
            success: true,
            data: response
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            msg: error.message
        });
    }
};

const getTableSchema = async (req, res) => {
    try {
        const { tables } = req.body
        const response = [];
        if (!tables || tables.length == 0) {
            res.status(400).json({
                success: false,
            })
            return
        }
        const promises = tables.map(async (table) => {
            let data = await fetchSchema(table);
            return data;
        });
        const results = await Promise.all(promises);
        results.forEach(data => response.push(data));

        res.status(200).json({
            success: true,
            response
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            msg: error.message
        });
    }
}

const getTableQuery = async (req, res) => {
    try {
        const schemaName = 'CRAVE_ACCOUNTS_LIVE';
        const tableName = 'ETL_COST_CENTER';

        const getTableQuery = `
            SELECT *
            FROM SYS.TABLES
            WHERE SCHEMA_NAME = '${schemaName}'
            AND TABLE_NAME = '${tableName}'
            `;

        const getColumnsQuery = `
            SELECT *
            FROM SYS.TABLE_COLUMNS
            WHERE SCHEMA_NAME = '${schemaName}'
            AND TABLE_NAME = '${tableName}'
            ORDER BY POSITION
            `;

        connectionPool.exec(getTableQuery, (err, tableRows) => {
            if (err) {
                return console.error('Error executing table query', err);
            }

            if (tableRows.length === 0) {
                console.log('Table not found.');
                connection.disconnect();
                return;
            }

            const table = tableRows[0];

            connectionPool.exec(getColumnsQuery, (err, columnRows) => {
                if (err) {
                    return console.error('Error executing column query', err);
                }

                let ddl = `CREATE TABLE "${tableName}" (\n`;

                columnRows.forEach((column, index) => {
                    ddl += `  "${column.COLUMN_NAME}" ${column.DATA_TYPE_NAME}`;
                    if (column.LENGTH) {
                        ddl += `(${column.LENGTH}`;
                        if (column.SCALE) {
                            ddl += `, ${column.SCALE}`;
                        }
                        ddl += `)`;
                    }
                    if (column.DEFAULT_VALUE) {
                        ddl += ` DEFAULT ${column.DEFAULT_VALUE}`;
                    }
                    if (column.IS_NULLABLE === 'FALSE') {
                        ddl += ` NOT NULL`;
                    }
                    if (index < columnRows.length - 1) {
                        ddl += `,`;
                    }
                    ddl += `\n`;
                });

                ddl += `);`;

                console.log('DDL Statement:', ddl);
            });
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            msg: error.message
        });
    }
}

const getProcedures = async (req, res) => {
    try {
        const page = req.query.page || 1;
        const size = req.query.size || 5;
        const offset = (page - 1) * size;
        const procedure = []

        const procedures = await fetchProcedures(size, offset);
        console.log(procedures);

        procedures.forEach(item => {
            procedure.push(item.PROCEDURE_NAME)
        })

        res.status(200).json({
            success: true,
            procedure,
            procedures
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            msg: error.message
        });
    }
}

const getFunctions = async (req, res) => {
    try {
        const page = req.query.page || 1;
        const size = req.query.size || 5;
        const offset = (page - 1) * size;
        const functionName = [];
        const functions = await fetchFunctions(size, offset);
        console.log(functions);
        functions.forEach(item => {
            functionName.push(item.FUNCTION_NAME)
        })

        res.status(200).json({
            success: true,
            functionName,
            functions
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            msg: error.message
        });
    }
}

const getViews = async (req, res) => {
    try {
        const page = req.query.page || 1;
        const size = req.query.size || 5;
        const offset = (page - 1) * size;
        const viewNames = []
        const views = await fetchViews(size, offset);
        console.log(views);
        views.forEach(item => {
            viewNames.push(item.VIEW_NAME)
        })

        res.status(200).json({
            success: true,
            viewNames,
            views
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            msg: error.message
        });
    }
}

const getOverview = async (req, res) => {
    try {
        const entityCount = await getEntityCount();
        console.log(entityCount);
        res.status(200).json({
            success: true,
            entityCount
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            msg: error.message
        });
    }
}

module.exports = { getTables, getTableData, getTableSchema, getTableQuery, getProcedures, getFunctions, getViews, getOverview }