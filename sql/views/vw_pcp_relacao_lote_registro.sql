--ALTER view [dbo].[vw_pcp_relacao_lote_registro] as

select distinct
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
group by
	x.filial, x.produto, x.lote, x.analise, 
	descricao, loteAprov, qtde, 
	usrAprovn1, usrAprovn2, usrAprovn3,
	dtAprovn1, dtAprovn2, dtAprovn3, 
	x.situacao, analiseStatus, alcadaProd

GO
