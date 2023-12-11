select distinct
	filial, produto, lote, analise, sum(qtde)
from 
	PCP..oppcfLote inner join
	PCP..qualEspecCab on
	produto = cabProduto
where
	1 = 1 
	--and especQuebra = 'QTDE'
	--and analise = 'A01'
	and lote > '000000000'
	--and produto = 'PA000118'
	--and filial = '101'
group by
	filial, produto, lote, analise
order by
	1,2



-- update PCP..oppcfLote set lote = '000000000', analise = 'A00'
