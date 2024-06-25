'use strict';
const hana = require('@sap/hana-client');
const XLSX = require('xlsx');
const fs = require('fs')
const { Parser } = require('json2csv');

const json2csvParser = new Parser();
var connOptions = {
    serverNode: '192.168.1.164:30015',
    uid: 'SYSTEM',
    pwd: 'Crave@123',
    sslValidateCertificate: 'false',
};
try {
    const conn = hana.createConnection(connOptions);
    conn.connect(connOptions, (err) => {
        if (err) {
            console.log(err)
            return 'Connection error'
        }
        else {
            // SELECT * FROM SYS.PROCEDURES WHERE SCHEMA_NAME = 'CRAVE_ACCOUNTS_LIVE';
            // SELECT 
            //             USED_SIZE
            //         FROM 
            //             M_DISK_USAGE
            //         WHERE 
            //             USAGE_TYPE = 'DATA'

            console.log("DATABASE CONNECTED");
            const getTotalDatabaseSize = async () => {
                const sql = `SELECT 
                                SCHEMA_NAME,
                                TABLE_NAME,
                                TABLE_SIZE 
                            FROM 
                                M_TABLES WHERE SCHEMA_NAME='CRAVE_ACCOUNTS_LIVE'
                            ORDER BY 
                                TABLE_SIZE DESC
                            `;
                const sql1 = `
                             SELECT 
      ROUND(SUM(Table_SIZE) / 1024 / 1024, 2) AS TOTAL_SIZE_MB 
   FROM 
                                M_TABLES WHERE SCHEMA_NAME='CRAVE_ACCOUNTS_LIVE'
                          `;
                try {
                    const statement = await new Promise((resolve, reject) => {
                        conn.prepare(sql1, (err, statement) => {
                            if (err) {
                                return reject(new Error(`Prepare statement error: ${err.message}`));
                            }
                            resolve(statement);
                        });
                    });
                    const result = await new Promise((resolve, reject) => {
                        statement.exec([], (err, rows) => {
                            if (err) {
                                return reject(new Error(`Execution error: ${err.message}`));
                            }
                            resolve(rows);
                        });
                    });
                    return result;
                } catch (error) {
                    throw error;
                } finally {
                }
            };

            (async () => {
                try {
                    const dbSize = await getTotalDatabaseSize();
                    console.log((dbSize));
                } catch (error) {
                    console.error(error);
                }
            })();
        }
    })
} catch (e) {
    console.log(e);
}
const pool = require("./config/onPrem.dbconfig")
const conn = hana.createConnection(connOptions);

