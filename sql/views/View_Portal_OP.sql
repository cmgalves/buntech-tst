SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO




ALTER VIEW [dbo].[View_Portal_OP] as

SELECT 
	RTRIM(C2_FILIAL) FILIAL,
	RTRIM(C2_NUM)+RTRIM(C2_ITEM)+RTRIM(C2_SEQUEN) OP, 
	CONVERT(VARCHAR(10), CAST(C2_EMISSAO AS DATETIME), 103) EMISSAO, 
	C2_QUANT QTDE, 
	C2_QUJE ENTREGUE, 
	RTRIM(B.B1_COD) PRODUTO, 
	RTRIM(B.B1_CODANT) CODANT,
	RTRIM(B.B1_DESC) DESCRICAO, 
	RTRIM(D4_LOCAL) ARMAZEM, 
	RTRIM(D4_COD) COMPONENTE, 
	RTRIM(D.B1_DESC) DESCRIC, 
	D4_QTDEORI QTDEORI, 
	ROUND(B2_QATU, 2) SALDO, 
	RTRIM(D4_ROTEIRO) ROTEIRO, 
	RTRIM(D4_OPERAC) OPERACAO, 
	RTRIM(D.B1_UM) UNIDADE,
	CASE 
		WHEN ISNULL(DTFIM, '') = '' 
		THEN '' 
		ELSE CONVERT(VARCHAR(10), CAST(DTFIM AS DATETIME), 103) 
	END DTFIM,
	CASE 
		WHEN 
			CASE 
				WHEN C2_DATRF = '' THEN ''
				WHEN C2_DATRF <> '' AND  ISNULL(DTFIM, '') <> '' 
				THEN CASE WHEN C2_DATRF > DTFIM THEN DTFIM ELSE C2_DATRF END
				WHEN ISNULL(DTFIM, '') = '' 
				THEN C2_DATRF
			END = '' 
		THEN ''
		ELSE CONVERT(VARCHAR(10), CAST(
			CASE 
				WHEN C2_DATRF = '' THEN ''
				WHEN C2_DATRF <> '' AND  ISNULL(DTFIM, '') <> '' 
				THEN CASE WHEN C2_DATRF > DTFIM THEN DTFIM ELSE C2_DATRF END
				WHEN ISNULL(DTFIM, '') = '' 
				THEN C2_DATRF
			END AS DATETIME), 103) 
	END FINAL
FROM 
	HOMOLOGACAO..SC2010 A WITH (NOLOCK) INNER JOIN
	HOMOLOGACAO..SB1010 B WITH (NOLOCK) ON
	C2_PRODUTO = B.B1_COD INNER JOIN
	HOMOLOGACAO..SD4010 C WITH (NOLOCK) ON
	C2_NUM+C2_ITEM+C2_SEQUEN = D4_OP AND
	C2_FILIAL = D4_FILIAL INNER JOIN
	HOMOLOGACAO..SB1010 D WITH (NOLOCK) ON
	D4_COD = D.B1_COD LEFT JOIN
	HOMOLOGACAO..SB2010 E WITH (NOLOCK) ON
	1 = 1
	AND D4_FILIAL = B2_FILIAL
	AND D4_COD = B2_COD
	AND E.R_E_C_D_E_L_ = 0
	AND B2_LOCAL = '01' LEFT JOIN
	(
		SELECT 
			H6_OP OP, MAX(H6_DTAPONT) DTFIM 
		FROM 
			HOMOLOGACAO..SH6010  WITH (NOLOCK) 
		WHERE 
			R_E_C_D_E_L_ = 0 
		GROUP BY 
			H6_OP	
	) F ON
	C2_NUM+C2_ITEM+C2_SEQUEN = F.OP
WHERE
	1 = 1
	AND A.R_E_C_D_E_L_ = 0
	AND B.R_E_C_D_E_L_ = 0
	AND C.R_E_C_D_E_L_ = 0
	AND D.R_E_C_D_E_L_ = 0
	AND (C2_DATRF = '' OR left(C2_DATRF, 6) >= convert(varchar(6),DATEADD(month, -1, getdate()), 112) )
GO
