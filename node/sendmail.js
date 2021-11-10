express = require('express');
fs = require('fs');
bodyParser = require('body-parser');
const app = express();
const porta = 94; //porta padrão
const sql = require('mssql');
const conexaoStr = "Server=172.16.20.20;Database=JSON;User Id=json;Password=json;";

// configuração do sendmail
const nodemailer = require('nodemailer');



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
rota.get('/', (requisicao, resposta) => resposta.json({ mensagem: 'json funcionando' }));
app.use('/', rota);

//inicia servidor
app.listen(porta);
console.log('Api para Geração de JSON, funcionando OK');

function execSQL(sql, resposta) {
    global.conexao.request()
        .query(sql)
        .then(resultado => resposta.json(resultado.recordset))
        .catch(erro => resposta.json(erro));
}

var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: 'portalmartinbi@gmail.com',
        pass: '.martinadm.'
    }
})

rota.get('/sendmail', (req, res) => {
    const message = {
        from: 'portalmartinbi@gmail.com',
        to: 'cmgalves@gmail.com',
        subject: 'teste de envio',
        text: 'teste de envio'
    };

    transporter.sendMail(message,(err, inf)=>{
        if (err) {
            return res.status(400).send('falha');
        } else {
            return res.status(200).send('foi');
        }

    });
    
})
//excel dos status dos pedidos
rota.get('/comercialStatus', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "SELECT "
    xcSql += "   * "
    xcSql += "FROM "
    xcSql += "   vw_comercialStatus "
    xcSql += "ORDER BY "
    xcSql += "   1,9,10 "

    console.log(xcSql)
    execSQL(xcSql, resposta);

})


//excel dos status dos pedidos
rota.get('/USER', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "SELECT "
    xcSql += "   * "
    xcSql += "FROM "
    xcSql += "   [JSON].dbo.USUARIO "
    xcSql += "ORDER BY "
    xcSql += "   1 "

    console.log(xcSql)
    execSQL(xcSql, resposta);

})


//excel dos status dos pedidos
rota.get('/CLIENTES', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "SELECT "
    xcSql += "   * "
    xcSql += "FROM "
    xcSql += "   [JSON].dbo.CLIENTES "
    xcSql += "ORDER BY "
    xcSql += "   2, 3 "

    console.log(xcSql)
    execSQL(xcSql, resposta);

})




//mantem sempre no final, n�o seu o que �
rota.post('/salvaJSON', (requisicao, resposta) => {
    fs.writeFile(requisicao.body.arquivo, requisicao.body.json);
})