express = require('express');
fs = require('fs');
bodyParser = require('body-parser');
const app = express();
const porta = 885; //porta padrão
const sql = require('mssql');
// const conexaoStr = "Server=BRCG02PCF01;Database=PCP;User Id=pcp;Password=Dev!@PCP;";
const conexaoStr = {
    "user": 'consulta',
    "password": 'sigasigasiga',
    "server": '10.3.0.44\\SQLPROTHEUS',
    "database": 'TMPRD',
    "port": 1433,
    "options": {
        "encrypt": true,
        "enableArithAbort": true
    },
    "dialect": "mssql",
    "dialectOptions": {
        "instanceName": "SQLPROTHEUS"
    }
};

//conexao com BD
sql.connect(conexaoStr)
    .then(conexao => global.conexao = conexao)
    .catch(erro => console.log(erro));

// configurando o body parser para pegar POSTS mais tarde   
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//acrescentando informacoes de cabecalho para suportar o CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PATCH, DELETE");
    next();
});
//definindo as rotas
const rota = express.Router();
rota.get('/', (req, res) => res.json({ mensagem: 'json ok' }));
app.use('/', rota);

//inicia servidor
app.listen(porta);
console.log('gerando json');

function execSQL(sql, res) {
    global.conexao.request()
        .query(sql)
        .then(resultado => res.json(resultado.recordset))
        .catch(erro => res.json(erro));
}


//Ordens de produção abertas ou fechadas recentemente
rota.post('/ordemProducaoAndamento', (req, res) => {
    let xcSql = '';
    const filial = req.body.filial;
    const op = req.body.op;
    xcSql += "SELECT "
    xcSql += "	* "
    xcSql += "FROM "
    xcSql += "	DESENVOLVIMENTO..View_Portal_OP "
    xcSql += "WHERE "
    xcSql += "  1 = 1 "
    xcSql += "	AND FILIAL = '" + filial + "' "
    xcSql += "	AND OP = '" + op + "' "

    console.log(xcSql)
    execSQL(xcSql, res);

})


//mantem sempre no final, n�o seu o que �
rota.post('/salvaJSON', (req, res) => {
    fs.writeFile(req.body.arquivo, req.body.json);
})