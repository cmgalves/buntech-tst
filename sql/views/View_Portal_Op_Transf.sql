SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER VIEW [dbo].[View_Portal_Op_Transf] as
SELECT * FROM (
SELECT 
	RTRIM(FILIAL) FILIAL, 
	RTRIM(OP) OP, 
	EMISSAO, 
	FINAL, 
	QTDE, 
	ENTREGUE, 
	RTRIM(PRODUTO) PRODUTO, 
	RTRIM(CODANT) CODANT, 
	RTRIM(DESCRICAO) DESCRICAO, 
	RTRIM(ARMAZEM) ARMAZEM, 
	RTRIM(COMPONENTE) COMPONENTE, 
	RTRIM(DESCRIC) DESCRIC, 
	QTDEORI, 
	QTDEPCF, 
	QTDECAL, 
	ISNULL(B2_QATU, 0) SALDO, 
	B1_QB BASE, 
	B1_XTRANSF XTRANSF, 
	B1_XINDICA XINDICA, 
	B1_XMOD XMOD, 
	ROTEIRO, 
	OPERACAO, 
	RTRIM(UNIDADE) UNIDADE,
	rtrim(TIPO) TIPO, 
	RTRIM(SITUACA) SITUACA,
	CASE
		WHEN SITUACA = 'I' THEN 'Integrada'
		WHEN SITUACA = 'C' THEN 'Calculada'
		WHEN SITUACA = 'A' THEN 'Ajustada'
		WHEN SITUACA = 'V' THEN 'Re-Ajustar'
		WHEN SITUACA = 'W' THEN 'Web Inicial'
		WHEN SITUACA = 'P' THEN 'Parcial'
		WHEN SITUACA = 'T' THEN 'Total'
		ELSE SITUACA 
	END SITUDESC
FROM 
	--SELECT * FROM 
	PCP..OP A WITH (NOLOCK) LEFT JOIN
	--SELECT * FROM 
	HOMOLOGACAO..SB2010 B WITH (NOLOCK) ON
	1 = 1
	AND FILIAL = B2_FILIAL
	AND COMPONENTE = B2_COD
	AND B.R_E_C_D_E_L_ = 0
	AND B2_LOCAL = '01' INNER JOIN
	--SELECT * FROM 
	HOMOLOGACAO..SB1010 C WITH (NOLOCK) ON
	1 = 1
	AND PRODUTO = B1_COD
	AND C.R_E_C_D_E_L_ = 0
)p

--WHERE FILIAL = '108' AND OP = '03939501001'

GO
