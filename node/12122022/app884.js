express = require('express');
bodyParser = require('body-parser');
config = require('./config');

const app = express();
const porta = 884; //porta padrão - HOMOLOGACAO

var conArr = config.conf(porta);

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
rota.post('/empresasBuntech', (req, res) => {
    let xcSql = '';

    // const diade = req.body.diade;
    // const diate = req.body.diate;
    // const atend = req.body.atend;
    xcSql += "SELECT "
    xcSql += "	rtrim(codEmp) codEmp, rtrim(codFil) codFil, "
    xcSql += "  rtrim(nomeFil) nomeFil, rtrim(nomeComercial) nomeComercial "
    xcSql += "FROM "
    xcSql += "	HOMOLOGACAO..View_Portal_Empresa "

    console.log(xcSql)
    execSQL(xcSql, res);

})

//Ordens de produção abertas ou fechadas recentemente
rota.post('/ordemProducaoAndamento', (req, res) => {
    let xcSql = '';
    const filial = req.body.filial;
    const op = req.body.op;
    xcSql += "SELECT "
    xcSql += "	* "
    xcSql += "FROM "
    xcSql += "	HOMOLOGACAO..View_Portal_OP "
    xcSql += "WHERE "
    xcSql += "  1 = 1 "
    xcSql += "	AND FILIAL = '" + filial + "' "
    xcSql += "	AND OP = '" + op + "' "

    console.log(xcSql)
    execSQL(xcSql, res);

})


//Cadastro de Produtos por view
rota.post('/cadastroProdutos', (req, res) => {
    let xcSql = '';

    const produto = req.body.produto;

    xcSql += "SELECT "
    xcSql += "	* "
    xcSql += "FROM "
    xcSql += "	HOMOLOGACAO..View_Portal_Cadastro_Produto "
    if (produto !== '') {
        xcSql += "WHERE "
        xcSql += "	codigo = '" + produto + "' "
    }
    xcSql += "ORDER BY "
    xcSql += "	codigo "

    console.log(xcSql)
    execSQL(xcSql, res);

})


//Cadastro de Produtos para qualidade por view
rota.post('/cadastroCaracteristicas', (req, res) => {
    let xcSql = '';

    xcSql += "SELECT "
    xcSql += "	codCarac, descCarac "
    xcSql += "FROM "
    xcSql += "	PCP..qualCarac "
    xcSql += "ORDER BY "
    xcSql += "	codCarac "

    console.log(xcSql)
    execSQL(xcSql, res);

})

//Ordens de produção abertas ou fechadas recentemente
rota.post('/cadEstruturas', (req, res) => {
    let xcSql = '';

    const filial = req.body.filial;
    const produto = req.body.produto;

    xcSql += "SELECT "
    xcSql += "	* "
    xcSql += "FROM "
    xcSql += "	HOMOLOGACAO..View_Portal_Estrutura "
    if (produto !== '') {
        xcSql += "WHERE "
        xcSql += "	codPai = '" + produto + "' AND "
        xcSql += "	filial = '" + filial + "'  "
    }
    xcSql += "ORDER BY "
    xcSql += "	filial, codPai "

    console.log(xcSql)
    execSQL(xcSql, res);

})

//Ordens de produção abertas ou fechadas recentemente
rota.post('/cadRecursos', (req, res) => {
    let xcSql = '';

    const filial = req.body.filial;
    const codigo = req.body.codigo;

    xcSql += "SELECT "
    xcSql += "	* "
    xcSql += "FROM "
    xcSql += "	HOMOLOGACAO..View_Portal_Cadastro_Recursos "
    if (codigo !== '') {
        xcSql += "WHERE "
        xcSql += "	codigo = '" + codigo + "' AND "
        xcSql += "	filial = '" + filial + "'  "
    }
    xcSql += "ORDER BY "
    xcSql += "	filial, codigo "

    console.log(xcSql)
    execSQL(xcSql, res);

})


//Ordens de produção abertas ou fechadas recentemente
rota.post('/cadSaldos', (req, res) => {
    let xcSql = '';

    const filial = req.body.filial;
    const codigo = req.body.codigo;
    const armazem = req.body.armazem;

    xcSql += "SELECT "
    xcSql += "	* "
    xcSql += "FROM "
    xcSql += "	HOMOLOGACAO..View_Portal_Saldo_Estoque "
    if (codigo !== '') {
        xcSql += "WHERE "
        xcSql += "	codigo = '" + codigo + "' AND "
        xcSql += "	armazem = '" + armazem + "' AND "
        xcSql += "	filial = '" + filial + "'  "
    }
    xcSql += "ORDER BY "
    xcSql += "	filial, armazem, codigo "

    console.log(xcSql)
    execSQL(xcSql, res);

});

//Cadastro de Produtos para qualidade por view
rota.post('/cadastroEspecificacoes', (req, res) => {
    let xcSql = '';

    xcSql += "SELECT "
    xcSql += "	codCarac, descCarac "
    xcSql += "FROM "
    xcSql += "	PCP..qualCarac "
    xcSql += "ORDER BY "
    xcSql += "	codCarac "

    console.log(xcSql)
    execSQL(xcSql, res);

})

//Cadastro de Produtos para qualidade por view
rota.post('/cadastroProdutosQualidade', (req, res) => {
    let xcSql = '';

    xcSql += "SELECT "
    xcSql += "	* "
    xcSql += "FROM "
    xcSql += "	HOMOLOGACAO..View_Portal_Cadastro_Produto_Qualidade "
    xcSql += "ORDER BY "
    xcSql += "	codigo "

    console.log(xcSql)
    execSQL(xcSql, res);

})


//relação dos itens revisados
rota.post('/relacaoCarac', (req, res) => {
    let xcSql = '';

    xcSql += "SELECT "
    xcSql += "   codCarac, rtrim(descCarac) descCarac "
    xcSql += "FROM "
    xcSql += "    PCP..qualCarac "

    console.log(xcSql)
    execSQL(xcSql, res);

})