SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER view [dbo].[View_Relacao_Lote_Aprova] as
select 
	id_loteProd, a.filial, a.op, a.produto, a.descricao, a.lote, a.loteAprov, 
	a.dtAprov, a.usrAprov, a.usrProd, a.dtProd, a.hrProd, a.dtVenc, a.qtdeProd, 
	a.qtdeQuebra, a.qtdeTot, a.quebra, a.nivel, a.revisao, b.situacao, 
	a.fechamento, a.obs, a.resultado, a.justificativa, a.userJusti,
	b.orig, b.dtAnalise, b.hrAnalise, b.usrAnalise, b.codCarac, b.descCarac, b.itemin, b.itemax, b.itemeio, 
	b.result, b.iteTxt, b.resultxt
from 
	loteProd a inner join 
	View_Relacao_Lote_Analisa b
	on
	1 = 1
	and a.filial = b.filial
	and a.op = b.op
	and a.produto = b.produto
	and a.lote = b.lote
GO
