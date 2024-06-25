const cloudPool = require('../config/cloud.dbconfig')
const { uploadTableRow, createCloudTable } = require('../util/util')
const { generateCreateTableQuery } = require('../util/convertSQL')
const fs = require('fs');

let connectionPool
(async () => {
    connectionPool = await cloudPool.acquire()
})()

const connectCloudDB = async (req, res) => {
    try {

        const { dataArray, tableName } = req.body
        console.log(dataArray, tableName);
        const generatePlaceholders = (numColumns) => {
            return Array(numColumns).fill('?').join(', ');
        };

        const generateInsertQuery = (schemaName, tableName, columns) => {
            const placeholders = generatePlaceholders(columns.length);

            const columnNames = columns.join(', ');
            let t = tableName.toUpperCase()
            return `INSERT INTO "${schemaName}"."${tableName}"(${columnNames}) values(${placeholders})`;
        };

        const columns = Object.keys(dataArray[0]);

        const sql = generateInsertQuery("EB93A40F16A74D0AAEA7CAFE5FD57CE0", tableName, columns);
        console.log(sql);

        const promises = dataArray.map(async obj => {
            const values = columns.map(col => obj[col]);
            let sql1 = sql;
            const uploadResponse = await uploadTableRow(sql, values);
            return uploadResponse;
        });

        const results = await Promise.all(promises);
        res.status(201).json({
            success: true,
            totalRecords: dataArray.length,
            results
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            msg: "Integnal server error"
        })
    }
}

const createTable = async (req, res) => {
    try {

        const sql = `
         CREATE TABLE EB93A40F16A74D0AAEA7CAFE5FD57CE0.Test_new (
            ID INTEGER PRIMARY KEY,
            NAME NVARCHAR(100),
            AGE INTEGER,
            CREATED_AT TIMESTAMP
        )`;
        connectionPool.exec(sql, (err, rows) => {
            if (err) {
                reject(new Error(err))
            }
            resolve(rows)
        })

        res.status(201).json({
            success: true,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            msg: "Integnal server error"
        })
    }
}

const generateCreteQuery = async (req, res) => {
    try {
        const metadata = req.body.metadata;
        const queries = [];
        metadata.forEach(table => {
            queries.push(generateCreateTableQuery(table));
        })

        res.status(200).json({
            success: true,
            queries
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            msg: "Integnal server error"
        })
    }
}

module.exports = { connectCloudDB, createTable, generateCreteQuery }