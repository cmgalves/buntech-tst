--ALTER VIEW [dbo].[View_Relacao_Lote_Detalhe] AS
    select
        convert(varchar(20), dtime, 113) aponta,
		id_num id_loteProd, filial, op, 
		produto, 
		isnull(lote, '') lote, 
		isnull(analise, '') analise, 
        descrProd descricao,
		isnull(intervalo, '') intervalo, 
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
GO
