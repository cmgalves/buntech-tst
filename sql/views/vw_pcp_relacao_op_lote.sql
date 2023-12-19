SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER view [dbo].[vw_pcp_relacao_op_lote] as

select
	convert(varchar(20), dtcria, 113) dtcria, max(id_loteProd) id_loteRegProd,
	filial, produto, op, lote, analise, 
	descricao, 
	case 
		when loteAprov = ''
		then 'Andamento'
		else loteAprov
	end loteAprov,  
	usrAprovn1,usrAprovn2,usrAprovn3,
	dtAprovn1,dtAprovn2,dtAprovn3,
	sum(qtdeLote)qtdeLote,
	situacao, analiseStatus, alcadaProd
from
	(
	select
		id_num id_loteProd, filial, 
		produto, op, intervalo, dtcria,
		isnull(lote, '') lote, 
		isnull(analise, '') analise, descrProd descricao,
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
		isnull(analiseStatus, '') analiseStatus, 
		especAlcada alcadaProd
	from
		oppcfLote a inner JOIN
		qualEspecCab b ON
		a.produto = b.cabProduto COLLATE Latin1_General_BIN
	where
		1 = 1
		and lote > '000000000'
        and isnull(qtde, 0) > 0
		and b.situacao <> 'Encerrada'
)x
group by
	filial, produto, op, lote, analise, 
	descricao, dtcria, loteAprov,  
	usrAprovn1, usrAprovn2, usrAprovn3,
	dtAprovn1, dtAprovn2, dtAprovn3, 
	situacao, analiseStatus, alcadaProd
GO
