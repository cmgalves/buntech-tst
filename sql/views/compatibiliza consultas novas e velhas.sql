SELECT
	a.op,
	producao,
	qtde, 
	producao - qtde
FROM
	(SELECT
		substring(op, 1, 3) filial,
		substring(op, 4, 11) op,
		codRecurso recurso,
		sum(qtde) qtde
	FROM
		pcp..oppcf
	WHERE 
	1 = 1
	--and op = '20600431401001'
	GROUP BY
    substring(op, 1, 3) ,
    substring(op, 4, 11),codRecurso) a INNER JOIN
	PCF_Integ..View_pcf b ON
	1 = 1
		AND a.filial = b.filial COLLATE Latin1_General_CI_AS
		AND a.op = b.op COLLATE Latin1_General_CI_AS
		AND a.recurso = b.recurso COLLATE Latin1_General_CI_AS