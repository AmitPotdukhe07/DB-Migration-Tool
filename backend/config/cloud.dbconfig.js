// dbPool.js
'use strict';
const hana = require('@sap/hana-client');
const { createPool } = require('generic-pool');

const connOptions = {
    serverNode: 'a01b6234-5e6c-4922-92d9-f65b0a68b4e7.hna0.prod-eu10.hanacloud.ondemand.com:443',
    uid: 'EB93A40F16A74D0AAEA7CAFE5FD57CE0_812SAMA68QIEBN7TVEX21ESCC_RT',
    pwd: 'Fe82BW3W68OF7dbAK8d7rj37E7nTqJTEoTdFy0umfloeahnIYEzFwRZLXCoc5eIERRYZZxCGKiVsIUdX0NPOPIWwT224L8hBMlLn45QQRNJI1UWdia2Yhfp05qB_W73J',
    sslValidateCertificate: 'false'
};

const factory = {
    create: () => {
        return new Promise((resolve, reject) => {
            const conn = hana.createConnection();
            conn.connect(connOptions, (err) => {
                if (err) {
                    reject(err);
                } else {
                    console.log("Connected to cloud db");
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

const cloudPool = createPool(factory, {
    max: 10,
    min: 2
});

module.exports = cloudPool;
