USE [PCP]
GO

/****** Object:  View [dbo].[VW_OPS]    Script Date: 21/01/2025 07:15:35 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE VIEW [dbo].[VW_OPS] AS
SELECT DISTINCT 
	* 
FROM (
	SELECT  
		D4_FILIAL, C2_FILIAL, C2_NUM, C2_ITEM, C2_SEQUEN, 
		D4_OP, C2_PRODUTO, C2_EMISSAO, D4_COD, D4_QTDEORI
	FROM 
		TMPRD..SC2010 A INNER JOIN
		TMPRD..SD4010 B ON
		1 = 1
		AND C2_FILIAL = D4_FILIAL
		AND C2_NUM+C2_ITEM+C2_SEQUEN = D4_OP
	WHERE 
		1 = 1
		AND A.D_E_L_E_T_ = ' '
		AND B.D_E_L_E_T_ = ' '
			
	UNION ALL

	SELECT  
		D4_FILIAL, C2_FILIAL, C2_NUM, C2_ITEM, C2_SEQUEN, 
		D4_OP, C2_PRODUTO, C2_EMISSAO, D4_COD, D4_QTDEORI
	FROM 
		TMPRD..SC2020 A INNER JOIN
		TMPRD..SD4020 B ON
		1 = 1
		AND C2_FILIAL = D4_FILIAL
		AND C2_NUM+C2_ITEM+C2_SEQUEN = D4_OP
	WHERE 
		1 = 1
		AND A.D_E_L_E_T_ = ' '
		AND B.D_E_L_E_T_ = ' '
			
	UNION ALL

	SELECT  
		D4_FILIAL, C2_FILIAL, C2_NUM, C2_ITEM, C2_SEQUEN, 
		D4_OP, C2_PRODUTO, C2_EMISSAO, D4_COD, D4_QTDEORI
	FROM 
		TMPRD..SC2040 A INNER JOIN
		TMPRD..SD4040 B ON
		1 = 1
		AND C2_FILIAL = D4_FILIAL
		AND C2_NUM+C2_ITEM+C2_SEQUEN = D4_OP
	WHERE 
		1 = 1
		AND A.D_E_L_E_T_ = ' '
		AND B.D_E_L_E_T_ = ' '
)O			
GO


