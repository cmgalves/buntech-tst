SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



ALTER View [dbo].[View_Portal_Cadastro_Recursos] as
SELECT 
	rtrim(H1_FILIAL) filial, 
	rtrim(H1_CODIGO) codigo, 
	rtrim(H1_DESCRI) descricao, 
	rtrim(H1_CCUSTO) custo, 
	rtrim(H1_CTRAB) setor, 
	rtrim(H1_CALEND) calendario
FROM 
	HOMOLOGACAO..SH1010 
WHERE
	1 = 1
	AND R_E_C_D_E_L_ = 0
GO
