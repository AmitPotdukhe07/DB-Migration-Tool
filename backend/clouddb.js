// const hana = require('@sap/hana-client');

// function connectAndQuery() {
//     const conn = hana.createConnection();
//     const connParams = {
//         serverNode: 'a01b6234-5e6c-4922-92d9-f65b0a68b4e7.hna0.prod-eu10.hanacloud.ondemand.com:443',
//         uid: 'EB93A40F16A74D0AAEA7CAFE5FD57CE0_812SAMA68QIEBN7TVEX21ESCC_RT',
//         pwd: 'Fe82BW3W68OF7dbAK8d7rj37E7nTqJTEoTdFy0umfloeahnIYEzFwRZLXCoc5eIERRYZZxCGKiVsIUdX0NPOPIWwT224L8hBMlLn45QQRNJI1UWdia2Yhfp05qB_W73J',
//         sslValidateCertificate: 'false'
//     };

//     conn.connect(connParams, (err) => {
//         if (err) {
//             return console.error('Connection error', err);
//         }
//         console.log('Connected to SAP HANA bhok me');
//         const createTableSQL = `
//         CREATE TABLE testatble (
//           ID INTEGER PRIMARY KEY,
//           NAME NVARCHAR(100),
//           CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//         )
//       `;
//         conn.exec(createTableSQL, (err, rows) => {
//             if (err) {
//                 return console.error('Query error', err);
//             }
//             console.log('Query result:', rows);

//             conn.disconnect((err) => {
//                 if (err) {
//                     return console.error('Disconnection error', err);
//                 }
//                 console.log('Disconnected from SAP HANA');
//             });
//         });
//     });
// }

// connectAndQuery();


const hana = require('@sap/hana-client');

const conn = hana.createConnection();
const connParams = {
    serverNode: 'a01b6234-5e6c-4922-92d9-f65b0a68b4e7.hna0.prod-eu10.hanacloud.ondemand.com:443',
    uid: 'DBUSER',
    pwd: 'Crave@12345',
};

conn.connect(connParams, (err) => {
    if (err) {
        return console.error('Error connecting to SAP HANA:', err);
    }
    console.log('Connected to SAP HANA');

    const grantPrivilegeSQL = `
    GRANT CREATE ANY ON SCHEMA EB93A40F16A74D0AAEA7CAFE5FD57CE0 TO DBUSER
  `;

    conn.exec(grantPrivilegeSQL, (err, result) => {
        if (err) {
            return console.error('Error granting privilege:', err);
        }
        console.log('Privilege granted successfully');

        const createTableSQL = `
      CREATE TABLE EB93A40F16A74D0AAEA7CAFE5FD57CE0.Test_new (
            ID INTEGER PRIMARY KEY,
            NAME NVARCHAR(100),
            AGE INTEGER,
            CREATED_AT TIMESTAMP
        )
    `;

        conn.exec(createTableSQL, (err, result) => {
            if (err) {
                return console.error('Error creating table:', err);
            }
            console.log('Table created successfully');

            conn.disconnect((err) => {
                if (err) {
                    return console.error('Error disconnecting from SAP HANA:', err);
                }
                console.log('Disconnected from SAP HANA');
            });
        });
    });
});
