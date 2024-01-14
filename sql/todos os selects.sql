--spcp_cria_lote_11

-- SELECT * FROM PCP..oppcfLote where regTipo = 'N'

SELECT op, regTipo, sum(qtde) FROM PCP..oppcfLote where regTipo = 'S' group by op, regTipo
SELECT op, regTipo, sum(qtde) FROM PCP..oppcfLote where regTipo = 'L' group by op, regTipo
SELECT op, regTipo, sum(qtde) FROM PCP..oppcfLote where regTipo = 'N' group by op, regTipo
SELECT op, sum(qtde) FROM PCP..oppcfLote where regTipo = 'N' group by op
SELECT * FROM PCP..oppcfLote where regTipo = 'N' 
SELECT * FROM PCP..oppcfLote where regTipo = 'L' 

/*
truncate table PCP..oppcfLoteAnalise
delete FROM PCP..oppcfLote where regTipo = 'L'
update PCP..oppcfLote set regTipo = 'S' where regTipo = 'N'

insert into PCP..oppcfLote (idEv, filial, op, produto, qtde, dtime, dtcria, codRecurso, qtdeImp, lote, origem, stsLote, analise, intervaloLote, qtde_lote, loteAprov, dtAprov, dtProd, dtVenc, qtdeQuebra, quebra, situacao, usrAprovn1, usrAprovn2, usrAprovn3, dtAprovn1, dtAprovn2, dtAprovn3, intervalo, recurso, codOpera, segundos, dataAprovacao, tipoAprova1, tipoAprova2, tipoAprova3, justificativa1, justificativa2, justificativa3, regTipo)
SELECT top 2 idEv, filial, op, produto,  -6 qtde, dtime, dtcria, codRecurso, qtdeImp, '000000000' lote, origem, stsLote, 'A00' analise, intervaloLote, qtde_lote, loteAprov, dtAprov, dtProd, dtVenc, qtdeQuebra, quebra, situacao, usrAprovn1, usrAprovn2, usrAprovn3, dtAprovn1, dtAprovn2, dtAprovn3, intervalo, recurso, codOpera, segundos, dataAprovacao, tipoAprova1, tipoAprova2, tipoAprova3, justificativa1, justificativa2, justificativa3, 'S' regTipo FROM PCP..oppcfLote where op = '04756401001'
SELECT * FROM PCP..oppcfLote where op = '04756401001' and lote <> '000000000'


04756401001
04758101001
04758401001
*/
-- SELECT * FROM PCP..oppcf
-- SELECT * FROM PCP..oppcfLote

-- SELECT * FROM PCP..oppcfLoteHora
-- SELECT * FROM PCP..oppcfLoteAnalise
-- SELECT * FROM PCP..oppcftemp

-- truncate table PCP..oppcfLoteHora
-- truncate table PCP..oppcfLoteAnalise
-- truncate table PCP..oppcftemp

