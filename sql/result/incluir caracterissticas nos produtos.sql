
insert into PCP..qualEspecItens (iteProduto, iteRevisao, iteCarac, iteMin, iteMax, iteMeio, itetxt, iteLaudo )



select 
	'PAN01051' iteProduto, '001' iteRevisao , iteCarac, iteMin, iteMax, iteMeio, itetxt, 'S' iteLaudo 
from 
	PCP..qualEspecCab inner join
	PCP..qualEspecItens on
	cabProduto = iteProduto
WHERE
	iteProduto = 'PA000119'
	and situacao = 'Concluida'
	
	


select 
	'''' + cabProduto + '''' + ' iteProduto, ' + '''' + cabRevisao + ''''  + ' iteRevisao '
from 
	PCP..qualEspecCab
where
	1 = 1
	and situacao = 'Concluida'
	and not exists
	(
	select 
		iteProduto
	from 
		PCP..qualEspecItens
	where
		cabProduto = iteProduto
	)

	/*


insert into PCP..qualEspecItens (iteProduto, iteRevisao, iteCarac, iteMin, iteMax, iteMeio, itetxt, iteLaudo )



select 
	'PAN00844' iteProduto, '002' iteRevisao , iteCarac, iteMin, iteMax, iteMeio, itetxt, 'S' iteLaudo 
from 
	PCP..qualEspecCab inner join
	PCP..qualEspecItens on
	cabProduto = iteProduto
WHERE
	iteProduto = 'PA000119'
	and situacao = 'Concluida'
	


	
select * 
--delete
from PCP..oppcfLote where produto = 'TESTE00'


select * 
--delete
from PCP..qualEspecCab where cabProduto = 'TESTE00'

*/

