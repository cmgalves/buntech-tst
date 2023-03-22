express = require('express');
bodyParser = require('body-parser');
config = require('./config');

const app = express();
const porta = 888; //porta padrão

// Filiais:101,117,107
// 10.3.0.92
// Usuário: pcp
// Senha: Dev!@PCP

var conArr = config.conf(porta);

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
rota.get('/', (req, res) => res.json({ mensagem: `json pronto no endereço http://10.3.0.48:${porta}` }));
app.use('/', rota);

//inicia servidor
app.listen(porta);
console.log(`iniciando json na porta: ${porta}`);

function execSQL(sql, res) {
    global.conexao.request()
        .query(sql)
        .then(resultado => res.json(resultado.recordset))
        .catch(erro => res.json(erro));
}


//excel dos status dos pedidos
rota.post('/incluiAlteraUsuario', (req, res) => {
    let xcSql = '';

    const codUser = req.body.codUser;
    const empresa = req.body.empresa;
    const nome = req.body.nome;
    const email = req.body.email;
    const senha = req.body.senha;
    const perfil = req.body.perfil;
    const depto = req.body.depto;
    const telefone = req.body.telefone;

    xcSql += "EXEC "
    xcSql += "	sp_incluiAlteraUsuario "
    xcSql += "  " + codUser + ",  "
    xcSql += "  '" + empresa + "', "
    xcSql += "  '" + nome + "', "
    xcSql += "  '" + email + "', "
    xcSql += "  '" + senha + "', "
    xcSql += "  '" + perfil + "', "
    xcSql += "  '" + depto + "', "
    xcSql += "  '" + telefone + "' "


    console.log(xcSql)
    execSQL(xcSql, res);

})

//Altera a Senha do usuário
rota.post('/alteraSenhaUsuario', (req, res) => {
    let xcSql = '';

    const codUser = req.body.codUser;
    const senhaNew = req.body.senhaNew;

    xcSql += "EXEC "
    xcSql += "	sp_alteraSenhaUsuario "
    xcSql += "  " + codUser + ",  "
    xcSql += "  '" + senhaNew + "' "


    console.log(xcSql)
    execSQL(xcSql, res);

})

//excel dos status dos pedidos
rota.post('/cadUsuarios', (req, res) => {
    let xcSql = '';

    const senPass = req.body.senPass;

    xcSql += "SELECT "
    xcSql += "	codigo, empresa, nome, senha,  "
    xcSql += "	email, perfil, depto, telefone "
    xcSql += "FROM "
    xcSql += "	PCP..usuarios "

    console.log(xcSql)
    execSQL(xcSql, res);

})

//excel dos status dos pedidos
rota.post('/ops', (req, res) => {
    let xcSql = '';

    const perfil = req.body.perfil;
    const filial = req.body.filial;

    xcSql += "SELECT "
    xcSql += "	* "
    xcSql += "FROM "
    xcSql += "	PCF_Integ..View_pcf "
    if (perfil !== 'Administrador') {
        xcSql += "WHERE "
        xcSql += "	1 = 1 "
        xcSql += "	AND '" + filial + "' LIKE '%' + filial + '%' "
    }
    xcSql += "ORDER BY "
    xcSql += "	filial, op, operacao "

    console.log(xcSql)
    execSQL(xcSql, res);

})


// deixa sempre por �ltimo
//excel dos status dos pedidos
rota.post('/tblOutInteg', (req, res) => {
    let xcSql = '';

    xcSql += "SELECT "
    xcSql += "	* "
    xcSql += "FROM "
    xcSql += "	PCF_Integ..View_tblOutInteg "

    console.log(xcSql)
    execSQL(xcSql, res);
})


//mantem sempre no final, n�o seu o que �
rota.post('/salvaJSON', (req, res) => {
    fs.writeFile(req.body.arquivo, req.body.json);
})