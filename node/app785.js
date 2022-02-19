express = require('express');
fs = require('fs');
bodyParser = require('body-parser');
const app = express();
const porta = 785; //porta padrão
const sql = require('mssql');


const conexaoStr = {
    "user": 'sql_ppi',
    "password": 'pcf',
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
rota.post('/empresasBuntech', (req, res) => {
    let xcSql = '';

    // const diade = req.body.diade;
    // const diate = req.body.diate;
    // const atend = req.body.atend;
    xcSql += "SELECT "
    xcSql += "	rtrim(codEmp) codEmp, rtrim(codFil) codFil, "
    xcSql += "  rtrim(nomeFil) nomeFil, rtrim(nomeComercial) nomeComercial "
    xcSql += "FROM "
    xcSql += "	TMPRD..View_Portal_Empresa "

    console.log(xcSql)
    execSQL(xcSql, res);

})

//Ordens de produção abertas ou fechadas recentemente
rota.post('/ordemProducaoAndamento', (req, res) => {
    let xcSql = '';

    xcSql += "SELECT DISTINCT "
    xcSql += "	FILIAL, OP, PRODUTO, EMISSAO, QTDE, ENTREGUE, FINAL, DTFIM "
    xcSql += "FROM "
    xcSql += "	TMPRD..View_Portal_OP "


    console.log(xcSql)
    execSQL(xcSql, res);

})

//Ordens de produção abertas ou fechadas recentemente
rota.post('/opAndamento', (req, res) => {
    let xcSql = '';
    const filial = req.body.filial;
    const op = req.body.op;
    const tipo = req.body.tipo;
    xcSql += "SELECT "
    xcSql += "	* "
    xcSql += "FROM "
    xcSql += "	PCP..View_Portal_Op_Transf "
    xcSql += "WHERE "
    xcSql += "  1 = 1 "
    xcSql += "	AND FILIAL = '" + filial + "' "
    xcSql += "	AND OP = '" + op + "' "
    if (tipo !== 'tudo') {
        xcSql += "	AND SITUACA = 'I' "
    }
    console.log(xcSql)
    execSQL(xcSql, res);
})


//Ordens de produção abertas ou fechadas recentemente
rota.post('/cadastroProdutos', (req, res) => {
    let xcSql = '';

    const produto = req.body.produto;

    xcSql += "SELECT "
    xcSql += "	* "
    xcSql += "FROM "
    xcSql += "	TMPRD..View_Portal_Cadastro_Produto "
    if (produto !== '') {
        xcSql += "WHERE "
        xcSql += "	codigo = '" + produto + "' "
    }
    xcSql += "ORDER BY "
    xcSql += "	codigo "

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
    xcSql += "	TMPRD..View_Portal_Estrutura "
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
    xcSql += "	TMPRD..View_Portal_Cadastro_Recursos "
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
    xcSql += "	TMPRD..View_Portal_Saldo_Estoque "
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

//Atualiza a tabela de OP 
rota.post('/atualiza_OP', (req, res) => {
    let xcSql = '';

    const filial = req.body.filial;
    const op = req.body.op;

    xcSql += "EXEC "
    xcSql += "	PCP..sp_atualiza_OP "
    xcSql += "  " + filial + ",  "
    xcSql += "  '" + op + "' "


    console.log(xcSql)
    execSQL(xcSql, res);

})

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
    xcSql += "	PCP..sp_incluiAlteraUsuario "
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
    xcSql += "	PCP..sp_alteraSenhaUsuario "
    xcSql += "  " + codUser + ",  "
    xcSql += "  '" + senhaNew + "' "


    console.log(xcSql)
    execSQL(xcSql, res);

})

//Atualiza a tabela de OP 
rota.post('/calcOP', (req, res) => {
    let xcSql = '';

    const FILIAL = req.body.FILIAL;
    const OP = req.body.OP;
    const PRODUTO = req.body.PRODUTO;
    const DESCPROD = req.body.DESCPROD;
    const CODANT = req.body.CODANT;
    const COMPONENTE = req.body.COMPONENTE;
    const DESCCOMP = req.body.DESCCOMP;
    const TIPO = req.body.TIPO;
    const SITUACA = req.body.SITUACA;
    const UNIDADE = req.body.UNIDADE;
    const QTDEPCF = req.body.QTDEPCF;
    const QTDEINF = req.body.QTDEINF;

    xcSql += "EXEC "
    xcSql += "	PCP..sp_ajusta_OP "
    xcSql += "  '" + FILIAL + "', "
    xcSql += "  '" + OP + "', "
    xcSql += "  '" + PRODUTO + "', "
    xcSql += "  '" + DESCPROD + "', "
    xcSql += "  '" + CODANT + "', "
    xcSql += "  '" + COMPONENTE + "', "
    xcSql += "  '" + DESCCOMP + "', "
    xcSql += "  '" + TIPO + "', "
    xcSql += "  '" + SITUACA + "', "
    xcSql += "  '" + UNIDADE + "', "
    xcSql += "  " + QTDEPCF + ", "
    xcSql += "  " + QTDEINF + " "


    console.log(xcSql)
    execSQL(xcSql, res);

})

//Produção Parcial da OP
rota.post('/produzOP', (req, res) => {
    let xcSql = '';

    const filial = req.body.filial;
    const op = req.body.op;
    const qtde = req.body.qtde;
    const tipo = req.body.tipo;

    xcSql += "EXEC "
    xcSql += "	PCP..sp_produzOP "
    xcSql += "  '" + filial + "',  "
    xcSql += "  '" + op + "', "
    xcSql += "  " + qtde + ", "
    xcSql += "  '" + tipo + "' "


    console.log(xcSql)
    execSQL(xcSql, res);

})


// deixa sempre por último
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