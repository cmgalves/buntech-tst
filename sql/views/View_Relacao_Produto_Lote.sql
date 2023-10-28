SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER view [dbo].[View_Relacao_Produto_Lote] as

select 
	id_lote, produto, descricao, lote, diaRevisao, hrRevisao, validade, qtde, seq, quebra, revisao, ativo, obs, nivel, usuario
from 
	qualLote
GO
