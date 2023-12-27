--ALTER view [dbo].[vw_pcp_relacao_op_lote] as

select
	convert(varchar(10), dtcria, 103) + ' ' +convert(varchar(08), dtcria, 108) dtcria, 
	filial, produto, op, lote, 
	descricao, 
	case 
		when loteAprov = ''
		then 'Andamento'
		else loteAprov
	end loteAprov,  
	usrAprovn1,usrAprovn2,usrAprovn3,
	dtAprovn1,dtAprovn2,dtAprovn3,
	sum(qtdeLote) qtdeLote,
	situacao, loteAprov, alcadaProd
from
	(
	select
		filial, 
		produto, op, intervalo, dtcria,
		isnull(lote, '') lote, 
		descrProd descricao,
		isnull(loteAprov,'') loteAprov, 
		isnull(dtAprovn1, '')dtAprovn1, 
		isnull(dtAprovn2, '')dtAprovn2, 
		isnull(dtAprovn3, '')dtAprovn3,
		isnull(usrAprovn1, 0)usrAprovn1, 
		isnull(usrAprovn2, 0)usrAprovn2, 
		isnull(usrAprovn3, 0)usrAprovn3, 
		isnull(dtVenc, '')dtVenc, 
		isnull(qtde, 0) qtdeLote, 
		isnull(a.situacao, '') situacao, 
		isnull(loteAprov, '') loteAprov, 
		especAlcada alcadaProd
	from
		oppcfLote a inner JOIN
		qualEspecCab b ON
		a.produto = b.cabProduto 
	where
		1 = 1
		and lote > '000000000'
        and isnull(qtde, 0) > 0
		and b.situacao <> 'Encerrada'
)x
-- where lote = '000000084'
group by
	filial, produto, op, lote, 
	descricao, dtcria, loteAprov,  
	usrAprovn1, usrAprovn2, usrAprovn3,
	dtAprovn1, dtAprovn2, dtAprovn3, 
	situacao, loteAprov, alcadaProd
GO

