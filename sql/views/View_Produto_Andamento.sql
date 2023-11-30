SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE view [dbo].[View_Produto_Andamento] as
-- View para os produtos que estão disponíveis para o PCF

	SELECT DISTINCT o.produto, e.descrProd, e.especQuebra, e.cabQtdeQuebra, e.especAlcada from oppcfLote o
	INNER JOIN View_Relacao_Espec e ON 
		CONVERT(VARCHAR, o.produto) COLLATE Latin1_General_CI_AS = 
			CONVERT(VARCHAR, e.cabProduto) COLLATE Latin1_General_CI_AS
		
GO
--prod, descri, tipo quebra, qtde da quebra, alçada

