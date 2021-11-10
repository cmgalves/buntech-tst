express = require('express');
fs = require('fs');
const app = express();
const bodyParser = require('body-parser');
const porta = 84; //porta padrão
const sql = require('mssql');
const conexaoStr = "Server=192.168.0.127;Database=ERPPROD;User Id=criajson;Password=mb2018;";

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
        //.then(resultado => //console.log(resultado.recordset))
        .catch(erro => resposta.json(erro));
}

//cria User Começando as páginas
rota.get('/loganu/:xcUser?', (requisicao, resposta) => {
    let xcSql = '';

    const xcUser = requisicao.params.xcUser;


    xcSql += "SELECT "
    xcSql += "  *  "
    xcSql += "FROM "
    xcSql += "  ERPPROD..AA_jsonCadastroUsuarios "
    xcSql += "WHERE "
    xcSql += "  rtrim(upper(loginuser)) = rtrim(upper('" + xcUser + "')) "

    //console.log(xcSql)
    execSQL(xcSql, resposta);
})


//cria User Começando as páginas
rota.post('/criaUser', (requisicao, resposta) => {
    let xcSql = '';
    let xcOk = 'OK';

    //console.log(xcSql)

    const nomeUser = requisicao.body.nomeUser;
    const senha = requisicao.body.senha;
    const email = requisicao.body.email;
    const nome = requisicao.body.nome;
    const gen = requisicao.body.gen;
    const tip = requisicao.body.tip;


    xcSql += "exec "
    xcSql += "  sp_Portal_Cadastro_Usuario  "
    xcSql += " '" + nomeUser
    xcSql += "', '" + senha
    xcSql += "', '" + nome
    xcSql += "', '" + email
    xcSql += "', '" + gen
    xcSql += "', '" + tip
    xcSql += "', '" + xcOk + "' "

    //console.log(xcSql)

    execSQL(xcSql, resposta);
})

//Altera as senhas - User Começando as páginas
rota.post('/userAlterSenha', (requisicao, resposta) => {
    let xcSql = '';
    let xcOk = 'OK';

    //console.log(xcSql)

    const nomeUser = requisicao.body.nomeUser;
    const senha1 = requisicao.body.senha1;
    const senha2 = requisicao.body.senha2;
    const senha3 = requisicao.body.senha3;
    const gen = requisicao.body.gen;
    const tip = requisicao.body.tip;


    xcSql += "exec "
    xcSql += "  sp_Portal_Cadastro_Usuario  "
    xcSql += " '" + nomeUser
    xcSql += "', '" + senha1
    xcSql += "', '" + senha2
    xcSql += "', '" + senha3
    xcSql += "', '" + gen
    xcSql += "', '" + tip
    xcSql += "', '" + xcOk + "' "

    console.log(xcSql)

    execSQL(xcSql, resposta);
})


//Acessos permitidos users
rota.get('/acessoUser/:xcUserCod?/:xcFuncCod?', (requisicao, resposta) => {
    let xcSql = '';

    const xcUserCod = requisicao.params.xcUserCod;
    const xcFuncCod = requisicao.params.xcFuncCod;


    xcSql += "SELECT "
    xcSql += "  *  "
    xcSql += "FROM "
    xcSql += "  CUBOMB..vw_AA_json_Portal_Valida_User "
    xcSql += "WHERE "
    xcSql += "  upper(codUser) = upper('" + xcUserCod + "') AND "
    xcSql += "  (rtrim(codAcesso) like '%' + rtrim('" + xcFuncCod + "') + '%' OR "
    xcSql += "  rtrim(codAcesso) = left(rtrim('" + xcFuncCod + "'),4) OR "
    xcSql += "  upper(rtrim(codAcesso)) = '00' ) AND "
    xcSql += "  codAcesso <> '' "

    console.log(xcSql)
    execSQL(xcSql, resposta);
})


//Comercial - Pedidos

rota.get('/comercialPedido', (requisicao, resposta) => {
    let xcSql = '';


    xcSql += "SELECT "
    xcSql += "  *  "
    xcSql += "FROM "
    xcSql += "  ERPPROD..AA_json_Pedidos_Alteracao "
    //  //console.log(xcSql)
    execSQL(xcSql, resposta);
})


//Comercial - Pedidos - Pontos

rota.get('/comercialPedidoPontos/:xcPed', (requisicao, resposta) => {
    let xcSql = '';

    const xcPed = requisicao.params.xcPed;

    xcSql += "SELECT "
    xcSql += "  *  "
    xcSql += "FROM "
    xcSql += "  ERPPROD..AA_json_Pedidos_Alteracao_Pontos "
    xcSql += " WHERE "
    xcSql += "  ERPPROD..pedido = '" + xcPed + "' "

    console.log(xcSql)
    execSQL(xcSql, resposta);
})


//Comercial - Clientes Intivos
rota.get('/clientesInativos/:xcEst?', (requisicao, resposta) => {
    let xcSql = '';

    const xcEst = requisicao.params.xcEst;

    xcSql += "SELECT "
    xcSql += "   * "
    xcSql += "FROM "
    xcSql += "   AA_json_Comercial_Clientes_Inativos "
    xcSql += "WHERE "
    xcSql += "   est = '" + xcEst + "' "

    //console.log(xcSql)

    execSQL(xcSql, resposta);
})

//Comercial - Clientes Intivos
rota.get('/clientesInativos01/:xcChave?', (requisicao, resposta) => {
    let xcSql = '';

    const xcChave = requisicao.params.xcChave;

    xcSql += "SELECT "
    xcSql += "   * "
    xcSql += "FROM "
    xcSql += "   AA_json_Comercial_Clientes_Inativos_Anotacao "
    xcSql += "WHERE "
    xcSql += "   chave = '" + xcChave + "' "


    console.log(xcSql)
    execSQL(xcSql, resposta);
})

//Comercial - Clientes Intivos - Motivos
rota.get('/cliInatMotivos', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "SELECT "
    xcSql += "   * "
    xcSql += "FROM "
    xcSql += "   AA_json_Comercial_Clientes_Inativos_Motivos "

    //console.log(xcSql)

    execSQL(xcSql, resposta);
})



//atualiza o pedido de vendas
rota.post('/ctbAlteraPedido', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "EXEC "
    xcSql += "   sp_comercialPedidoDet "
    xcSql += "'" + requisicao.body.pedido + "', "
    xcSql += "'" + requisicao.body.cond + "', "
    xcSql += "'" + requisicao.body.transp + "', "
    xcSql += "'" + requisicao.body.redesp + "', "
    xcSql += "'" + requisicao.body.mennota + "', "
    xcSql += "'" + requisicao.body.obsped + "', "
    xcSql += "'" + requisicao.body.obsexp + "', "
    xcSql += "'" + requisicao.body.obsfina + "', "
    xcSql += "'" + requisicao.body.obscad + "', "
    xcSql += "'" + requisicao.body.obsregra + "', "
    xcSql += "'" + requisicao.body.datafat + "' "


    console.log(xcSql)
    execSQL(xcSql, resposta);

})


//Limpa a reserva conforme solicitação
rota.post('/logisticaLimpaReserva', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "EXEC "
    xcSql += "   sp_logisticaLimpaReserva "
    xcSql += "'" + requisicao.body.xcPedido + "', "
    xcSql += "'" + requisicao.body.xcItem + "' "


    console.log(xcSql)
    execSQL(xcSql, resposta);

})


// rota.get('/flpPedidos_status/:ped?/:sts?/:stsold?/:usr?/:obs?', (requisicao, resposta) => {
//   let xa = "'";
//   let xcOk = 'OK';
rota.post('/flpPedidos_status', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "EXEC "
    xcSql += "   sp_Inclui_Status_Pedido "
    xcSql += "'" + requisicao.body.pedido + "', "
    xcSql += "'" + requisicao.body.xcStatus + "', "
    xcSql += "'" + requisicao.body.xcStatusOld + "', "
    xcSql += "'" + requisicao.body.xcUser + "', "
    xcSql += "'" + requisicao.body.xcObserva + "', "
    xcSql += "'" + requisicao.body.retOk + "' "

    console.log(xcSql)
    execSQL(xcSql, resposta);

})


//rotina para alterar e ajustar os status dos pedidos
rota.post('/comercialPedidoStatus', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "EXEC "
    xcSql += "   sp_comercialPedidoStatus "
    xcSql += "'" + requisicao.body.pedido + "', "
    xcSql += "'" + requisicao.body.xcStatus + "', "
    xcSql += "'" + requisicao.body.xcStatusOld + "', "
    xcSql += "'" + requisicao.body.xcUser + "', "
    xcSql += "'" + requisicao.body.xcObserva + "', "
    xcSql += "'" + requisicao.body.envEmail + "'"

    console.log(xcSql)
    execSQL(xcSql, resposta);

})


//rotina para apenas alterar os status do pedido
rota.post('/pedidoIncluiStatus', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "EXEC "
    xcSql += "   sp_pedidoIncluiStatus "
    xcSql += "'" + requisicao.body.pedido + "', "
    xcSql += "'" + requisicao.body.xcStatus + "', "
    xcSql += "'" + requisicao.body.xcStatusOld + "', "
    xcSql += "'" + requisicao.body.xcUser + "', "
    xcSql += "'" + requisicao.body.xcObserva + "'"

    console.log(xcSql)
    execSQL(xcSql, resposta);

})


//Ajuste de TES Inteligente
rota.post('/ajustaTesInteligente', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "EXEC "
    xcSql += "   sp_pedidosImportaGuarani02 "
    xcSql += "'" + requisicao.body.pedido + "' "

    console.log(xcSql)
    execSQL(xcSql, resposta);

})






//Faturamento Diário
rota.get('/fatdia', (requisicao, resposta) => {
    execSQL(`SELECT 
            *
          FROM 
          AA_json_FAT_Diario`, resposta);
})

//?
rota.get('/usuario/:nome?', (requisicao, resposta) => {
    const nome = requisicao.params.nome;
    execSQL('SELECT COUNT(*) FROM USUARIO WHERE NOME = ' + nome);
})


//Representantes - dados de objetivos e venda dos

rota.get('/obj_rep_sup/:repCod?/:repNivel?', (requisicao, resposta) => {
    let xcSql = '';


    const repCod = requisicao.params.repCod;
    const repNivel = requisicao.params.repNivel;

    if (repNivel == 'D') {
        xcSql += "SELECT "
        xcSql += "   * "
        xcSql += "FROM "
        xcSql += "   AA_json_Pedidos_Supervisor_Objetivos "
    } else if (repNivel == 'G') {
        xcSql += "SELECT "
        xcSql += "   * "
        xcSql += "FROM "
        xcSql += "   AA_json_Pedidos_Supervisor_Objetivos "
        xcSql += "WHERE "
        xcSql += "  '" + repCod + "' like '%' + codsup + '%' "
    } else if (repNivel == 'R') {
        xcSql += "SELECT "
        xcSql += "   * "
        xcSql += "FROM "
        xcSql += "   AA_json_Pedidos_Supervisor_Objetivos "
        xcSql += "WHERE "
        xcSql += "  '" + repCod + "' like '%' + codrep + '%' "
    }

    console.log(xcSql)
    execSQL(xcSql, resposta);
})


//Representantes - Itens cortados do pedido
rota.get('/repCortes/:cods', (requisicao, resposta) => {
    let xcSql = '';

    const codSuper = requisicao.params.cods;

    xcSql += "SELECT "
    xcSql += "    * "
    xcSql += "FROM  "
    xcSql += "    CUBOMB..CORTESPEDIDO "
    xcSql += "WHERE "
    xcSql += "  '" + codSuper + "' like '%' + codRep + '%' "

    //console.log(xcSql)
    execSQL(xcSql, resposta);
})

//Representantes - Analise dos pedidos cortados
rota.get('/repCortes01/:xcPed?', (requisicao, resposta) => {
    let xcSql = '';

    const xcPed = requisicao.params.xcPed;

    xcSql += "SELECT "
    xcSql += "    * "
    xcSql += "FROM  "
    xcSql += "    CUBOMB..PEDIDOSCORTADOS "
    xcSql += "WHERE  "
    xcSql += "    pedido = '" + xcPed + "' "

    //console.log(xcSql)
    execSQL(xcSql, resposta);
})



//Administração - Margens - Cálculos Gerais
rota.get('/margemGeral/:rep?/:cde?/:cat?', (requisicao, resposta) => {
    let xa = "'";
    let xcSql = '';
    const xcRep = requisicao.params.rep;
    const xcCde = requisicao.params.cde;
    const xcCat = requisicao.params.cat;



    if (xcRep != '001') {
        xcSql += "SELECT  \n"
        xcSql += "  produto, sum(qtd) qtd,   \n"
        xcSql += "  sum(tot) tot, sum(icm) icm, sum(cof) cof,   \n"
        xcSql += "  sum(pis) pis, sum(df) df, sum(ir) ir,   \n"
        xcSql += "  sum(mg) mg, sum(me) me, sum(mk) mk,   \n"
        xcSql += "  sum(lb) lb, sum(vb) vb, sum(cst) cst,   \n"
        xcSql += "  sum(frt) frt, sum(com) com, sum(comdir) comdir,   \n"
        xcSql += "  descric  \n"
        xcSql += "FROM  \n"
        xcSql += "   ERPPROD..AA_json_Adm_Margem  \n"
        xcSql += "WHERE  \n"
        xcSql += "   (LEFT(RTRIM(REPCOD) + RTRIM(SUPCOD),3) = '" + xcRep + "' OR  \n"
        xcSql += "   RIGHT(RTRIM(REPCOD) + RTRIM(SUPCOD),3) = '" + xcRep + "') AND  \n"
        xcSql += "   REPCOD BETWEEN '011' AND '500' AND  \n"
        xcSql += "   MESANO BETWEEN '" + xcCde + "' AND '" + xcCat + "'   \n"
        xcSql += "GROUP BY  \n"
        xcSql += "  produto, descric  \n"
    } else {
        xcSql += "SELECT  \n"
        xcSql += "  produto, sum(qtd) qtd,   \n"
        xcSql += "  sum(tot) tot, sum(icm) icm, sum(cof) cof,   \n"
        xcSql += "  sum(pis) pis, sum(df) df, sum(ir) ir,   \n"
        xcSql += "  sum(mg) mg, sum(me) me, sum(mk) mk,   \n"
        xcSql += "  sum(lb) lb, sum(vb) vb, sum(cst) cst,   \n"
        xcSql += "  sum(frt) frt, sum(com) com, sum(comdir) comdir,   \n"
        xcSql += "  descric \n"
        xcSql += "FROM  \n"
        xcSql += "   ERPPROD..AA_json_Adm_Margem  \n"
        xcSql += "WHERE  \n"
        xcSql += "   REPCOD BETWEEN '011' AND '500' AND  \n"
        xcSql += "   MESANO BETWEEN '" + xcCde + "' AND '" + xcCat + "'   \n"
        xcSql += "GROUP BY  \n"
        xcSql += "   produto, descric \n"
    }

    console.log(xcSql)
    execSQL(xcSql, resposta);
})

//Administração - Margens - Coeficientes para cálculos do LB
rota.get('/admMargemCoef', (requisicao, resposta) => {
    let xcSql = '';


    xcSql += "SELECT "
    xcSql += "   * "
    xcSql += "FROM "
    xcSql += "   AA_json_Apoio_Coeficiente_Margem "


    //console.log(xcSql)
    execSQL(xcSql, resposta);
})


//Administração - Margens - Filtros para Margens
rota.get('/filMargem', (requisicao, resposta) => {
    let xcSql = '';


    xcSql += "SELECT "
    xcSql += "   * "
    xcSql += "FROM "
    xcSql += "   AA_json_Adm_Margem_Filtros "
    xcSql += "ORDER BY "
    xcSql += "   1 asc, 2 desc "


    //console.log(xcSql)
    execSQL(xcSql, resposta);


})

//Administração - Custos
rota.get('/admCustos', (requisicao, resposta) => {
    let xcSql = '';


    xcSql += "SELECT "
    xcSql += "   * "
    xcSql += "FROM "
    xcSql += "   AA_json_Adm_Custos "
    xcSql += "ORDER BY "
    xcSql += "   1  "


    //console.log(xcSql)
    execSQL(xcSql, resposta);


})


//Ajusta a comissão a partir do pedido
rota.post('/comissoesAjusta', (requisicao, resposta) => {
    let xcSql = '';
    let xcOk = 'OK';


    xcSql += "EXEC "
    xcSql += "   sp_Fin_Ajusta_Comissao "
    xcSql += "'" + requisicao.body.xcPed + "', "
    xcSql += xcOk

    // //console.log(xcSql)
    execSQL(xcSql, resposta);
})




//Cargas Pedidos Itens
rota.get('/cargasPedItens/:xcCargas?/', (requisicao, resposta) => {
    let xcSql = '';

    const xcCargas = requisicao.params.xcCargas;

    xcSql += "SELECT "
    xcSql += "   * "
    xcSql += "FROM "
    xcSql += "   AA_jsonCargasMontarItem "
    xcSql += "WHERE "
    xcSql += "   carga = '" + xcCargas + "' "
    xcSql += "ORDER BY "
    xcSql += "   1,2 "

    //console.log(xcSql)
    execSQL(xcSql, resposta);
})




//Carga Montada, itens do pedido
rota.get('/cargasPedido', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "SELECT "
    xcSql += "   * "
    xcSql += "FROM "
    xcSql += "   AA_json_carga_pedidos "

    //console.log(xcSql)
    execSQL(xcSql, resposta);
})






//PCP - Telas inicias para programação
rota.get('/encerraOp/:_cop?', (requisicao, resposta) => {
    let xcSql = '';
    let xcOk = 'OK';

    const xcop = requisicao.params._cop;

    xcSql += "EXEC "
    xcSql += "   sp_Pcp_Encerra_OP "
    xcSql += "'" + xcop + "', "
    xcSql += xcOk

    console.log(xcSql)
    execSQL(xcSql, resposta);
})



rota.get('/Rotas', (requisicao, resposta) => {
    execSQL((`SELECT  * FROM AA_json_Rotas`), resposta);
})

rota.get('/objetivos', (requisicao, resposta) => {
    execSQL((`SELECT  * FROM AA_json_Pedidos_Supervisor_Objetivos order by 2,1`), resposta);
})

rota.get('/Est_Posicao_Diaria', (requisicao, resposta) => {
    execSQL((`SELECT * FROM AA_json_Est_Posicao_Diaria`), resposta);
})

rota.get('/Est_Posicao_Diaria_Data', (requisicao, resposta) => {
    execSQL((`SELECT DISTINCT DATA FROM AA_json_Est_Posicao_Diaria order by 1`), resposta);
})

//Marketing cadastro de produtos
rota.get('/CadProd/:xcClas?', (requisicao, resposta) => {
    let xcSql = '';
    let xcFil = '';
    let xa = "'";

    const xcClassse = requisicao.params.xcClas;

    if (xcClassse == '1') {
        xcFil = xa + '2' + xa + ', ' + xa + '3' + xa;
    } else if (xcClassse == '2') {
        xcFil = xa + '1' + xa + ', ' + xa + '3' + xa;
    } else if (xcClassse == '3') {
        xcFil = xa + '1' + xa + ', ' + xa + '2' + xa;
    } else if (xcClassse == '4') {
        xcFil = xa + '1' + xa;
    } else if (xcClassse == '5') {
        xcFil = xa + '3' + xa;
    } else if (xcClassse == '6') {
        xcFil = xa + '2' + xa;
    } else {
        xcFil = xa + '' + xa;
    }

    xcSql += "SELECT "
    xcSql += "   * "
    xcSql += "FROM "
    xcSql += "   AA_json_Cadastro_Produto "
    xcSql += "WHERE "
    xcSql += "   codclasse not in (" + xcFil + ") "
    xcSql += "ORDER BY "
    xcSql += "   1 "

    console.log(xcSql)
    execSQL(xcSql, resposta);

})

//Marketing cadastro de produtos - precos
rota.get('/CadProdPreco/:xcProd?', (requisicao, resposta) => {
    let xcSql = '';
    let xcFil = '';
    let xa = "'";

    const xcProd = requisicao.params.xcProd;

    xcFil = xa + xcProd + xa

    xcSql += "SELECT "
    xcSql += "   * "
    xcSql += "FROM "
    xcSql += "   AA_json_Cadastro_Produto_Precos "
    xcSql += "WHERE "
    xcSql += "   codpro = " + xcFil + " "
    xcSql += "ORDER BY "
    xcSql += "   1,2 "

    //console.log(xcSql)
    execSQL(xcSql, resposta);

})

//Marketing Tabela de Preco de produtos 
rota.get('/tabPrecos', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "SELECT "
    xcSql += "   * "
    xcSql += "FROM "
    xcSql += "   AA_json_Tabela_Precos "
    xcSql += "ORDER BY "
    xcSql += "   1 "

    //console.log(xcSql)
    execSQL(xcSql, resposta);

})

//Marketing Tabela de Preco de produtos / Vendedores 
rota.get('/tabPrecosVendedores/:xcTab?', (requisicao, resposta) => {
    let xcSql = '';

    const xcTab = requisicao.params.xcTab;

    xcSql += "SELECT "
    xcSql += "   * "
    xcSql += "FROM "
    xcSql += "   AA_json_Tabela_Precos_Vendedores "
    xcSql += "WHERE "
    xcSql += "   TAB LIKE '%" + xcTab + "%' "
    xcSql += "ORDER BY "
    xcSql += "   4,2 "

    console.log(xcSql)
    execSQL(xcSql, resposta);
})


//Marketing Tabela de Preco de produtos / Vendedores e Clientes 
rota.get('/tabPrecosClientes/:xcTab?/:xcVend?', (requisicao, resposta) => {
    let xcSql = '';

    const xcTab = requisicao.params.xcTab;
    const xcVend = requisicao.params.xcVend;

    xcSql += "SELECT "
    xcSql += "   * "
    xcSql += "FROM "
    xcSql += "   AA_json_Tabela_Precos_Clientes "
    xcSql += "WHERE "
    xcSql += "   TAB LIKE '%" + xcTab + "%' AND "
    xcSql += "   VEND = '" + xcVend + "' "

    console.log(xcSql)
    execSQL(xcSql, resposta);

})

//Marketing Tabela de Preco de produtos Margens
rota.get('/tabPrecosMargens/:xcTab?', (requisicao, resposta) => {
    let xcSql = '';
    let xa = "'";

    const xcTab = requisicao.params.xcTab;


    xcSql += "SELECT "
    xcSql += "   * "
    xcSql += "FROM "
    xcSql += "   AA_json_Tabela_Precos_Margens "
    xcSql += "WHERE "
    xcSql += "   tabela = '" + xcTab + "' "
    xcSql += "ORDER BY "
    xcSql += "   1 "

    //console.log(xcSql)
    execSQL(xcSql, resposta);

})

rota.get('/admFecha', (requisicao, resposta) => {
    execSQL((`SELECT * FROM AA_json_Adm_Fechamento order by 1`), resposta);
})

rota.get('/admPosicDiaria/:xnDias?', (requisicao, resposta) => {
    let xcSql = '';
    const xnDias = requisicao.params.xnDias;
    xcSql += "SELECT "
    xcSql += "   * "
    xcSql += "FROM "
    xcSql += "   CUBOMB..ADMPOSICDIA "
    xcSql += "WHERE "
    xcSql += "   diade >= convert(varchar(8), getdate() - " + xnDias + ", 112) "
    xcSql += "ORDER BY "
    xcSql += "   1 "

    //console.log(xcSql)
    execSQL(xcSql, resposta);
})




rota.get('/tabela_preco', (requisicao, resposta) => {
    execSQL((`SELECT 
  DA0_CODTAB TABELA, DA0_DESCRI, DA0_ZZMARG, DA1_CODPRO, DA1_ZQTLOT, DA1_XDESPR, DA1_PRCVEN 
FROM 
  DA0010 A INNER JOIN
  DA1010 B ON
  DA0_CODTAB = DA1_CODTAB INNER JOIN
  SB1010 C ON
  DA1_CODPRO = B1_COD
WHERE
  A.D_E_L_E_T_ = '' AND
  B.D_E_L_E_T_ = '' AND
  C.D_E_L_E_T_ = '' AND
  B1_FILIAL = '01' AND
  B1_ZFORLIN <> '2'`), resposta);
})



rota.get('/RepPedidos/:prod?/:este?/:repr?/:grup?/:clie?/:supe?', (requisicao, resposta) => {
    let xa = "'";
    let xcFil = '';
    let xn = 0

    const prd = requisicao.params.prod;
    const est = requisicao.params.este;
    const rep = requisicao.params.repr;
    const grp = requisicao.params.grup;
    const cli = requisicao.params.clie;
    const sup = requisicao.params.supe;




    if (prd == 'p') {
        xcFil += ''
    } else {
        xcFil += ' produto = ' + xa + prd + xa + ' and '
    }
    if (est == 'e') {
        xcFil += ''
    } else {
        xcFil += ' est = ' + xa + est + xa + ' and '
    }
    if (rep == 'r') {
        xcFil += ''
    } else {
        xcFil += ' rep = ' + xa + rep + xa + ' and '
    }
    if (grp == 'g') {
        xcFil += ''
    } else {
        xcFil += ' grp = ' + xa + grp + xa + ' and '
    }
    if (cli == 'c') {
        xcFil += ''
    } else {
        xcFil += ' cli + loj = ' + xa + cli + xa + ' and '
    }
    if (sup == 'TODOS') {
        xcFil += ''
    } else {
        xcFil += ' sup = ' + xa + sup + xa + ' and '
    }

    xcFil = 'where ' + xcFil
    xn = xcFil.length;

    xcFil = xcFil.substring(0, xn - 5);

    execSQL((`SELECT top 6200 * FROM AA_json_Representantes_Pedidos ` + xcFil + ` order by emis desc`), resposta);
})


///Rota para 
rota.get('/pontos/:codrep?/:ano?/:mes?/:codprod?', (requisicao, resposta) => {
    let xa = "'";
    let xcFil = '';

    const xcRep = requisicao.params.codrep;
    const xcAno = requisicao.params.ano;
    const xcMes = requisicao.params.mes;
    const xcProd = requisicao.params.codprod;

    if (xcRep != '000') {
        xcFil += ' codrep = ' + xa + xcRep + xa
    }

    if (xcAno != '0000') {
        if (xcFil == '') {
            xcFil += ' ano = ' + xa + xcAno + xa
        } else {
            xcFil += ' and ano = ' + xa + xcAno + xa
        }

    }

    if (xcMes != '00') {
        if (xcFil == '') {
            xcFil += ' mes = ' + xa + xcMes + xa
        } else {
            xcFil += ' and mes = ' + xa + xcMes + xa
        }
    }

    if (xcProd != '00000') {
        if (xcFil == '') {
            xcFil += ' codprod = ' + xa + xcProd + xa
        } else {
            xcFil += ' and codprod = ' + xa + xcProd + xa
        }
    }

    if (xcFil != '') {
        xcFil = ' Where ' + xcFil
    }

    //xcFil = ' WHERE ano = ' + xa + '2015' + xa + ' and mes = '
    execSQL(('SELECT top 3000 * FROM AA_json_Est_LB' + xcFil), resposta);


})

//Estoque - Inventário
rota.get('/inventario/:Arm?/:tip?', (requisicao, resposta) => {
    let xcSql = '';

    const xcArm = requisicao.params.Arm;
    const xcTipoProd = requisicao.params.tip;

    xcSql += "SELECT "
    xcSql += "   * "
    xcSql += "FROM "
    xcSql += "   AA_json_Est_Invent "
    if (xcArm + xcTipoProd != '0000') {
        xcSql += "WHERE "
        xcSql += "   arm = '" + xcArm + "' AND "
        xcSql += "   tipo = '" + xcTipoProd + "' "
    }
    xcSql += "ORDER BY "
    xcSql += "   1,4,2 "

    //  //console.log(xcSql)
    execSQL(xcSql, resposta);
})

//Estoque - Inventário - Filtro
rota.get('/inventFil', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "SELECT "
    xcSql += "   * "
    xcSql += "FROM "
    xcSql += "   AA_json_Est_Invent_Filtro "
    xcSql += "ORDER BY "
    xcSql += "   1,2 "

    //  //console.log(xcSql)
    execSQL(xcSql, resposta);
})


//Inclui Contagem
rota.get('/invetContagem/:_cLoc?/:_cTipProd?', (requisicao, resposta) => {
    let xcSql = '';
    let xcOk = 'OK';

    const xcLoc = requisicao.params._cLoc;
    const xcTipProd = requisicao.params._cTipProd;

    xcSql += "EXEC "
    xcSql += "   sp_Est_Invent_Gera_Contagem "
    xcSql += "'" + xcLoc + "', "
    xcSql += "'" + xcTipProd + "', "
    xcSql += xcOk
    //console.log(xcSql)
    execSQL(xcSql, resposta);
})

rota.get('/clienteCadastro', (requisicao, resposta) => {
    execSQL('select * from AA_json_Cadastro_Clientes', resposta);
})

rota.get('/cadCliPed/:codCliente?', (requisicao, resposta) => {
    execSQL(`select * from AA_jsonCadCliPedido where cliente =  + '${requisicao.params.codCliente}'`, resposta);
})

rota.post('/alteraNatureza', (requisicao, resposta) => {

    console.log(`spFinPagarAltNatureza ${requisicao.body.rec}, '${requisicao.body.natureza}'`)
    execSQL(`spFinPagarAltNatureza ${requisicao.body.rec}, '${requisicao.body.natureza}', 'OK'`, resposta);
})

rota.get('/itemPedido/:pedido?', (requisicao, resposta) => {
    execSQL(`select * from AA_jsonCadCliPedidoItem where pedido = '${requisicao.params.pedido}'`, resposta);
})

rota.get('/fechamentos', (requisicao, resposta) => {
    execSQL('select * from AA_jsonMktFechamentoSuperv', resposta);
})


//Inclui Contagem
rota.get('/fechamentosDestalhes/:_Sup?/:_Mes?', (requisicao, resposta) => {
    let xcSql = '';

    const _Sup = requisicao.params._Sup;
    const _Mes = requisicao.params._Mes;

    xcSql += "SELECT "
    xcSql += "  * "
    xcSql += "FROM "
    xcSql += "   CUBOMB..FECHAMENTO_REP "
    xcSql += "WHERE "
    if (_Sup != '999') {
        xcSql += "   supCod = '" + _Sup + "' AND "
    }
    xcSql += "   repMes = '" + _Mes + "'  "
    xcSql += "ORDER BY "
    xcSql += "   1,2 "

    //console.log(xcSql)
    execSQL(xcSql, resposta);
})

//Campanha de Marketing
rota.get('/mktCampanhas', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "SELECT "
    xcSql += "  * "
    xcSql += "FROM "
    xcSql += "   AA_jsonMktCampanha "

    //console.log(xcSql)
    execSQL(xcSql, resposta);
})

//Marketing ABC Produtos
rota.get('/mktAbcProdutos/:mesDe?/:mesAte?/:clube?/:grupo?/:abcTipo?', (requisicao, resposta) => {
    let xcSql = '';

    const mesDe = requisicao.params.mesDe;
    const mesAte = requisicao.params.mesAte;
    const xcClube = requisicao.params.clube;
    const xcGrupo = requisicao.params.grupo;
    const abcTipo = requisicao.params.abcTipo;


    if (abcTipo == 'abcQuant') {
        xcSql += "SELECT "
        xcSql += "  abcRef,   abcDesc,  sum(abcQuant) abcQuant "
        xcSql += "FROM "
        xcSql += "   CUBOMB..ABC_PRODUTOS "
        xcSql += "WHERE "
        if (xcClube === '-' && xcGrupo === '-') {
            xcSql += "   abcMes BETWEEN '" + mesDe + "' AND '" + mesAte + "' "
        }
        if (xcClube === '-' && xcGrupo !== '-') {
            xcSql += "   abcMes BETWEEN '" + mesDe + "' AND '" + mesAte + "' AND "
            xcSql += "   grupo = '" + xcGrupo + "' "
        }
        if (xcClube !== '-' && xcGrupo === '-') {
            xcSql += "   abcMes BETWEEN '" + mesDe + "' AND '" + mesAte + "' AND "
            xcSql += "   clube = '" + xcClube + "' "
        }
        if (xcClube !== '-' && xcGrupo !== '-') {
            xcSql += "   abcMes BETWEEN '" + mesDe + "' AND '" + mesAte + "' AND "
            xcSql += "   clube = '" + xcClube + "' AND "
            xcSql += "   grupo = '" + xcGrupo + "' "
        }
        xcSql += "GROUP BY "
        xcSql += "   abcRef,   abcDesc "
        xcSql += "ORDER BY "
        xcSql += "   3 DESC "

    }
    if (abcTipo == 'abcVal') {
        xcSql += "SELECT "
        xcSql += "  abcRef,   abcDesc,   sum(abcVal) abcVal "
        xcSql += "FROM "
        xcSql += "   CUBOMB..ABC_PRODUTOS "
        xcSql += "WHERE "
        if (xcClube === '-' && xcGrupo === '-') {
            xcSql += "   abcMes BETWEEN '" + mesDe + "' AND '" + mesAte + "' "
        }
        if (xcClube === '-' && xcGrupo !== '-') {
            xcSql += "   abcMes BETWEEN '" + mesDe + "' AND '" + mesAte + "' AND "
            xcSql += "   grupo = '" + xcGrupo + "' "
        }
        if (xcClube !== '-' && xcGrupo === '-') {
            xcSql += "   abcMes BETWEEN '" + mesDe + "' AND '" + mesAte + "' AND "
            xcSql += "   clube = '" + xcClube + "' "
        }
        if (xcClube !== '-' && xcGrupo !== '-') {
            xcSql += "   abcMes BETWEEN '" + mesDe + "' AND '" + mesAte + "' AND "
            xcSql += "   clube = '" + xcClube + "' AND "
            xcSql += "   grupo = '" + xcGrupo + "' "
        }
        xcSql += "GROUP BY "
        xcSql += "   abcRef,   abcDesc "
        xcSql += "ORDER BY "
        xcSql += "   3 DESC "
    }

    console.log(xcSql)
    execSQL(xcSql, resposta);
})

//Marketing ABC Produtos
rota.get('/marketingAbcProdutos/:mesDe?/:mesAte?/:abcTipo?', (requisicao, resposta) => {
    let xcSql = '';

    const mesDe = requisicao.params.mesDe;
    const mesAte = requisicao.params.mesAte;
    const abcTipo = requisicao.params.abcTipo;


    if (abcTipo == 'abcQuant') {
        xcSql += "SELECT "
        xcSql += "  abcRef,   abcDesc,  sum(abcQuant) abcQuant "
        xcSql += "FROM "
        xcSql += "   CUBOMB..ABC_PRODUTOS "
        xcSql += "WHERE "
        xcSql += "   abcMes BETWEEN '" + mesDe + "' AND '" + mesAte + "' "
        xcSql += "GROUP BY "
        xcSql += "   abcRef,   abcDesc "
        xcSql += "ORDER BY "
        xcSql += "   3 DESC "

    }
    if (abcTipo == 'abcVal') {
        xcSql += "SELECT "
        xcSql += "  abcRef,   abcDesc,   sum(abcVal) abcVal "
        xcSql += "FROM "
        xcSql += "   CUBOMB..ABC_PRODUTOS "
        xcSql += "WHERE "
        xcSql += "   abcMes BETWEEN '" + mesDe + "' AND '" + mesAte + "' "
        xcSql += "GROUP BY "
        xcSql += "   abcRef,   abcDesc "
        xcSql += "ORDER BY "
        xcSql += "   3 DESC "
    }

    if (abcTipo == 'abcPeso') {
        xcSql += "SELECT "
        xcSql += "  abcRef,   abcDesc,   sum(abcPeso) abcPeso "
        xcSql += "FROM "
        xcSql += "   CUBOMB..ABC_PRODUTOS "
        xcSql += "WHERE "
        xcSql += "   abcMes BETWEEN '" + mesDe + "' AND '" + mesAte + "' "
        xcSql += "GROUP BY "
        xcSql += "   abcRef,   abcDesc "
        xcSql += "ORDER BY "
        xcSql += "   3 DESC "
    }

    console.log(xcSql)
    execSQL(xcSql, resposta);
})

//Marketing ABC Produtos
rota.get('/mktAbcPeriodo', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "SELECT  DISTINCT "
    xcSql += "	abcMes per "
    xcSql += "FROM  "
    xcSql += "	CUBOMB..ABC_PRODUTOS  "
    xcSql += "ORDER BY 1 desc "

    console.log(xcSql)
    execSQL(xcSql, resposta);
})

rota.get('/mktAbcGrupos', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "SELECT  DISTINCT "
    xcSql += "	grupo grp "
    xcSql += "FROM  "
    xcSql += "	CUBOMB..ABC_PRODUTOS  "
    xcSql += "WHERE  "
    xcSql += "	grupo <> '' "
    xcSql += "ORDER BY 1 "

    console.log(xcSql)
    execSQL(xcSql, resposta);
})

rota.get('/mktAbcClubes', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "SELECT  DISTINCT "
    xcSql += "	clube clb "
    xcSql += "FROM  "
    xcSql += "	CUBOMB..ABC_PRODUTOS  "
    xcSql += "WHERE  "
    xcSql += "	clube <> ''  "
    xcSql += "ORDER BY 1 "

    console.log(xcSql)
    execSQL(xcSql, resposta);
})

//Campanha de Marketing Analises
rota.get('/mktCampanhasAnalises/:codCamp?/', (requisicao, resposta) => {
    let xcSql = '';

    const xccodCamp = requisicao.params.codCamp;

    xcSql += "SELECT "
    xcSql += "  * "
    xcSql += "FROM "
    xcSql += "   CUBOMB..MKT_CAMPANHA "
    xcSql += "WHERE "
    xcSql += "   codCamp = '" + xccodCamp + "' "

    //console.log(xcSql)
    execSQL(xcSql, resposta);
})



//Objetivos - Detalhes das bonificações
rota.get('/objetivos01Boni/:xcCli?/:mesde?/:mesate?', (requisicao, resposta) => {
    let xcSql = '';

    const xcCli = requisicao.params.xcCli;
    const mesde = requisicao.params.mesde;
    const mesate = requisicao.params.mesate;


    xcSql += "SELECT "
    xcSql += "  boniEmis, boniPed, boniCli, boniRef,  "
    xcSql += "  boniDesc, boniVal, boniObs "
    xcSql += "FROM "
    xcSql += "   CUBOMB..OBJ_BONI_CLI "
    xcSql += "WHERE "
    xcSql += "   boniCli = '" + xcCli + "'  AND "
    xcSql += "   boniEmis between '" + mesde + "'  AND '" + mesate + "' "
    xcSql += "ORDER BY "
    xcSql += "   4"


    //console.log(xcSql)
    execSQL(xcSql, resposta);
})

//Objetivos - Detalhes dos clientes - Meses
rota.get('/objetivosClientesMes/:xcRep?', (requisicao, resposta) => {
    let xcSql = '';

    const xcRep = requisicao.params.xcRep;


    xcSql += "SELECT DISTINCT"
    xcSql += "  mesObj "
    xcSql += "FROM "
    xcSql += "   CUBOMB..OBJ_VEND_CLI "
    xcSql += "WHERE "
    xcSql += "   repCod = '" + xcRep + "'  "
    xcSql += "ORDER BY "
    xcSql += "   1"

    //console.log(xcSql)
    execSQL(xcSql, resposta);
})



//Geral - Controle de Atividades
rota.get('/geralAtividades01/:xcTar?', (requisicao, resposta) => {
    let xcSql = '';

    const xcTar = requisicao.params.xcTar;

    xcSql += "SELECT "
    xcSql += "    * "
    xcSql += "FROM  "
    xcSql += "    ERPPROD..AA_jsonGeralAtividades01 "
    xcSql += "WHERE  "
    xcSql += "    atv = '" + xcTar + "' "

    //console.log(xcSql)
    execSQL(xcSql, resposta);
})

//Geral - Controle de Atividades
rota.get('/geralUsuariosPortal', (requisicao, resposta) => {
    let xcSql = '';

    const xcTar = requisicao.params.xcTar;

    xcSql += "SELECT "
    xcSql += "    * "
    xcSql += "FROM  "
    xcSql += "    ERPPROD..AA_jsonUsuariosPortalInternos "
    xcSql += "ORDER BY  "
    xcSql += "    2 "

    //console.log(xcSql)
    execSQL(xcSql, resposta);
})


//cria User Começando as páginas
rota.post('/spTarefas', (requisicao, resposta) => {
    let xcSql = '';
    let xcOk = 'OK';


    const cTar = requisicao.body.cTar;
    const cRes = requisicao.body.cRes;
    const cDet = requisicao.body.cDet;
    const cSol = requisicao.body.cSol;
    const cRsp = requisicao.body.cRsp;
    const cTpA = requisicao.body.cTpA;
    const cDia = requisicao.body.cDia;
    const cTpI = requisicao.body.cTpI;


    xcSql += "exec "
    xcSql += "  sp_Inclui_Atividade  "
    xcSql += " '" + cTar
    xcSql += "', '" + cRes
    xcSql += "', '" + cDet
    xcSql += "', '" + cSol
    xcSql += "', '" + cRsp
    xcSql += "', '" + cTpA
    xcSql += "', '" + cDia
    xcSql += "', '" + cTpI
    xcSql += "', '" + xcOk + "' "

    console.log(xcSql)

    execSQL(xcSql, resposta);
})




//Geral - Controle de Atividades
rota.get('/repPedidosClientes/:repCod?', (requisicao, resposta) => {
    let xcSql = '';

    const repCod = requisicao.params.repCod;


    xcSql += "SELECT "
    xcSql += "    * "
    xcSql += "FROM  "
    xcSql += "    CUBOMB..REPPED06 "
    xcSql += "WHERE "
    xcSql += "   '" + repCod + "' like '%' + vend + '%'"

    console.log(xcSql)
    execSQL(xcSql, resposta);
})



//Geral - Controle de Atividades
rota.get('/PedRepItens/:codCli?', (requisicao, resposta) => {
    let xcSql = '';

    const codCli = requisicao.params.codCli;


    xcSql += "SELECT "
    xcSql += "   * ",
        xcSql += "FROM  "
    xcSql += "    CUBOMB..REPPED05 "
    xcSql += "WHERE   "
    xcSql += "    cliCod = '" + codCli + "' "
    xcSql += "ORDER BY  "
    xcSql += "    2 "



    console.log(xcSql)
    execSQL(xcSql, resposta);
})



//MKT - Pedidos dos Representantes
rota.get('/fiscalDocs', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "SELECT "
    xcSql += "   * ",
        xcSql += "FROM  "
    xcSql += "    CUBOMB..FISDOCS01 "

    //console.log(xcSql)
    execSQL(xcSql, resposta);
})

//Pedidos - Ranking dos itens
rota.get('/refRanking', (requisicao, resposta) => {
    let xcSql = '';


    xcSql += "SELECT "
    xcSql += "   * ",
        xcSql += "FROM  "
    xcSql += "    CUBOMB..SB1ABC "

    //console.log(xcSql)
    execSQL(xcSql, resposta);
})

//Pedidos - Ranking dos itens
rota.get('/cadClientes', (requisicao, resposta) => {
    let xcSql = '';


    xcSql += "SELECT "
    xcSql += "   * ",
        xcSql += "FROM  "
    xcSql += "    CUBOMB..SA101 "

    console.log(xcSql)
    execSQL(xcSql, resposta);
})


//cria User Começando as páginas
rota.post('/spEnvPedido', (requisicao, resposta) => {
    let xcSql = '';
    let xcOk = 'OK';


    const cTar = requisicao.body.cTar;
    const cRes = requisicao.body.cRes;
    const cDet = requisicao.body.cDet;
    const cSol = requisicao.body.cSol;
    const cRsp = requisicao.body.cRsp;
    const cTpA = requisicao.body.cTpA;
    const cDia = requisicao.body.cDia;
    const cTpI = requisicao.body.cTpI;


    xcSql += "exec "
    xcSql += "  sp_Inclui_Atividade  "
    xcSql += " '" + cTar
    xcSql += "', '" + cRes
    xcSql += "', '" + cDet
    xcSql += "', '" + cSol
    xcSql += "', '" + cRsp
    xcSql += "', '" + cTpA
    xcSql += "', '" + cDia
    xcSql += "', '" + cTpI
    xcSql += "', '" + xcOk + "' "

    //console.log(xcSql)

    execSQL(xcSql, resposta);
})



//Pedidos Para liberar
rota.get('/pedidoEstoqueItem/:logPed?', (requisicao, resposta) => {
    let xcSql = '';

    const logPed = requisicao.params.logPed;

    xcSql += "SELECT ";
    xcSql += "   * ";
    xcSql += "FROM  ";
    xcSql += "    ERPPROD..AA_jsonPedidoEstoqueItens ";
    xcSql += "WHERE  ";
    xcSql += "    '" + logPed + "' like '%' + ped + '%' ";

    console.log(xcSql);
    execSQL(xcSql, resposta);
})

//Pedidos da pre carga itens consolidados
rota.get('/pedidoEstoqueItemAgrupados/:logPed?', (requisicao, resposta) => {
    let xcSql = '';

    const logPed = requisicao.params.logPed;

    xcSql += "select  "
    xcSql += "	sts, cor, '' ped, '' ite, prd, dsc, sld,  "
    xcSql += "	rsv, dsp, abs(dsp-sum(qtd)) flt, sum(qtd) qtd,  "
    xcSql += "	sum(tot)/ sum(qtd) prc, sum(tot)tot, arm,  "
    xcSql += "	'' crg, sum(vol) vol, sum(pes) pes,  "
    xcSql += "	sum(cub)cub "
    xcSql += "from  "
    xcSql += "	ERPPROD..AA_jsonPedidoEstoqueItens "
    xcSql += "where "
    xcSql += "    '" + logPed + "' like '%' + ped + '%' ";
    xcSql += "group by "
    xcSql += "	sts, cor,prd, dsc, arm, sld, rsv, dsp "
    xcSql += "having "
    xcSql += "	sum(qtd) > dsp "
    xcSql += "order by "
    xcSql += "    5 "

    console.log(xcSql);
    execSQL(xcSql, resposta);
})

//Pré - Carga Montar - procedure
rota.post('/logisticaMontarPreCarga', (requisicao, resposta) => {
    let xcSql = '';

    const xcPedido = requisicao.body.xcPedido;
    const xcCarga = requisicao.body.xcCarga;
    const xcTipo = requisicao.body.xcTipo;

    xcSql += "EXEC "
    xcSql += "   sp_logisticaMontarPreCarga "
    xcSql += "'" + xcPedido + "', "
    xcSql += "'" + xcCarga + "', '"
    xcSql += xcTipo + "' "
    console.log(xcSql)
    execSQL(xcSql, resposta);
})


//Pedidos Para liberar
rota.get('/pedidoEstoqueItemReserva/:logPrd?', (requisicao, resposta) => {
    let xcSql = '';

    const logPrd = requisicao.params.logPrd;

    xcSql += "SELECT ";
    xcSql += "   * ";
    xcSql += "FROM  ";
    xcSql += "    ERPPROD..AA_jsonPedidoEstoqueItensReserva ";
    xcSql += "WHERE  ";
    xcSql += "    prd = '" + logPrd + "' ";

    console.log(xcSql);
    execSQL(xcSql, resposta);
})


//Relação de produtos com devergências entre os fechamentos
rota.get('/variacaoCM/:xcArm?/:xcTipo?', (requisicao, resposta) => {
    let xcSql = '';

    const xcArm = requisicao.params.xcArm;
    const xcTipo = requisicao.params.xcTipo;


    if (xcTipo == 'TD' && xcArm == 'TD') {
        xcSql += "SELECT ";
        xcSql += "   ref, dsc, arm, qatu, peso, tip, chj, vrb, catu, est, vrc ";
        xcSql += "FROM  ";
        xcSql += "    ERPPROD..AA_jsonComparaSb9 ";
    } else {


        xcSql += "SELECT ";
        xcSql += "   ref, dsc, arm, tip, qatu, peso, chj, vrb, catu, est, vrc ";
        xcSql += "FROM  ";
        xcSql += "    ERPPROD..AA_jsonComparaSb9 ";
        xcSql += "WHERE  ";
        if (xcTipo == 'TD') {
            xcSql += "    arm = '" + xcArm + "' ";
        } else if (xcArm == 'TD') {
            xcSql += "    tip = '" + xcTipo + "' ";
        } else {
            xcSql += "    arm = '" + xcArm + "' AND ";
            xcSql += "    tip = '" + xcTipo + "' ";

        }
    }
    console.log(xcSql);
    execSQL(xcSql, resposta);
})

//Relação de produtos com devergências entre os fechamentos
rota.get('/pcpAnaliseDiferencaCusto/:xcArm?/:xcTipo?', (requisicao, resposta) => {
    let xcSql = '';

    const xcArm = requisicao.params.xcArm;
    const xcTipo = requisicao.params.xcTipo;


    if (xcTipo == 'TD' && xcArm == 'TD') {
        xcSql += "SELECT ";
        xcSql += "   * ";
        xcSql += "FROM  ";
        xcSql += "    ERPPROD..vw_pcpAnaliseDiferencaCusto ";
    } else {
        xcSql += "SELECT ";
        xcSql += "  *  ";
        xcSql += "FROM  ";
        xcSql += "    ERPPROD..vw_pcpAnaliseDiferencaCusto ";
        xcSql += "WHERE  ";
        if (xcTipo == 'TD') {
            xcSql += "    ARMAZEM = '" + xcArm + "' ";
        } else if (xcArm == 'TD') {
            xcSql += "    TIPO = '" + xcTipo + "' ";
        } else {
            xcSql += "    ARMAZEM = '" + xcArm + "' AND ";
            xcSql += "    TIPO = '" + xcTipo + "' ";
        }
    }
    console.log(xcSql);
    execSQL(xcSql, resposta);
})


//Relação de produtos com devergências entre os fechamentos e as divergências entre as estruturas
rota.get('/variacaoCMEstruturas/:xcrefPA?/:xcArm?', (requisicao, resposta) => {
    let xcSql = '';

    const xcrefPA = requisicao.params.xcrefPA;
    const xcArm = requisicao.params.xcArm;


    xcSql += "SELECT ";
    xcSql += "   refpa, refpi, refComp, descComp, tipoComp, ";
    xcSql += "   qtd, umComp, nivel, vra, vrb, vrc, cantes, catu, chj, est ";
    xcSql += "FROM  ";
    xcSql += "    ERPPROD..AA_jsonComparaSb9Estrutura ";
    xcSql += "WHERE  ";
    xcSql += "    refpa = '" + xcrefPA + "' ";

    console.log(xcSql);
    execSQL(xcSql, resposta);
})



//Follow-up de pedidos, tela inicial de gerenciamento de manutenção
rota.get('/flpPedidosLB/:pedLB?', (requisicao, resposta) => {
    let xcSql = '';

    const pedLB = requisicao.params.pedLB;


    xcSql += "SELECT ";
    xcSql += "   * ";
    xcSql += "FROM  ";
    xcSql += "    ERPPROD..AA_jsonPedidosLB ";
    xcSql += "WHERE  ";
    xcSql += "    C6_NUM = '" + pedLB + "' ";

    console.log(xcSql);
    execSQL(xcSql, resposta);
})

//Dados para o portal dos Feras consolidado
rota.get('/repFeras/:xcMesDe?/:xcMesAte?', (requisicao, resposta) => {
    let xcSql = '';
    const xcMesDe = requisicao.params.xcMesDe;
    const xcMesAte = requisicao.params.xcMesAte;

    xcSql += "SELECT ";
    xcSql += "   cod, nome,	sum(objetivo) obj, sum(vendido) vnd,	";
    xcSql += "   sum(faturado) fat, sum(resultfat) rft, sum(resultVnd) rvd ";
    xcSql += "FROM  ";
    xcSql += "    CUBOMB..REP_FERAS ";
    xcSql += "WHERE  ";
    xcSql += "    periodo between '" + xcMesDe + "' AND '" + xcMesAte + "' ";
    xcSql += "GROUP BY  ";
    xcSql += "    cod, nome ";

    console.log(xcSql);
    execSQL(xcSql, resposta);
})

//Dados para o portal dos Feras por representantes
rota.get('/repFerasRc/:xcMesDe?/:xcMesAte?', (requisicao, resposta) => {
    let xcSql = '';
    const xcMesDe = requisicao.params.xcMesDe;
    const xcMesAte = requisicao.params.xcMesAte;

    xcSql += "SELECT ";
    xcSql += "   nome, codrep, nomerep,	sum(objetivo) obj, sum(vendido) vnd,	";
    xcSql += "   sum(faturado) fat, sum(resultfat) rft, sum(resultVnd) rvd ";
    xcSql += "FROM  ";
    xcSql += "    CUBOMB..REP_FERAS ";
    xcSql += "WHERE  ";
    xcSql += "    periodo between '" + xcMesDe + "' AND '" + xcMesAte + "' ";
    xcSql += "GROUP BY  ";
    xcSql += "    nome, codrep, nomerep ";

    console.log(xcSql);
    execSQL(xcSql, resposta);
})

///relação dos itens disponívels para transferências
rota.get('/almoxTransf', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "SELECT ";
    xcSql += "   * ";
    xcSql += "FROM  ";
    xcSql += "    ERPPROD..AA_jsonAlmoxarifadoTransferencia ";

    console.log(xcSql);
    execSQL(xcSql, resposta);
})

//executa procedure transf armazem
rota.get('/almoxTransfProc/:referen?/:local?/:qtde?', (requisicao, resposta) => {
    let xa = "'";
    let xcOk = 'OK';

    const referen = requisicao.params.referen;
    const local = requisicao.params.local;
    const qtde = requisicao.params.qtde;

    console.log(`EXEC spAlmoxarifadoTransferencia` + xa + referen + xa + `,` + xa + local + xa + `,` + qtde)
    execSQL((`EXEC spAlmoxarifadoTransferencia` + xa + referen + xa + `,` + xa + local + xa + `,` + qtde), resposta);

})


//Conferencia de lotes divergentes
rota.get('/confLotes', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "SELECT ";
    xcSql += "   * ";
    xcSql += "FROM  ";
    xcSql += "    CUBOMB..ctbConfereLote ";

    console.log(xcSql);
    execSQL(xcSql, resposta);
})


//Contorle de alteração de vencimento de titulos do contas a receber
rota.get('/altTitulosReceber', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "SELECT ";
    xcSql += "   * ";
    xcSql += "FROM  ";
    xcSql += "    CUBOMB..vw_FinAlteracaoDataVencimento ";

    console.log(xcSql);
    execSQL(xcSql, resposta);
})



//Follow-up de pedidos, tela inicial de gerenciamento de manutenção
rota.get('/flpPedidos/:tpFiltro?/:numPedido?/:codRegiao?', (requisicao, resposta) => {
    let xcSql = '';

    const tpFiltro = requisicao.params.tpFiltro;
    const numPedido = requisicao.params.numPedido;
    const codRegiao = requisicao.params.codRegiao;

    xcSql += "SELECT ";
    xcSql += "   * ";
    xcSql += "FROM  ";
    xcSql += "    comercialPedidosAndamento ";


    if (numPedido !== 'AAAAAA') {
        xcSql += "WHERE  ";
        xcSql += "    pedido = '" + numPedido + "' ";
    } else {
        if (codRegiao === '000') {
            if (tpFiltro === 'sim') {
                xcSql += "WHERE  ";
                xcSql += "    hoje = '" + tpFiltro + "' ";
            }
        } else {
            if (tpFiltro === 'sim') {
                xcSql += "WHERE  ";
                xcSql += "    hoje = '" + tpFiltro + "' AND ";
                xcSql += "    '" + codRegiao + "' LIKE '%' + regiao + '%' ";
            } else {
                xcSql += "WHERE  ";
                xcSql += "    '" + codRegiao + "' LIKE '%' + regiao + '%' ";
            }
        }
    }


    console.log(xcSql);
    execSQL(xcSql, resposta);
})

//Follow-up de pedidos, Agrupamento pos Status
rota.get('/represPedidosAcompanhamento/:codSuper?/:codTipo?', (requisicao, resposta) => {
    let xcSql = '';
    const codSuper = requisicao.params.codSuper;
    const codTipo = requisicao.params.codTipo;

    if (codTipo == 'R') {
        xcSql += "SELECT ";
        xcSql += "   * ";
        xcSql += "FROM  ";
        xcSql += "    CUBOMB..ComPedidosAndamento ";
        xcSql += "WHERE  ";
        xcSql += "    repres = '" + codSuper + "' ";
    } else {
        xcSql += "SELECT ";
        xcSql += "   * ";
        xcSql += "FROM  ";
        xcSql += "    CUBOMB..ComPedidosAndamento ";
    }
    console.log(xcSql);
    execSQL(xcSql, resposta);
})


//Follow-up de pedidos, Agrupamento pos Status
rota.get('/pedidosAndamentoRep/:codSuper?/:codTipo?', (requisicao, resposta) => {
    let xcSql = '';
    const codSuper = requisicao.params.codSuper;
    const codTipo = requisicao.params.codTipo;

    if (codTipo == 'R') {
        xcSql += "SELECT ";
        xcSql += "   * ";
        xcSql += "FROM  ";
        xcSql += "    vw_pedidosAndamento ";
        xcSql += "WHERE  ";
        xcSql += "    repres = '" + codSuper + "' ";
    } else {
        xcSql += "SELECT ";
        xcSql += "   * ";
        xcSql += "FROM  ";
        xcSql += "    vw_pedidosAndamento ";
    }
    console.log(xcSql);
    execSQL(xcSql, resposta);
})



//Follow-up de pedidos em andamento, tela inicial de gerenciamento de manutenção
rota.get('/pedidosAndamento/:tpFiltro?/:numPedido?/:codRegiao?', (requisicao, resposta) => {
    let xcSql = '';

    const tpFiltro = requisicao.params.tpFiltro;
    const numPedido = requisicao.params.numPedido;
    const codRegiao = requisicao.params.codRegiao;

    xcSql += "SELECT ";
    xcSql += "   * ";
    xcSql += "FROM  ";
    xcSql += "    vw_pedidosAndamento ";


    // if (numPedido !== 'AAAAAA') {
    //     xcSql += "WHERE  ";
    //     xcSql += "    pedido = '" + numPedido + "' ";
    // } else {
    if (codRegiao === '000') {
        if (tpFiltro === 'sim') {
            xcSql += "WHERE  ";
            xcSql += "    hoje = '" + tpFiltro + "' ";
        }
    } else {
        if (tpFiltro === 'sim') {
            xcSql += "WHERE  ";
            xcSql += "    hoje = '" + tpFiltro + "' AND ";
            xcSql += "    '" + codRegiao + "' LIKE '%' + regiao + '%' ";
        } else {
            xcSql += "WHERE  ";
            xcSql += "    '" + codRegiao + "' LIKE '%' + regiao + '%' ";
        }
    }
    // }


    console.log(xcSql);
    execSQL(xcSql, resposta);
})


//Tabela com todos os itens em andamento
rota.get('/pedidosAndamentoItens', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "SELECT ";
    xcSql += "   * ";
    xcSql += "FROM  ";
    xcSql += "    vw_pedidosAndamentoItens ";

    console.log(xcSql);
    execSQL(xcSql, resposta);
})


//resumo dos pedidos em andamento
rota.get('/pedidosAndamentoResumo', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "SELECT ";
    xcSql += "   descSituacao situacao, COUNT(*) qtde, SUM(totalPedido) total ";
    xcSql += "FROM  ";
    xcSql += "    vw_pedidosAndamento ";
    xcSql += "GROUP BY  ";
    xcSql += "    descSituacao ";
    xcSql += "ORDER BY  ";
    xcSql += "    1 ";

    console.log(xcSql);
    execSQL(xcSql, resposta);
})

//Follow-up de pedidos, tela inicial de gerenciamento de manutenção
rota.get('/pedidoUltimoStatus/:numPedido?', (requisicao, resposta) => {
    let xcSql = '';

    const numPedido = requisicao.params.numPedido;

    xcSql += "SELECT ";
    xcSql += "   * ";
    xcSql += "FROM  ";
    xcSql += "    vw_pedidoStatusEsteira ";
    xcSql += "WHERE  ";
    xcSql += "    pedido = '" + numPedido + "' ";


    console.log(xcSql);
    execSQL(xcSql, resposta);
})

//Retorna os detalhes dos pedidos
rota.get('/flpPedidosDetalhes/:pedi?', (requisicao, resposta) => {
    let xcSql = '';
    const xcPedi = requisicao.params.pedi;

    xcSql += "SELECT "
    xcSql += "   * "
    xcSql += "FROM "
    xcSql += "   vw_flpPedidosDetalhes "
    xcSql += "WHERE "
    xcSql += "   pedido = '" + xcPedi + "' "

    console.log(xcSql)
    execSQL(xcSql, resposta);
})


//Follow-up de pedidos, Agrupamento pos Status
rota.get('/flpPedidosResumo', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "SELECT ";
    xcSql += "   tipo, situacao, descSituacao, SUM(qtdePedidos) qtdePedidos, SUM(totalPedidos) totalPedidos, ";
    xcSql += "   SUM(qtdFaturadoHoje) qtdFaturadoHoje, SUM(qtdPedidoHoje) qtdPedidoHoje, ";
    xcSql += "   SUM(vlrFaturadoHoje) vlrFaturadoHoje, SUM(vlrPedidoHoje) vlrPedidoHoje ";
    xcSql += "FROM  ";
    xcSql += "    CUBOMB..ComPedidosAndamentoResumo ";
    xcSql += "group by  ";
    xcSql += "    tipo, situacao, descSituacao ";


    console.log(xcSql);
    execSQL(xcSql, resposta);
})

//Representantes - Acompanhamento de Pedidos

rota.get('/PedRep/:repCod?/:repNivel?', (requisicao, resposta) => {
    let xa = "'";
    let xcSql = '';


    const repCod = requisicao.params.repCod;
    const repNivel = requisicao.params.repNivel;

    if (repNivel == 'D') {
        xcSql += "SELECT "
        xcSql += "   * "
        xcSql += "FROM "
        xcSql += "   AA_json_Pedidos_Supervisor "
    } else if (repNivel == 'G') {
        xcSql += "SELECT "
        xcSql += "   * "
        xcSql += "FROM "
        xcSql += "   AA_json_Pedidos_Supervisor "
        xcSql += "WHERE "
        xcSql += "   supervisor = '" + repCod + "' or "
        xcSql += "   '" + repCod + "' like '%' + supervisor + '%'"
    } else if (repNivel == 'R') {
        xcSql += "SELECT "
        xcSql += "   * "
        xcSql += "FROM "
        xcSql += "   AA_json_Pedidos_Supervisor "
        xcSql += "WHERE "
        xcSql += "   codirc = '" + repCod + "' or "
        xcSql += "   '" + repCod + "' like '%' + codirc + '%'"
    }

    //console.log(xcSql)
    execSQL(xcSql, resposta);
})




//avaliação do LB item a Item para liberação do pedido
rota.get('/flpPedidosLiberacao/:pedItemLb?', (requisicao, resposta) => {
    let xcSql = '';

    const pedItemLb = requisicao.params.pedItemLb;


    xcSql += "SELECT ";
    xcSql += "   * ";
    xcSql += "FROM  ";
    xcSql += "    ERPPROD..AA_json_flp_pedido_lb_item ";
    xcSql += "WHERE  ";
    xcSql += "    numPedido = '" + pedItemLb + "' ";

    console.log(xcSql);
    execSQL(xcSql, resposta);
})


//Follow-up de pedidos, Tela para os RCs
rota.get('/represPedidosAcompanhamentoResumo/:codSuper?', (requisicao, resposta) => {
    let xcSql = '';

    const codSuper = requisicao.params.codSuper;

    xcSql += "SELECT ";
    xcSql += "   * ";
    xcSql += "FROM  ";
    xcSql += "    CUBOMB..ComPedidosAndamento ";
    xcSql += "WHERE  ";
    xcSql += "    supervisor = '" + codSuper + "' ";

    console.log(xcSql);
    execSQL(xcSql, resposta);
})


//Dados da comissão - geração da tela e do pdf
rota.get('/comissoes/:xcVend?/:xdData?', (requisicao, resposta) => {
    let xcSql = '';
    const xcVend = requisicao.params.xcVend;
    const xdData = requisicao.params.xdData;

    xcSql += "SELECT "
    xcSql += "   * "
    xcSql += "FROM "
    xcSql += "   AA_json_Financeiro_Comissao "
    // xcSql += "WHERE "
    // xcSql += "   vendedor = '" + xcVend + "' and "
    // xcSql += "   fildata <= '" + xdData + "'  "

    execSQL(xcSql, resposta);
})

//Impressao de pedidos,
rota.get('/repCalculoLb', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "SELECT ";
    xcSql += "   * ";
    xcSql += "FROM  ";
    xcSql += "    CUBOMB..repCalculoLb ";

    console.log(xcSql);
    execSQL(xcSql, resposta);
})

//pedidos de compras aprovação
rota.get('/pedidoCompras', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "SELECT ";
    xcSql += "   * ";
    xcSql += "FROM  ";
    xcSql += "    CUBOMB..cmpPedidoCompras ";

    console.log(xcSql);
    execSQL(xcSql, resposta);
})

//pedidos de compras detalhes aprovação
rota.get('/pedidoComprasDet', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "SELECT ";
    xcSql += "   * ";
    xcSql += "FROM  ";
    xcSql += "    CUBOMB..cmpPedidoComprasDetalhes ";
    xcSql += "ORDER BY  ";
    xcSql += "    1,2 ";

    console.log(xcSql);
    execSQL(xcSql, resposta);
})


//Busca cadastro de fornecedores
rota.get('/buscaCadFor', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "SELECT ";
    xcSql += "   * ";
    xcSql += "FROM  ";
    xcSql += "    CUBOMB..CmpCadastroFornecedores ";

    console.log(xcSql);
    execSQL(xcSql, resposta);

})

//cadastro de fornecedores
rota.get('/cadFor', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "SELECT ";
    xcSql += "   * ";
    xcSql += "FROM  ";
    xcSql += "    ERPPROD..AA_jsonCmpCadastroFornecedores ";

    console.log(xcSql);
    execSQL(xcSql, resposta);

})

//relação de cotação por pedido de compras
rota.get('/pcCotacao/:pcPedido?', (requisicao, resposta) => {
    let xcSql = '';
    const pcPedido = requisicao.params.pcPedido;

    xcSql += "SELECT ";
    xcSql += "   * ";
    xcSql += "FROM  ";
    xcSql += "    CUBOMB..CmpPedidoComprasCotacao ";
    xcSql += "WHERE  ";
    xcSql += "    pedidoCompras = '" + pcPedido + "' ";

    console.log(xcSql);
    execSQL(xcSql, resposta);

})


//Todas as TES de todas as Empresas
rota.get('/tesDuplica', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "SELECT ";
    xcSql += "   * ";
    xcSql += "FROM  ";
    xcSql += "    CUBOMB..fisDuplicaTES ";

    console.log(xcSql);
    execSQL(xcSql, resposta);

})


//Inserindo TES conforme especificação
rota.post('/incTES', (requisicao, resposta) => {
    let xcSql = '';

    const codTes = requisicao.body.codTes;
    const empDe = requisicao.body.empDe;
    const empPara = requisicao.body.empPara;

    xcSql += "exec "
    xcSql += "  sp_Fiscal_Inclui_TES  "
    xcSql += " '" + codTes
    xcSql += "', '" + empDe
    xcSql += "', '" + empPara + "' "

    console.log(xcSql)
    execSQL(xcSql, resposta);
})


//Painel de status das máquinas
rota.get('/pcpStatusFabrica', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "SELECT ";
    xcSql += "   * ";
    xcSql += "FROM  ";
    xcSql += "    CUBOMB..pcpStatusMaquinasFabrica ";

    // console.log(xcSql);
    execSQL(xcSql, resposta);
})


//Confirma liberacao contas a pagar
rota.post('/estoqueSaldoNegativo', (requisicao, resposta) => {
    let xcSql = '';

    const ref = requisicao.body.ref;
    const quant = requisicao.body.quant;
    const custo = requisicao.body.custo;
    const armazem = requisicao.body.armazem;
    const tipoAjuste = requisicao.body.tipoAjuste;
    const tm = requisicao.body.tm;
    const cf = requisicao.body.cf;

    xcSql += "EXEC "
    xcSql += "   estoqueSaldoNegativo "
    xcSql += "'" + ref + "', "
    xcSql += " " + quant + ", "
    xcSql += " " + custo + ", "
    xcSql += "'" + armazem + "', "
    xcSql += "'" + tipoAjuste + "', "
    xcSql += "'" + tm + "', '"
    xcSql += cf + "' "

    console.log(xcSql)
    execSQL(xcSql, resposta);
})


//Liberação de Contas a Pagar
rota.get('/FinLiberaCP', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "SELECT "
    xcSql += "   * "
    xcSql += "FROM "
    xcSql += "  AA_jsonFinLiberarCP"

    console.log(xcSql)
    execSQL(xcSql, resposta);
})


//Confirma liberacao contas a pagar
rota.post('/spFinLiberaCP', (requisicao, resposta) => {
    let xcSql = '';

    const xnRec = requisicao.body.rec;
    const xcEmp = requisicao.body.emp;
    const xcuser = requisicao.body.usr;

    xcSql += "EXEC "
    xcSql += "   spFinLiberaCP "
    xcSql += "'" + xnRec + "', "
    xcSql += "'" + xcEmp + "', '"
    xcSql += xcuser + "' "

    console.log(xcSql)
    execSQL(xcSql, resposta);
})



//rc Acompanhamento dos pdidos dos representantes
rota.get('/rcPedidos/:codrc?', (requisicao, resposta) => {
    let xcSql = '';
    const codrc = requisicao.params.codrc;


    xcSql += "SELECT "
    xcSql += "   * "
    xcSql += "FROM "
    xcSql += "  CUBOMB..rcPedidos "
    xcSql += "WHERE "
    xcSql += "  codrc = '" + codrc + "' "

    console.log(xcSql)
    execSQL(xcSql, resposta);
})



//Objetivos - Detalhes dos clientes
rota.get('/objetivos01/:xcRep?/:mesde?/:mesate?/:tpRel?/', (requisicao, resposta) => {
    let xcSql = '';

    const xcRep = requisicao.params.xcRep;
    const mesde = requisicao.params.mesde;
    const mesate = requisicao.params.mesate;
    const tpRel = requisicao.params.tpRel;

    if (tpRel == 'Clientes') {

        xcSql += "SELECT "
        xcSql += "  cliObj, estObj, repCod, "
        xcSql += "  sum(totalObj) totalObj, "
        xcSql += "  sum(totBonif) totBonif, "
        xcSql += "  sum(totFat) totFat, "
        xcSql += "  MIN(ULT) ULT "
        xcSql += "FROM "
        xcSql += "   CUBOMB..OBJ_VEND_CLI "
        xcSql += "WHERE "
        xcSql += "   repCod = '" + xcRep + "'  AND "
        xcSql += "   mesObj between '" + mesde + "'  AND '" + mesate + "' "
        xcSql += "GROUP BY "
        xcSql += "   cliObj, estObj, repCod "
        xcSql += "ORDER BY "
        xcSql += "   1,2,3"

    }

    if (tpRel == 'Produtos') {

        xcSql += "SELECT "
        xcSql += "  rtrim(refCod) refCod, rtrim(refNome) refNome, "
        xcSql += "  sum(qtde) qtde, sum(total) total, refClasse "
        xcSql += "FROM "
        xcSql += "   CUBOMB..MKT_CAMPANHA_REF "
        xcSql += "WHERE "
        xcSql += "   repCod = '" + xcRep + "'  AND "
        xcSql += "   mes between '" + mesde + "'  AND '" + mesate + "' "
        xcSql += "GROUP BY "
        xcSql += "   refCod, refNome, refClasse "
        xcSql += "ORDER BY "
        xcSql += "   1 "

    }

    console.log(xcSql)
    execSQL(xcSql, resposta);
})



//MKT - Pedidos dos Representantes
rota.get('/mktPedidos/:codRep?', (requisicao, resposta) => {
    let xcSql = '';

    const codRep = requisicao.params.codRep;


    xcSql += "SELECT "
    xcSql += "   * ",
        xcSql += "FROM  "
    xcSql += "    CUBOMB..MKTCAMPANHA01 "
    xcSql += "WHERE   "
    xcSql += "    codRep = '" + codRep + "' "



    console.log(xcSql)
    execSQL(xcSql, resposta);
})



//Pedidos aptos a faturar
rota.get('/pedidoEstoque', (requisicao, resposta) => {
    let xcSql = '';

    const repCod = requisicao.params.repCod;

    xcSql += "SELECT "
    xcSql += "   * ",
        xcSql += "FROM  "
    xcSql += "    ERPPROD..AA_jsonPedidoEstoque "

    console.log(xcSql)
    execSQL(xcSql, resposta);
})



//Reserva o produto ou volta o saldo
rota.post('/reservaPedidoEst', (requisicao, resposta) => {
    let xcSql = '';

    const pedi = requisicao.body.pedi;
    const tipo = requisicao.body.tipo;

    xcSql += "EXEC "
    xcSql += "   logReservaPedido "
    xcSql += "'" + pedi + "', '"
    xcSql += tipo + "' "

    console.log(xcSql)
    execSQL(xcSql, resposta);
})


//Cargas Montagem Montadas
rota.get('/cargasMontar', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "SELECT "
    xcSql += "   * "
    xcSql += "FROM "
    xcSql += "   AA_jsonCargasMontar "

    console.log(xcSql)
    execSQL(xcSql, resposta);
})



//Ralação das cargas montadas
rota.get('/cargas', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "SELECT "
    xcSql += "   * "
    xcSql += "FROM "
    xcSql += "   AA_json_carga "

    console.log(xcSql)
    execSQL(xcSql, resposta);
})

//Cargas Montar - procedure
rota.post('/spCargaMontar', (requisicao, resposta) => {
    let xcSql = '';

    const xcPedido = requisicao.body.ped;
    const xcCarga = requisicao.body.carga;
    const xcTipo = requisicao.body.tipo;

    xcSql += "EXEC "
    xcSql += "   spCargaMontar "
    xcSql += "'" + xcPedido + "', "
    xcSql += "'" + xcCarga + "', '"
    xcSql += xcTipo + "' "
    console.log(xcSql)
    execSQL(xcSql, resposta);
})

//Cargas Montagem Montadas
rota.get('/logMontarCargas', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "SELECT "
    xcSql += "   * "
    xcSql += "FROM "
    xcSql += "   CUBOMB..logMontarCargas "

    console.log(xcSql)
    execSQL(xcSql, resposta);
})

//Cargas Montagem Montadas
rota.get('/logCargasMontadas', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "SELECT "
    xcSql += "   * "
    xcSql += "FROM "
    xcSql += "   CUBOMB..logCargasMontadas "

    console.log(xcSql)
    execSQL(xcSql, resposta);
})


//Cargas Numeração de próximas cargas
rota.get('/cargasNumero', (requisicao, resposta) => {
    let xcSql = '';

    const xcCarga = requisicao.params.xcCarga;


    xcSql += "SELECT "
    xcSql += "   * "
    xcSql += "FROM "
    xcSql += "   AA_jsonCargasNumero "


    //console.log(xcSql)
    execSQL(xcSql, resposta);
})


//Cargas Numeração de próximas cargas
rota.get('/logCargasNumero', (requisicao, resposta) => {
    let xcSql = '';

    const xcCarga = requisicao.params.xcCarga;


    xcSql += "SELECT "
    xcSql += "   * "
    xcSql += "FROM "
    xcSql += "   CUBOMB..logCargasNumero "


    console.log(xcSql)
    execSQL(xcSql, resposta);
})



//Representantes - visão das anotações feitas para os clientes
rota.get('/repClientesNota/:codCli?', (requisicao, resposta) => {
    let xcSql = '';


    const codCli = requisicao.params.codCli;

    xcSql += "SELECT "
    xcSql += "   * "
    xcSql += "FROM "
    xcSql += "   comercialAnotacoesClientes "
    xcSql += "WHERE "
    xcSql += "  codCli = '" + codCli + "'  "

    console.log(xcSql)
    execSQL(xcSql, resposta);
})



//Representantes - venda geral dos clientes

rota.get('/repClientes/:repCod?/:repNivel?', (requisicao, resposta) => {
    let xcSql = '';


    const repCod = requisicao.params.repCod;
    const repNivel = requisicao.params.repNivel;


    if (repNivel == 'D') {
        xcSql += "SELECT "
        xcSql += "   * "
        xcSql += "FROM "
        xcSql += "   comercialRelacaoClientes "
    } else if (repNivel == 'G') {
        xcSql += "SELECT "
        xcSql += "   * "
        xcSql += "FROM "
        xcSql += "   comercialRelacaoClientes "
        xcSql += "WHERE "
        xcSql += "  '" + repCod + "' like '%' + supCod + '%' AND "
        xcSql += "  supCod <> '' "
    } else if (repNivel == 'R') {
        xcSql += "SELECT "
        xcSql += "   * "
        xcSql += "FROM "
        xcSql += "   comercialRelacaoClientes "
        xcSql += "WHERE "
        xcSql += "  '" + repCod + "' like '%' + repCod + '%' "
    }

    console.log(xcSql)
    execSQL(xcSql, resposta);
})


//Representantes - visão dos produtos por clientes
rota.get('/repClientesRef/:repCli?', (requisicao, resposta) => {
    let xcSql = '';


    const repCli = requisicao.params.repCli;


    xcSql += "SELECT "
    xcSql += "  * "
    xcSql += "FROM  "
    xcSql += "   CUBOMB..REPCLI04 "
    xcSql += "WHERE  "
    xcSql += "  codCli = '" + repCli + "'  "

    //console.log(xcSql)
    execSQL(xcSql, resposta);
})


//Representantes - visão dos produtos por clientes
rota.get('/repClientesPed/:codCli?', (requisicao, resposta) => {
    let xcSql = '';


    const codCli = requisicao.params.codCli;

    xcSql += "SELECT "
    xcSql += "   * "
    xcSql += "FROM "
    xcSql += "   vw_repClientesPed "
    xcSql += "WHERE "
    xcSql += "  codCli = '" + codCli + "'  "

    console.log(xcSql)
    execSQL(xcSql, resposta);
})




//Representantes - visão dos títulos por clientes
rota.get('/repClientesTit/:repCli?/:repNiv?/:xcOrig?', (requisicao, resposta) => {
    let xcSql = '';


    const entCod = requisicao.params.repCli;
    const repNivel = requisicao.params.repNiv;
    const xcOrig = requisicao.params.xcOrig;

    if (xcOrig == 'cli') {

        xcSql += "SELECT "
        xcSql += "   * "
        xcSql += "  FROM  "
        xcSql += "    CUBOMB..REPCLI06 "
        xcSql += "  WHERE	 "
        xcSql += "      rtrim(cliCod) + rtrim(cliLoja) = '" + entCod + "'  "

    } else {

        if (repNivel == 'D') {
            xcSql += "SELECT "
            xcSql += "   * "
            xcSql += "  FROM  "
            xcSql += "    CUBOMB..REPCLI06 "
        } else if (repNivel == 'G') {
            xcSql += "SELECT "
            xcSql += "   * "
            xcSql += "  FROM  "
            xcSql += "    CUBOMB..REPCLI06 "
            xcSql += "WHERE "
            xcSql += "  '" + entCod + "' like '%' + codsup + '%' "
        } else if (repNivel == 'R') {
            xcSql += "SELECT "
            xcSql += "   * "
            xcSql += "  FROM  "
            xcSql += "    CUBOMB..REPCLI06 "
            xcSql += "WHERE "
            xcSql += "  '" + entCod + "' like '%' + codrep + '%' "
        }

    }
    console.log(xcSql)
    execSQL(xcSql, resposta);
})


//Representantes - visão dos produtos por clientes
rota.get('/repGrafClientesInativos/:codCli?', (requisicao, resposta) => {
    let xcSql = '';


    const codCli = requisicao.params.codCli;

    xcSql += "SELECT "
    xcSql += "   * "
    xcSql += "FROM "
    xcSql += "   situacaoDescr, COUNT(*) qtde "
    xcSql += "WHERE "
    xcSql += "  '" + repCod + "' like '%' + repCod + '%' "

    console.log(xcSql)
    execSQL(xcSql, resposta);
})

//Representantes - venda geral dos clientes

rota.get('/repGrafClientesInativos/:repCod?/:repNivel?', (requisicao, resposta) => {
    let xcSql = '';


    const repCod = requisicao.params.repCod;
    const repNivel = requisicao.params.repNivel;


    if (repNivel == 'D') {
        xcSql += "SELECT "
        xcSql += "   situacaoDescr, COUNT(*) qtde "
        xcSql += "FROM "
        xcSql += "   comercialRelacaoClientes "
        xcSql += "GROUP BY "
        xcSql += "   situacaoDescr "
    } else if (repNivel == 'G') {
        xcSql += "SELECT "
        xcSql += "   situacaoDescr, COUNT(*) qtde "
        xcSql += "FROM "
        xcSql += "   comercialRelacaoClientes "
        xcSql += "WHERE "
        xcSql += "  '" + repCod + "' like '%' + supCod + '%' AND "
        xcSql += "  supCod <> '' "
        xcSql += "GROUP BY "
        xcSql += "   situacaoDescr "
    } else if (repNivel == 'R') {
        xcSql += "SELECT "
        xcSql += "   situacaoDescr, COUNT(*) qtde "
        xcSql += "FROM "
        xcSql += "   comercialRelacaoClientes "
        xcSql += "WHERE "
        xcSql += "  '" + repCod + "' like '%' + repCod + '%' "
        xcSql += "GROUP BY "
        xcSql += "   situacaoDescr "
    }

    console.log(xcSql)
    execSQL(xcSql, resposta);
})


//Campanhas na tela inicial dos representantes
rota.get('/repTelaInicial/:repCod?', (requisicao, resposta) => {
    let xcSql = '';

    const repCod = requisicao.params.repCod;

    xcSql += "SELECT "
    xcSql += "   * ",
        xcSql += "FROM  "
    xcSql += "    ERPPROD..AA_jsonTelaInicialRepresentantes "
    xcSql += "WHERE  "
    xcSql += "   '" + repCod + "' like '%' + rtrim(repcod) + '%'"

    console.log(xcSql)
    execSQL(xcSql, resposta);
})



//Retorna os detalhes dos pedidos
rota.get('/PedRepDet/:pedi?', (requisicao, resposta) => {
    let xa = "'";
    let xcSql = '';
    const xcPedi = requisicao.params.pedi;

    xcSql += "SELECT "
    xcSql += "   * "
    xcSql += "FROM "
    xcSql += "   CUBOMB..REPPED07 "
    xcSql += "WHERE "
    xcSql += "   pedido = '" + xcPedi + "' "

    console.log(xcSql)
    execSQL(xcSql, resposta);
})


//grafico com os dados dos clientes bloqueados e os motivos
rota.get('/repGrafClientesBloqueados/:repCod?/:repNivel?', (requisicao, resposta) => {
    let xcSql = '';


    const repCod = requisicao.params.repCod;
    const repNivel = requisicao.params.repNivel;


    if (repNivel == 'D') {
        xcSql += "SELECT "
        xcSql += "   tipoBloq, sum(qtde) qtde "
        xcSql += "FROM "
        xcSql += "   comercialRelacaoClientesBlqMotivos "
        xcSql += "GROUP BY "
        xcSql += "   tipoBloq "
    } else if (repNivel == 'G') {
        xcSql += "SELECT "
        xcSql += "   tipoBloq, sum(qtde) qtde "
        xcSql += "FROM "
        xcSql += "   comercialRelacaoClientesBlqMotivos "
        xcSql += "WHERE "
        xcSql += "  '" + repCod + "' like '%' + supCod + '%' AND "
        xcSql += "  supCod <> '' "
        xcSql += "GROUP BY "
        xcSql += "   tipoBloq "
    } else if (repNivel == 'R') {
        xcSql += "SELECT "
        xcSql += "   tipoBloq, sum(qtde) qtde "
        xcSql += "FROM "
        xcSql += "   comercialRelacaoClientesBlqMotivos "
        xcSql += "WHERE "
        xcSql += "  '" + repCod + "' like '%' + repCod + '%' "
        xcSql += "GROUP BY "
        xcSql += "   tipoBloq "
    }

    console.log(xcSql)
    execSQL(xcSql, resposta);
})

//grafico com os dados dos clientes bloqueados e os motivos
rota.get('/repGrafClientesVendidoFaturado/:repCod?/:repNivel?', (requisicao, resposta) => {
    let xcSql = '';


    const repCod = requisicao.params.repCod;
    const repNivel = requisicao.params.repNivel;


    if (repNivel == 'D') {
        xcSql += "SELECT "
        xcSql += "  sum(vendido) vendido, sum(faturado) faturado, sum(meta) meta "
        xcSql += "FROM "
        xcSql += "   comercialRelacaoClientesMetaVendFat "
    } else if (repNivel == 'G') {
        xcSql += "SELECT "
        xcSql += "  sum(vendido) vendido, sum(faturado) faturado, sum(meta) meta "
        xcSql += "FROM "
        xcSql += "   comercialRelacaoClientesMetaVendFat "
        xcSql += "WHERE "
        xcSql += "  '" + repCod + "' like '%' + codRc + '%' AND "
        xcSql += "  codRc <> '' "
    } else if (repNivel == 'R') {
        xcSql += "SELECT "
        xcSql += "  sum(vendido) vendido, sum(faturado) faturado, sum(meta) meta "
        xcSql += "FROM "
        xcSql += "   comercialRelacaoClientesMetaVendFat "
        xcSql += "WHERE "
        xcSql += "  '" + repCod + "' like '%' + codRc + '%' "
    }

    console.log(xcSql)
    execSQL(xcSql, resposta);
})

//grafico com os dados dos produtos vendidos pelos RC
rota.get('/comercialRelacaoProdutosMix100/:repCod?/:repNivel?', (requisicao, resposta) => {
    let xcSql = '';


    const repCod = requisicao.params.repCod;
    const repNivel = requisicao.params.repNivel;


    if (repNivel == 'D') {
        xcSql += "SELECT  "
        xcSql += "  COUNT(codRef) codRef, MAX(qtdeRef) qtdeRef "
        xcSql += "FROM ( "
        xcSql += "SELECT DISTINCT "
        xcSql += "  codRef, qtdeRef "
        xcSql += "FROM "
        xcSql += "   comercialRelacaoProdutosMix100 "
        xcSql += ")M "
    } else {
        xcSql += "SELECT  "
        xcSql += "  COUNT(codRef) codRef, MAX(qtdeRef) qtdeRef "
        xcSql += "FROM ( "
        xcSql += "SELECT DISTINCT "
        xcSql += "  codRef, qtdeRef "
        xcSql += "FROM "
        xcSql += "   comercialRelacaoProdutosMix100 "
        xcSql += "WHERE "
        xcSql += "  '" + repCod + "' like '%' + codRc + '%' "
        xcSql += ")M "
    }

    console.log(xcSql)
    execSQL(xcSql, resposta);
})



//Geral - Controle de Atividades
rota.get('/geralAtividades/:xcUsr?', (requisicao, resposta) => {
    let xcSql = '';
    let permissaoUsers = '000001 | 000020 | 000008 | 000010 | 000049'
    const xcUsr = requisicao.params.xcUsr;

    if (permissaoUsers.match(xcUsr)) {
        xcSql += "SELECT "
        xcSql += "    * "
        xcSql += "FROM  "
        xcSql += "    ERPPROD..AA_jsonGeralAtividades "
    } else {
        xcSql += "SELECT "
        xcSql += "    * "
        xcSql += "FROM  "
        xcSql += "    ERPPROD..AA_jsonGeralAtividades "
        xcSql += "WHERE  "
        xcSql += "    (codSolic = '" + xcUsr + "' OR "
        xcSql += "    codResp = '" + xcUsr + "') "
    }

    console.log(xcSql)
    execSQL(xcSql, resposta);
})


//Cargas detalhadas para impressão
rota.get('/logCargasImpressao/:numCarga?', (requisicao, resposta) => {
    let xcSql = '';

    const numCarga = requisicao.params.numCarga;

    xcSql += "SELECT "
    xcSql += "   * "
    xcSql += "FROM "
    xcSql += "   CUBOMB..logCargasImpressao "
    xcSql += "WHERE "
    xcSql += "   crg = '" + numCarga + "' "
    xcSql += "ORDER BY "
    xcSql += "   1, 2, 3 "

    console.log(xcSql)
    execSQL(xcSql, resposta);
})

//Cargas detalhadas para impressão
rota.get('/logCargasImpressaoResumo/:numCarga?', (requisicao, resposta) => {
    let xcSql = '';

    const numCarga = requisicao.params.numCarga;


    xcSql += "SELECT "
    xcSql += "   crg, prd, dsc, unidadePrimeira, "
    xcSql += "   sum(qtd) qtd, sum(vol) vol, sum(pes) pes, sum(cub) cub "
    xcSql += "FROM "
    xcSql += "   CUBOMB..logCargasImpressao "
    xcSql += "WHERE "
    xcSql += "   crg = '" + numCarga + "' "
    xcSql += "GROUP BY "
    xcSql += "   crg, prd, dsc, unidadePrimeira "
    xcSql += "ORDER BY "
    xcSql += "   1, 2, 3 "


    console.log(xcSql)
    execSQL(xcSql, resposta);
})



//Consulta para retornar os dados do pedido para impress�o
rota.get('/comercialImpressaoPedido/:numPedido?', (requisicao, resposta) => {
    let xcSql = '';

    const numPedido = requisicao.params.numPedido;


    xcSql += "SELECT "
    xcSql += "   * "
    xcSql += "FROM "
    xcSql += "   comercialImpressaoPedido "
    xcSql += "WHERE "
    xcSql += "   pedido = '" + numPedido + "' "
    xcSql += "ORDER BY "
    xcSql += "   1, 2, 3 "


    console.log(xcSql)
    execSQL(xcSql, resposta);
})


//PCP - Telas inicias para programação
rota.get('/opsFab', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "SELECT "
    xcSql += "   * "
    xcSql += "FROM "
    xcSql += "   AA_json_Pcp_OPs_Andamento "

    console.log(xcSql)
    execSQL(xcSql, resposta);
})


//PCP - Telas inicias para programação
rota.get('/pcpImpressaOP/:numOP?', (requisicao, resposta) => {
    let xcSql = '';

    const numOP = requisicao.params.numOP;

    xcSql += "SELECT "
    xcSql += "   * "
    xcSql += "FROM "
    xcSql += "   pcpImpressaOP "
    xcSql += "WHERE "
    xcSql += "  '" + numOP + "' like '%' + numOP + '%' "
    xcSql += "ORDER BY "
    xcSql += "  1, 2 "
    // xcSql += "  '" + numOP + "' numOP =  "

    console.log(xcSql)
    execSQL(xcSql, resposta);
})

//retorna os status para colocar na tela dos pedidos de representantes
rota.get('/Pedidos_Alteracao_Status', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "SELECT "
    xcSql += "   * "
    xcSql += "FROM "
    xcSql += "   AA_json_Pedidos_Alteracao_Status "

    console.log(xcSql)
    execSQL(xcSql, resposta);
})

//retorna os status para colocar na tela dos pedidos de representantes
rota.get('/pedidosAndamentoListaStatus', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "SELECT "
    xcSql += "   * "
    xcSql += "FROM "
    xcSql += "   vw_pedidosAndamentoListaStatus "

    console.log(xcSql)
    execSQL(xcSql, resposta);
})




//Alteracao Clientes Inativos, ajuste de cadastro
rota.post('/atuClientesInativos', (requisicao, resposta) => {
    let xcSql = '';
    let xcOk = 'OK';


    xcSql += "EXEC " //xcTip, xcCod, , , , , , , , , , , , 
    xcSql += "   sp_Cliente_Inativo_Bloq_Atu "
    xcSql += "'" + requisicao.body.xcTip + "', "
    xcSql += "'" + requisicao.body.xcCod + "', "
    xcSql += "'" + requisicao.body.xcLoja + "', "
    xcSql += "'" + requisicao.body.xcDdd + "', "
    xcSql += "'" + requisicao.body.xcTel1 + "', "
    xcSql += "'" + requisicao.body.xcTel2 + "', "
    xcSql += "'" + requisicao.body.xcTel3 + "', "
    xcSql += "'" + requisicao.body.xcEmail + "', "
    xcSql += "'" + requisicao.body.xcVend + "', "
    xcSql += "'" + requisicao.body.xcMot + "', "
    xcSql += "'" + requisicao.body.xcUsr + "', "
    xcSql += "'" + requisicao.body.xcObs + "', "
    xcSql += "'" + requisicao.body.xdRet + "', "
    xcSql += "'" + requisicao.body.xcOut + "' "

    console.log(xcSql)
    execSQL(xcSql, resposta);
})

//Representantes - venda geral dos clientes

rota.get('/repClientesDetalhes/:codCli?', (requisicao, resposta) => {
    let xcSql = '';

    const codCli = requisicao.params.codCli;

    xcSql += "SELECT "
    xcSql += "   * "
    xcSql += "FROM "
    xcSql += "   comercialRelacaoClientes "
    xcSql += "WHERE "
    xcSql += "  codCli = '" + codCli + "' "

    console.log(xcSql)
    execSQL(xcSql, resposta);
})


//Lista com o perfil dos clientes
rota.get('/comercialRelacaoPerfilClientes', (requisicao, resposta) => {
    let xcSql = '';


    xcSql += "SELECT "
    xcSql += "   * "
    xcSql += "FROM "
    xcSql += "   comercialRelacaoPerfilClientes "

    console.log(xcSql)
    execSQL(xcSql, resposta);
})

//Alteracao Clientes Inativos, ajuste de cadastro
rota.post('/repAtucliInativos', (requisicao, resposta) => {
    let xcSql = '';


    xcSql += "EXEC " //xcTip, xcCod, , , , , , , , , , , , 
    xcSql += "   representanteAtualizaCadastroClientes "
    xcSql += "'" + requisicao.body.xcCod + "', "
    xcSql += "'" + requisicao.body.xcPerfil + "', "
    xcSql += "'" + requisicao.body.xcTel2 + "', "
    xcSql += "'" + requisicao.body.xcTel3 + "', "
    xcSql += "'" + requisicao.body.xcEmail + "', "
    xcSql += "'" + requisicao.body.xcUsr + "', "
    xcSql += "'" + requisicao.body.xcObs + "' "

    console.log(xcSql)
    execSQL(xcSql, resposta);
})


//Entradas e Sa+idas
rota.get('/estoqueEntradasSaidas', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "SELECT "
    xcSql += "   * "
    xcSql += "FROM "
    xcSql += "   CUBOMB..pcpEntradaSaida "

    console.log(xcSql)
    execSQL(xcSql, resposta);
})

//Atualiza as tabelas de Entrada e saida
rota.post('/spFechamentoEstoque', (requisicao, resposta) => {
    let xcSql = '';


    xcSql += "EXEC " //xcTip, xcCod, , , , , , , , , , , , 
    xcSql += "   CUBOMB..spFechamentoEstoque "

    console.log(xcSql)
    execSQL(xcSql, resposta);
})

//Atualiza as tabelas de Diferenca entre OP
rota.post('/spFechamentoDifOP', (requisicao, resposta) => {
    let xcSql = '';


    xcSql += "EXEC " //xcTip, xcCod, , , , , , , , , , , , 
    xcSql += "   CUBOMB..spFechamentoDifOP "

    console.log(xcSql)
    execSQL(xcSql, resposta);
})


//clientes aptos ou não para agendamento
rota.get('/agendaClientes', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "SELECT "
    xcSql += "   * "
    xcSql += "FROM "
    xcSql += "   varejoClientes "
    xcSql += "ORDER BY "
    xcSql += "   1,2 "

    console.log(xcSql)
    execSQL(xcSql, resposta);
})

//Representantes com agendamento ou não
rota.get('/varejoVendedores', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "SELECT "
    xcSql += "   * "
    xcSql += "FROM "
    xcSql += "   varejoVendedores "
    xcSql += "ORDER BY "
    xcSql += "   1 "

    console.log(xcSql)
    execSQL(xcSql, resposta);
})

//Cidades onde tem clientes
rota.get('/varejoCidades', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "SELECT "
    xcSql += "   * "
    xcSql += "FROM "
    xcSql += "   varejoCidades "
    xcSql += "ORDER BY "
    xcSql += "   2 "

    console.log(xcSql)
    execSQL(xcSql, resposta);
})



//Agendamentos do Cliente clientes
rota.get('/varejoAgendas/:codCli?', (requisicao, resposta) => {
    let xcSql = '';

    const codCli = requisicao.params.codCli;

    xcSql += "SELECT "
    xcSql += "   * "
    xcSql += "FROM "
    xcSql += "   varejoAgendas "
    xcSql += "WHERE "
    xcSql += "  codCli = '" + codCli + "'  "
    xcSql += "ORDER BY "
    xcSql += "   3,4 "

    console.log(xcSql)
    execSQL(xcSql, resposta);
})

//Lista geral dos agendamentos
rota.get('/varejoAgendasGeral', (requisicao, resposta) => {
    let xcSql = '';

    const codCli = requisicao.params.codCli;

    xcSql += "SELECT "
    xcSql += "   * "
    xcSql += "FROM "
    xcSql += "   varejoAgendasGeral "
    xcSql += "ORDER BY "
    xcSql += "   3,1 "

    console.log(xcSql)
    execSQL(xcSql, resposta);
})

//Agendamentos do vendedor para não repetir
rota.get('/varejoAgendasVendedor/:vendedor?', (requisicao, resposta) => {
    let xcSql = '';

    const vendedor = requisicao.params.vendedor;

    xcSql += "SELECT "
    xcSql += "   * "
    xcSql += "FROM "
    xcSql += "   varejoAgendasVendedor "
    xcSql += "WHERE "
    xcSql += "  vendedor = '" + vendedor + "'  "
    xcSql += "ORDER BY "
    xcSql += "   1,2 "

    console.log(xcSql)
    execSQL(xcSql, resposta);
})

//usuárioscom permissão para efetuar cortes
rota.get('/pac40Cortes/', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "SELECT "
    xcSql += "   PAC_TXT01 "
    xcSql += "FROM "
    xcSql += "   CUBOMB..PAC40CORTES "

    console.log(xcSql)
    execSQL(xcSql, resposta);
})


//itens do pedido desstinadopara cortes
rota.get('/pedidoCorteTabela/:pedItemLb?', (requisicao, resposta) => {
    let xcSql = '';

    const pedItemLb = requisicao.params.pedItemLb;


    xcSql += "SELECT ";
    xcSql += "   * ";
    xcSql += "FROM  ";
    xcSql += "    vw_pedidoCorteTabela ";
    xcSql += "WHERE  ";
    xcSql += "    numPedido = '" + pedItemLb + "' ";

    console.log(xcSql);
    execSQL(xcSql, resposta);
})

//atualização das reservas no momento de cortar
rota.post('/estoqueReservaAtualiza', (requisicao, resposta) => {
    let xcSql = '';


    xcSql += "EXEC " //xcTip, xcCod, , , , , , , , , , , , 
    xcSql += "   sp_estoqueReservaAtualiza "

    console.log(xcSql);
    execSQL(xcSql, resposta);
})


//Pré - Carga Montar - procedure
rota.post('/logisticaReservaPedido', (requisicao, resposta) => {
    let xcSql = '';

    const xcPedido = requisicao.body.xcPedido;
    const xcTipo = requisicao.body.xcTipo;

    xcSql += "EXEC "
    xcSql += "   sp_logisticaReservaPedido "
    xcSql += "'" + xcPedido + "', "
    xcSql += "'" + xcTipo + "' "
    console.log(xcSql)
    execSQL(xcSql, resposta);
})

//itens do pedido desstinadopara cortes
rota.get('/pedidoCorteMotivos', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "SELECT ";
    xcSql += "   * ";
    xcSql += "FROM  ";
    xcSql += "    vw_pedidoCorteMotivos ";

    console.log(xcSql);
    execSQL(xcSql, resposta);
})

//pedidos e notas por RC
rota.get('/comercialPedidosNotasRC/:xcRep?/:xcSup?/:xcMesDe?/:xcMesTe?/:xcTipo?', (requisicao, resposta) => {
    let xcSql = '';

    const xcRep = requisicao.params.xcRep;
    const xcSup = requisicao.params.xcSup;
    const xcMesDe = requisicao.params.xcMesDe;
    const xcMesTe = requisicao.params.xcMesTe;
    const xcTipo = requisicao.params.xcTipo;

    if (xcTipo === 'SELEC') {
        xcSql += "SELECT DISTINCT ";
        xcSql += "   'RC' TIPO, RC + ' - ' + NOMERC INFO ";
        xcSql += "FROM  ";
        xcSql += "    vw_comercialPedidosNotasRC ";
        xcSql += "UNION ALL ";
        xcSql += "SELECT DISTINCT ";
        xcSql += "   'SUP' TIPO, SUP + ' - ' + NOMESUP INFO ";
        xcSql += "FROM  ";
        xcSql += "    vw_comercialPedidosNotasRC ";
        xcSql += "UNION ALL ";
        xcSql += "SELECT DISTINCT ";
        xcSql += "   'PER' TIPO, MES INFO ";
        xcSql += "FROM  ";
        xcSql += "    vw_comercialPedidosNotasRC ";
        xcSql += "ORDER BY  ";
        xcSql += "    1,2 ";
    }
    if (xcTipo === 'RESUMO') {
        xcSql += "SELECT DISTINCT ";
        xcSql += "  NOMERC, NOMESUP, ";
        xcSql += "  SUM(PEDTOTAL) PEDTOTAL, SUM(PEDBRUTO) PEDBRUTO,  ";
        xcSql += "  SUM(LBVALOR) LBVALOR, SUM(NOTATOTAL) NOTATOTAL,  ";
        xcSql += "  SUM(NOTABRUTO) NOTABRUTO, SUM(FRETEVALOR) FRETEVALOR ";
        xcSql += "FROM  ";
        xcSql += "  vw_comercialPedidosNotasRC ";
        xcSql += "WHERE  ";

        if (xcRep === 'SEM') {
            if (xcSup !== 'SEM') {
                xcSql += "  SUP = '" + xcSup + "' AND";
            }
        } else {
            if (xcSup !== 'SEM') {
                // xcSql += "  RC = '" + xcRep + "' AND";
                xcSql += "  SUP = '" + xcSup + "' AND";
            } else {
                xcSql += "  RC = '" + xcRep + "' AND";
            }

        }
        xcSql += "  MES BETWEEN '" + xcMesDe + "' AND '" + xcMesTe + "' ";
        xcSql += "GROUP BY  ";
        xcSql += "   NOMERC, NOMESUP ";

    }

    console.log(xcSql);
    execSQL(xcSql, resposta);
})

//Clientes do guarani prontos para importação
rota.get('/cadastroClienteGuarani', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "SELECT ";
    xcSql += "   * ";
    xcSql += "FROM  ";
    xcSql += "    CUBOMB..vw_cadastroClienteGuarani ";

    console.log(xcSql);
    execSQL(xcSql, resposta);
})


//Pedidos do guarani prontos para importação
rota.get('/pedidosGuarani', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "SELECT ";
    xcSql += "   * ";
    xcSql += "FROM  ";
    xcSql += "    CUBOMB..vw_pedidosGuarani ";

    execSQL(xcSql, resposta);
})


//Inclui agenda na tabela de agenda
rota.post('/agendaIncRegistro', (requisicao, resposta) => {
    let xcSql = '';


    xcSql += "EXEC " //xcTip, xcCod, , , , , , , , , , , , 
    xcSql += "   agendaIncRegistro "
    xcSql += "'" + requisicao.body.repCod + "', "
    xcSql += "'" + requisicao.body.codCli + "', "
    xcSql += "'" + requisicao.body.codLoja + "', "
    xcSql += "'" + requisicao.body.dia + "', "
    xcSql += "'" + requisicao.body.obs + "', "
    xcSql += "'" + requisicao.body.hora + "'"

    execSQL(xcSql, resposta);
})

//Deleta registro na agenda
rota.post('/agendaDelRegistro', (requisicao, resposta) => {
    let xcSql = '';


    xcSql += "EXEC " //xcTip, xcCod, , , , , , , , , , , , 
    xcSql += "   agendaDelRegistro "
    xcSql += "'" + requisicao.body.registro + "'"

    execSQL(xcSql, resposta);
})

//Atualiza o pedido de acordo com a solicitação dos cortes
rota.post('/cortePedido', (requisicao, resposta) => {
    let xcSql = '';


    xcSql += "EXEC " //xcTip, xcCod, , , , , , , , , , , , 
    xcSql += "   sp_cortePedido "
    xcSql += "'" + requisicao.body.pedido + "', "
    xcSql += "'" + requisicao.body.item + "', "
    xcSql += "'" + requisicao.body.motivo + "', "
    xcSql += "'" + requisicao.body.user + "', "
    xcSql += " " + requisicao.body.qtdeCorte + ", "
    xcSql += " '" + requisicao.body.tipoCorte + "' "

    console.log(xcSql)

    execSQL(xcSql, resposta);

})

//Cria novo pedido ou apenas atualiza os valores dos pedidos
rota.post('/cortePedidoGera', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "EXEC " //xcTip, xcCod, , , , , , , , , , , , 
    xcSql += "   sp_cortePedidoGera "
    xcSql += "'" + requisicao.body.pedido + "' "
    execSQL(xcSql, resposta);
})

//Cria novo pedido ou apenas atualiza os valores dos pedidos
rota.post('/corrigeInscricao', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "EXEC " //xcTip, xcCod, , , , , , , , , , , , 
    xcSql += "   sp_incluiClienteGuaraniInscricao "
    xcSql += "'" + requisicao.body.codCli + "', "
    xcSql += " '" + requisicao.body.inscriEst + "' "
    execSQL(xcSql, resposta);
})


//Comercial, acompanhamento diário dos clientes
rota.get('/clientesDiariamente', (requisicao, resposta) => {
    let xcSql = '';


    xcSql += "SELECT "
    xcSql += "   * "
    xcSql += "FROM "
    xcSql += "   clientesDiariamente "

    execSQL(xcSql, resposta);
})

//Comercial, acompanhamento diário dos clientes
rota.get('/clientesAcompanhamento/:xdDia?', (requisicao, resposta) => {
    let xcSql = '';

    const xdDia = requisicao.params.xdDia;

    xcSql += "SELECT "
    xcSql += "   * "
    xcSql += "FROM "
    xcSql += "   clientesAcompanhamento "
    xcSql += "WHERE "
    xcSql += "   cadDia = '" + xdDia + "' OR "
    xcSql += "   sinDia = '" + xdDia + "' OR "
    xcSql += "   anaDia = '" + xdDia + "' "

    execSQL(xcSql, resposta);
})

//Comercial, acompanhamento diário dos clientes
rota.get('/okrObjetivo', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "SELECT "
    xcSql += "   * "
    xcSql += "FROM "
    xcSql += "   vw_okrObjetivo "

    execSQL(xcSql, resposta);
})


//cria Objetivos
rota.post('/spOkr', (requisicao, resposta) => {
    let xcSql = '';


    const obj = requisicao.body.obj;
    const resp = requisicao.body.resp;
    const obs = requisicao.body.obs;


    xcSql += "exec "
    xcSql += "  sp_okrObjetivos  "
    xcSql += " '" + obj
    xcSql += "', '" + resp
    xcSql += "', '" + obs + "' "

    console.log(xcSql)

    execSQL(xcSql, resposta);
})



//Comercial, acompanhamento diário dos clientes
rota.get('/pedidoCorteRelatorioItens/:dtDe?/:dtAte?/:xcMotivo?', (requisicao, resposta) => {
    let xcSql = '';

    const dtDe = requisicao.params.dtDe;
    const dtAte = requisicao.params.dtAte;
    const xcMotivo = requisicao.params.xcMotivo;

    xcSql += "SELECT "
    xcSql += "  produto, descricao, tipo, "
    xcSql += "  sum(qtde) qtde, "
    xcSql += "  sum(vlr) vlr "
    xcSql += "FROM "
    xcSql += "   vw_pedidoCorteRelatorioItens "
    if (xcMotivo == '000') {
        if (dtDe != '999') {
            xcSql += "WHERE "
            xcSql += "  dataCorte >= '" + dtDe + "' "
            if (dtAte != '999') {
                xcSql += " and dataCorte <= '" + dtAte + "' "
            }
        } else {
            if (dtAte != '999') {
                xcSql += "WHERE "
                xcSql += "  dataCorte <= '" + dtAte + "' "
            }
        }
    } else {
        xcSql += "WHERE "
        xcSql += "  motivo = '" + xcMotivo + "' "
        if (dtDe != '999') {
            xcSql += "  and dataCorte >= '" + dtDe + "' "
            if (dtAte != '999') {
                xcSql += " and dataCorte <= '" + dtAte + "' "
            }
        } else {
            if (dtAte != '999') {
                xcSql += " and dataCorte <= '" + dtAte + "' "
            }
        }

    }
    xcSql += "GROUP BY "
    xcSql += "   produto, descricao, tipo "

    console.log(xcSql)

    execSQL(xcSql, resposta);
})


//Comercial, acompanhamento diário dos clientes
rota.get('/pedidoCorteRelatorioPedido/:xcMotivo?', (requisicao, resposta) => {
    let xcSql = '';

    const xcMotivo = requisicao.params.xcMotivo;

    xcSql += "SELECT DISTINCT "
    xcSql += "   pedido, codCli, lojaCli, nomeCli, tipoCorte, faturado, rcCod, rcNome, rcEmail "
    xcSql += "FROM "
    xcSql += "   vw_pedidoCorteRelatorio "

    if (xcMotivo != '000') {
        xcSql += "WHERE "
        xcSql += "  motivo = '" + xcMotivo + "' "
    }

    console.log(xcSql)

    execSQL(xcSql, resposta);
})


//pedidos cortados originais
rota.get('/pedidoCorteRelatorioOriginal/:pedCortado?', (requisicao, resposta) => {
    let xcSql = '';
    const pedCortado = requisicao.params.pedCortado;

    xcSql += "SELECT "
    xcSql += "   * "
    xcSql += "FROM "
    xcSql += "   vw_pedidoCorteRelatorioOriginal "
    xcSql += "WHERE "
    xcSql += "  pedido = '" + pedCortado + "' ";

    execSQL(xcSql, resposta);
})

//pedidos gerados a partir do corte
rota.get('/pedidoCorteRelatorioGerado/:pedCortado?', (requisicao, resposta) => {
    let xcSql = '';
    const pedCortado = requisicao.params.pedCortado;

    xcSql += "SELECT "
    xcSql += "   * "
    xcSql += "FROM "
    xcSql += "   vw_pedidoCorteRelatorioGerado "
    xcSql += "WHERE "
    xcSql += "  pedido = '" + pedCortado + "' ";

    execSQL(xcSql, resposta);
})


//Envia email dos pedidos cortados
rota.post('/envioPedidoCorte', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "EXEC " //xcTip, xcCod, , , , , , , , , , , , 
    xcSql += "   sp_envioPedidoCorte "
    xcSql += "'" + requisicao.body.pedido + "' "

    console.log(xcSql)

    execSQL(xcSql, resposta);

})

//pedidos gerados a partir do corte
rota.get('/pedidoCorteMotivos', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "SELECT "
    xcSql += "   * "
    xcSql += "FROM "
    xcSql += "   vw_pedidoCorteMotivos "

    execSQL(xcSql, resposta);
})


//Atualiza a tabela de extrato do financeiro
rota.post('/atuExtratoBancario', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "EXEC "
    xcSql += "   sp_extratoBancario "

    execSQL(xcSql, resposta);

})

//Extrato bancario inicial resumo por empresas
rota.get('/extratoBancarioEmpresas', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "SELECT "
    xcSql += "   * "
    xcSql += "FROM "
    xcSql += "   vw_extratoBancarioEmpresas "

    execSQL(xcSql, resposta);
})

//Extrato bancario inicial resumo por bancos
rota.get('/extratoBancarioBancos/:empresa?', (requisicao, resposta) => {
    let xcSql = '';

    const empresa = requisicao.params.empresa;

    xcSql += "SELECT "
    xcSql += "   * "
    xcSql += "FROM "
    xcSql += "   vw_extratoBancarioBancos "
    xcSql += "WHERE "
    xcSql += "   empresa = '" + empresa + "' "

    execSQL(xcSql, resposta);
})

//Extrato bancario inicial resumo por bancos
rota.get('/extratoBancarioAgencias/:empresa?/:banco?', (requisicao, resposta) => {
    let xcSql = '';

    const empresa = requisicao.params.empresa;
    const banco = requisicao.params.banco;

    xcSql += "SELECT "
    xcSql += "   * "
    xcSql += "FROM "
    xcSql += "   vw_extratoBancarioAgencias "
    xcSql += "WHERE "
    xcSql += "   empresa = '" + empresa + "' AND "
    xcSql += "   banco = '" + banco + "' "

    execSQL(xcSql, resposta);
})


//Extrato bancario lancamentos por conta
rota.get('/extratoBancarioLanctos/:empresa?/:banco?/:agencia?/:conta?/:recon?', (requisicao, resposta) => {
    let xcSql = '';

    const empresa = requisicao.params.empresa;
    const banco = requisicao.params.banco;
    const agencia = requisicao.params.agencia;
    const conta = requisicao.params.conta;
    const recon = requisicao.params.recon;

    xcSql += "SELECT "
    xcSql += "   * "
    xcSql += "FROM "
    xcSql += "   vw_extratoBancarioLanctos "
    xcSql += "WHERE "
    xcSql += "   empresa = '" + empresa + "' AND "
    xcSql += "   banco = '" + banco + "' AND "
    xcSql += "   agencia = '" + agencia + "' AND "
    if (recon == 'x') {
        xcSql += "   recon = '" + recon + "' AND "
    }
    if (recon == 'z') {
        xcSql += "   recon = ' ' AND "
    }
    xcSql += "   conta = '" + conta + "' "

    console.log(xcSql)

    execSQL(xcSql, resposta);
})

//atualiza a reconciliação
rota.post('/extratoBancarioReconc', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "EXEC " //(@empresa varchar(2), @rec int, @tipo int)
    xcSql += "   sp_extratoBancarioReconc "
    xcSql += "'" + requisicao.body.empresa + "', "
    xcSql += "" + requisicao.body.rec + ", "
    xcSql += " " + requisicao.body.tipo

    console.log(xcSql)

    execSQL(xcSql, resposta);

})

//atualiza a base do financeido para geração dos extratos
rota.post('/extratoBancarioAtualiza', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "EXEC "
    xcSql += "   CUBOMB..sp_extratoBancarioAtualiza "

    console.log(xcSql)
    execSQL(xcSql, resposta);

})

//Saldo da conta em determinada data
rota.get('/ctbPlanoContas', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "SELECT "
    xcSql += "   conta, rec "
    xcSql += "FROM "
    xcSql += "   vw_ctbPlanoContas   "


    console.log(xcSql)

    execSQL(xcSql, resposta);
})

//Saldo da conta em determinada data
rota.get('/ctbSaldoConta/:conta?/:dia?', (requisicao, resposta) => {
    let xcSql = '';

    const conta = requisicao.params.conta;
    const dia = requisicao.params.dia;

    if (conta !== 'x') {
        xcSql += "SELECT "
        xcSql += "   conta, sum(vlr) vlr, "
        xcSql += "   CONVERT(varchar(8), getdate(), 112) hoje "
        xcSql += "FROM "
        xcSql += "   vw_ctbSaldoConta   "
        xcSql += "WHERE "
        if (dia === 'x') {
            xcSql += "   conta = '" + conta + "'  "
        } else {
            xcSql += "   conta = '" + conta + "' AND "
            xcSql += "   dia <= '" + dia + "' "
        }
         xcSql += "GROUP BY "
         xcSql += "   conta "
    }

    console.log(xcSql)

    execSQL(xcSql, resposta);
})

//Saldo da conta em determinada data
rota.get('/ctbLanctoConta/:conta?/:diade?/:diate?/:hist?', (requisicao, resposta) => {
    let xcSql = '';

    const conta = requisicao.params.conta;
    const diade = requisicao.params.diade;
    const diate = requisicao.params.diate;
    const hist = requisicao.params.hist;

    if (conta !== 'x' && diade !== 'x') {
        xcSql += "SELECT TOP 5000 "
        xcSql += "   dia, lote, subLote, doc, linha, tipo, "
        xcSql += "   debito, credito, vlr, hist, origem, rec "
        xcSql += "FROM "
        xcSql += "   vw_ctbLanctoConta   "
        xcSql += "WHERE "
        if (diade === 'x' && diate === 'x') {
            xcSql += "  ( debito = '" + conta + "' OR credito = '" + conta + "')  "
        }
        if (diade === 'x' && diate !== 'x') {
            xcSql += "  ( debito = '" + conta + "' OR credito = '" + conta + "')  AND "
            xcSql += "   dia <= '" + diate + "' "
        }
        if (diade !== 'x' && diate === 'x') {
            xcSql += "  ( debito = '" + conta + "' OR credito = '" + conta + "')  AND "
            xcSql += "   dia >= '" + diate + "' "
        }
        if (diade !== 'x' && diate !== 'x') {
            xcSql += "  ( debito = '" + conta + "' OR credito = '" + conta + "')  AND "
            xcSql += "   dia between '" + diade + "' AND '" + diate + "' "
            if (hist != 'zz') {
                xcSql += "   AND upper(hist) like upper('%" + hist + "%') "
            }
        }
    }

    console.log(xcSql)

    execSQL(xcSql, resposta);
})

//Tabela de preços para os representantes
rota.get('/repTabelaPreco', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "SELECT "
    xcSql += "   * "
    xcSql += "FROM "
    xcSql += "   AA_json_Tabela_Precos "
    xcSql += "ORDER BY "
    xcSql += "   1 "

    console.log(xcSql)
    execSQL(xcSql, resposta);

})

//Tabela de preços para os representantes - Detalhes
rota.get('/repTabelaPrecoDetalhes/:tabDet?', (requisicao, resposta) => {
    let xcSql = '';
    const tabDet = requisicao.params.tabDet;

    xcSql += "SELECT "
    xcSql += "   * "
    xcSql += "FROM "
    xcSql += "   vw_repTabelaPrecoDetalhes "
    xcSql += "WHERE "
    xcSql += "   tabela = '" + tabDet + "' "
    xcSql += "ORDER BY "
    xcSql += "   1,4 "

    console.log(xcSql)
    execSQL(xcSql, resposta);

})

//pesquisa transportadora - redespacho
rota.get('/cadastroTransportadora', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "SELECT "
    xcSql += "   * "
    xcSql += "FROM "
    xcSql += "   vw_cadastroTransportadora "

    console.log(xcSql)
    execSQL(xcSql, resposta);
})

//pesquisa Condiçoes de Pagamento - redespacho
rota.get('/cadastroCondicaoPagamento', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "SELECT "
    xcSql += "   * "
    xcSql += "FROM "
    xcSql += "   vw_cadastroCondicaoPagamento "

    console.log(xcSql)
    execSQL(xcSql, resposta);
})


//atualiza a base do financeido para geração dos extratos
rota.post('/ctbAlteraLancto', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "EXEC "
    xcSql += "   sp_ctbAlteraLancto "
    xcSql += "" + requisicao.body.rec + ", "
    xcSql += "'" + requisicao.body.debito + "', "
    xcSql += "'" + requisicao.body.credito + "' "

    console.log(xcSql)
    execSQL(xcSql, resposta);

})

//atualiza a base do financeido para geração dos extratos
rota.post('/contabilSaldoAtual', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "EXEC "
    xcSql += "   CUBOMB..sp_contabilSaldoAtual "
   

    console.log(xcSql)
    execSQL(xcSql, resposta);

})

    //atualiza a base do financeido para geração dos extratos
rota.post('/ctbDeletaLancto', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "EXEC "
    xcSql += "   sp_ctbDeletaLancto "
    xcSql += "" + requisicao.body.rec + " "

    console.log(xcSql)
    execSQL(xcSql, resposta);

})


//atualiza o pedido de vendas
rota.post('/ctbAlteraPedido', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "EXEC "
    xcSql += "   sp_comercialPedidoDet "
    xcSql += "'" + requisicao.body.pedido + "', "
    xcSql += "'" + requisicao.body.cond + "', "
    xcSql += "'" + requisicao.body.transp + "', "
    xcSql += "'" + requisicao.body.redesp + "', "
    xcSql += "'" + requisicao.body.mennota + "', "
    xcSql += "'" + requisicao.body.obsped + "', "
    xcSql += "'" + requisicao.body.obsexp + "', "
    xcSql += "'" + requisicao.body.obsfina + "', "
    xcSql += "'" + requisicao.body.obscad + "', "
    xcSql += "'" + requisicao.body.obsregra + "', "
    xcSql += "'" + requisicao.body.datafat + "' "


    console.log(xcSql)
    execSQL(xcSql, resposta);

})


//Cadastro de Representantes
rota.get('/CadRc', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "SELECT "
    xcSql += "   * "
    xcSql += "FROM "
    xcSql += "   AA_json_Cad_Rep "
    xcSql += "ORDER BY "
    xcSql += "   1 "

    console.log(xcSql)
    execSQL(xcSql, resposta);

})


//relação de cidades amarradas com o rc
rota.get('/cidadesRc', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "SELECT "
    xcSql += "   * "
    xcSql += "FROM "
    xcSql += "   vw_cidadesRc "

    console.log(xcSql)
    execSQL(xcSql, resposta);

})

//relação de cidades amarradas com o rc
rota.get('/segmentosRc', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "SELECT "
    xcSql += "   * "
    xcSql += "FROM "
    xcSql += "   vw_segmentosRc "

    console.log(xcSql)
    execSQL(xcSql, resposta);

})


//retorna o cadastro de cidades
rota.get('/cadastroCidades', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "SELECT "
    xcSql += "    * "
    xcSql += "FROM "
    xcSql += "   vw_listaCidades "

    console.log(xcSql)
    execSQL(xcSql, resposta);

})


//retorna o cadastro de segmentos
rota.get('/cadastroSegmentos', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "SELECT "
    xcSql += "    * "
    xcSql += "FROM "
    xcSql += "   vw_listaSegmentos "

    console.log(xcSql)
    execSQL(xcSql, resposta);

})


//Amarração do RC com as Cidades
rota.post('/incluiRepresentanteCidades', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "EXEC "
    xcSql += "   sp_representanteCidades "
    xcSql += "" + requisicao.body.codRc + ", "
    xcSql += "" + requisicao.body.codCidade + " "


    console.log(xcSql)
    execSQL(xcSql, resposta);

})


//Amarração do RC com os Segmentos
rota.post('/incluiRepresentanteSegmentos', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "EXEC "
    xcSql += "   sp_representanteSegmentos "
    xcSql += "" + requisicao.body.codRc + ", "
    xcSql += "'" + requisicao.body.codSeg + "' "


    console.log(xcSql)
    execSQL(xcSql, resposta);

})


//atualiza o pedido de vendas
rota.post('/alteraRepresentanteLicenca', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "EXEC "
    xcSql += "   sp_alteraRepresentanteLicenca "
    xcSql += "'" + requisicao.body.codRc + "', "
    xcSql += "" + requisicao.body.codQtde + ", "
    xcSql += "'" + requisicao.body.tipoLic + "' "


    console.log(xcSql)
    execSQL(xcSql, resposta);

})

//atualiza o pedido de vendas
rota.post('/representanteComissaoCalc', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "EXEC "
    xcSql += "   sp_representanteComissaoCalc "
    xcSql += "'" + requisicao.body.dtEmissa + "', "
    xcSql += "'" + requisicao.body.dvVencto + "', "
    xcSql += " " + requisicao.body.ValComis + ", "
    xcSql += "'" + requisicao.body.Observar + "', "
    xcSql += "'" + requisicao.body.tipoOper + "' "


    console.log(xcSql)
    execSQL(xcSql, resposta);

})


//retorna o cadastro de segmentos
rota.get('/cadatroClientesGeral', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "SELECT "
    xcSql += "    * "
    xcSql += "FROM "
    xcSql += "   vw_cadatroClientesGeral "

    console.log(xcSql)
    execSQL(xcSql, resposta);

})

//Dados da comissão - filtro do representante
rota.get('/filtro_vend', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "SELECT "
    xcSql += "    * "
    xcSql += "FROM "
    xcSql += "   AA_json_Financeiro_Comissao_Filtro_Vend "
    xcSql += "ORDER BY "
    xcSql += "   1,3 desc "

    console.log(xcSql)
    execSQL(xcSql, resposta);

})


//Dados do financeiro contas a pagar
rota.get('/finPagar', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "SELECT "
    xcSql += "    * "
    xcSql += "FROM "
    xcSql += "   AA_jsonFinPagar "

    console.log(xcSql)
    execSQL(xcSql, resposta);

})


//Dados do financeiro contas a pagar
rota.get('/listaOpcoesCancelamento', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "SELECT "
    xcSql += "    * "
    xcSql += "FROM "
    xcSql += "   vw_listaOpcoesCancelamento "

    console.log(xcSql)
    execSQL(xcSql, resposta);

})

//Dados do financeiro Cobranca Contas a Receber
rota.get('/financeiroCobrancaReceber', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "SELECT "
    xcSql += "    * "
    xcSql += "FROM "
    xcSql += "   vw_financeiroCobrancaReceber "
    xcSql += "ORDER BY "
    xcSql += "   ANOVENC "

    execSQL(xcSql, resposta);

})

//Dados do financeiro Cobranca Contas a Receber
rota.get('/indicaFinCobrancaReceber', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "SELECT "
    xcSql += "    * "
    xcSql += "FROM "
    xcSql += "   vw_indicaFinCobrancaReceber "
    xcSql += "ORDER BY "
    xcSql += "   ANOVENC "

    execSQL(xcSql, resposta);

})

//Dados do financeiro Cobranca Contas a Receber
rota.get('/indicaFinCobrancaReceber', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "SELECT "
    xcSql += "    * "
    xcSql += "FROM "
    xcSql += "   vw_indicaFinCobrancaReceber "
    xcSql += "ORDER BY "
    xcSql += "   ANOVENC "

    execSQL(xcSql, resposta);

})

//Dados do financeiro Cobranca Contas a Receber Vencidos, agrupados po RC
rota.get('/npfinanceiroCobrancaReceberVencidosRC', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "SELECT "
    xcSql += "    * "
    xcSql += "FROM "
    xcSql += "   vw_npfinanceiroCobrancaReceberVencidosRC "

    execSQL(xcSql, resposta);

})


//Dados do financeiro Cobranca Contas a Receber - Histórico Clientes
rota.get('/financeiroCobrancaReceberHistCli/:codCli?/:codGrupo?/:codClube?', (requisicao, resposta) => {
    let xcSql = '';

    const codCli = requisicao.params.codCli;
    const codGrupo = requisicao.params.codGrupo;
    const codClube = requisicao.params.codClube;

    xcSql += "SELECT "
    xcSql += "    * "
    xcSql += "FROM "
    xcSql += "   vw_financeiroCobrancaReceberHistCli "

    if (codGrupo === '') {
        if (codClube === '') {
            xcSql += "WHERE "
            xcSql += "   COD = '" + codCli + "' "
        } else {
            xcSql += "WHERE "
            xcSql += "   COD = '" + codCli + "' OR "
            xcSql += "   CODCLUBE = '" + codClube + "'  "
        }
    } else {
        if (codClube === '') {
            xcSql += "   COD = '" + codCli + "' OR "
            xcSql += "   CODGRUPO = '" + codGrupo + "'  "
        } else {
            xcSql += "WHERE "
            xcSql += "   COD = '" + codCli + "' OR "
            xcSql += "   CODGRUPO = '" + codGrupo + "' OR "
            xcSql += "   CODCLUBE = '" + codClube + "'  "
        }
    }

    console.log(xcSql)
    execSQL(xcSql, resposta);

})

//Rotina para incluir observação e alterar vencimento
rota.post('/financeiroCobrancaReceberAnotacoes', (anota, resposta) => {
    let xcSql = '';

    xcSql += "EXEC "
    xcSql += "   sp_financeiroCobrancaReceberAnotacoes "
    xcSql += "'" + anota.body.cliente + "', "
    xcSql += "'" + anota.body.loja + "', "
    xcSql += "'" + anota.body.prefixo + "', "
    xcSql += "'" + anota.body.titulo + "', "
    xcSql += "'" + anota.body.parcela + "', "
    xcSql += "'" + anota.body.tipo + "', "
    xcSql += "'" + anota.body.cabec + "', "
    xcSql += "'" + anota.body.observa + "', "
    xcSql += "'" + anota.body.vencimento + "', "
    xcSql += "'" + anota.body.codUser + "', "
    xcSql += "'" + anota.body.nomeUser + "', 'OK' "

    console.log(xcSql)
    execSQL(xcSql, resposta);

})

//Rotina para alterar o cadastro de clientes
rota.post('/financeiroCobrancaReceberClientes', (cadCli, resposta) => {
    let xcSql = '';

    xcSql += "EXEC "
    xcSql += "   sp_financeiroCobrancaReceberClientes "
    xcSql += "'" + cadCli.body.cliente + "', "
    xcSql += "'" + cadCli.body.loja + "', "
    xcSql += "'" + cadCli.body.email + "', "
    xcSql += "'" + cadCli.body.ddd1 + "', "
    xcSql += "'" + cadCli.body.fone1 + "', "
    xcSql += "'" + cadCli.body.ddd2 + "', "
    xcSql += "'" + cadCli.body.fone2 + "', "
    xcSql += "'" + cadCli.body.ddd3 + "', "
    xcSql += "'" + cadCli.body.fone3 + "', "
    xcSql += "'" + cadCli.body.txBol + "' "

    console.log(xcSql)
    execSQL(xcSql, resposta);

})

//Rotina para alterar o cadastro de clientes
rota.post('/comissaoLimpaMesRep', (codRep, resposta) => {
    let xcSql = '';

    xcSql += "EXEC "
    xcSql += "   sp_comissaoLimpaMesRep "
    xcSql += "'" + codRep.body.rep + "', "
    xcSql += "'" + codRep.body.mes + "' "

    execSQL(xcSql, resposta);

})


//Marketing cadastro de produtos
rota.get('/cadastroProdutoLogistica', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "SELECT "
    xcSql += "   * "
    xcSql += "FROM "
    xcSql += "   vw_cadastroProdutoLogistica "
    xcSql += "ORDER BY "
    xcSql += "   1 "

    execSQL(xcSql, resposta);

})


//Novo Portal Cobranca Receber Representante
rota.get('/npfinanceiroCobrancaReceberRC', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "SELECT "
    xcSql += "    * "
    xcSql += "FROM "
    xcSql += "   vw_npfinanceiroCobrancaReceberRC "

    execSQL(xcSql, resposta);

})

//cadastro de representantes para o portal gerencial
rota.get('/indicaCadRepresentantes', (req, resp) => {
    let xcSql = '';

    xcSql += "SELECT "
    xcSql += "  *  "
    xcSql += "FROM "
    xcSql += "  ERPPROD..vw_indicaCadRepresentantes "

    execSQL(xcSql, resp);
})


//cria User Começando as páginas
rota.get('/indicaCadNaturezas', (req, resp) => {
    let xcSql = '';

    xcSql += "SELECT "
    xcSql += "  *  "
    xcSql += "FROM "
    xcSql += "  ERPPROD..vw_indicaCadNaturezas "

    execSQL(xcSql, resp);
})


//cria User Começando as páginas
rota.get('/indicaCadClientes', (req, resp) => {
    let xcSql = '';

    xcSql += "SELECT "
    xcSql += "  CNPJ, Nome, Fantasia, Cidade, Estado, Email, vend, grupo, Situacao "
    xcSql += "FROM "
    xcSql += "  ERPPROD..vw_indicaCadClientes "

    execSQL(xcSql, resp);
})

//cria User Começando as páginas
rota.get('/indicaCadFornecedores', (req, resp) => {
    let xcSql = '';

    xcSql += "SELECT "
    xcSql += "  * "
    xcSql += "FROM "
    xcSql += "  ERPPROD..vw_indicaCadFornecedores "

    execSQL(xcSql, resp);
})


//cria User Começando as páginas
rota.get('/indicaFinPrazoMedio', (req, resp) => {
    let xcSql = '';

    xcSql += "SELECT "
    xcSql += "  *  "
    xcSql += "FROM "
    xcSql += "  ERPPROD..vw_indicaFinPrazoMedio "

    execSQL(xcSql, resp);
})


//cria User Começando as páginas
rota.get('/indicaProvisaoImpostos', (req, resp) => {
    let xcSql = '';

    xcSql += "SELECT "
    xcSql += "  *  "
    xcSql += "FROM "
    xcSql += "  ERPPROD..vw_indicaProvisaoImpostos "

    execSQL(xcSql, resp);
})


//Cadastro de clientes novos alteração e ajuste no pedido
rota.get('/cadastroClientesFiscal', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "SELECT "
    xcSql += "   * ",
        xcSql += "FROM  "
    xcSql += "    vw_cadastroClientesFiscal "

    console.log(xcSql)
    execSQL(xcSql, resposta);
})

//atualiza o pedido de vendas
rota.post('/cadastroClientesFiscalAlt', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "EXEC "
    xcSql += "   sp_cadastroClientesFiscal "
    xcSql += "'" + requisicao.body.cliente + "', "
    xcSql += "'" + requisicao.body.loja + "', "
    xcSql += "'" + requisicao.body.tipo + "', "
    xcSql += "'" + requisicao.body.grupo + "', "
    xcSql += "'" + requisicao.body.tpessoa + "', "
    xcSql += "'" + requisicao.body.contrib + "' "

    console.log(xcSql)
    execSQL(xcSql, resposta);

})


//Campanha de Marketing
rota.get('/pcpTratamentoPadroes', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "SELECT "
    xcSql += "  * "
    xcSql += "FROM "
    xcSql += "   vw_pcpTratamentoPadroes "

    console.log(xcSql)
    execSQL(xcSql, resposta);
})


//Campanha de Marketing
rota.get('/movimentoCalculoHora', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "SELECT "
    xcSql += "  * "
    xcSql += "FROM "
    xcSql += "   vw_movimentoCalculoHora "

    console.log(xcSql)
    execSQL(xcSql, resposta);
})

//Campanha de Marketing
rota.get('/movimentoCTBdetalhes', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "SELECT "
    xcSql += "  * "
    xcSql += "FROM "
    xcSql += "   vw_movimentoCTBdetalhes "

    console.log(xcSql)
    execSQL(xcSql, resposta);
})

//atualiza o pedido de vendas
rota.post('/estoqueFechamentoCustoMod', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "EXEC "
    xcSql += "   sp_estoqueFechamentoCustoMod "

    console.log(xcSql)
    execSQL(xcSql, resposta);

})

//CUSTO DE OP
rota.get('/estoqueCustoOpFabricao', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "SELECT "
    xcSql += "  * "
    xcSql += "FROM "
    xcSql += "   vw_estoqueCustoOpFabricao "

    console.log(xcSql)
    execSQL(xcSql, resposta);
})


//CUSTO DE OP DETALHE
rota.get('/estoqueCustoOpFabricaoDetalhe/:numOP?', (requisicao, resposta) => {
    let xcSql = '';


    const numOP = requisicao.params.numOP;
    xcSql += "SELECT "
    xcSql += "  * "
    xcSql += "FROM "
    xcSql += "   vw_estoqueCustoOpFabricaoDetalhe "
    xcSql += "WHERE "
    xcSql += "   OP = '" + numOP + "' "

    console.log(xcSql)
    execSQL(xcSql, resposta);
})

//CUSTO DE OP
rota.get('/pcpPedidosAndamento', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "SELECT "
    xcSql += "  * "
    xcSql += "FROM "
    xcSql += "   vw_pcpPedidosAndamento "

    console.log(xcSql)
    execSQL(xcSql, resposta);
})


//CUSTO DE OP
rota.get('/pcpEstruturaSimples', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "SELECT "
    xcSql += "  * "
    xcSql += "FROM "
    xcSql += "   vw_pcpEstruturaSimples "

    console.log(xcSql)
    execSQL(xcSql, resposta);
})

//gera registros para atualização
rota.post('/estoqueCustoReavaliacao', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "exec "
    xcSql += "  sp_estoqueCustoReavaliacao  "

    console.log(xcSql)

    execSQL(xcSql, resposta);
})


//CUSTO DE OP
rota.get('/pcpAnaliseOPAndamento', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "SELECT "
    xcSql += "  * "
    xcSql += "FROM "
    xcSql += "   vw_pcpAnaliseOPAndamento "

    console.log(xcSql)
    execSQL(xcSql, resposta);
})


//CUSTO DE OP
rota.get('/pcpCustoFaturamento', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "SELECT "
    xcSql += "  * "
    xcSql += "FROM "
    xcSql += "   vw_pcpCustoFaturamento "

    console.log(xcSql)
    execSQL(xcSql, resposta);
})

//Analise do saldo calculado atual para ajuste de valores negativos
rota.get('/pcpFechamentoPreviaFinal', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "SELECT ";
    xcSql += "   * ";
    xcSql += "FROM  ";
    xcSql += "    vw_pcpFechamentoPreviaFinal ";

    console.log(xcSql);
    execSQL(xcSql, resposta);
})


//Dados do financeiro Cobranca Pontualidade no pagamento Detalhes
rota.get('/indicaFinPontualidade', (requisicao, resposta) => {
    let xcSql = '';



    xcSql += "SELECT "
    xcSql += "    * "
    xcSql += "FROM "
    xcSql += "   vw_indicaFinPontualidade "
    xcSql += "ORDER BY "
    xcSql += "   1 "

    console.log(xcSql);
    execSQL(xcSql, resposta);

})



//Dados do financeiro Cobranca Pontualidade no pagamento Detalhes
rota.get('/indicaFinPontualidadeDetalhes/:xcPer?', (requisicao, resposta) => {
    let xcSql = '';


    const xcPer = requisicao.params.xcPer;


    xcSql += "SELECT "
    xcSql += "    * "
    xcSql += "FROM "
    xcSql += "   vw_indicaFinPontualidadeDetalhes "
    xcSql += "WHERE "
    xcSql += "   periodo = '" + xcPer + "' "
    xcSql += "ORDER BY "
    xcSql += "   1 "

    console.log(xcSql);
    execSQL(xcSql, resposta);

})

//Dados para verificar o percentual da inadimplencia do faturamento - emissao e títulos vencidos
rota.get('/indicaCobrancaReceberValores', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "SELECT  "
    xcSql += "	* "
    xcSql += "FROM  "
    xcSql += "	CUBOMB..vw_indicaCobrancaReceberValores "
    xcSql += "ORDER BY "
    xcSql += "   1 "

    console.log(xcSql);
    execSQL(xcSql, resposta);

})


//Dados para verificar o percentual da inadimplencia do faturamento - emissao e títulos vencidos
rota.get('/indicaCobrancaReceberValoresFin', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "SELECT  "
    xcSql += "	* "
    xcSql += "FROM  "
    xcSql += "	CUBOMB..vw_indicaCobrancaReceberValoresFin "
    xcSql += "ORDER BY "
    xcSql += "   1 "

    console.log(xcSql);
    execSQL(xcSql, resposta);

})


//Dados para verificar o percentual da inadimplencia do faturamento - emissao e títulos vencidos
rota.get('/indicaCobrancaReceberValoresRCFin', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "SELECT  "
    xcSql += "	* "
    xcSql += "FROM  "
    xcSql += "	CUBOMB..vw_indicaCobrancaReceberValoresRCFin "
    xcSql += "ORDER BY "
    xcSql += "   1 "

    console.log(xcSql);
    execSQL(xcSql, resposta);

})

//Dados para verificar o percentual da inadimplencia do faturamento - emissao e títulos vencidos
rota.get('/indicaCobrancaReceberValoresRC', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "SELECT  "
    xcSql += "	* "
    xcSql += "FROM  "
    xcSql += "	CUBOMB..vw_indicaCobrancaReceberValoresRC "
    xcSql += "ORDER BY "
    xcSql += "   1 "

    console.log(xcSql);
    execSQL(xcSql, resposta);

})

//Dados para verificar o percentual da inadimplencia do faturamento - emissao e títulos vencidos
rota.get('/indicaCobrancaReceberValoresRcDetalhes', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "SELECT  "
    xcSql += "	* "
    xcSql += "FROM  "
    xcSql += "	CUBOMB..vw_indicaCobrancaReceberValoresRcDetalhes "
    xcSql += "ORDER BY "
    xcSql += "   1 "

    console.log(xcSql);
    execSQL(xcSql, resposta);

})

//Dados para verificar o percentual da inadimplencia do faturamento - emissao e títulos vencidos
rota.get('/indicaCobrancaReceberValoresRcDetalhesFin', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "SELECT  "
    xcSql += "	* "
    xcSql += "FROM  "
    xcSql += "	CUBOMB..vw_indicaCobrancaReceberValoresRcDetalhesFin "
    xcSql += "ORDER BY "
    xcSql += "   1 "

    console.log(xcSql);
    execSQL(xcSql, resposta);

})

//Cadastro de Representantes
rota.get('/indicaCadRepresentantes', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "SELECT "
    xcSql += "   * "
    xcSql += "FROM "
    xcSql += "   CUBOMB..vw_indicaCadRepresentantes "
    xcSql += "ORDER BY "
    xcSql += "   1 "

    console.log(xcSql)
    execSQL(xcSql, resposta);

})

//Cadastro de Representantes
rota.get('/indicaCobrancaPorEstado', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "SELECT "
    xcSql += "   * "
    xcSql += "FROM "
    xcSql += "   CUBOMB..vw_indicaCobrancaPorEstado "
    xcSql += "ORDER BY "
    xcSql += "   1, 2 "

    console.log(xcSql)
    execSQL(xcSql, resposta);

})

//Cadastro de Representantes
rota.get('/indicaCobrancaPorEstadoFin', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "SELECT "
    xcSql += "   * "
    xcSql += "FROM "
    xcSql += "   CUBOMB..vw_indicaCobrancaPorEstadoFin "
    xcSql += "ORDER BY "
    xcSql += "   1, 2 "

    console.log(xcSql)
    execSQL(xcSql, resposta);

})

//Cadastro de Representantes
rota.get('/indicaCobrancaPorMes', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "SELECT "
    xcSql += "   * "
    xcSql += "FROM "
    xcSql += "   CUBOMB..vw_indicaCobrancaPorMes "
    xcSql += "ORDER BY "
    xcSql += "   1 "

    console.log(xcSql)
    execSQL(xcSql, resposta);

})

//Cadastro de Representantes
rota.get('/indicaCobrancaPorMesFin', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "SELECT "
    xcSql += "   * "
    xcSql += "FROM "
    xcSql += "   CUBOMB..vw_indicaCobrancaPorMesFin "
    xcSql += "ORDER BY "
    xcSql += "   1 "

    console.log(xcSql)
    execSQL(xcSql, resposta);

})

//Cadastro de Representantes
rota.get('/indicaCobrancaPorAno', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "SELECT "
    xcSql += "   * "
    xcSql += "FROM "
    xcSql += "   CUBOMB..vw_indicaCobrancaPorAno "
    xcSql += "ORDER BY "
    xcSql += "   1 "

    console.log(xcSql)
    execSQL(xcSql, resposta);

})

//Cadastro de Representantes
rota.get('/indicaCobrancaPorAnoFin', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "SELECT "
    xcSql += "   * "
    xcSql += "FROM "
    xcSql += "   CUBOMB..vw_indicaCobrancaPorAnoFin "
    xcSql += "ORDER BY "
    xcSql += "   1 "

    console.log(xcSql)
    execSQL(xcSql, resposta);

})

//Dados para verificar o percentual da inadimplencia do financeiro - vencimento real e títulos vencidos
rota.get('/indicaCobrancaPosicVendedorFinanc', (requisicao, resposta) => {
    let xcSql = '';

    xcSql += "SELECT  "
    xcSql += "	* "
    xcSql += "FROM  "
    xcSql += "	CUBOMB..vw_indicaCobrancaPosicVendedorFinanc "
    xcSql += "ORDER BY "
    xcSql += "   1 "

    console.log(xcSql);
    execSQL(xcSql, resposta);

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




//mantem sempre no final, n�o seu o que �
rota.post('/salvaJSON', (requisicao, resposta) => {
    fs.writeFile(requisicao.body.arquivo, requisicao.body.json);
})