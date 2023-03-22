const sql = require('mssql');
const fetch = require('node-fetch');

function conf(tp) {
    var url = 'http://10.3.0.48:900/' + tp
    var conectJson = {}

    fetch(url)
        .then((response) => {
            // console.log(response)
            return response.json();
        })
        .then((data) => {
            let x = data[0];
            conectJson = {
                "user": x.usur,
                "password": x.pass,
                "server": x.serv,
                "database": x.db,
                "type": x.tipo,
                "host": x.host,
                "port": parseInt(x.prt), // make sure to change port
                "stream": false,
                "options": {
                    "trustedConnection": true,
                    "encrypt": x.encrypt == 1 ? true : false,
                    "enableArithAbort": x.enableArithAbort == 1 ? true : false,
                    "trustServerCertificate": true,
                },
                "dialect": x.dialect,
                "dialectOptions": {
                    "instanceName": x.instanceName
                },
            };
            // console.log(conectJson)
            sql.connect(conectJson)
                .then(conexao => global.conexao = conexao)
                .catch(erro => console.log(erro));
        })
}

module.exports = { conf };