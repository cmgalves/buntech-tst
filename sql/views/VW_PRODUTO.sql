USE [PCP]
GO

/****** Object:  View [dbo].[VW_PRODUTO]    Script Date: 21/01/2025 07:19:17 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

cREATE vIEW [dbo].[VW_PRODUTO] AS
SELECT DISTINCT 
	* 
FROM (
	SELECT 
		B1_COD, B1_XMOD
	FROM
		TMPRD..SB1010	
	WHERE
		D_E_L_E_T_ = ''
	UNION ALL
	SELECT 
		B1_COD, B1_XMOD
	FROM
		TMPRD..SB1020	
	WHERE
		D_E_L_E_T_ = ''
	UNION ALL
	SELECT 
		B1_COD, B1_XMOD
	FROM
		TMPRD..SB1040	
	WHERE
		D_E_L_E_T_ = ''
	
)J
GO


