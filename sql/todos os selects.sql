--spcp_cria_lote_11

-- SELECT * FROM PCP..oppcfLote where regTipo = 'N'

SELECT op, regTipo, sum(qtde) FROM PCP..oppcfLote where regTipo = 'S' group by op, regTipo
SELECT op, regTipo, sum(qtde) FROM PCP..oppcfLote where regTipo = 'L' group by op, regTipo
SELECT op, regTipo, sum(qtde) FROM PCP..oppcfLote where regTipo = 'N' group by op, regTipo
SELECT op, sum(qtde) FROM PCP..oppcfLote where regTipo = 'N' group by op
SELECT * FROM PCP..oppcfLote where regTipo = 'N' 
SELECT * FROM PCP..oppcfLote where regTipo = 'L' 
SELECT * FROM PCP..oppcfLote where regTipo = 'S' 

/*
truncate table PCP..oppcfLoteAnalise
select * FROM PCP..oppcfLote where regTipo = 'L' and analise in ('A04', 'A05') AND produto = 'PAN00132' AND lote = '000000001'
delete FROM PCP..oppcfLote where regTipo = 'L' and analise in ('A04', 'A05') AND produto = 'PAN00132' AND lote = '000000001'
update PCP..oppcfLote set regTipo = 'S' where idEv in (3151651, 3151650)

3151650
3151651

insert into PCP..oppcfLote (idEv, filial, op, produto, qtde, dtime, dtcria, codRecurso, qtdeImp, lote, origem, stsLote, analise, intervaloLote, qtde_lote, loteAprov, dtAprov, dtProd, dtVenc, qtdeQuebra, quebra, situacao, usrAprovn1, usrAprovn2, usrAprovn3, dtAprovn1, dtAprovn2, dtAprovn3, intervalo, recurso, codOpera, segundos, dataAprovacao, tipoAprova1, tipoAprova2, tipoAprova3, justificativa1, justificativa2, justificativa3, regTipo)
SELECT top 1 idEv, filial, op, produto,  -34 qtde, dtime, dtcria, codRecurso, qtdeImp, '000000000' lote, origem, stsLote, 'A00' analise, intervaloLote, qtde_lote, loteAprov, dtAprov, dtProd, dtVenc, qtdeQuebra, quebra, situacao, usrAprovn1, usrAprovn2, usrAprovn3, dtAprovn1, dtAprovn2, dtAprovn3, intervalo, recurso, codOpera, segundos, dataAprovacao, tipoAprova1, tipoAprova2, tipoAprova3, justificativa1, justificativa2, justificativa3, 'S' regTipo FROM PCP..oppcfLote where op = '04758701001'
SELECT * FROM PCP..oppcfLote where op = '04756401001' and lote <> '000000000'


04756401001
04758101001
04758401001
*/
SELECT * FROM PCP..oppcf where op = '10804758701001'
SELECT * FROM PCP..oppcfLote where produto = 'PAN00132' order by idEv
-- SELECT * FROM PCP..oppcfLote

-- SELECT * FROM PCP..oppcfLoteHora
-- SELECT * FROM PCP..oppcfLoteAnalise
-- SELECT * FROM PCP..oppcftemp

-- todos os registros pcfactory
-- truncate table PCP..oppcf 

-- os registro amarração do recurso ou o último recusro
-- truncate table PCP..oppcfLote  

-- quando montar o lote, ele registra as características pra análise
-- truncate table PCP..oppcfLoteAnalise  

-- truncate table PCP..oppcfLoteHora
-- truncate table PCP..oppcftemp

