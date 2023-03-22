express = require('express');
bodyParser = require('body-parser');
config = require('./config');

const app = express();
const porta = 885; //porta padrão - HOMOLOGACAO

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
// rota.get('/clau', (req, res) => res.json({ mensagem: `teste claudio teste` }));
app.use('/', rota);

//inicia servidor
app.listen(porta);
console.log(`json pronto no endereço http://10.3.0.48:${porta}`);

function execSQL(sql, res) {
    global.conexao.request()
        .query(sql)
        .then(resultado => res.json(resultado.recordset))
        .catch(erro => res.json(erro));
}

//Cadastro de Produtos por view
rota.post('/cadastroProdutos', (req, res) => {
    let xcSql = '';

    const produto = req.body.produto;

    xcSql += "SELECT "
    xcSql += "	* "
    xcSql += "FROM "
    xcSql += "	PCP..View_Portal_Cadastro_Produto "
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

//excel dos status dos pedidos
rota.post('/empresasBuntech', (req, res) => {
    let xcSql = '';

    xcSql += "SELECT "
    xcSql += "	rtrim(codEmp) codEmp, rtrim(codFil) codFil, "
    xcSql += "  rtrim(nomeFil) nomeFil, rtrim(nomeComercial) nomeComercial "
    xcSql += "FROM "
    xcSql += "	PCP..View_Portal_Empresa "

    console.log(xcSql)
    execSQL(xcSql, res);

})

//Ordens de produção abertas ou fechadas recentemente
rota.post('/ordemProducaoAndamento', (req, res) => {
    let xcSql = '';

    const op = req.body.op;

    xcSql += "SELECT DISTINCT "
    xcSql += "	FILIAL, OP, PRODUTO, EMISSAO, QTDE, ENTREGUE, FINAL, DTFIM "
    xcSql += "FROM "
    xcSql += "	PCP..View_Portal_OP "


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
rota.post('/cadEstruturas', (req, res) => {
    let xcSql = '';

    const filial = req.body.filial;
    const produto = req.body.produto;

    xcSql += "SELECT "
    xcSql += "	* "
    xcSql += "FROM "
    xcSql += "	PCP..View_Portal_Estrutura "
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
    xcSql += "	PCP..View_Portal_Cadastro_Recursos "
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
    xcSql += "	PCP..View_Portal_Saldo_Estoque "
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

    xcSql += "SELECT "
    xcSql += "	codigo, empresa, nome, senha,  "
    xcSql += "	email, perfil, depto, telefone "
    xcSql += "FROM "
    xcSql += "	PCP..usuarios "

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
    xcSql += "  " + nome + "', "
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

//Documentos da OP
rota.post('/documentosOpCabec', (req, res) => {
    let xcSql = '';

    const filial = req.body.filial;
    const op = req.body.op;

    xcSql += "SELECT DISTINCT "
    xcSql += "    RTRIM(filial) filial, "
    xcSql += "    RTRIM(op) op, RTRIM(produto) produto, "
    xcSql += "    RTRIM(descricao) descricao, qtdeori,  "
    xcSql += "    CONVERT(VARCHAR(10), CAST(datadoc AS DATETIME), 103) datadoc, "
    xcSql += "    CONVERT(VARCHAR(10), CAST(emissao AS DATETIME), 103) emissao "
    xcSql += "FROM "
    xcSql += "  PCP..DOC "
    xcSql += "WHERE "
    xcSql += "	1 = 1 "
    xcSql += "	AND filial = '" + filial + "' "
    xcSql += "	AND op = '" + op + "' "

    console.log(xcSql)
    execSQL(xcSql, res);
})




//lista de documentos por OP, por filial e por data
rota.post('/documentosOpLista', (req, res) => {
    let xcSql = '';

    const filial = req.body.filial;
    const op = req.body.op;
    const datadoc = req.body.datadoc;

    xcSql += "SELECT DISTINCT "
    xcSql += "    * "
    xcSql += "FROM "
    xcSql += "  PCP..DOC A INNER JOIN "
    xcSql += "  PCP..DOCITENS ON "
    xcSql += "  1 = 1 "
    xcSql += "  AND filial = itfilial "
    xcSql += "  AND op = itop "
    xcSql += "  AND datadoc = itdatadoc "
    xcSql += "WHERE "
    xcSql += "	1 = 1 "
    xcSql += "	AND filial = '" + filial + "' "
    xcSql += "	AND op = '" + op + "' "
    xcSql += "	AND datadoc = '" + datadoc + "' "

    console.log(xcSql)
    execSQL(xcSql, res);
})


//Atualiza a tabela de OP 
rota.post('/atualizaDoc', (req, res) => {
    let xcSql = '';

    const tipo = req.body.tipo;
    const filial = req.body.filial;
    const op = req.body.op;
    const datadoc = req.body.datadoc;
    const qtdeinfo = req.body.qtdeinfo;
    const itComp = req.body.itComp;
    const itlote = req.body.itlote;

    xcSql += "EXEC "
    xcSql += "	PCP..sp_atualizaDoc "
    xcSql += "  " + tipo + ",  "
    xcSql += "  '" + filial + "',  "
    xcSql += "  '" + op + "', "
    xcSql += "  '" + datadoc + "', "
    xcSql += "  " + qtdeinfo + ", "
    xcSql += "  '" + itComp + "', "
    xcSql += "  '" + itlote + "' "


    console.log(xcSql)
    execSQL(xcSql, res);

})

//Atualiza o cabeçalho da tabela de DOC 
rota.post('/atualizaCabecDoc', (req, res) => {
    let xcSql = '';

    const filial = req.body.filial;
    const op = req.body.op;
    const datadoc = req.body.datadoc;
    const clotea = req.body.clotea;
    const cloteb = req.body.cloteb;
    const clotec = req.body.clotec;
    const cloted = req.body.cloted;
    const clotee = req.body.clotee;
    const clotef = req.body.clotef;
    const cloteg = req.body.cloteg;
    const cloteh = req.body.cloteh;
    const clotei = req.body.clotei;
    const clotej = req.body.clotej;
    const clotek = req.body.clotek;
    const clotel = req.body.clotel;
    const nlotea = req.body.nlotea;
    const nloteb = req.body.nloteb;
    const nlotec = req.body.nlotec;
    const nloted = req.body.nloted;
    const nlotee = req.body.nlotee;
    const nlotef = req.body.nlotef;
    const nloteg = req.body.nloteg;
    const nloteh = req.body.nloteh;
    const nlotei = req.body.nlotei;
    const nlotej = req.body.nlotej;
    const nlotek = req.body.nlotek;
    const nlotel = req.body.nlotel;
    const lider = req.body.lider;
    const processo = req.body.processo;
    const observ = req.body.observ;
    const turno1 = req.body.turno1;
    const turno2 = req.body.turno2;
    const turno3 = req.body.turno3;


    xcSql += "EXEC "
    xcSql += "	PCP..sp_atualizaCabecDoc "
    xcSql += "  '" + filial + "',  "
    xcSql += "  '" + op + "', "
    xcSql += "  '" + datadoc + "', "
    xcSql += "  '" + clotea + "', "
    xcSql += "  '" + cloteb + "', "
    xcSql += "  '" + clotec + "', "
    xcSql += "  '" + cloted + "', "
    xcSql += "  '" + clotee + "', "
    xcSql += "  '" + clotef + "', "
    xcSql += "  '" + cloteg + "', "
    xcSql += "  '" + cloteh + "', "
    xcSql += "  '" + clotei + "', "
    xcSql += "  '" + clotej + "', "
    xcSql += "  '" + clotek + "', "
    xcSql += "  '" + clotel + "', "
    xcSql += "  " + nlotea + ", "
    xcSql += "  " + nloteb + ", "
    xcSql += "  " + nlotec + ", "
    xcSql += "  " + nloted + ", "
    xcSql += "  " + nlotee + ", "
    xcSql += "  " + nlotef + ", "
    xcSql += "  " + nloteg + ", "
    xcSql += "  " + nloteh + ", "
    xcSql += "  " + nlotei + ", "
    xcSql += "  " + nlotej + ", "
    xcSql += "  " + nlotek + ", "
    xcSql += "  " + nlotel + ", "
    xcSql += "  '" + lider + "', "
    xcSql += "  '" + processo + "', "
    xcSql += "  '" + observ + "', "
    xcSql += "  '" + turno1 + "', "
    xcSql += "  '" + turno2 + "', "
    xcSql += "  '" + turno3 + "' "


    console.log(xcSql)
    execSQL(xcSql, res);

});


//lista de documentos por OP, por filial e por data
rota.post('/agrupaRecursos', (req, res) => {
    let xcSql = '';

    xcSql += "SELECT"
    xcSql += " * "
    xcSql += "FROM"
    xcSql += " PCP..recursos "
    xcSql += "WHERE"
    xcSql += " ativo = 'S' "

    console.log(xcSql)
    execSQL(xcSql, res);
});


//Inclusão de características no cadastro
rota.post('/incluiAlteraCaracteristica', (req, res) => {
    let xcSql = '';

    const tipoCarac = req.body.tipoCarac;
    const codCarac = req.body.codCarac;
    const descCarac = req.body.descCarac;

    xcSql += "EXEC "
    xcSql += "	PCP..sp_incluiAlteraCaracteristica "
    xcSql += "  '" + tipoCarac + "',  "
    xcSql += "  '" + codCarac + "', "
    xcSql += "  '" + descCarac + "'"

    console.log(xcSql)
    execSQL(xcSql, res);

})


//Inclusão de especificações 
rota.post('/incluiEspec', (req, res) => {
    let xcSql = '';

    const cabProduto = req.body.cabProduto;
    const descrProd = req.body.descrProd;
    const cabRevisao = req.body.cabRevisao;
    const dataAprov = req.body.dataAprov;
    const numEspec = req.body.numEspec;
    const situacao = req.body.situacao;
    const qualObsGeral = req.body.qualObsGeral;
    const qualObsRevisao = req.body.qualObsRevisao;
    const aplicacao = req.body.aplicacao;
    const embalagem = req.body.embalagem;
    const feitoPor = req.body.feitoPor;
    const aprovPor = req.body.aprovPor;
    const cTipo = req.body.cTipo;

    xcSql += "EXEC "
    xcSql += "	PCP..sp_incluiEspec "
    xcSql += " '" + cabProduto + "', "
    xcSql += " '" + descrProd + "', "
    xcSql += " '" + cabRevisao + "', "
    xcSql += " '" + dataAprov + "', "
    xcSql += " '" + numEspec + "', "
    xcSql += " '" + situacao + "', "
    xcSql += " '" + qualObsGeral + "', "
    xcSql += " '" + qualObsRevisao + "', "
    xcSql += " '" + aplicacao + "', "
    xcSql += " '" + embalagem + "', "
    xcSql += " '" + feitoPor + "', "
    xcSql += " '" + aprovPor + "', "
    xcSql += " '" + cTipo + "' "

    console.log(xcSql)
    execSQL(xcSql, res);

})


//Inclusão de especificações 
rota.post('/incluiEspecItens', (req, res) => {
    let xcSql = '';

    const iteProduto = req.body.iteProduto;
    const iteRevisao = req.body.iteRevisao;
    const iteCarac = req.body.iteCarac;
    const iteMin = req.body.iteMin;
    const iteMax = req.body.iteMax;
    const iteMeio = req.body.iteMeio;
    const itetxt = req.body.itetxt;
    const iteTp = req.body.iteTp;

    xcSql += "EXEC "
    xcSql += "	PCP..sp_incluiEspecItens "
    xcSql += " '" + iteProduto + "', "
    xcSql += " '" + iteRevisao + "', "
    xcSql += " '" + iteCarac + "', "
    xcSql += " " + iteMin + ", "
    xcSql += " " + iteMax + ", "
    xcSql += " '" + iteMeio + "', "
    xcSql += " '" + itetxt + "', "
    xcSql += " '" + iteTp + "' "

    console.log(xcSql)
    execSQL(xcSql, res);

})

//relação dos itens revisados
rota.post('/relacaoRevisaoEspec', (req, res) => {
    let xcSql = '';

    const cabProduto = req.body.cabProduto;

    xcSql += "SELECT "
    xcSql += "    * "
    xcSql += "FROM "
    xcSql += "    PCP..View_Relacao_Espec "
    xcSql += "WHERE "
    xcSql += "    1 = 1 "
    xcSql += "    and cabProduto = '" + cabProduto + "' "
    xcSql += "ORDER BY "
    xcSql += "    1,2,3 "

    console.log(xcSql)
    execSQL(xcSql, res);

})

//relação dos itens revisados
rota.post('/relacaoHistorico', (req, res) => {
    let xcSql = '';

    xcSql += "SELECT "
    xcSql += "    cabProduto, descrProd, cabRevisao, dataAprov, numEspec, "
    xcSql += "    case "
    xcSql += "         when isnull(rev, '') = '' "
    xcSql += "         then 'Fora Vigência' "
    xcSql += "         when isnull(situacao, '') = '' "
    xcSql += "         then 'Sem Epecificação' "
    xcSql += "         when isnull(situacao, '') <> '' "
    xcSql += "         then situacao "
    xcSql += "         else '' "
    xcSql += "     end situacao, "
    xcSql += "    qualObsGeral, qualObsRevisao, aplicacao, embalagem, feitoPor, aprovPor "
    xcSql += "FROM "
    xcSql += "    PCP..qualEspecCab a left join "
    xcSql += "	( "
    xcSql += "		select "
    xcSql += "			cabProduto prod, max(cabRevisao) rev "
    xcSql += "		from "
    xcSql += "			PCP..qualEspecCab "
    xcSql += "		group by "
    xcSql += "			cabProduto "
    xcSql += "	) b on "
    xcSql += "	1 = 1 "
    xcSql += "	and cabProduto = prod "
    xcSql += "	and cabRevisao = rev "
    xcSql += "ORDER BY "
    xcSql += "    1,2,3 "

    console.log(xcSql)
    execSQL(xcSql, res);

})

//relação dos itens revisados
rota.post('/relacaoHistoricoEspec', (req, res) => {
    let xcSql = '';

    const cabProduto = req.body.cabProduto;
    const cabRevisao = req.body.cabRevisao;

    xcSql += "SELECT "
    xcSql += "    * "
    xcSql += "FROM "
    xcSql += "    PCP..View_Relacao_Espec_Hist "
    xcSql += "WHERE "
    xcSql += "    1 = 1 "
    xcSql += "    and cabProduto = '" + cabProduto + "' "
    xcSql += "    and cabRevisao = '" + cabRevisao + "' "
    xcSql += "ORDER BY "
    xcSql += "    1,2,3 "

    console.log(xcSql)
    execSQL(xcSql, res);

})

//Cadastro de Produtos para qualidade por view
rota.post('/cadastroProdutosQualidade', (req, res) => {
    let xcSql = '';

    xcSql += "SELECT "
    xcSql += "	* "
    xcSql += "FROM "
    xcSql += "	PCP..View_Portal_Cadastro_Produto_Qualidade "
    xcSql += "ORDER BY "
    xcSql += "	codigo "

    console.log(xcSql)
    execSQL(xcSql, res);

})

//Cadastro de Lote por Produtos para qualidade por view
rota.post('/cadastroProdutosQualidadeLote', (req, res) => {
    let xcSql = '';

    xcSql += "SELECT "
    xcSql += "	* "
    xcSql += "FROM "
    xcSql += "	PCP..View_Portal_Cadastro_Produto_Qualidade_Lote "
    xcSql += "ORDER BY "
    xcSql += "	produto, revisao "

    console.log(xcSql)
    execSQL(xcSql, res);

})


//Cadastro de Produtos para qualidade por view
rota.post('/relacaoProdLote', (req, res) => {
    let xcSql = '';

    const produto = req.body.produto;

    xcSql += "SELECT "
    xcSql += "	* "
    xcSql += "FROM "
    xcSql += "	PCP..View_Relacao_Produto_Lote "
    xcSql += "WHERE "
    xcSql += "    1 = 1 "
    xcSql += "    and produto = '" + produto + "' "
    xcSql += "ORDER BY "
    xcSql += "	produto, revisao "

    console.log(xcSql)
    execSQL(xcSql, res);

})


//Inclusão de especificações 
rota.post('/manuLote', (req, res) => {
    let xcSql = '';

    const filial = req.body.filial;
    const op = req.body.op;
    const produto = req.body.produto;
    const descricao = req.body.descricao;
    const revisao = req.body.revisao;
    const lote = req.body.lote;
    const validade = req.body.validade;
    const quebra = req.body.quebra;
    const nivel = req.body.nivel;
    const qtde = req.body.qtde;
    const obs = req.body.obs;
    const usuario = req.body.usuario;
    const cTipo = req.body.cTipo;

    xcSql += "EXEC "
    xcSql += "	PCP..sp_manuLote "
    xcSql += " '" + filial + "', "
    xcSql += " '" + op + "', "
    xcSql += " '" + produto + "', "
    xcSql += " '" + descricao + "', "
    xcSql += " '" + revisao + "', "
    xcSql += " '" + lote + "', "
    xcSql += " " + validade + ", "
    xcSql += " '" + quebra + "', "
    xcSql += " '" + nivel + "', "
    xcSql += " " + qtde + ", "
    xcSql += " '" + obs + "', "
    xcSql += " " + usuario + ", "
    xcSql += " '" + cTipo + "' "

    console.log(xcSql)
    execSQL(xcSql, res);

})


//Cadastro de Produtos para qualidade por view
rota.post('/relacaoLoteRegistro', (req, res) => {
    let xcSql = '';

    const xcFil = req.body.xcFil;

    xcSql += "SELECT "
    xcSql += "	* "
    xcSql += "FROM "
    xcSql += "	PCP..View_Relacao_Lote_Registro "
    if (xcFil !== 'Todos') {
        xcSql += "WHERE "
        xcSql += "	situacao = '" + xcFil + "' "
    }
    xcSql += "ORDER BY "
    xcSql += "	lote "

    console.log(xcSql)
    execSQL(xcSql, res);

})

rota.post('/relacaoNivelLoteAprova', (req, res) => {
    let xcSql = '';

    const filial = req.body.filial;
    const produto = req.body.produto;
    const lote = req.body.lote;

    xcSql += "SELECT DISTINCT "
    xcSql += "	filial, produto, lote, nivel, nivelAprov, situacao "
    xcSql += "FROM "
    xcSql += "	PCP..loteAprov "
    xcSql += "WHERE "
    xcSql += "	1 = 1 "
    xcSql += "	and ativo = 'SIM' "
    xcSql += "	and filial = '" + filial + "' "
    xcSql += "	and produto = '" + produto + "' "
    xcSql += "	and lote = '" + lote + "' "
    xcSql += "ORDER BY "
    xcSql += "	produto, lote, nivelAprov "

    console.log(xcSql)
    execSQL(xcSql, res);

})

//Cadastro de Produtos para qualidade por view
rota.post('/relacaoLoteDetalhe', (req, res) => {
    let xcSql = '';

    const produto = req.body.produto;
    const lote = req.body.lote;

    xcSql += "SELECT "
    xcSql += "	* "
    xcSql += "FROM "
    xcSql += "	PCP..View_Relacao_Lote_Detalhe "
    xcSql += "WHERE "
    xcSql += "	1 = 1 "
    xcSql += "	AND produto = '" + produto + "' "
    xcSql += "	AND lote = '" + lote + "' "
    xcSql += "ORDER BY "
    xcSql += "	id_loteProd "

    console.log(xcSql)
    execSQL(xcSql, res);

})

//Cadastro de Produtos para qualidade por view
rota.post('/relacaoLoteAdianta', (req, res) => {
    let xcSql = '';

    const produto = req.body.produto;
    const lote = req.body.lote;

    xcSql += "SELECT "
    xcSql += "	* "
    xcSql += "FROM "
    xcSql += "	PCP..View_Relacao_Lote_Adianta "
    xcSql += "WHERE "
    xcSql += "	1 = 1 "
    xcSql += "	AND produto = '" + produto + "' "
    xcSql += "	AND lote = '" + lote + "' "
    xcSql += "ORDER BY "
    xcSql += "	id_loteProd "

    console.log(xcSql)
    execSQL(xcSql, res);

})

//Produção Parcial da OP
rota.post('/produzLote', (req, res) => {
    let xcSql = '';

    const filial = req.body.filial;
    const op = req.body.op;
    const qtde = req.body.qtde;
    const tipo = req.body.tipo;
    const usrProd = req.body.usrProd;
    const fechamento = req.body.fechamento;

    xcSql += "EXEC "
    xcSql += "	PCP..sp_produzLote "
    xcSql += "  '" + filial + "',  "
    xcSql += "  '" + op + "', "
    xcSql += "  " + qtde + ", "
    xcSql += "  '" + tipo + "', "
    xcSql += "  " + usrProd + ", "
    xcSql += "  '" + fechamento + "' "

    console.log(xcSql)
    execSQL(xcSql, res);
})

//Produção Parcial da OP
rota.post('/antecipaLote', (req, res) => {
    let xcSql = '';

    const filial = req.body.filial;
    const produto = req.body.produto;
    const lote = req.body.lote;
    const justificativa = req.body.justificativa;
    const usrProd = req.body.usrProd;

    xcSql += "EXEC "
    xcSql += "	PCP..sp_antecipaLote "
    xcSql += "  '" + filial + "',  "
    xcSql += "  '" + produto + "', "
    xcSql += "  '" + lote + "', "
    xcSql += "  '" + justificativa + "', "
    xcSql += "  " + usrProd + " "

    console.log(xcSql)
    execSQL(xcSql, res);
})


//Cadastro de Produtos para qualidade por view
rota.post('/relacaoLoteAprova', (req, res) => {
    let xcSql = '';

    const filial = req.body.filial;
    const produto = req.body.produto;
    const lote = req.body.lote;

    xcSql += "SELECT "
    xcSql += "	* "
    xcSql += "FROM "
    xcSql += "	PCP..View_Relacao_Lote_Aprova "
    xcSql += "WHERE "
    xcSql += "	1 = 1 "
    xcSql += "	AND filial = '" + filial + "' "
    xcSql += "	AND produto = '" + produto + "' "
    xcSql += "	AND lote = '" + lote + "' "
    xcSql += "ORDER BY "
    xcSql += "	filial, op, produto "

    console.log(xcSql)
    execSQL(xcSql, res);

})

//Cadastro de Produtos para qualidade por view
rota.post('/relacaoLoteAnalisa', (req, res) => {
    let xcSql = '';

    const filial = req.body.filial;
    const produto = req.body.produto;
    const lote = req.body.lote;

    xcSql += "SELECT "
    xcSql += "	* "
    xcSql += "FROM "
    xcSql += "	PCP..View_Relacao_Lote_Analisa "
    xcSql += "WHERE "
    xcSql += "	1 = 1 "
    xcSql += "	AND filial = '" + filial + "' "
    xcSql += "	AND produto = '" + produto + "' "
    xcSql += "	AND lote = '" + lote + "' "
    xcSql += "ORDER BY "
    xcSql += "	filial, codCarac, op, produto "

    console.log(xcSql)
    execSQL(xcSql, res);

})

rota.post('/relacaoLoteProtheus', (req, res) => {
    let xcSql = '';

    const filial = req.body.filial;
    const produto = req.body.produto;
    const lote = req.body.lote;

    xcSql += "SELECT "
    xcSql += "	* "
    xcSql += "FROM "
    xcSql += "	PCP..View_Relacao_Lote_Aprova_Protheus "
    xcSql += "WHERE "
    xcSql += "	1 = 1 "
    xcSql += "	AND filial = '" + filial + "' "
    xcSql += "	AND produto = '" + produto + "' "
    xcSql += "	AND lote = '" + lote + "' "
    xcSql += "ORDER BY "
    xcSql += "	filial, op, codCarac "

    console.log(xcSql)
    execSQL(xcSql, res);

})

//Inclusão de especificações 
rota.post('/analisaAprovaLote', (req, res) => {
    let xcSql = '';

    const filial = req.body.filial;
    const op = req.body.op;
    const produto = req.body.produto;
    const descricao = req.body.descricao;
    const lote = req.body.lote;
    const usr = req.body.usrAprov;
    const usrPerf = req.body.usrPerfil;
    const dtVenc = req.body.dtVenc;
    const qtde = req.body.qtde;
    const revisao = req.body.revisao;
    const codCarac = req.body.codCarac;
    const itemin = req.body.itemin;
    const itemax = req.body.itemax;
    const itemeio = req.body.itemeio;
    const itetxt = req.body.itetxt;
    const result = req.body.result;
    const resultxt = req.body.result;
    const situacao = req.body.situacao;
    const just = req.body.just;
    const tipo = req.body.tipo;


    xcSql += "EXEC "
    xcSql += "	PCP..sp_manuLoteAnalisaAprova "
    xcSql += " '" + filial + "', "
    xcSql += " '" + op + "', "
    xcSql += " '" + produto + "', "
    xcSql += " '" + descricao + "', "
    xcSql += " '" + lote + "', "
    xcSql += " " + usr + ", "
    xcSql += " '" + usrPerf + "', "
    xcSql += " '" + dtVenc + "', "
    xcSql += " " + qtde + ", "
    xcSql += " '" + revisao + "', "
    xcSql += " '" + codCarac + "', "
    xcSql += " " + itemin + ", "
    xcSql += " " + itemax + ", "
    xcSql += " '" + itemeio + "', "
    xcSql += " '" + itetxt + "', "
    xcSql += " " + result + ", "
    xcSql += " '" + resultxt + "', "
    xcSql += " '" + situacao + "', "
    xcSql += " '" + just + "', "
    xcSql += " '" + tipo + "' "

    console.log(xcSql)
    execSQL(xcSql, res);

})
