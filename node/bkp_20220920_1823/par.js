express = require('express');
fs = require('fs');
bodyParser = require('body-parser');
const app = express();
const porta = 1020; //porta padrão
const sql = require('mssql');


const conexaoStr = {
    "user": 'sql_ppi',
    "password": 'pcf',
    "server": '10.3.0.44\\SQLPROTHEUS',
    "database": 'PCP',
    "type": "mssql",
    "host": "10.3.0.204",
    "port": 1433, // make sure to change port
    "stream": false,
    "options": {
      "trustedConnection": true,
      "encrypt": true,
      "enableArithAbort": true,
      "trustServerCertificate": true,
    },
    "dialect": "mssql",
    "dialectOptions": {
        "instanceName": "MSSQLSERVER"
    },
};

//conexao com BD
sql.connect(conexaoStr)
    .then(conexao => global.conexao = conexao)
    .catch(erro => console.log(erro));

// configurando o body parser para pegar POSTS mais tarde   
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//acrescentando informacoes de cabecalho para suportar o CORS
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PATCH, DELETE");
    next();
});
//definindo as rotas
const rota = express.Router();
rota.get('/', (req, res) => res.json({ mensagem: 'json ok ambiente produção - banco protheus' }));
app.use('/', rota);

//inicia servidor
app.listen(porta);
console.log('json ok');

function execSQL(sql, res) {
    global.conexao.request()
        .query(sql)
        .then(resultado => res.json(resultado.recordset))
        .catch(erro => res.json(erro));
}


//excel dos status dos pedidos
rota.get('/883', (req, res) => {
    let xcSql = '';

    xcSql += "SELECT"
    xcSql += " * "
    xcSql += "FROM"
    xcSql += " parametros "
    xcSql += "WHERE"
    xcSql += " conect = '883'"

    console.log(xcSql)
    execSQL(xcSql, res);

})


//mantem sempre no final, n�o seu o que �
rota.post('/salvaJSON', (req, res) => {
    fs.writeFile(req.body.arquivo, req.body.json);
})