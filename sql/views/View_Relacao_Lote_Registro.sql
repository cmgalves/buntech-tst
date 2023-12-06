--ALTER view [dbo].[View_Relacao_Lote_Registro] as

select
	max(id_loteProd) id_loteRegProd,
	filial, produto, lote, analise, 
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
		produto, 
		isnull(intervalo, '') intervalo, 
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
group by
	filial, produto, lote, analise, 
	descricao, loteAprov,  
	usrAprovn1, usrAprovn2, usrAprovn3,
	dtAprovn1, dtAprovn2, dtAprovn3, 
	situacao, analiseStatus, alcadaProd
GO
