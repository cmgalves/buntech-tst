SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



ALTER View [dbo].[View_Portal_Saldo_Estoque] as
SELECT 
	rtrim(B2_FILIAL) filial, 
	rtrim(B2_COD) codigo, 
	rtrim(B1_DESC) descricao, 
	rtrim(B2_LOCAL) armazem, 
	B2_QATU saldo, 
	B2_CMFF1 cm, 
	B2_QEMP empenhado
FROM 
	HOMOLOGACAO..SB2010 A INNER JOIN
	HOMOLOGACAO..SB1010 B ON
	B2_COD = B1_COD
WHERE
	1 = 1
	AND B1_TIPO IN ('PA', 'MP', 'EM', 'MO')
	AND A.R_E_C_D_E_L_ = 0
	AND B.R_E_C_D_E_L_ = 0
	--AND (B2_QATU <> 0 OR (B2_QATU = 0 AND B2_RESERVA <> 0))
GO
