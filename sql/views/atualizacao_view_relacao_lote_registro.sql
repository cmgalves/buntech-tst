SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER view [dbo].[View_Relacao_Lote_Registro] as
select 
	max(id_loteProd) id_loteProd, filial, op, produto, descricao, lote, 
	loteAprov, dtAprov, usrAprov, min(dtProd) dtProd, 
	dtVenc, sum(qtdeProd) qtdeProd, qtdeQuebra, 
	quebra, loteProd.situacao, loteAprov, p.especAlcada as alcadaProd
from 
	loteProd
	left join qualEspecCab p ON loteProd.produto = p.cabProduto
--where produto = 'PAN00441' and lote = '000000014'
group by
	filial, op, produto, descricao, lote, loteAprov, dtAprov, usrAprov, dtVenc, qtdeQuebra, quebra, loteProd.situacao, loteAprov, p.especAlcada
GO





