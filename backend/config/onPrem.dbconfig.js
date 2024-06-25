// dbPool.js
'use strict';
const hana = require('@sap/hana-client');
const { createPool } = require('generic-pool');

const connOptions = {
    serverNode: '192.168.1.164:30015',
    uid: 'SYSTEM',
    pwd: 'Crave@123',
    sslValidateCertificate: 'false',
};

const factory = {
    create: () => {
        return new Promise((resolve, reject) => {
            const conn = hana.createConnection();
            conn.connect(connOptions, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(conn);
                }
            });
        });
    },
    destroy: (conn) => {
        return new Promise((resolve) => {
            conn.disconnect();
            resolve();
        });
    }
};

const pool = createPool(factory, {
    max: 10,
    min: 2
});

module.exports = pool;
