const pool = require("../config/onPrem.dbconfig")
const cloudPool = require("../config/cloud.dbconfig")
const { Parser } = require('json2csv')
const fs = require('fs')

let connectionPool
(async () => {
    connectionPool = await pool.acquire()
})()

let cloudConnectionPool
(async () => {
    cloudConnectionPool = await cloudPool.acquire()
})()


const fetchTables = async (dbName) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT TABLE_NAME FROM SYS.TABLES WHERE SCHEMA_NAME ='${dbName}' LIMIT 100 OFFSET 1000`;
        connectionPool.exec(sql, (err, rows) => {
            if (err) {
                reject(new Error(err))
            }
            resolve(rows)
        })
    })
}

const fetchTableData = async (table) => {
    const json2csvParser = new Parser();
    return new Promise((resolve, reject) => {
        const selectData = `SELECT * FROM "CRAVE_ACCOUNTS_LIVE"."${table}"`
        connectionPool.exec(selectData, (err, data) => {
            if (err) {
                reject(new Error(err))
            }
            if (data.length != 0) {
                const csv = json2csvParser.parse(data);
                resolve(
                    {
                        table: table,
                        rows: data
                    }
                )
                // fs.writeFile(`../onprem/data/${table}.csv`, csv, (err) => {
                //     if (err) {
                //         console.error('Error writing CSV file', err);
                //     } else {
                //         console.log('CSV file successfully written');

                //     }
                // })
            } else {
                resolve(
                    {
                        table: table,
                        rows: data
                    }
                )
            }
        })
    })
}

const fetchSchema = async (table) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT *
        -- SCHEMA_NAME, TABLE_NAME, COLUMN_NAME, POSITION
        FROM    SYS.COLUMNS
        WHERE SCHEMA_NAME = 'CRAVE_ACCOUNTS_LIVE' AND TABLE_NAME = '${table}'
        ORDER BY POSITION;`;
        connectionPool.exec(sql, (err, rows) => {
            if (err) {
                reject(new Error(err))
            }
            resolve(rows)
        })
    })
}

const uploadTableRow = async (sql, values) => {
    return new Promise((resolve, reject) => {
        cloudConnectionPool.exec(sql, values, (err, rows) => {
            if (err) {
                reject(new Error(err))
            }
            resolve(rows)
        })
    })
}

const createCloudTable = async (sql) => {
    return new Promise((resolve, reject) => {
        cloudConnectionPool.exec(sql, (err, rows) => {
            if (err) {
                reject(new Error(err))
            }
            resolve(rows)
        })
    })
}

const fetchProcedures = async (limit, offset) => {
    const sql = `SELECT * FROM SYS.PROCEDURES WHERE SCHEMA_NAME = 'CRAVE_ACCOUNTS_LIVE' LIMIT ? OFFSET ?`;
    return new Promise((resolve, reject) => {
        connectionPool.prepare(sql, (err, statement) => {
            if (err) {
                reject(new Error(`Prepare statement error: ${err.message}`));
                return;
            }

            statement.exec([limit, offset], (err, rows) => {
                if (err) {
                    reject(new Error(`Execution error: ${err.message}`));
                    return;
                }
                resolve(rows);
            });
        });
    });
};

const fetchFunctions = async (limit, offset) => {
    const sql = `SELECT * FROM SYS.FUNCTIONS WHERE SCHEMA_NAME = 'CRAVE_ACCOUNTS_LIVE' LIMIT ? OFFSET ?`;
    return new Promise((resolve, reject) => {
        connectionPool.prepare(sql, (err, statement) => {
            if (err) {
                reject(new Error(`Prepare statement error: ${err.message}`));
                return;
            }

            statement.exec([limit, offset], (err, rows) => {
                if (err) {
                    reject(new Error(`Execution error: ${err.message}`));
                    return;
                }
                resolve(rows);
            });
        });
    });
};

const fetchViews = async (limit, offset) => {
    const sql = `SELECT * FROM SYS.VIEWS WHERE SCHEMA_NAME = 'CRAVE_ACCOUNTS_LIVE' LIMIT ? OFFSET ?`;
    return new Promise((resolve, reject) => {
        connectionPool.prepare(sql, (err, statement) => {
            if (err) {
                reject(new Error(`Prepare statement error: ${err.message}`));
                return;
            }

            statement.exec([limit, offset], (err, rows) => {
                if (err) {
                    reject(new Error(`Execution error: ${err.message}`));
                    return;
                }
                resolve(rows);
            });
        });
    });
};

const getEntityCount = async () => {
    try {
        return new Promise((resolve, reject) => {
            const response = {}
            let tableCount = `SELECT COUNT(*) as tableCount FROM SYS.TABLES WHERE SCHEMA_NAME ='CRAVE_ACCOUNTS_LIVE'`;
            connectionPool.exec(tableCount, (err, tableRows) => {
                if (err) {
                    reject(new Error(err))
                }
                response.tables = tableRows[0].TABLECOUNT

                let procedureCount = `SELECT COUNT(*) as procedureCount FROM SYS.PROCEDURES WHERE SCHEMA_NAME ='CRAVE_ACCOUNTS_LIVE'`;
                connectionPool.exec(procedureCount, (err, procedureRows) => {
                    if (err) {
                        reject(new Error(err))
                    }
                    response.procedures = procedureRows[0].PROCEDURECOUNT

                    let functionCount = `SELECT COUNT(*) as functionCount FROM SYS.FUNCTIONS WHERE SCHEMA_NAME ='CRAVE_ACCOUNTS_LIVE'`;
                    connectionPool.exec(functionCount, (err, functionRows) => {
                        if (err) {
                            reject(new Error(err))
                        }
                        response.functions = functionRows[0].FUNCTIONCOUNT

                        let viewCount = `SELECT COUNT(*) as viewCount FROM SYS.FUNCTIONS WHERE SCHEMA_NAME ='CRAVE_ACCOUNTS_LIVE'`;
                        connectionPool.exec(viewCount, (err, viewRows) => {
                            if (err) {
                                reject(new Error(err))
                            }
                            response.views = viewRows[0].VIEWCOUNT



                            resolve(response)
                        })

                    })
                })
            })
        })
    } catch (error) {
        console.log(error);
    }
}

module.exports = { fetchTables, fetchTableData, fetchSchema, uploadTableRow, fetchProcedures, fetchFunctions, fetchViews, getEntityCount, createCloudTable }