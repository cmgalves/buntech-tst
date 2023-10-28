SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER view [dbo].[View_Relacao_Lote_Registro] as
select 
	max(id_loteProd) id_loteProd, filial, op, produto, descricao, lote, 
	loteAprov, dtAprov, usrAprov, min(dtProd) dtProd, 
	dtVenc, sum(qtdeProd) qtdeProd, qtdeQuebra, 
	quebra, situacao, analiseStatus
from 
	loteProd
--where produto = 'PAN00441' and lote = '000000014'
group by
	filial, op, produto, descricao, lote, loteAprov, dtAprov, usrAprov, dtVenc, qtdeQuebra, quebra, situacao, analiseStatus
GO
