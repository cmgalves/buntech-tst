--ALTER view [dbo].[vw_pcp_pcf] as
SELECT 
	substring(op, 1,3) filial, 
	rtrim(substring(op, 4, 20)) op, 
	codRecurso recurso, 
	codOpera operacao, 
	0 integrado, 
	rtrim(substring(produto, 4, 20)) produto, 
	round(SUM(qtde),4) producao, 
	0 retrabalho, 
	sum(segundos) segundos, 
	a.situacao, 
	b.situacao situDesc, 
	convert(varchar(10), dtcria, 103) dia
FROM 
	oppcf a inner join
	opSituacao b on
	a.situacao = b.codigo collate Latin1_General_BIN
WHERE
	1 = 1
	--and op = '20600431401001'
group by
	op, codRecurso, codOpera, produto,  a.situacao, b.situacao, convert(varchar(10), dtcria, 103)
--ORDER BY 12
GO
