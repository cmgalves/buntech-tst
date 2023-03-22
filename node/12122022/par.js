express = require('express');
bodyParser = require('body-parser');
config = require('./config');
const sql = require('mssql');
const app = express();
const porta = 900; //porta padrão


const conexaoStr = {
    "user": 'sql_ppi',
    "password": 'pcf',
    "server": '10.3.0.44\\SQLPROTHEUS',
    "database": 'PCP',
    "type": "mssql",
    "port": 1433, // make sure to change port
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


//Conexão banco de dados da porta 785
rota.get('/785', (req, res) => {
    let xcSql = '';

    const param = req.body.param;

    xcSql += "SELECT"
    xcSql += " * "
    xcSql += "FROM"
    xcSql += " parametros "
    xcSql += "WHERE"
    xcSql += " conect = '785'"

    console.log(xcSql)
    execSQL(xcSql, res);

});

//Conexão banco de dados da porta 786
rota.get('/786', (req, res) => {
    let xcSql = '';

    const param = req.body.param;

    xcSql += "SELECT"
    xcSql += " * "
    xcSql += "FROM"
    xcSql += " parametros "
    xcSql += "WHERE"
    xcSql += " conect = '786'"

    console.log(xcSql)
    execSQL(xcSql, res);

});

//Conexão banco de dados da porta 787
rota.get('/787', (req, res) => {
    let xcSql = '';

    const param = req.body.param;

    xcSql += "SELECT"
    xcSql += " * "
    xcSql += "FROM"
    xcSql += " parametros "
    xcSql += "WHERE"
    xcSql += " conect = '787'"

    console.log(xcSql)
    execSQL(xcSql, res);

});

//Conexão banco de dados da porta 788
rota.get('/788', (req, res) => {
    let xcSql = '';

    const param = req.body.param;

    xcSql += "SELECT"
    xcSql += " * "
    xcSql += "FROM"
    xcSql += " parametros "
    xcSql += "WHERE"
    xcSql += " conect = '788'"

    console.log(xcSql)
    execSQL(xcSql, res);

});

//Conexão banco de dados da porta 883
rota.get('/883', (req, res) => {
    let xcSql = '';

    const param = req.body.param;

    xcSql += "SELECT"
    xcSql += " * "
    xcSql += "FROM"
    xcSql += " parametros "
    xcSql += "WHERE"
    xcSql += " conect = '883'"

    console.log(xcSql)
    execSQL(xcSql, res);

});

//Conexão banco de dados da porta 884
rota.get('/884', (req, res) => {
    let xcSql = '';

    const param = req.body.param;

    xcSql += "SELECT"
    xcSql += " * "
    xcSql += "FROM"
    xcSql += " parametros "
    xcSql += "WHERE"
    xcSql += " conect = '884'"

    console.log(xcSql)
    execSQL(xcSql, res);

});

//Conexão banco de dados da porta 886
rota.get('/886', (req, res) => {
    let xcSql = '';

    const param = req.body.param;

    xcSql += "SELECT"
    xcSql += " * "
    xcSql += "FROM"
    xcSql += " parametros "
    xcSql += "WHERE"
    xcSql += " conect = '886'"

    console.log(xcSql)
    execSQL(xcSql, res);

});

//Conexão banco de dados da porta 887
rota.get('/887', (req, res) => {
    let xcSql = '';

    const param = req.body.param;

    xcSql += "SELECT"
    xcSql += " * "
    xcSql += "FROM"
    xcSql += " parametros "
    xcSql += "WHERE"
    xcSql += " conect = '887'"

    console.log(xcSql)
    execSQL(xcSql, res);

});

//Conexão banco de dados da porta 888
rota.get('/888', (req, res) => {
    let xcSql = '';

    const param = req.body.param;

    xcSql += "SELECT"
    xcSql += " * "
    xcSql += "FROM"
    xcSql += " parametros "
    xcSql += "WHERE"
    xcSql += " conect = '888'"

    console.log(xcSql)
    execSQL(xcSql, res);

});

//Conexão banco de dados do REST restprd
rota.get('/restprd', (req, res) => {
    let xcSql = '';

    xcSql += "SELECT"
    xcSql += " conect, instanceName rest "
    xcSql += "FROM"
    xcSql += " parametros "
    xcSql += "WHERE"
    xcSql += " conect = 'restprd'"

    console.log(xcSql)
    execSQL(xcSql, res);

});

//Conexão banco de dados do REST resttst
rota.get('/resttst', (req, res) => {
    let xcSql = '';

    xcSql += "SELECT"
    xcSql += " conect, instanceName rest "
    xcSql += "FROM"
    xcSql += " parametros "
    xcSql += "WHERE"
    xcSql += " conect = 'resttst'"

    console.log(xcSql)
    execSQL(xcSql, res);

});

//Tabela com todas as configurações
rota.get('/config', (req, res) => {
    let xcSql = '';

    xcSql += "SELECT"
    xcSql += " conect, usur, pass, serv, db, tipo, host,"
    xcSql += " prt, encrypt, enableArithAbort, dialect, instanceName "
    xcSql += "FROM"
    xcSql += " parametros "
    xcSql += "ORDER BY"
    xcSql += " 1"

    console.log(xcSql)
    execSQL(xcSql, res);

});


//Atualiza a tabela de OP 
rota.post('/altParametros', (req, res) => {
    let xcSql = '';
    // --sp_incluiAlteraUsuario '785', 'sql_ppi', 'pcf', '10.3.0.44\SQLPROTHEUS', 'TMPRD', 'mssql', '10.3.0.44', '1433', '1', '1', 'mssql', 'SQLPROTHEUS'

    const conect = req.body.conect;
    const usur = req.body.usur;
    const pass = req.body.pass;
    const serv = req.body.serv;
    const db = req.body.db;
    const tipo = req.body.tipo;
    const host = req.body.host;
    const prt = req.body.prt;
    const encrypt = req.body.encrypt;
    const enableArithAbort = req.body.enableArithAbort;
    const dialect = req.body.dialect;
    const instanceName = req.body.instanceName;

    xcSql += "EXEC "
    xcSql += "	PCP..sp_altParametros "
    xcSql += "  '" + conect + "', "
    xcSql += "  '" + usur + "', "
    xcSql += "  '" + pass + "', "
    xcSql += "  '" + serv + "', "
    xcSql += "  '" + db + "', "
    xcSql += "  '" + tipo + "', "
    xcSql += "  '" + host + "', "
    xcSql += "  '" + prt + "', "
    xcSql += "  '" + encrypt + "', "
    xcSql += "  '" + enableArithAbort + "', "
    xcSql += "  '" + dialect + "', "
    xcSql += "  '" + instanceName + "' "

    console.log(xcSql)
    execSQL(xcSql, res);

})