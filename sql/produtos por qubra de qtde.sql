select distinct
	produto, b.situacao, b.qtdeAnalise
from 
	PCP..oppcfLote a inner join 
	PCP..qualEspecCab b on 
	a.produto = b.cabProduto 
where 
	1 = 1
	and b.situacao = 'Concluida'
	and b.especQuebra = 'QTDE'
	--and b.qtdeAnalise > 0