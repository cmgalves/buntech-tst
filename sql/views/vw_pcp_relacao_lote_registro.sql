SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER view [dbo].[vw_pcp_relacao_lote_registro] as

select distinct
	
	case when dtAprovn1 = ' ' then ' ' else convert(varchar(8), cast(dtAprovn1 as datetime), 3) + '-' + tipoAprova1 end dt1,
	case when dtAprovn2 = ' ' then ' ' else convert(varchar(8), cast(dtAprovn2 as datetime), 3) + '-' + tipoAprova2 end dt2,
	case when dtAprovn3 = ' ' then ' ' else convert(varchar(8), cast(dtAprovn3 as datetime), 3) + '-' + tipoAprova3 end dt3,
	max(id_loteProd) id_loteRegProd,
	x.filial, x.produto, x.lote, x.analise, 
	descricao, 
	case 
		when loteAprov = ''
		then 'Andamento'
		else loteAprov
	end loteAprov,  
	usrAprovn1,usrAprovn2,usrAprovn3,
	dtAprovn1,dtAprovn2,dtAprovn3,
	tipoAprova1, tipoAprova2, tipoAprova3,
	sum(qtdeLote)qtdeLote,
	x.situacao, analiseStatus, alcadaProd, 
	CASE 
		WHEN isnull(qtde, 0) = 0
		THEN 'true'
		ELSE 'false'
	END AS podeAprovar
from
	(
	select
		id_num id_loteProd, filial, 
		produto, intervalo,
		isnull(lote, '') lote, 
		isnull(analise, '') analise, descrProd descricao,
		isnull(loteAprov,'') loteAprov, 
		isnull(dtAprovn1, '')dtAprovn1, 
		isnull(dtAprovn2, '')dtAprovn2, 
		isnull(dtAprovn3, '')dtAprovn3,
		isnull(tipoAprova1, '')tipoAprova1, 
		isnull(tipoAprova2, '')tipoAprova2, 
		isnull(tipoAprova3, '')tipoAprova3,
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
		and lote >= '000000001'
        and isnull(qtde, 0) > 0
		and b.situacao <> 'Encerrada'
)x
LEFT JOIN (
			select 
				filial, produto, lote, analise, count(*) qtde
			from 
				oppcfLoteAnalise 
			where 
				situacao = '' 
			group by 
				filial, produto, lote, analise
			) la on la.produto = x.produto AND la.filial = x.filial AND la.lote = x.lote AND la.analise = x.analise
-- where dtAprovn1 <> ''
group by
	x.filial, x.produto, x.lote, x.analise, 
	descricao, loteAprov, qtde, 
	usrAprovn1, usrAprovn2, usrAprovn3,
	dtAprovn1, dtAprovn2, dtAprovn3,
	tipoAprova1, tipoAprova2, tipoAprova3, 
	x.situacao, analiseStatus, alcadaProd


GO
