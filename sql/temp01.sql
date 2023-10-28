--alter VIEW vw_pcp_op_andamento as

SELECT
    filial,
    op,
    recurso,
    operacao,
    integrado,
    produto,
    producao,
    retrabalho,
    segundos,
    situacao,
    situDesc,
    dia,
    CONVERT(VARCHAR(10), CAST(C2_EMISSAO AS DATETIME), 103) emissao,
    C2_QUANT qtde,
    C2_QUJE entregue,
    CASE 
		WHEN ISNULL(DTFIM, '') = '' 
		THEN '' 
		ELSE CONVERT(VARCHAR(10), CAST(DTFIM AS DATETIME), 103) 
	END dtfim,
    CASE 
		WHEN 
			CASE 
				WHEN C2_DATRF = '' THEN ''
				WHEN C2_DATRF <> '' AND ISNULL(DTFIM, '') <> '' 
				THEN CASE WHEN C2_DATRF > DTFIM THEN DTFIM ELSE C2_DATRF END
				WHEN ISNULL(DTFIM, '') = '' 
				THEN C2_DATRF
			END = '' 
		THEN ''
		ELSE CONVERT(VARCHAR(10), CAST(
			CASE 
				WHEN C2_DATRF = '' THEN ''
				WHEN C2_DATRF <> '' AND ISNULL(DTFIM, '') <> '' 
				THEN CASE WHEN C2_DATRF > DTFIM THEN DTFIM ELSE C2_DATRF END
				WHEN ISNULL(DTFIM, '') = '' 
				THEN C2_DATRF
			END AS DATETIME), 103) 
	END final

FROM
    HOMOLOGACAO..SC2010 a INNER JOIN
    PCP..vw_pcp_pcf b ON
    1 = 1
        AND C2_FILIAL = filial COLLATE Latin1_General_BIN
        AND C2_NUM+C2_ITEM+C2_SEQUEN = op COLLATE Latin1_General_BIN LEFT JOIN
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
    AND R_E_C_D_E_L_ = 0
    AND (C2_DATRF = '' OR LEFT(C2_DATRF, 6) >= CONVERT(VARCHAR(6),DATEADD(month, -1, getdate()), 112) )
-- and op = '10804755901001'





    -- SELECT
    --     *
    -- FROM
    --     PCP..vw_pcp_pcf
    -- WHERE
    --     op = '04755901001'

    -- SELECT
    --     *
    -- FROM
    --     PCP..View_Portal_OP
    -- WHERE
    --     OP = '04755901001'