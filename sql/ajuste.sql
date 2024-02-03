
--update PCP..oppcfLote set regTipo = 'S' where produto = 'PAN00122' and regTipo = 'W'
--update PCP..oppcfLote set regTipo = 'S' where produto = 'PAN00122' and regTipo = 'W'
--update PCP..oppcfLote set qtde = 20, qtdeLote = 0 where id_num = 328
--update PCP..oppcfLote set qtde = 25, qtdeLote = 0 where id_num = 329
--spcp_cria_lote_11
--select loteAtual from PCP..qualEspecCab where cabProduto = 'PAN00775' and situacao = 'Concluida'
--select max(lote) from oppcfLote where produto = 'PAN00775' and lote <> '000000000'


select 
	filial, op, produto, regTipo, lote, qtde, qtdeLote, analise,	
	qtdeQuebraAnalise, situacao, qtdeImp, * 
--delete
--delete PCP..oppcfLote where lote <> '000000000'
from 
--update PCP..oppcfLote set regTipo = 'S' from
--update PCP..oppcfLote set regTipo = 'x' from
	PCP..oppcfLote 
where	
	1 = 1 
	and filial = '108'
	and produto = 'PAN01205'
	--and op in ('04758701001', '04760001001')	
	--and regTipo <> 'T'
order by
	5, 12


select 
	lote, produto, sum(qtde) qtde, count(*)
from 
	PCP..oppcfLote 
where 
	1 = 1 
	and filial = '108'
	--and produto = 'PAN01205'
	--and op in ('04758701001', '04760001001')	
	--and regTipo <> 'T'
group by
	lote, produto


/*
truncate table PCP..oppcf
truncate table PCP..oppcfLote
truncate table PCP..oppcfLoteHora
truncate table PCP..oppcfLoteAnalise
truncate table PCP..oppcfLoteEmpenho

select * from PCP..qualEspecCab where cabProduto = 'PAN00779'

*/

