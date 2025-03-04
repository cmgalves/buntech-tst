USE [PCP]
GO
/****** Object:  View [dbo].[View_Relacao_Espec]    Script Date: 21/01/2025 07:24:46 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE view [dbo].[View_Relacao_Espec] as
SELECT
    cabProduto, descrProd, cabRevisao, dataAprov, 
	numEspec, situacao, qualObsGeral, qualObsRevisao, 
	aplicacao, embalagem, feitoPor, aprovPor,especAlcada, 
	especAnalise,especQuebra,especSequencia, loteAtual,
    isnull(iteProduto, '') iteProduto, 
	isnull(iteRevisao, '') iteRevisao,
    isnull(iteCarac, '') iteCarac, 
	isnull(iteMin, 0) iteMin,
    isnull(iteMax, 0) iteMax, 
    isnull(iteTxt, 0) iteTxt, 
	isnull(iteMeio, '') iteMeio, 
    isnull(codCarac, '') codCarac, 
	isnull(descCarac, '') descCarac, 
	cabQtdeQuebra, 
	qtdeAnalise, 
    imprimeLaudo, 
	isnull(iteLaudo,'SIM') iteLaudo,
    isnull(idEspecItens, 0) idEspecItens,
	a.validadeMeses, a.linha, c.parametro, a.geraAnalise
FROM
    PCP..qualEspecCab a inner join
	(
		select 
			cabProduto prod, max(idEspecCab) idcab
		from 
			PCP..qualEspecCab
		group by
			cabProduto
	) b on
	1 = 1
	and cabProduto = prod
    and idEspecCab = idcab left join
    PCP..qualEspecItens c on
    1 = 1
    and cabProduto = iteProduto
    and cabRevisao = iteRevisao left join
    PCP..qualCarac d on
    1 = 1
    and iteCarac = codCarac
where
	1 = 1 and
	situacao = 'Concluida'
GO
/****** Object:  View [dbo].[View_Produto_Andamento_Detalhe]    Script Date: 21/01/2025 07:24:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE VIEW [dbo].[View_Produto_Andamento_Detalhe] as 
SELECT 
	filial, produto, op, e.descrProd, qtdeLote, qtde
FROM 
	oppcfLote Inner JOIN 
	View_Relacao_Espec e on 
	CONVERT(VARCHAR, cabProduto) COLLATE Latin1_General_CI_AS 
	= CONVERT(VARCHAR, produto) COLLATE Latin1_General_CI_AS
GO
/****** Object:  View [dbo].[View_Relacao_Lote_Analisa]    Script Date: 21/01/2025 07:24:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE view [dbo].[View_Relacao_Lote_Analisa] as

--select * from loteAnalise
--alter table loteAnalise add nivel varchar(2)
select 
	* 
from 
(
	select 
		'analise' as orig, filial, op, produto, descricao, lote, nivel, 
		dtAprov, usrAprov, hrAprov, dtAnalise, hrAnalise, usrAnalise, 
		dtVenc, qtdeProd, qtdeTot, revisao, a.codCarac, descCarac, itemin, itemax, itemeio, 
		result, situacao, resultxt, sitFim, ISNULL(a.imprimeLaudo, 'SIM') as imprimeLaudo, id_loteProd
	from 
		loteAnalise a inner join 
		qualCarac b on
		1 = 1
		and a.codCarac = b.codCarac

	 union all

	select * from 
	(select distinct
		'produc' as orig, filial, op, produto, descricao, lote, nivel,
		dtAprov, usrAprov, '' hrAprov, '' dtAnalise, '' hrAnalise, 0 usrAnalise, 
		dtVenc, qtdeProd, qtdeTot, revisao, codCarac, descCarac, iteMin itemin, iteMax itemax, iteMeio itemeio,
		'' result, situacao, '' resultxt, '' sitFim, '' imprimeLaudo, '' id_loteProd
	from 
		loteProd a left join
		(
			select 
				cabProduto, cabRevisao, codCarac, iteCarac, descCarac, iteMin, iteMax, iteMeio
			from 
				qualEspecCab a inner join 
				qualEspecItens b on
				1 = 1
				and cabProduto = iteProduto
				and cabRevisao = iteRevisao inner join 
				qualCarac c on
				1 = 1
				and iteCarac = codCarac
			where 
				1 = 1
				and situacao <> 'Encerrada'
				--and cabProduto =  'PAN01166'
		)b on
		1 = 1
		and produto = cabProduto
	)l
	where
		not exists
		(
			select 
				w.filial, w.op, w.produto, w.lote, w.codCarac
			from 
				loteAnalise w
			where
				w.filial = l.filial
				and w.op = l.op 
				and w.produto = l.produto
				and w.lote = l.lote
				and w.codCarac = l.codCarac
		)
	

) AS mm
--where  produto =  'PAN01051' and lote = '000000002' and filial = '108'
GO
/****** Object:  View [dbo].[View_Relacao_Lote_Aprova]    Script Date: 21/01/2025 07:24:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE view [dbo].[View_Relacao_Lote_Aprova] as
select 
	id_loteProd, a.filial, a.op, a.produto, a.descricao, a.lote, a.loteAprov, 
	a.dtAprov, a.usrAprov, a.usrProd, a.dtProd, a.hrProd, a.dtVenc, a.qtdeProd, 
	a.qtdeQuebra, a.qtdeTot, a.quebra, a.nivel, a.revisao, b.situacao, 
	a.fechamento, a.obs, a.resultado, a.justificativa, a.userJusti,
	b.orig, b.dtAnalise, b.hrAnalise, b.usrAnalise, b.codCarac, b.descCarac, b.itemin, b.itemax, b.itemeio, 
	b.result, b.itetxt, b.resultxt
from 
	loteProd a inner join 
	View_Relacao_Lote_Analisa b
	on
	1 = 1
	and a.filial = b.filial
	and a.op = b.op
	and a.produto = b.produto
	and a.lote = b.lote
GO
/****** Object:  View [dbo].[View_Relacao_Lote_Aprova_Protheus]    Script Date: 21/01/2025 07:24:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE view [dbo].[View_Relacao_Lote_Aprova_Protheus] as
select 
	filial, op, produto, lote, qtdeProd, dtVenc, dtProd, 
	codCarac, 
	rtrim(ltrim(descCarac)) descCarac, itemin, itemax, result obtido, 
	resultado sitLote 
from 
	View_Relacao_Lote_Aprova 
GO
/****** Object:  View [dbo].[vw_qualEspec_nivel]    Script Date: 21/01/2025 07:24:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE VIEW [dbo].[vw_qualEspec_nivel] as
    SELECT
        q.*,
        parametro,
        iteCarac,
        iteProduto,
        CASE 
        WHEN EXISTS (
            SELECT 
				1
			FROM 
				usuarios u
			WHERE 
				CHARINDEX(q.linha, u.linha) > 0 
				AND CHARINDEX('Qualidade', u.perfil) > 0
        ) THEN (
            SELECT STUFF((
                SELECT ' - ' + u.perfil
            FROM 
				usuarios u
            WHERE 
				CHARINDEX(q.linha, u.linha) > 0 
				AND CHARINDEX('Qualidade', u.perfil) > 0
            FOR XML PATH('')), 1, 3, '')
        )
        ELSE 'Qualidade N1'
    END nivel
    FROM 
		PCP..qualEspecCab q inner join
        PCP..qualEspecItens k on
		cabProduto = iteProduto
        and cabRevisao = iteRevisao
GO
/****** Object:  View [dbo].[vw_pcp_relacao_lote_analisa]    Script Date: 21/01/2025 07:24:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE view [dbo].[vw_pcp_relacao_lote_analisa]
as

	/*
alter table loteAnalise add nivel varchar(2)
select * from vw_pcp_caracteristica


*/

	select distinct
		a.filial, a.produto, c.descrProd,
		a.lote, a.analise, d.qtdeLote qtde, c.especAlcada,
		b.codCarac, b.descCarac, a.iteMin, a.iteMax, a.iteMeio, a.iteTxt, a.situacao, a.result, a.resultxt, d.op,
		d.dtAprovn1, d.dtAprovn2, d.dtAprovn3, d.dtVenc, imprimeLaudo, c.validadeMeses, c.nivel, c.parametro
	from
		oppcfLoteAnalise a inner join
		qualCarac b on
	1 = 1
			and a.carac = b.codCarac

		inner join
		PCP..vw_qualEspec_nivel c on
	a.produto = c.cabProduto
		inner join
		(
		select
			filial, produto, lote, analise, sum(qtde) qtdeLote, op,
			dtAprovn1, dtAprovn2, dtAprovn3, dtVenc
		from
			oppcfLote a
		where
			1 = 1
			and lote > '000000000'
			and FlgDeleted = 0
		group by
			filial, produto, lote, analise, op, dtAprovn1, dtAprovn2, dtAprovn3, dtVenc, qtdeLote
	)d on
	1 = 1
			and a.filial = d.filial
			and a.produto = d.produto
			and a.lote = d.lote
			and a.analise = d.analise


GO
/****** Object:  View [dbo].[vw_pcp_pcf_situacao]    Script Date: 21/01/2025 07:24:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE view [dbo].[vw_pcp_pcf_situacao] as
select distinct
	substring(a.op, 1, 3) filial,
	substring(a.op, 4, 11) op, a.situacao codSitu, c.situacao
from 
	oppcf a inner join
	(
		select 
			op, max(dtime) dtime
		from 
			oppcf 
		group by 
			op	
	) b on
	1 = 1
	and a.op = b.op
	and a.dtime = b.dtime inner join
	opSituacao c on
	a.situacao = c.codigo
WHERE
	1 = 1
	--and op = '20600431401001'
--ORDER BY 12
GO
/****** Object:  View [dbo].[vw_pcp_relacao_op_lote]    Script Date: 21/01/2025 07:24:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE view [dbo].[vw_pcp_relacao_op_lote]
as

	select
		convert(varchar(10), dtcria, 103) + ' ' +convert(varchar(08), dtcria, 108) dtcria,
		convert(varchar(10), cast(max(dtime) as datetime), 103) dtime,
		x.filial, produto, x.op, lote,
		max(codRecurso) codRecurso,
		max(codOpera) codOpera,
		convert(varchar(10), cast(dtcria as datetime), 103) diabr,
		descricao,
		sum(qtdeLote) qtdeLote,
		sum(qtdeEnv) qtdeEnv,
		sum(qtdeLote - qtdeEnv) qtdeSaldo,
		sum(qtdeProd) qtdeProd,
		sum(qtdeEnv - qtdeProd) saldoProd,
		codSitu, y.situacao, alcadaProd, sum(qtdeReprovado) qtdeReprovado,
		CASE WHEN sum(qtdeEnv) = sum(qtdeLote) THEN (CASE WHEN sum(qtdeReprovado) = 0 THEN 'APROVADO' ELSE 'REPROVADO' END) 
		ELSE 'ABERTO' END as loteAprov
	from
		(
	select
			filial,
			produto, op, intervalo,
			dtime, dtcria,
			codRecurso, codOpera,
			isnull(lote, '') lote,
			descrProd descricao,
			isnull(dtAprovn1, '') dtAprovn1,
			isnull(dtAprovn2, '') dtAprovn2,
			isnull(dtAprovn3, '') dtAprovn3,
			isnull(usrAprovn1, 0) usrAprovn1,
			isnull(usrAprovn2, 0) usrAprovn2,
			isnull(usrAprovn3, 0) usrAprovn3,
			isnull(dtVenc, '')dtVenc,
			isnull(qtde, 0) qtdeLote,
			isnull(qtdeProd, 0) qtdeProd,
			CASE WHEN CHARINDEX('REPROVADO', loteAprov) > 0 THEN qtdeLote ELSE 0 END AS qtdeReprovado,
			isnull( 
			case 
				when loteAprov = 'ABERTO' 
				then 0 
				when loteAprov = 'ANDAMENTO' 
				then 0 
				when loteAprov = 'SEGREGADO' 
				then 0 
				else qtde 
			end, 0) qtdeEnv,
			isnull(a.situacao, '') situacao,
			especAlcada alcadaProd
		from
			oppcfLote a inner JOIN
			qualEspecCab b ON
		a.produto = b.cabProduto
		where
		1 = 1
			--and loteAprov = 'APROVADO'
			and lote > '000000000'
			and isnull(qtde, 0) > 0
			and b.situacao = 'Concluida'
		group by qtdeProd, qtde, filial, produto, op, intervalo,
		dtime, dtcria, codRecurso, codOpera, lote, descrProd, usrAprovn1, 
		usrAprovn2, usrAprovn2, usrAprovn3, dtAprovn1, dtAprovn2, dtAprovn3,
		dtVenc, qtdeLote, qtdeProd, a.situacao, especAlcada , loteAprov
)x inner join
		vw_pcp_pcf_situacao y on
1 = 1
			and x.filial = y.filial
			and x.op = y.op
	-- where lote = '000000084'
	group by
	x.filial, produto, x.op, lote, 
	descricao, dtcria,   
	codSitu, y.situacao, alcadaProd
GO
/****** Object:  View [dbo].[vw_lote_item]    Script Date: 21/01/2025 07:24:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE VIEW [dbo].[vw_lote_item] as

SELECT 
	p.filial, p.produto, p.lote, p.analise, c.descCarac, p.resultxt, q.validadeMeses,
	p.iteMin, p.iteMax, q.imprimeLaudo, q.parametro, p.result
from 
	vw_qualEspec_nivel q INNER JOIN 
	oppcfLoteAnalise p on 
	1 = 1
	and produto = cabProduto
	and p.carac = q.iteCarac INNER JOIN
	qualCarac c on 
	1 = 1
	and iteCarac = codCarac 
GO
/****** Object:  View [dbo].[vw_pcp_relacao_lote_registro]    Script Date: 21/01/2025 07:24:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE view [dbo].[vw_pcp_relacao_lote_registro] as

select distinct
	case when dtAprovn1 = ' ' then ' ' else convert(varchar(8), cast(dtAprovn1 as datetime), 3) + '-' + tipoAprova1 end dt1,
	case when dtAprovn2 = ' ' then ' ' else convert(varchar(8), cast(dtAprovn2 as datetime), 3) + '-' + tipoAprova2 end dt2,
	case when dtAprovn3 = ' ' then ' ' else convert(varchar(8), cast(dtAprovn3 as datetime), 3) + '-' + tipoAprova3 end dt3,
	max(id_loteProd) id_loteRegProd,
	x.filial, x.produto, x.lote, x.analise,
	descricao,
	case 
		when loteAprov = ''
		then 'ABERTO'
		else loteAprov
	end loteAprov,
	usrAprovn1, usrAprovn2, usrAprovn3,
	dtAprovn1, dtAprovn2, dtAprovn3,
	justificativa1, justificativa2, justificativa3,
	tipoAprova1, tipoAprova2, tipoAprova3,
	sum(qtdeLote) qtdeLote,
	sum(qtdeEnv) qtdeEnv,
	sum(qtdeLote - qtdeEnv) qtdeSaldo,
	sum(qtdeProd) qtdeProd,
	sum(qtdeEnv - qtdeProd) saldoProd,
	min(dtcria) dtcria,
	convert(varchar(10), cast(max(dtime) as datetime), 103) dtime,
	max(codRecurso) codRecurso,
	max(codOpera) codOpera,
	min(intervaloInicial) as intervaloInicial,
	max(intervaloFinal) as intervaloFinal,
	max(x.situacao) as situacao,
	x.loteEnv,
	alcadaProd, op, statusEnvio, statusLote, linha,
	CASE 
		WHEN isnull(qtde, 0) = 0
		THEN 'true'
		ELSE 'false'
	END AS podeAprovar
from
	(
	select
		id_num id_loteProd, a.filial,
		produto, intervalo,
		isnull(a.lote, '') lote,
		isnull(analise, '') analise, descrProd descricao,
		isnull(loteAprov,'') loteAprov,
		isnull(dtAprovn1, '')dtAprovn1,
		isnull(dtAprovn2, '')dtAprovn2,
		isnull(dtAprovn3, '')dtAprovn3,
		isnull(tipoAprova1, '')tipoAprova1,
		isnull(tipoAprova2, '')tipoAprova2,
		isnull(tipoAprova3, '')tipoAprova3,
		isnull(justificativa1, '')justificativa1,
		isnull(justificativa2, '')justificativa2,
		isnull(justificativa3, '')justificativa3,
		isnull(usrAprovn1, 0)usrAprovn1,
		isnull(usrAprovn2, 0)usrAprovn2,
		isnull(usrAprovn3, 0)usrAprovn3,
		isnull(dtVenc, '')dtVenc,
		isnull(qtde, 0) qtdeLote,
		isnull(qtdeProd, 0) qtdeProd,
		isnull( 
				case 
					when loteAprov = 'ABERTO' 
					then 0 
					when loteAprov = 'ANDAMENTO' 
					then 0 
					when loteAprov = 'SEGREGADO' 
					then 0 
					else qtde 
				end, 0) qtdeEnv,
		isnull(a.situacao, '') situacao,
		isnull(a.loteEnv, '') loteEnv,
		codRecurso, codOpera,
		dtcria,
		dtime,
		op,
		intervaloInicial,
		intervaloFinal,
		especAlcada alcadaProd,
		statusEnvio, a.statusLote,
		b.linha
	from
		PCP..oppcfLote a inner join
		PCP..qualEspecCab b ON
		a.produto = b.cabProduto inner join
		PCP..loteFilial c ON
		a.filial = c.filial
	where
		1 = 1
		and a.lote > '000000000'
		and c.lote IN ('S')
		and a.FlgDeleted = 0
		and b.situacao = 'Concluida'
)x
	LEFT JOIN (
			select
				filial, produto, lote, analise, count(*) qtde
			from
				PCP..oppcfLoteAnalise
			where 
				situacao = ''
			group by 
				filial, produto, lote, analise
			) la on 
			1 = 1
			and la.produto = x.produto 
			and la.filial = x.filial 
			and la.lote = x.lote 
			and la.analise = x.analise
--where x.produto = 'PAN01069' and x.op = '04770601001'
group by
	x.filial, x.produto, x.lote, x.analise, 
	descricao, loteAprov, qtde, 
	usrAprovn1, usrAprovn2, usrAprovn3,
	dtAprovn1, dtAprovn2, dtAprovn3,
	tipoAprova1, tipoAprova2, tipoAprova3,
	justificativa1, justificativa2, justificativa3, 
	loteEnv, 
	alcadaProd, op, intervaloFinal, intervaloInicial, statusEnvio, statusLote,
	linha


GO
/****** Object:  View [dbo].[vw_pcp_relacao_lote_agrupa]    Script Date: 21/01/2025 07:24:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE VIEW [dbo].[vw_pcp_relacao_lote_agrupa] AS
SELECT
    lote,
    produto,
    statusLote,
    MAX(filial) as filial,
    SUM(qtdeLote) as qtde,
    MAX(descricao) as descricao,
    SUM(CASE WHEN CHARINDEX('ABERTO', loteAprov) > 0 OR CHARINDEX('ANDAMENTO', loteAprov) > 0 THEN qtdeLote ELSE 0 END) AS saldoAnalisar,
    SUM(CASE WHEN CHARINDEX('APROVADO', loteAprov) > 0 THEN qtdeLote ELSE 0 END) AS qtdeAprovado,
    SUM(CASE WHEN CHARINDEX('REPROVADO', loteAprov) > 0 THEN qtdeLote ELSE 0 END) AS qtdeReprovado,
    SUM(CASE WHEN CHARINDEX('RECLASSIFICADO', loteAprov) > 0 THEN qtdeLote ELSE 0 END) AS qtdeReclassifica,
    CASE
        WHEN SUM(CASE WHEN loteAprov = 'ABERTO' OR loteAprov = 'ANDAMENTO' THEN qtdeLote ELSE 0 END) = SUM(qtdeLote) THEN 'ABERTO'
        WHEN SUM(CASE WHEN loteAprov = 'ABERTO' OR loteAprov = 'ANDAMENTO' THEN qtdeLote ELSE 0 END) > 0 THEN 'ANDAMENTO'
        ELSE 'CONCLUIDO'
    END AS situacao
FROM
    vw_pcp_relacao_lote_registro
GROUP BY
    lote, produto, statusLote;

/*
    SELECT * FROM vw_pcp_relacao_lote_agrupa
    SELECT situacao FROM vw_pcp_relacao_lote_registro

    SELECT loteAprov from oppcfLote
    update oppcfLote set loteAprov = 'ABERTO' where loteAprov = ''
*/
GO
/****** Object:  View [dbo].[vw_pcp_pcf]    Script Date: 21/01/2025 07:24:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE view [dbo].[vw_pcp_pcf] as
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
	a.situacao = b.codigo
WHERE
	1 = 1
	--and op = '20600431401001'
group by
	op, codRecurso, codOpera, produto,  a.situacao, b.situacao, convert(varchar(10), dtcria, 103)
--ORDER BY 12
GO
/****** Object:  View [dbo].[vw_pcp_op_andamento]    Script Date: 21/01/2025 07:24:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE VIEW [dbo].[vw_pcp_op_andamento] as

SELECT
    filial, op, recurso, operacao, integrado, produto, 
	producao, retrabalho, segundos, situacao, situDesc, dia,
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
    TOTVS_MIGRACAO..SC2010 a INNER JOIN
    PCP..vw_pcp_pcf b ON
    1 = 1
        AND C2_FILIAL = filial COLLATE Latin1_General_BIN
        AND C2_NUM+C2_ITEM+C2_SEQUEN = op COLLATE Latin1_General_BIN LEFT JOIN
	(
		SELECT 
			H6_OP OP, MAX(H6_DTAPONT) DTFIM 
		FROM 
			TOTVS_MIGRACAO..SH6010  WITH (NOLOCK) 
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

UNION ALL

SELECT
    filial, op, recurso, operacao, integrado, produto, 
	producao, retrabalho, segundos, situacao, situDesc, dia,
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
    TOTVS_MIGRACAO..SC2020 a INNER JOIN
    PCP..vw_pcp_pcf b ON
    1 = 1
        AND C2_FILIAL = filial COLLATE Latin1_General_BIN
        AND C2_NUM+C2_ITEM+C2_SEQUEN = op COLLATE Latin1_General_BIN LEFT JOIN
	(
		SELECT 
			H6_OP OP, MAX(H6_DTAPONT) DTFIM 
		FROM 
			TOTVS_MIGRACAO..SH6020  WITH (NOLOCK) 
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

UNION ALL

SELECT
    filial, op, recurso, operacao, integrado, produto, 
	producao, retrabalho, segundos, situacao, situDesc, dia,
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
    TOTVS_MIGRACAO..SC2040 a INNER JOIN
    PCP..vw_pcp_pcf b ON
    1 = 1
        AND C2_FILIAL = filial COLLATE Latin1_General_BIN
        AND C2_NUM+C2_ITEM+C2_SEQUEN = op COLLATE Latin1_General_BIN LEFT JOIN
	(
		SELECT 
			H6_OP OP, MAX(H6_DTAPONT) DTFIM 
		FROM 
			TOTVS_MIGRACAO..SH6040  WITH (NOLOCK) 
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



GO
/****** Object:  View [dbo].[vw_pcp_op_totais]    Script Date: 21/01/2025 07:24:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE view [dbo].[vw_pcp_op_totais] as
select 
	substring(op, 1, 3) filial, 
	substring(op, 4, 11) op, 
	sum(qtde) qtde, sum(segundos) segundos 
from 
	(
		select 
			'q1' tipo, op, sum(qtde) qtde, 0 segundos
		from 
			PCP..oppcfFixo a inner join
			PCP..recursos b on
			a.codRecurso = b.recurso
		where
			a.FlgDeleted = 0
			and tipo in ('Q', 'A')
		group by
			op

		union all
		--registros com o último recurso utilizado
		select 
			'q2', a.op, sum(qtde), 0
		from 
			PCP..oppcfFixo a inner join
			(
				select 
					op, max(codOpera) codOpera 
				from
					PCP..oppcfFixo
				where
					FlgDeleted = 0
				group by
					op
			)b on
			1 = 1
			and a.op = b.op
			and a.codOpera = b.codOpera
		where
			1 = 1
			and a.FlgDeleted = 0
			and not exists
			(
				select 
					recurso 
				from 
					PCP..recursos
				where
					tipo in ('Q', 'A')
					and codRecurso = recurso
			)
		group by
			a.op

		union all

		select 
			't1', op, 0, sum(segundos)
		from 
			PCP..oppcfFixo a inner join
			PCP..recursos b on
			a.codRecurso = b.recurso
		where
			a.FlgDeleted = 0
			and tipo in ('T', 'A')
		group by
			op

		union all
		--registros com o último recurso utilizado
		select 
			't2', a.op, 0, sum(segundos)
		from 
			PCP..oppcfFixo a
		where
			1 = 1
			and a.FlgDeleted = 0
			and not exists
			(
				select 
					recurso, tipo 
				from 
					PCP..recursos
				where
					tipo in ('T', 'A')
					and codRecurso = recurso
			)
		group by
			a.op
	)m 
group by
	op

--where op = '10804766501001'
--order by 2
GO
/****** Object:  View [dbo].[vw_pcp_relacao_op_cabec]    Script Date: 21/01/2025 07:24:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
create view [dbo].[vw_pcp_relacao_op_cabec] as
SELECT 
	dtcria, a.filial, a.produto, descricao, a.op, max(codRecurso) codRecurso, 
	max(codOpera) codOpera, sum(qtdeLote) qtdeLote, 
	sum(qtdeEnv) qtdeEnv, sum(qtdeSaldo) qtdeSaldo, 
	sum(qtdeProd) qtdeProd, sum(saldoProd) saldoProd, 
	max(codSitu) codSitu, max(situacao) situacao, 
	max(alcadaProd) alcadaProd, max(qtde) opQtde, max(segundos) opSegundos
FROM 
	PCP..vw_pcp_relacao_op_lote a inner join
	PCP..vw_pcp_op_totais b on
	1 = 1
	and a.filial = b.filial
	and a.op = b.op

group by
	dtcria, a.filial, a.produto, descricao, a.op
--select * from vw_pcp_op_totais
GO
/****** Object:  View [dbo].[View_Produto_Andamento]    Script Date: 21/01/2025 07:24:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE view [dbo].[View_Produto_Andamento] as
-- View para os produtos que estão disponíveis para o PCF

	SELECT DISTINCT 
		o.produto, 
		isnull(e.descrProd, '') descrProd, 
		isnull(e.especQuebra, '') especQuebra, 
		isnull(e.cabQtdeQuebra, 0) cabQtdeQuebra, 
		isnull(e.especAlcada, '') especAlcada
	from 
		oppcfLote o LEFT JOIN 
		View_Relacao_Espec e ON 
		o.produto COLLATE Latin1_General_CI_AS = e.cabProduto
		
GO
/****** Object:  View [dbo].[View_Relacao_Lote_Analisa_Situacao]    Script Date: 21/01/2025 07:24:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE view [dbo].[View_Relacao_Lote_Analisa_Situacao] as
select 
	filial, op, produto, lote, 
	andamento, analisado, case 
		when andamento = 0 
		then 'analisado'
		when analisado = 0 
		then 'aguardando'
		when analisado <> 0 and andamento <> 0 
		then 'andamento'
	end situac
from 
(
	select 
		filial, op, produto, lote, 
		sum(andamento) andamento, 
		sum(analisado) analisado 
	from 
	(
		select 
			filial, op, produto, lote, count(*) andamento, 0 analisado
		from 
			View_Relacao_Lote_Analisa
		where
			usrAnalise = 0
		group by 
			filial, op, produto, lote
			union all
		select 
			filial, op, produto, lote, 0, count(*) analisado
		from 
			View_Relacao_Lote_Analisa
		where
			usrAnalise <> 0
		group by 
			filial, op, produto, lote

	)a
	group by
		filial, op, produto, lote
)b

--select * from View_Relacao_Lote_Analisa where op = '03940201001'
GO
/****** Object:  View [dbo].[VW_OPS]    Script Date: 21/01/2025 07:24:47 ******/
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
/****** Object:  View [dbo].[VW_PRODUTO]    Script Date: 21/01/2025 07:24:47 ******/
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
/****** Object:  View [dbo].[View_Portal_Cadastro_Produto]    Script Date: 21/01/2025 07:24:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE view [dbo].[View_Portal_Cadastro_Produto] as
SELECT DISTINCT 
	* 
FROM (
	SELECT 
		rtrim(B1_COD) codigo, 
		rtrim(B1_DESC) descricao, 
		rtrim(B1_TIPO) tipo, 
		rtrim(B1_UM) unidade, 
		rtrim(B1_GRUPO) grupo, 
		rtrim(B1_POSIPI) ncm, 
		rtrim(B1_XTRANSF) retrabalho, 
		rtrim(B1_XINDICA) mdo, 
		rtrim(case when B1_MSBLQL = '1' then'Bloqueado' else 'Liberado' end) situacao
	FROM 
		TMPRD..SB1010 
	WHERE 
		1 = 1
		AND D_E_L_E_T_ = ''

	UNION ALL

	SELECT 
		rtrim(B1_COD) codigo, 
		rtrim(B1_DESC) descricao, 
		rtrim(B1_TIPO) tipo, 
		rtrim(B1_UM) unidade, 
		rtrim(B1_GRUPO) grupo, 
		rtrim(B1_POSIPI) ncm, 
		rtrim(B1_XTRANSF) retrabalho, 
		rtrim(B1_XINDICA) mdo, 
		rtrim(case when B1_MSBLQL = '1' then'Bloqueado' else 'Liberado' end) situacao
	FROM 
		TMPRD..SB1020 
	WHERE 
		1 = 1
		AND D_E_L_E_T_ = ''

	UNION ALL

	SELECT 
		rtrim(B1_COD) codigo, 
		rtrim(B1_DESC) descricao, 
		rtrim(B1_TIPO) tipo, 
		rtrim(B1_UM) unidade, 
		rtrim(B1_GRUPO) grupo, 
		rtrim(B1_POSIPI) ncm, 
		rtrim(B1_XTRANSF) retrabalho, 
		rtrim(B1_XINDICA) mdo, 
		rtrim(case when B1_MSBLQL = '1' then'Bloqueado' else 'Liberado' end) situacao
	FROM 
		TMPRD..SB1040 
	WHERE 
		1 = 1
		AND D_E_L_E_T_ = ''
)PROD
GO
/****** Object:  View [dbo].[View_Portal_Cadastro_Produto_Qualidade]    Script Date: 21/01/2025 07:24:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE view [dbo].[View_Portal_Cadastro_Produto_Qualidade] as
-- View para os produtos que estão disponíveis para o PCF

SELECT DISTINCT 
	* 
FROM (
	SELECT 
		rtrim(B1_COD) codigo,
		rtrim(B1_DESC) descricao,
		rtrim(B1_TIPO) tipo,
		rtrim(B1_UM) unidade,
		rtrim(B1_GRUPO) grupo,
		rtrim(B1_POSIPI) ncm,
		rtrim(B1_XTRANSF) retrabalho,
		rtrim(B1_XINDICA) mdo,
		isnull(cabRevisao, '000') revisao,
        rtrim(case when B1_MSBLQL = '1' then'Bloqueado' else 'Liberado' end) sit,
		isnull(situacao, 'Sem Epecificação') situacao
	FROM
		TMPRD..SB1010 A LEFT JOIN
		(
			select 
				* 
			from 
				PCP..qualEspecCab c inner join
				(
					select 
						cabProduto cabPrd, max(cabRevisao) mxRev
					from 
						PCP..qualEspecCab
					group by
						cabProduto
				)d on
				1 = 1
				and cabProduto = cabPrd
				and cabRevisao = mxRev		
		) B ON
		1 = 1
		AND B1_COD = cabProduto
	WHERE 
		1 = 1
		AND D_E_L_E_T_ = ''
		AND B1_TIPO IN ('PA', 'PP') 
		AND B1_XINTPCF <> ''

UNION ALL

	SELECT 
		rtrim(B1_COD) codigo,
		rtrim(B1_DESC) descricao,
		rtrim(B1_TIPO) tipo,
		rtrim(B1_UM) unidade,
		rtrim(B1_GRUPO) grupo,
		rtrim(B1_POSIPI) ncm,
		rtrim(B1_XTRANSF) retrabalho,
		rtrim(B1_XINDICA) mdo,
		isnull(cabRevisao, '000') revisao,
        rtrim(case when B1_MSBLQL = '1' then'Bloqueado' else 'Liberado' end) sit,
		isnull(situacao, 'Sem Epecificação') situacao
	FROM
		TMPRD..SB1020 A LEFT JOIN
		(
			select 
				* 
			from 
				PCP..qualEspecCab c inner join
				(
					select 
						cabProduto cabPrd, max(cabRevisao) mxRev
					from 
						PCP..qualEspecCab
					group by
						cabProduto
				)d on
				1 = 1
				and cabProduto = cabPrd
				and cabRevisao = mxRev		
		) B ON
		1 = 1
		AND B1_COD = cabProduto
	WHERE 
		1 = 1
		AND D_E_L_E_T_ = ''
		AND B1_TIPO IN ('PA', 'PP') 
		AND B1_XINTPCF <> ''

UNION ALL

	SELECT 
		rtrim(B1_COD) codigo,
		rtrim(B1_DESC) descricao,
		rtrim(B1_TIPO) tipo,
		rtrim(B1_UM) unidade,
		rtrim(B1_GRUPO) grupo,
		rtrim(B1_POSIPI) ncm,
		rtrim(B1_XTRANSF) retrabalho,
		rtrim(B1_XINDICA) mdo,
		isnull(cabRevisao, '000') revisao,
        rtrim(case when B1_MSBLQL = '1' then'Bloqueado' else 'Liberado' end) sit,
		isnull(situacao, 'Sem Epecificação') situacao
	FROM
		TMPRD..SB1040 A LEFT JOIN
		(
			select 
				* 
			from 
				PCP..qualEspecCab c inner join
				(
					select 
						cabProduto cabPrd, max(cabRevisao) mxRev
					from 
						PCP..qualEspecCab
					group by
						cabProduto
				)d on
				1 = 1
				and cabProduto = cabPrd
				and cabRevisao = mxRev		
		) B ON
		1 = 1
		AND B1_COD = cabProduto
	WHERE 
		1 = 1
		AND D_E_L_E_T_ = ''
		AND B1_TIPO IN ('PA', 'PP') 
		AND B1_XINTPCF <> ''

)PRODQ

GO
/****** Object:  View [dbo].[View_Portal_Cadastro_Produto_Qualidade_Lote]    Script Date: 21/01/2025 07:24:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE view [dbo].[View_Portal_Cadastro_Produto_Qualidade_Lote] as
-- View para os produtos que estão disponíveis para o PCF

SELECT DISTINCT 
	* 
FROM (
	SELECT 
		rtrim(B1_COD) produto,
		rtrim(B1_DESC) descricao,
		rtrim(B1_TIPO) tipo,
		rtrim(B1_UM) unidade,
		rtrim(B1_GRUPO) grupo,
		rtrim(B1_POSIPI) ncm,
		rtrim(B1_XTRANSF) retrabalho,
		rtrim(B1_XINDICA) mdo,
		isnull(revisao, '000') revisao,
		isnull(seq, '') seq,
		isnull(validade, 0) validade,
		case
			when isnull(ativo, '') = '' then ''
			else ativo
		end ativo,
		case
			when isnull(quebra, '') = '' then ''
			else quebra
		end quebra,
		isnull(qtde, 0) qtde,
		isnull(diaRevisao, '') diaRevisao,
		isnull(obs, '') obs,
        rtrim(case when B1_MSBLQL = '1' then'Bloqueado' else 'Liberado' end) sit
	FROM
		TMPRD..SB1010 A LEFT JOIN
		(
			select 
				produto, revisao, seq, validade, 
				ativo, quebra, qtde, diaRevisao, obs
			from 
				PCP..qualLote c inner join
				(
					select 
						produto cabPrd, max(revisao) mxRev
					from 
						PCP..qualLote
					group by
						produto
				)d on
				1 = 1
				and produto = cabPrd
				and revisao = mxRev		
		) B ON
		1 = 1
		AND B1_COD = produto
	WHERE 
		1 = 1
		AND D_E_L_E_T_ = ''
		AND B1_TIPO IN ('PA', 'PP') 
		AND B1_XINTPCF <> ''

UNION ALL

	SELECT 
		rtrim(B1_COD) produto,
		rtrim(B1_DESC) descricao,
		rtrim(B1_TIPO) tipo,
		rtrim(B1_UM) unidade,
		rtrim(B1_GRUPO) grupo,
		rtrim(B1_POSIPI) ncm,
		rtrim(B1_XTRANSF) retrabalho,
		rtrim(B1_XINDICA) mdo,
		isnull(revisao, '000') revisao,
		isnull(seq, '') seq,
		isnull(validade, 0) validade,
		case
			when isnull(ativo, '') = '' then ''
			else ativo
		end ativo,
		case
			when isnull(quebra, '') = '' then ''
			else quebra
		end quebra,
		isnull(qtde, 0) qtde,
		isnull(diaRevisao, '') diaRevisao,
		isnull(obs, '') obs,
        rtrim(case when B1_MSBLQL = '1' then'Bloqueado' else 'Liberado' end) sit
	FROM
		TMPRD..SB1020 A LEFT JOIN
		(
			select 
				produto, revisao, seq, validade, 
				ativo, quebra, qtde, diaRevisao, obs
			from 
				PCP..qualLote c inner join
				(
					select 
						produto cabPrd, max(revisao) mxRev
					from 
						PCP..qualLote
					group by
						produto
				)d on
				1 = 1
				and produto = cabPrd
				and revisao = mxRev		
		) B ON
		1 = 1
		AND B1_COD = produto
	WHERE 
		1 = 1
		AND D_E_L_E_T_ = ''
		AND B1_TIPO IN ('PA', 'PP') 
		AND B1_XINTPCF <> ''

UNION ALL

	SELECT 
		rtrim(B1_COD) produto,
		rtrim(B1_DESC) descricao,
		rtrim(B1_TIPO) tipo,
		rtrim(B1_UM) unidade,
		rtrim(B1_GRUPO) grupo,
		rtrim(B1_POSIPI) ncm,
		rtrim(B1_XTRANSF) retrabalho,
		rtrim(B1_XINDICA) mdo,
		isnull(revisao, '000') revisao,
		isnull(seq, '') seq,
		isnull(validade, 0) validade,
		case
			when isnull(ativo, '') = '' then ''
			else ativo
		end ativo,
		case
			when isnull(quebra, '') = '' then ''
			else quebra
		end quebra,
		isnull(qtde, 0) qtde,
		isnull(diaRevisao, '') diaRevisao,
		isnull(obs, '') obs,
        rtrim(case when B1_MSBLQL = '1' then'Bloqueado' else 'Liberado' end) sit
	FROM
		TMPRD..SB1040 A LEFT JOIN
		(
			select 
				produto, revisao, seq, validade, 
				ativo, quebra, qtde, diaRevisao, obs
			from 
				PCP..qualLote c inner join
				(
					select 
						produto cabPrd, max(revisao) mxRev
					from 
						PCP..qualLote
					group by
						produto
				)d on
				1 = 1
				and produto = cabPrd
				and revisao = mxRev		
		) B ON
		1 = 1
		AND B1_COD = produto
	WHERE 
		1 = 1
		AND D_E_L_E_T_ = ''
		AND B1_TIPO IN ('PA', 'PP') 
		AND B1_XINTPCF <> ''


)PRODQLOTE


GO
/****** Object:  View [dbo].[View_Portal_Cadastro_Recursos]    Script Date: 21/01/2025 07:24:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE View [dbo].[View_Portal_Cadastro_Recursos] as
SELECT DISTINCT * FROM (
SELECT 
	rtrim(H1_FILIAL) filial, 
	rtrim(H1_CODIGO) codigo, 
	rtrim(H1_DESCRI) descricao, 
	rtrim(H1_CCUSTO) custo, 
	rtrim(H1_CTRAB) setor, 
	rtrim(H1_CALEND) calendario
FROM 
	TMPRD..SH1010 
WHERE
	1 = 1
	AND R_E_C_D_E_L_ = 0
UNION ALL



SELECT 
	rtrim(H1_FILIAL) filial, 
	rtrim(H1_CODIGO) codigo, 
	rtrim(H1_DESCRI) descricao, 
	rtrim(H1_CCUSTO) custo, 
	rtrim(H1_CTRAB) setor, 
	rtrim(H1_CALEND) calendario
FROM 
	TMPRD..SH1020 
WHERE
	1 = 1
	AND R_E_C_D_E_L_ = 0
UNION ALL



SELECT 
	rtrim(H1_FILIAL) filial, 
	rtrim(H1_CODIGO) codigo, 
	rtrim(H1_DESCRI) descricao, 
	rtrim(H1_CCUSTO) custo, 
	rtrim(H1_CTRAB) setor, 
	rtrim(H1_CALEND) calendario
FROM 
	TMPRD..SH1040 
WHERE
	1 = 1
	AND R_E_C_D_E_L_ = 0
)RECURSOS
GO
/****** Object:  View [dbo].[View_Portal_Calcula_Empenho]    Script Date: 21/01/2025 07:24:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

Create View [dbo].[View_Portal_Calcula_Empenho] as

SELECT DISTINCT 
	* 
FROM 
(
	SELECT 
		G1_FILIAL, G1_COD, G1_COMP, G1_QUANT, G1_PERDA, B1_QB
	FROM 
		TMPRD..SG1010 A WITH (NOLOCK) INNER JOIN
		TMPRD..SB1010 B WITH (NOLOCK) ON
		G1_COD = B1_COD
	WHERE
		1 = 1
		AND A.R_E_C_D_E_L_ = 0
		AND B.R_E_C_D_E_L_ = 0
	UNION ALL
	SELECT 
		G1_FILIAL, G1_COD, G1_COMP, G1_QUANT, G1_PERDA, B1_QB
	FROM 
		TMPRD..SG1020 A WITH (NOLOCK) INNER JOIN
		TMPRD..SB1020 B WITH (NOLOCK) ON
		G1_COD = B1_COD
	WHERE
		1 = 1
		AND A.R_E_C_D_E_L_ = 0
		AND B.R_E_C_D_E_L_ = 0
	UNION ALL
	SELECT 
		G1_FILIAL, G1_COD, G1_COMP, G1_QUANT, G1_PERDA, B1_QB
	FROM 
		TMPRD..SG1040 A WITH (NOLOCK) INNER JOIN
		TMPRD..SB1040 B WITH (NOLOCK) ON
		G1_COD = B1_COD
	WHERE
		1 = 1
		AND A.R_E_C_D_E_L_ = 0
		AND B.R_E_C_D_E_L_ = 0
)calcEMPENHO
GO
/****** Object:  View [dbo].[View_Portal_Empresa]    Script Date: 21/01/2025 07:24:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



CREATE view [dbo].[View_Portal_Empresa] as

	SELECT	
		M0_CODIGO AS 'codEmp', 
		M0_CODFIL AS 'codFil', 
		M0_FILIAL AS 'nomeFil', 
		M0_NOMECOM AS 'nomeComercial',
		M0_CGC AS 'CNPJ',
		M0_INSC AS 'IE',
		M0_ENDENT AS 'Endereco',
		M0_CIDENT as 'Cidade',
		M0_ESTENT as 'Estado'
	FROM 
		TMPRD..SYS_COMPANY WITH(NOLOCK)
	WHERE 
		D_E_L_E_T_ = ''


GO
/****** Object:  View [dbo].[View_Portal_Estrutura]    Script Date: 21/01/2025 07:24:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE VIEW [dbo].[View_Portal_Estrutura] as
WITH 
	ESTRUTURA010( 
		FILIAL, CODIGO, COD_PAI, COD_COMP, 
		QTD, PERDA, DT_INI, DT_FIM, NIVEL 
		) AS 
( 
	SELECT 
		G1_FILIAL, G1_COD PAI, G1_COD, G1_COMP, 
		G1_QUANT, G1_PERDA, G1_INI, 
		G1_FIM, 1 AS NIVEL 
	FROM 
		TMPRD..SG1010 A (NOLOCK) 
	WHERE 
		D_E_L_E_T_ = ''

	UNION ALL 

	SELECT 
		G1_FILIAL, CODIGO, G1_COD, G1_COMP, QTD * G1_QUANT, G1_PERDA, G1_INI, G1_FIM, NIVEL + 1 
	FROM 
		TMPRD..SG1010 A WITH (NOLOCK) INNER JOIN 
		ESTRUTURA010 B ON 
		G1_COD = COD_COMP 
	WHERE 
		1 = 1
		AND D_E_L_E_T_ = '' 
),
ESTRUTURA020( 
		FILIAL, CODIGO, COD_PAI, COD_COMP, 
		QTD, PERDA, DT_INI, DT_FIM, NIVEL 
		) AS 
( 
	SELECT 
		G1_FILIAL, G1_COD PAI, G1_COD, G1_COMP, 
		G1_QUANT, G1_PERDA, G1_INI, 
		G1_FIM, 1 AS NIVEL 
	FROM 
		TMPRD..SG1020 A (NOLOCK) 
	WHERE 
		D_E_L_E_T_ = ''

	UNION ALL 

	SELECT 
		G1_FILIAL, CODIGO, G1_COD, G1_COMP, QTD * G1_QUANT, G1_PERDA, G1_INI, G1_FIM, NIVEL + 1 
	FROM 
		TMPRD..SG1020 A WITH (NOLOCK) INNER JOIN 
		ESTRUTURA020 B ON 
		G1_COD = COD_COMP 
	WHERE 
		1 = 1
		AND D_E_L_E_T_ = '' 
),
ESTRUTURA040( 
		FILIAL, CODIGO, COD_PAI, COD_COMP, 
		QTD, PERDA, DT_INI, DT_FIM, NIVEL 
		) AS 
( 
	SELECT 
		G1_FILIAL, G1_COD PAI, G1_COD, G1_COMP, 
		G1_QUANT, G1_PERDA, G1_INI, 
		G1_FIM, 1 AS NIVEL 
	FROM 
		TMPRD..SG1040 A (NOLOCK) 
	WHERE 
		D_E_L_E_T_ = ''

	UNION ALL 

	SELECT 
		G1_FILIAL, CODIGO, G1_COD, G1_COMP, QTD * G1_QUANT, G1_PERDA, G1_INI, G1_FIM, NIVEL + 1 
	FROM 
		TMPRD..SG1040 A WITH (NOLOCK) INNER JOIN 
		ESTRUTURA040 B ON 
		G1_COD = COD_COMP 
	WHERE 
		1 = 1
		AND D_E_L_E_T_ = '' 
)
SELECT DISTINCT * FROM (
SELECT 
	rtrim(FILIAL) filial, 
	rtrim(CODIGO) codigo, 
	rtrim(B.B1_DESC) descCodigo, 
	rtrim(B.B1_TIPO) tipo, 
	rtrim(COD_PAI) codPai, 
	rtrim(C.B1_DESC) descPai , 
	rtrim(C.B1_TIPO) tipoPai, 
	rtrim(COD_COMP) codComp, 
	rtrim(D.B1_DESC) descComp, 
	rtrim(D.B1_TIPO) tipoComp, 
	rtrim(C.B1_QB) basePai, 
	QTD qtde, 
	PERDA perda, 
	rtrim(D.B1_UM) unidadeComp, 
	DT_INI dtIni, 
	DT_FIM dtFim, 
	NIVEL nivel      
FROM 
	ESTRUTURA010 A INNER JOIN 
	TMPRD..SB1010 B WITH (NOLOCK) ON 
	1 = 1
	AND B.D_E_L_E_T_ = '' 
	AND B.B1_COD = A.CODIGO INNER JOIN 
	TMPRD..SB1010 C WITH (NOLOCK) ON 
	1 = 1
	AND C.D_E_L_E_T_ = '' 
	AND C.B1_COD = COD_PAI INNER JOIN 
	TMPRD..SB1010 D WITH (NOLOCK) ON 
	1 = 1
	AND D.D_E_L_E_T_ = '' 
	AND D.B1_COD = COD_COMP 
UNION ALL
SELECT 
	rtrim(FILIAL) filial, 
	rtrim(CODIGO) codigo, 
	rtrim(B.B1_DESC) descCodigo, 
	rtrim(B.B1_TIPO) tipo, 
	rtrim(COD_PAI) codPai, 
	rtrim(C.B1_DESC) descPai , 
	rtrim(C.B1_TIPO) tipoPai, 
	rtrim(COD_COMP) codComp, 
	rtrim(D.B1_DESC) descComp, 
	rtrim(D.B1_TIPO) tipoComp, 
	rtrim(C.B1_QB) basePai, 
	QTD qtde, 
	PERDA perda, 
	rtrim(D.B1_UM) unidadeComp, 
	DT_INI dtIni, 
	DT_FIM dtFim, 
	NIVEL nivel      
FROM 
	ESTRUTURA020 A INNER JOIN 
	TMPRD..SB1020 B WITH (NOLOCK) ON 
	1 = 1
	AND B.D_E_L_E_T_ = '' 
	AND B.B1_COD = A.CODIGO INNER JOIN 
	TMPRD..SB1020 C WITH (NOLOCK) ON 
	1 = 1
	AND C.D_E_L_E_T_ = '' 
	AND C.B1_COD = COD_PAI INNER JOIN 
	TMPRD..SB1020 D WITH (NOLOCK) ON 
	1 = 1
	AND D.D_E_L_E_T_ = '' 
	AND D.B1_COD = COD_COMP 
	UNION ALL
SELECT 
	rtrim(FILIAL) filial, 
	rtrim(CODIGO) codigo, 
	rtrim(B.B1_DESC) descCodigo, 
	rtrim(B.B1_TIPO) tipo, 
	rtrim(COD_PAI) codPai, 
	rtrim(C.B1_DESC) descPai , 
	rtrim(C.B1_TIPO) tipoPai, 
	rtrim(COD_COMP) codComp, 
	rtrim(D.B1_DESC) descComp, 
	rtrim(D.B1_TIPO) tipoComp, 
	rtrim(C.B1_QB) basePai, 
	QTD qtde, 
	PERDA perda, 
	rtrim(D.B1_UM) unidadeComp, 
	DT_INI dtIni, 
	DT_FIM dtFim, 
	NIVEL nivel      
FROM 
	ESTRUTURA040 A INNER JOIN 
	TMPRD..SB1040 B WITH (NOLOCK) ON 
	1 = 1
	AND B.D_E_L_E_T_ = '' 
	AND B.B1_COD = A.CODIGO INNER JOIN 
	TMPRD..SB1040 C WITH (NOLOCK) ON 
	1 = 1
	AND C.D_E_L_E_T_ = '' 
	AND C.B1_COD = COD_PAI INNER JOIN 
	TMPRD..SB1040 D WITH (NOLOCK) ON 
	1 = 1
	AND D.D_E_L_E_T_ = '' 
	AND D.B1_COD = COD_COMP 
)EST
GO
/****** Object:  View [dbo].[View_Portal_OP]    Script Date: 21/01/2025 07:24:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE VIEW [dbo].[View_Portal_OP] as

--select OP, FINAL, DTFIM, TESTE, * from (
SELECT 
	RTRIM(C2_FILIAL) FILIAL,
	RTRIM(C2_NUM)+RTRIM(C2_ITEM)+RTRIM(C2_SEQUEN) OP, 
	CONVERT(VARCHAR(10), CAST(C2_EMISSAO AS DATETIME), 103) EMISSAO, 
	/*
	CASE 
		WHEN C2_DATRF = '' 
		THEN '' 
		ELSE CONVERT(VARCHAR(10), CAST(C2_DATRF AS DATETIME), 103) 
	END FINAL, 
	*/
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
	TMPRD..SC2010 A WITH (NOLOCK) INNER JOIN
	TMPRD..SB1010 B WITH (NOLOCK) ON
	C2_PRODUTO = B.B1_COD INNER JOIN
	TMPRD..SD4010 C WITH (NOLOCK) ON
	C2_NUM+C2_ITEM+C2_SEQUEN = D4_OP AND
	C2_FILIAL = D4_FILIAL INNER JOIN
	TMPRD..SB1010 D WITH (NOLOCK) ON
	D4_COD = D.B1_COD LEFT JOIN
	--SELECT * FROM 
	TMPRD..SB2010 E WITH (NOLOCK) ON
	1 = 1
	AND D4_FILIAL = B2_FILIAL
	AND D4_COD = B2_COD
	AND E.R_E_C_D_E_L_ = 0
	AND B2_LOCAL = '01' LEFT JOIN
	(
		SELECT 
			H6_OP OP, MAX(H6_DTAPONT) DTFIM 
		FROM 
			TMPRD..SH6010  WITH (NOLOCK) 
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

	UNION ALL

SELECT 
	RTRIM(C2_FILIAL) FILIAL,
	RTRIM(C2_NUM)+RTRIM(C2_ITEM)+RTRIM(C2_SEQUEN) OP, 
	CONVERT(VARCHAR(10), CAST(C2_EMISSAO AS DATETIME), 103) EMISSAO, 
	/*
	CASE 
		WHEN C2_DATRF = '' 
		THEN '' 
		ELSE CONVERT(VARCHAR(10), CAST(C2_DATRF AS DATETIME), 103) 
	END FINAL, 
	*/
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
	TMPRD..SC2020 A WITH (NOLOCK) INNER JOIN
	TMPRD..SB1020 B WITH (NOLOCK) ON
	C2_PRODUTO = B.B1_COD INNER JOIN
	TMPRD..SD4020 C WITH (NOLOCK) ON
	C2_NUM+C2_ITEM+C2_SEQUEN = D4_OP AND
	C2_FILIAL = D4_FILIAL INNER JOIN
	TMPRD..SB1020 D WITH (NOLOCK) ON
	D4_COD = D.B1_COD LEFT JOIN
	--SELECT * FROM 
	TMPRD..SB2020 E WITH (NOLOCK) ON
	1 = 1
	AND D4_FILIAL = B2_FILIAL
	AND D4_COD = B2_COD
	AND E.R_E_C_D_E_L_ = 0
	AND B2_LOCAL = '01' LEFT JOIN
	(
		SELECT 
			H6_OP OP, MAX(H6_DTAPONT) DTFIM 
		FROM 
			TMPRD..SH6020  WITH (NOLOCK) 
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
UNION ALL

SELECT 
	RTRIM(C2_FILIAL) FILIAL,
	RTRIM(C2_NUM)+RTRIM(C2_ITEM)+RTRIM(C2_SEQUEN) OP, 
	CONVERT(VARCHAR(10), CAST(C2_EMISSAO AS DATETIME), 103) EMISSAO, 
	/*
	CASE 
		WHEN C2_DATRF = '' 
		THEN '' 
		ELSE CONVERT(VARCHAR(10), CAST(C2_DATRF AS DATETIME), 103) 
	END FINAL, 
	*/
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
	TMPRD..SC2040 A WITH (NOLOCK) INNER JOIN
	TMPRD..SB1040 B WITH (NOLOCK) ON
	C2_PRODUTO = B.B1_COD INNER JOIN
	TMPRD..SD4040 C WITH (NOLOCK) ON
	C2_NUM+C2_ITEM+C2_SEQUEN = D4_OP AND
	C2_FILIAL = D4_FILIAL INNER JOIN
	TMPRD..SB1040 D WITH (NOLOCK) ON
	D4_COD = D.B1_COD LEFT JOIN
	--SELECT * FROM 
	TMPRD..SB2040 E WITH (NOLOCK) ON
	1 = 1
	AND D4_FILIAL = B2_FILIAL
	AND D4_COD = B2_COD
	AND E.R_E_C_D_E_L_ = 0
	AND B2_LOCAL = '01' LEFT JOIN
	(
		SELECT 
			H6_OP OP, MAX(H6_DTAPONT) DTFIM 
		FROM 
			TMPRD..SH6040  WITH (NOLOCK) 
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

--) m  where FINAL <> '' AND DTFIM <> '' ORDER BY 2
GO
/****** Object:  View [dbo].[View_Portal_OP_Config]    Script Date: 21/01/2025 07:24:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE VIEW [dbo].[View_Portal_OP_Config] as


SELECT 
	RTRIM(C2_FILIAL) FILIAL, 
	RTRIM(C2_NUM)+RTRIM(C2_ITEM)+RTRIM(C2_SEQUEN) OP, 
	CONVERT(VARCHAR(10), CAST(C2_EMISSAO AS DATETIME), 103) EMISSAO, 
	CASE 
		WHEN C2_DATRF = '' 
		THEN '' 
		ELSE CONVERT(VARCHAR(10), CAST(C2_DATRF AS DATETIME), 103) 
	END FINAL, 
	C2_QUANT QTDE, 
	C2_QUJE ENTREGUE, 
	RTRIM(B.B1_COD) PRODUTO, 
	RTRIM(B.B1_CODANT) CODANT,
	RTRIM(B.B1_DESC) DESCRICAO, 
	RTRIM(D4_LOCAL) ARMAZEM, 
	RTRIM(D4_COD) COMPONENTE, 
	RTRIM(D.B1_DESC) DESCRIC, 
	D4_QTDEORI QTDEORI, 
	0 QTDEPCF, 
	0 QTDECAL, 
	0 SALDO, 
	RTRIM(D4_ROTEIRO) ROTEIRO, 
	RTRIM(D4_OPERAC) OPERACAO, 
	RTRIM(D.B1_UM) UNIDADE,
	'E' TIPO,
	'W' SITUACA
	--INTO PCP..OP
	--TRUNCATE TABLE PCP..OP
	--DROP TABLE PCP..OP
FROM 
	TMPRD..SC2010 A WITH (NOLOCK) INNER JOIN
	TMPRD..SB1010 B WITH (NOLOCK) ON
	C2_PRODUTO = B.B1_COD INNER JOIN
	TMPRD..SD4010 C WITH (NOLOCK) ON
	C2_NUM+C2_ITEM+C2_SEQUEN = D4_OP AND
	C2_FILIAL = D4_FILIAL INNER JOIN
	TMPRD..SB1010 D WITH (NOLOCK) ON
	D4_COD = D.B1_COD
WHERE
	1 = 1
	AND A.R_E_C_D_E_L_ = 0
	AND B.R_E_C_D_E_L_ = 0
	AND C.R_E_C_D_E_L_ = 0
	AND D.R_E_C_D_E_L_ = 0

UNION ALL

SELECT 
	RTRIM(C2_FILIAL) FILIAL, 
	RTRIM(C2_NUM)+RTRIM(C2_ITEM)+RTRIM(C2_SEQUEN) OP, 
	CONVERT(VARCHAR(10), CAST(C2_EMISSAO AS DATETIME), 103) EMISSAO, 
	CASE 
		WHEN C2_DATRF = '' 
		THEN '' 
		ELSE CONVERT(VARCHAR(10), CAST(C2_DATRF AS DATETIME), 103) 
	END FINAL, 
	C2_QUANT QTDE, 
	C2_QUJE ENTREGUE, 
	RTRIM(B.B1_COD) PRODUTO, 
	RTRIM(B.B1_CODANT) CODANT,
	RTRIM(B.B1_DESC) DESCRICAO, 
	RTRIM(D4_LOCAL) ARMAZEM, 
	RTRIM(D4_COD) COMPONENTE, 
	RTRIM(D.B1_DESC) DESCRIC, 
	D4_QTDEORI QTDEORI, 
	0 QTDEPCF, 
	0 QTDECAL, 
	0 SALDO, 
	RTRIM(D4_ROTEIRO) ROTEIRO, 
	RTRIM(D4_OPERAC) OPERACAO, 
	RTRIM(D.B1_UM) UNIDADE,
	'E' TIPO,
	'W' SITUACA
	--INTO PCP..OP
	--TRUNCATE TABLE PCP..OP
	--DROP TABLE PCP..OP
FROM 
	TMPRD..SC2020 A WITH (NOLOCK) INNER JOIN
	TMPRD..SB1020 B WITH (NOLOCK) ON
	C2_PRODUTO = B.B1_COD INNER JOIN
	TMPRD..SD4020 C WITH (NOLOCK) ON
	C2_NUM+C2_ITEM+C2_SEQUEN = D4_OP AND
	C2_FILIAL = D4_FILIAL INNER JOIN
	TMPRD..SB1020 D WITH (NOLOCK) ON
	D4_COD = D.B1_COD
WHERE
	1 = 1
	AND A.R_E_C_D_E_L_ = 0
	AND B.R_E_C_D_E_L_ = 0
	AND C.R_E_C_D_E_L_ = 0
	AND D.R_E_C_D_E_L_ = 0

UNION ALL

SELECT 
	RTRIM(C2_FILIAL) FILIAL, 
	RTRIM(C2_NUM)+RTRIM(C2_ITEM)+RTRIM(C2_SEQUEN) OP, 
	CONVERT(VARCHAR(10), CAST(C2_EMISSAO AS DATETIME), 103) EMISSAO, 
	CASE 
		WHEN C2_DATRF = '' 
		THEN '' 
		ELSE CONVERT(VARCHAR(10), CAST(C2_DATRF AS DATETIME), 103) 
	END FINAL, 
	C2_QUANT QTDE, 
	C2_QUJE ENTREGUE, 
	RTRIM(B.B1_COD) PRODUTO, 
	RTRIM(B.B1_CODANT) CODANT,
	RTRIM(B.B1_DESC) DESCRICAO, 
	RTRIM(D4_LOCAL) ARMAZEM, 
	RTRIM(D4_COD) COMPONENTE, 
	RTRIM(D.B1_DESC) DESCRIC, 
	D4_QTDEORI QTDEORI, 
	0 QTDEPCF, 
	0 QTDECAL, 
	0 SALDO, 
	RTRIM(D4_ROTEIRO) ROTEIRO, 
	RTRIM(D4_OPERAC) OPERACAO, 
	RTRIM(D.B1_UM) UNIDADE,
	'E' TIPO,
	'W' SITUACA
	--INTO PCP..OP
	--TRUNCATE TABLE PCP..OP
	--DROP TABLE PCP..OP
FROM 
	TMPRD..SC2040 A WITH (NOLOCK) INNER JOIN
	TMPRD..SB1040 B WITH (NOLOCK) ON
	C2_PRODUTO = B.B1_COD INNER JOIN
	TMPRD..SD4040 C WITH (NOLOCK) ON
	C2_NUM+C2_ITEM+C2_SEQUEN = D4_OP AND
	C2_FILIAL = D4_FILIAL INNER JOIN
	TMPRD..SB1040 D WITH (NOLOCK) ON
	D4_COD = D.B1_COD
WHERE
	1 = 1
	AND A.R_E_C_D_E_L_ = 0
	AND B.R_E_C_D_E_L_ = 0
	AND C.R_E_C_D_E_L_ = 0
	AND D.R_E_C_D_E_L_ = 0


GO
/****** Object:  View [dbo].[View_Portal_Op_Transf]    Script Date: 21/01/2025 07:24:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE VIEW [dbo].[View_Portal_Op_Transf] as
SELECT * FROM (
SELECT 
	'010' EMPRESA, RTRIM(FILIAL) FILIAL, 
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
	PCP..OP A WITH (NOLOCK) INNER JOIN
	TMPRD..SB2010 B WITH (NOLOCK) ON
	1 = 1
	AND FILIAL = B2_FILIAL
	AND COMPONENTE = B2_COD
	AND B.R_E_C_D_E_L_ = 0
	AND B2_LOCAL = '01' INNER JOIN
	TMPRD..SB1010 C WITH (NOLOCK) ON
	1 = 1
	AND PRODUTO = B1_COD
	AND C.R_E_C_D_E_L_ = 0

UNION ALL

SELECT 
	'020' EMPRESA, RTRIM(FILIAL) FILIAL, 
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
	PCP..OP A WITH (NOLOCK) INNER JOIN
	TMPRD..SB2020 B WITH (NOLOCK) ON
	1 = 1
	AND FILIAL = B2_FILIAL
	AND COMPONENTE = B2_COD
	AND B.R_E_C_D_E_L_ = 0
	AND B2_LOCAL = '01' INNER JOIN
	TMPRD..SB1020 C WITH (NOLOCK) ON
	1 = 1
	AND PRODUTO = B1_COD
	AND C.R_E_C_D_E_L_ = 0

UNION ALL

SELECT 
	'040' EMPRESA, RTRIM(FILIAL) FILIAL, 
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
	PCP..OP A WITH (NOLOCK) INNER JOIN
	TMPRD..SB2040 B WITH (NOLOCK) ON
	1 = 1
	AND FILIAL = B2_FILIAL
	AND COMPONENTE = B2_COD
	AND B.R_E_C_D_E_L_ = 0
	AND B2_LOCAL = '01' INNER JOIN
	TMPRD..SB1040 C WITH (NOLOCK) ON
	1 = 1
	AND PRODUTO = B1_COD
	AND C.R_E_C_D_E_L_ = 0
)p

GO
/****** Object:  View [dbo].[View_Portal_Saldo_Estoque]    Script Date: 21/01/2025 07:24:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE View [dbo].[View_Portal_Saldo_Estoque] as
SELECT DISTINCT * FROM (
SELECT 
	rtrim(B2_FILIAL) filial, 
	rtrim(B2_COD) codigo, 
	rtrim(B1_DESC) descricao, 
	rtrim(B2_LOCAL) armazem, 
	B2_QATU saldo, 
	B2_CMFF1 cm, 
	B2_QEMP empenhado
FROM 
	TOTVS_MIGRACAO..SB2010 A INNER JOIN
	TOTVS_MIGRACAO..SB1010 B ON
	B2_COD = B1_COD
WHERE
	1 = 1
	AND B1_TIPO IN ('PA', 'MP', 'EM', 'MO')
	AND A.R_E_C_D_E_L_ = 0
	AND B.R_E_C_D_E_L_ = 0

UNION ALL

SELECT 
	rtrim(B2_FILIAL) filial, 
	rtrim(B2_COD) codigo, 
	rtrim(B1_DESC) descricao, 
	rtrim(B2_LOCAL) armazem, 
	B2_QATU saldo, 
	B2_CMFF1 cm, 
	B2_QEMP empenhado
FROM 
	TOTVS_MIGRACAO..SB2020 A INNER JOIN
	TOTVS_MIGRACAO..SB1020 B ON
	B2_COD = B1_COD
WHERE
	1 = 1
	AND B1_TIPO IN ('PA', 'MP', 'EM', 'MO')
	AND A.R_E_C_D_E_L_ = 0
	AND B.R_E_C_D_E_L_ = 0

UNION ALL

SELECT 
	rtrim(B2_FILIAL) filial, 
	rtrim(B2_COD) codigo, 
	rtrim(B1_DESC) descricao, 
	rtrim(B2_LOCAL) armazem, 
	B2_QATU saldo, 
	B2_CMFF1 cm, 
	B2_QEMP empenhado
FROM 
	TOTVS_MIGRACAO..SB2040 A INNER JOIN
	TOTVS_MIGRACAO..SB1040 B ON
	B2_COD = B1_COD
WHERE
	1 = 1
	AND B1_TIPO IN ('PA', 'MP', 'EM', 'MO')
	AND A.R_E_C_D_E_L_ = 0
	AND B.R_E_C_D_E_L_ = 0
)ESTOQUE
GO
/****** Object:  View [dbo].[View_Relacao_Espec_Hist]    Script Date: 21/01/2025 07:24:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE view [dbo].[View_Relacao_Espec_Hist] as
SELECT
    idEspecItens, cabProduto, descrProd, cabRevisao, dataAprov, numEspec,
    situacao, qualObsGeral, qualObsRevisao,
    aplicacao, embalagem, isnull(nome, '') feitoPor, aprovPor,
    isnull(iteProduto, '') iteProduto, isnull(iteRevisao, '') iteRevisao,
    isnull(iteCarac, '') iteCarac, isnull(iteMin, '') iteMin,
    isnull(iteMax, '') iteMax, isnull(iteMeio, '') iteMeio, 
	isnull(descCarac, '') descCarac, isnull(iteLaudo, '') iteLaudo
FROM
    PCP..qualEspecCab a left join
    PCP..qualEspecItens c on
    1 = 1
    and cabProduto = iteProduto
    and cabRevisao = iteRevisao left join
    PCP..qualCarac d on
    1 = 1
    and iteCarac = codCarac left join
	PCP..usuarios e on
	a.feitoPor = e.codigo
GO
/****** Object:  View [dbo].[View_Relacao_Lote_Adianta]    Script Date: 21/01/2025 07:24:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE view [dbo].[View_Relacao_Lote_Adianta] as
select 
	*
from 
	PCP..loteProd
GO
/****** Object:  View [dbo].[View_Relacao_Lote_Detalhe]    Script Date: 21/01/2025 07:24:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE VIEW [dbo].[View_Relacao_Lote_Detalhe] AS
    select
       	convert(varchar(10), dtime, 103) + ' ' +convert(varchar(08), dtime, 108) aponta,
		id_num id_loteProd, filial, op, 
		produto, 
		isnull(lote, '') lote, 
		isnull(analise, '') analise, 
        descrProd descricao,
		isnull(intervalo, '') intervalo, 
		isnull(loteAprov,'') loteAprov, 
		isnull(dtAprovn1, '')dtAprovn1, 
		isnull(dtAprovn2, '')dtAprovn2, 
		isnull(dtAprovn3, '')dtAprovn3,
		isnull(usrAprovn1, 0)usrAprovn1, 
		isnull(usrAprovn2, 0)usrAprovn2, 
		isnull(usrAprovn3, 0)usrAprovn3,
		justificativa1, justificativa2, justificativa3, 
		isnull(dtVenc, '')dtVenc, 
		isnull(qtde, 0) qtdeLote, 
		isnull(a.situacao, '') situacao, 
		especAlcada alcadaProd
	from
		oppcfLote a inner JOIN
		qualEspecCab b ON
	    a.produto = b.cabProduto COLLATE Latin1_General_BIN
	where
		1 = 1
		and lote >= '000000001'
		and FlgDeleted = 0
		and b.situacao <> 'Encerrada'
GO
/****** Object:  View [dbo].[View_Relacao_Lote_Registro]    Script Date: 21/01/2025 07:24:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE view [dbo].[View_Relacao_Lote_Registro] as

select
	max(id_loteProd) id_loteRegProd,
	filial, produto, lote, analise, 
	descricao, dt1, dt2, dt3, 
	case 
		when loteAprov = ''
		then 'Andamento'
		else loteAprov
	end loteAprov,  
	usrAprovn1,usrAprovn2,usrAprovn3,
	dtAprovn1,dtAprovn2,dtAprovn3,
	sum(qtdeLote) qtdeLote,
	sum(qtdeProd) qtdeProd,
	situacao,  
	max(loteEnv) loteEnv,
	alcadaProd
from
	(
	select
		case when dtAprovn1 = ' ' then ' ' else convert(varchar(8), cast(dtAprovn1 as datetime), 3) + '-' + tipoAprova1 end dt1,
		case when dtAprovn2 = ' ' then ' ' else convert(varchar(8), cast(dtAprovn2 as datetime), 3) + '-' + tipoAprova2 end dt2,
		case when dtAprovn3 = ' ' then ' ' else convert(varchar(8), cast(dtAprovn3 as datetime), 3) + '-' + tipoAprova3 end dt3,
		id_num id_loteProd, filial, 
		produto, intervalo,
		isnull(lote, '') lote, 
		isnull(analise, '') analise, descrProd descricao,
		isnull(loteAprov,'') loteAprov, 
		isnull(dtAprovn1, '')dtAprovn1, 
		isnull(dtAprovn2, '')dtAprovn2, 
		isnull(dtAprovn3, '')dtAprovn3,
		isnull(usrAprovn1, 0)usrAprovn1, 
		isnull(usrAprovn2, 0)usrAprovn2, 
		isnull(usrAprovn3, 0)usrAprovn3, 
		isnull(dtVenc, '')dtVenc, 
		isnull(qtde, 0) qtdeLote, 
		isnull(qtdeProd, 0) qtdeProd, 
		isnull(a.situacao, '') situacao, 
		isnull(a.loteEnv, '') loteEnv, 
		especAlcada alcadaProd
	from
		oppcfLote a inner JOIN
		qualEspecCab b ON
		a.produto = b.cabProduto COLLATE Latin1_General_BIN
	where
		1 = 1
		and lote >= '000000001'
        and isnull(qtde, 0) > 0
		and b.situacao <> 'Encerrada'
)x
group by
	filial, produto, lote, analise, 
	descricao, loteAprov, dt1, dt2, dt3,  
	usrAprovn1, usrAprovn2, usrAprovn3,
	dtAprovn1, dtAprovn2, dtAprovn3, 
	situacao, alcadaProd
GO
/****** Object:  View [dbo].[View_Relacao_Produto_Lote]    Script Date: 21/01/2025 07:24:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE view [dbo].[View_Relacao_Produto_Lote] as

select 
	id_lote, produto, descricao, lote, diaRevisao, hrRevisao, validade, qtde, seq, quebra, revisao, ativo, obs, nivel, usuario
from 
	qualLote
GO
/****** Object:  View [dbo].[View_ajusta_OP]    Script Date: 21/01/2025 07:24:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



CREATE view [dbo].[View_ajusta_OP] as

SELECT DISTINCT 
	* 
FROM (
	SELECT 
		G1_FILIAL FILIAL, 
		G1_COD PRODUTO, 
		B.B1_DESC DESCPRO, 
		G1_COMP COMPONENTE, 
		C.B1_DESC DESCCOMP, 
		G1_QUANT QTDE,  
		B.B1_QB BASE, 
		C.B1_TIPO TIPO, 
		C.B1_UM UNIDADE
	FROM 
		TMPRD..SG1010 A WITH (NOLOCK) INNER JOIN
		TMPRD..SB1010 B WITH (NOLOCK) ON
		1 = 1
		AND G1_COD = B.B1_COD INNER JOIN
		TMPRD..SB1010 C WITH (NOLOCK) ON
		1 = 1
		AND G1_COMP = C.B1_COD 
	WHERE
		1 = 1
		AND G1_MSBLQL <> '1'
		AND B.B1_QB > 0
		AND A.R_E_C_D_E_L_ = 0
		AND B.R_E_C_D_E_L_ = 0
		AND C.R_E_C_D_E_L_ = 0

UNION ALL

	SELECT 
		G1_FILIAL FILIAL, 
		G1_COD PRODUTO, 
		B.B1_DESC DESCPRO, 
		G1_COMP COMPONENTE, 
		C.B1_DESC DESCCOMP, 
		G1_QUANT QTDE,  
		B.B1_QB BASE, 
		C.B1_TIPO TIPO, 
		C.B1_UM UNIDADE
	FROM 
		TMPRD..SG1020 A WITH (NOLOCK) INNER JOIN
		TMPRD..SB1020 B WITH (NOLOCK) ON
		1 = 1
		AND G1_COD = B.B1_COD INNER JOIN
		TMPRD..SB1020 C WITH (NOLOCK) ON
		1 = 1
		AND G1_COMP = C.B1_COD 
	WHERE
		1 = 1
		AND G1_MSBLQL <> '1'
		AND B.B1_QB > 0
		AND A.R_E_C_D_E_L_ = 0
		AND B.R_E_C_D_E_L_ = 0
		AND C.R_E_C_D_E_L_ = 0

UNION ALL

	SELECT 
		G1_FILIAL FILIAL, 
		G1_COD PRODUTO, 
		B.B1_DESC DESCPRO, 
		G1_COMP COMPONENTE, 
		C.B1_DESC DESCCOMP, 
		G1_QUANT QTDE,  
		B.B1_QB BASE, 
		C.B1_TIPO TIPO, 
		C.B1_UM UNIDADE
	FROM 
		TMPRD..SG1040 A WITH (NOLOCK) INNER JOIN
		TMPRD..SB1040 B WITH (NOLOCK) ON
		1 = 1
		AND G1_COD = B.B1_COD INNER JOIN
		TMPRD..SB1040 C WITH (NOLOCK) ON
		1 = 1
		AND G1_COMP = C.B1_COD 
	WHERE
		1 = 1
		AND G1_MSBLQL <> '1'
		AND B.B1_QB > 0
		AND A.R_E_C_D_E_L_ = 0
		AND B.R_E_C_D_E_L_ = 0
		AND C.R_E_C_D_E_L_ = 0

)AJUSTAOP

GO
/****** Object:  View [dbo].[vw_pcp_caracteristica]    Script Date: 21/01/2025 07:24:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE view [dbo].[vw_pcp_caracteristica] as

SELECT
    idEspecCab, idEspecItens, cabProduto, descrProd, 
    especAlcada, especQuebra, cabQtdeQuebra, iteCarac, codCarac, rtrim(descCarac) descCarac, 
    iteMin, iteMax, iteMeio, iteTxt, cabRevisao, situacao
FROM 
    PCP..qualEspecCab a inner join 
    PCP..qualEspecItens b on 
    1 = 1
    and a.cabProduto = b.iteProduto 
    and a.cabRevisao = b.iteRevisao inner join
	PCP..qualCarac c on
	1 = 1
	and iteCarac = codCarac
WHERE
    situacao = 'Concluida'
    --and cabProduto = 'PAN01061'
GO
/****** Object:  View [dbo].[vw_pcp_historico_revisoes]    Script Date: 21/01/2025 07:24:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE VIEW [dbo].[vw_pcp_historico_revisoes] as
SELECT 
    cabProduto, descrProd, cabRevisao, 
    dataAprov, numEspec, situacao, 
	qualObsGeral, qualObsRevisao, 
	aplicacao, embalagem, nome feitoPor
FROM 
    PCP..qualEspecCab a left join 
	( 
		select 
			cabProduto prod, max(cabRevisao) rev 
		from 
			PCP..qualEspecCab 
		group by 
			cabProduto 
	) b on 
	1 = 1 
	and cabProduto = prod 
	and cabRevisao = rev left join
	PCP..usuarios c on
	a.feitoPor = c.codigo
GO
/****** Object:  View [dbo].[vw_pcp_op_para_producao]    Script Date: 21/01/2025 07:24:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
create view [dbo].[vw_pcp_op_para_producao] as
select 
	a.filial, a.op, a.produto, 
	case 
		when a.loteAprov = 'APROVADO' 
		then '01'
		when a.loteAprov = 'REPROVADO' 
		then '41'
		when a.loteAprov = 'APROVADO' 
		then '01'
	end loc
from 
	PCP..oppcfLote a inner join
	PCP..oppcfLoteEmpenho b on
	1 = 1
	and a.filial = b.filial
	and a.op = b.op
	and a.produto = b.produto
where
	a.loteAprov not in ('ABERTO', 'ANDAMENTO', '')
GO
/****** Object:  View [dbo].[vw_pcp_op_pcfactory]    Script Date: 21/01/2025 07:24:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE VIEW [dbo].[vw_pcp_op_pcfactory] as

select 
	idEv, op, produto, qtde, dtime,  dtcria, codRecurso, recurso, codOpera, situacao, segundos
from 
(
	select
	--	sum(c.qty)
		a.code1 op, 
		d.code produto, 
		c.qty qtde,
		b.FlgDeleted,
		--isnull(b.WOShiftProd, 0) qtde, 
		c.DtTimeStamp dtime, 
		a.DtCreation dtcria, 
		e.code codRecurso, 
		e.name recurso, 
		f.code codOpera, 
		g.Status situacao,
		b.WOShiftRunT segundos, 
		c.IDGPEv idEv, 
		b.idwohd chave
	from 
		PCF4..TBLWOhd a with (nolock) inner join --tabela das ops
		PCF4..TBLProductionEv b with (nolock)  on --lançamentos
		a.idwohd = b.idwohd inner join
		PCF4..TBLGoodPiecesEv c on
		b.IDProdEv = c.IDProdEv inner join
		PCF4..TBLProduct d with (nolock)  on  --tabela de produção
		a.IDProduct = d.IDProduct inner join
		PCF4..TBLResource e with (nolock)  on
		e.IDResource = b.IDResource inner join
		PCF4..TBLWODet f with (nolock)  on
		f.IDWOHD = a.IDWOHD
		and e.IDResource = f.IDResource inner join
		PCF4..TBLWOHDQtyEv g on a.IDWOHD = g.IDWOHD

	where
		1 = 1
		-- and b.FlgDeleted = '0'
		--and b.WOShiftRunT > 0
)s
where
	1 = 1
	-- AND chave = 1107
	--and op = '10804758401001'

GO
/****** Object:  View [dbo].[vw_pcp_pcf_analitica]    Script Date: 21/01/2025 07:24:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE view [dbo].[vw_pcp_pcf_analitica] as
SELECT 
	substring(op, 1,3) filial, 
	rtrim(substring(op, 4, 20)) op, 
	codRecurso recurso, 
	codOpera operacao, 
	0 integrado, 
	rtrim(substring(produto, 4, 20)) produto, 
	round(qtde,4) producao, 
	0 retrabalho, 
	segundos, 
	a.situacao, 
	b.situacao situDesc, 
	convert(varchar(10), dtcria, 103) criacao,
	convert(varchar(10), dtime, 103) aponta
FROM 
	oppcf a inner join
	opSituacao b on
	a.situacao = b.codigo collate Latin1_General_BIN
WHERE
	1 = 1
	--and op = '20600431401001'


/*

select * from oppcf

*/
--ORDER BY 12
GO
/****** Object:  View [dbo].[vw_pcp_registros_op_qtde]    Script Date: 21/01/2025 07:24:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

create view [dbo].[vw_pcp_registros_op_qtde] as

select 
	op, sum(qtde) qude
from 
	(
	--registros vinculados com o agrupamento do codigo de recusros
	SELECT 
		a.op, qtde
	FROM 
		PCP..oppcf a inner join
		PCP..recursos b on
		a.codRecurso = b.recurso collate Latin1_General_BIN
	where
		1 = 1
		--and op = @op
	union all
	select 
		a.op, qtde
	from 
		PCP..oppcf a inner join
		(
			select 
				op, max(codOpera) codOpera 
			from 
				PCP..oppcf
			group by
				op
		)b on
		1 = 1
		and a.op = b.op
		and a.codOpera = b.codOpera
	where
		1 = 1
		--and a.op = @op
		and qtde > 0 
		and not exists
		(
			select 
				recurso 
			from 
				PCP..recursos
			where
				codRecurso = recurso collate Latin1_General_BIN
		)


)a
group by
	op

		/*
		select * from PCP..recursos	
	
	
		select * from PCP..oppcf*/
GO
/****** Object:  View [dbo].[vw_pcp_registros_saldo]    Script Date: 21/01/2025 07:24:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE view [dbo].[vw_pcp_registros_saldo] as
--registros vinculados com o agrupamento do codigo de recusros
SELECT 
	a.*, isnull(cabQtdeQuebra, 0) cabQtdeQuebra, isnull(qtdeAnalise, 0) qtdeAnalise
FROM 
	PCP..oppcf a inner join
	PCP..recursos b on
	a.codRecurso = b.recurso inner join
	PCP..qualEspecCab c on
	substring(a.produto, 4, 15)= c.cabProduto
where
	1 = 1
	and c.situacao = 'Concluida'
	--and op = @op
union all

--registros com o último recurso utilizado
select 
	a.*, isnull(cabQtdeQuebra, 0) cabQtdeQuebra, isnull(qtdeAnalise, 0) qtdeAnalise
from 
	PCP..oppcf a inner join
	(
		select 
			op, max(codOpera) codOpera 
		from 
			PCP..oppcf
		group by
			op
	)b on
	1 = 1
	and a.op = b.op
	and a.codOpera = b.codOpera inner join
	PCP..qualEspecCab c on
	substring(a.produto, 4, 15)= c.cabProduto
where
	1 = 1
	and c.situacao = 'Concluida'
	and qtde <> 0 
	and not exists
	(
		select 
			recurso 
		from 
			PCP..recursos
		where
			codRecurso = recurso
	)

GO
/****** Object:  View [dbo].[vw_pcp_relacao_lote_aprova]    Script Date: 21/01/2025 07:24:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE view [dbo].[vw_pcp_relacao_lote_aprova] as

/*
alter table loteAnalise add nivel varchar(2)
select * from vw_pcp_caracteristica


*/

select distinct 
	a.filial, a.produto, c.descrProd, 
	a.lote, a.analise, d.qtde, c.especAlcada, 
	b.codCarac, b.descCarac, a.iteMin, a.iteMax, a.iteMeio, a.iteTxt, a.situacao, a.result, a.resultxt, d.op, 
	d.dtAprovn1, d.dtAprovn2, d.dtAprovn3, d.dtVenc
from 
	oppcfLoteAnalise a inner join
	qualCarac b on
	1 = 1
	and a.carac = b.codCarac inner join
	PCP..qualEspecCab c on
	a.produto = c.cabProduto inner join
	(
		select 
			filial, produto, lote, analise, sum(qtde) qtde, op,
			dtAprovn1, dtAprovn2, dtAprovn3, dtVenc
		from 
			oppcfLote a
		where
			lote > '000000000'
		group by
			filial, produto, lote, analise, op, dtAprovn1, dtAprovn2, dtAprovn3, dtVenc
	)d on
	1 = 1
	and a.filial = d.filial 
	and a.produto = d.produto 
	and a.lote = d.lote
	and a.analise = d.analise


GO
/****** Object:  View [dbo].[vw_pcp_relacao_lote_op_empenho]    Script Date: 21/01/2025 07:24:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE VIEW [dbo].[vw_pcp_relacao_lote_op_empenho] as


SELECT DISTINCT 
	* 
FROM (
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
		RTRIM(D.B1_UM) UNIDADE
	FROM 
		TMPRD..SC2010 A WITH (NOLOCK) INNER JOIN
		TMPRD..SB1010 B WITH (NOLOCK) ON
		C2_PRODUTO = B.B1_COD INNER JOIN
		TMPRD..SD4010 C WITH (NOLOCK) ON
		C2_NUM+C2_ITEM+C2_SEQUEN = D4_OP AND
		C2_FILIAL = D4_FILIAL INNER JOIN
		TMPRD..SB1010 D WITH (NOLOCK) ON
		D4_COD = D.B1_COD LEFT JOIN
		TMPRD..SB2010 E WITH (NOLOCK) ON
		1 = 1
		AND D4_FILIAL = B2_FILIAL
		AND D4_COD = B2_COD
		AND E.R_E_C_D_E_L_ = 0
		AND B2_LOCAL = '01'
	WHERE
		1 = 1
		AND A.R_E_C_D_E_L_ = 0
		AND B.R_E_C_D_E_L_ = 0
		AND C.R_E_C_D_E_L_ = 0
		AND D.R_E_C_D_E_L_ = 0
		AND (C2_DATRF = '' OR left(C2_DATRF, 6) >= convert(varchar(6),DATEADD(month, -1, getdate()), 112) )

UNION ALL

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
		RTRIM(D.B1_UM) UNIDADE
	FROM 
		TMPRD..SC2020 A WITH (NOLOCK) INNER JOIN
		TMPRD..SB1020 B WITH (NOLOCK) ON
		C2_PRODUTO = B.B1_COD INNER JOIN
		TMPRD..SD4020 C WITH (NOLOCK) ON
		C2_NUM+C2_ITEM+C2_SEQUEN = D4_OP AND
		C2_FILIAL = D4_FILIAL INNER JOIN
		TMPRD..SB1020 D WITH (NOLOCK) ON
		D4_COD = D.B1_COD LEFT JOIN
		TMPRD..SB2020 E WITH (NOLOCK) ON
		1 = 1
		AND D4_FILIAL = B2_FILIAL
		AND D4_COD = B2_COD
		AND E.R_E_C_D_E_L_ = 0
		AND B2_LOCAL = '01'
	WHERE
		1 = 1
		AND A.R_E_C_D_E_L_ = 0
		AND B.R_E_C_D_E_L_ = 0
		AND C.R_E_C_D_E_L_ = 0
		AND D.R_E_C_D_E_L_ = 0
		AND (C2_DATRF = '' OR left(C2_DATRF, 6) >= convert(varchar(6),DATEADD(month, -1, getdate()), 112) )

UNION ALL

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
		RTRIM(D.B1_UM) UNIDADE
	FROM 
		TMPRD..SC2040 A WITH (NOLOCK) INNER JOIN
		TMPRD..SB1040 B WITH (NOLOCK) ON
		C2_PRODUTO = B.B1_COD INNER JOIN
		TMPRD..SD4040 C WITH (NOLOCK) ON
		C2_NUM+C2_ITEM+C2_SEQUEN = D4_OP AND
		C2_FILIAL = D4_FILIAL INNER JOIN
		TMPRD..SB1040 D WITH (NOLOCK) ON
		D4_COD = D.B1_COD LEFT JOIN
		TMPRD..SB2040 E WITH (NOLOCK) ON
		1 = 1
		AND D4_FILIAL = B2_FILIAL
		AND D4_COD = B2_COD
		AND E.R_E_C_D_E_L_ = 0
		AND B2_LOCAL = '01'
	WHERE
		1 = 1
		AND A.R_E_C_D_E_L_ = 0
		AND B.R_E_C_D_E_L_ = 0
		AND C.R_E_C_D_E_L_ = 0
		AND D.R_E_C_D_E_L_ = 0
		AND (C2_DATRF = '' OR left(C2_DATRF, 6) >= convert(varchar(6),DATEADD(month, -1, getdate()), 112) )
)D
GO
/****** Object:  View [dbo].[vw_pcp_relacao_op_lote_empenho]    Script Date: 21/01/2025 07:24:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE VIEW [dbo].[vw_pcp_relacao_op_lote_empenho] as --View_Portal_Op_Transf


SELECT DISTINCT 
	* 
FROM (
	SELECT 
		ipEmp, filial, op, 
		rtrim(produto) produto, 
		convert(varchar(10), cast(emissao as datetime), 103) emissao, 
		rtrim(componente) componente, 
		b.B1_DESC descEmp,
		qtdeEmp, 
		isnull(qtdeEmpCalc, 0) qtdeEmpCalc, 
		isnull(qtdeInformada, 0) qtdeInformada, 
		isnull(qtdeConsumida, 0) qtdeConsumida, 
		isnull(saldo, 0) saldo, 
		isnull(tipo, '') tipo, 
		isnull(situacao, '') situacao, 
		CASE isnull(situacao, '')
			WHEN 'I' THEN 'Integrada'
			WHEN 'K' THEN 'Informado'
			WHEN 'C' THEN 'Calculada'
			WHEN 'A' THEN 'Ajustada'
			WHEN 'V' THEN 'Re-Ajustar'
			WHEN 'W' THEN 'Web Inicial'
			WHEN 'P' THEN 'Parcial'
			WHEN 'T' THEN 'Total'
			ELSE isnull(situacao, '') 
		END sitDesc, b.B1_UM unidade
	FROM 
		oppcfLoteEmpenho a left join
		TMPRD..SB1010 b on
		1 = 1
		and rtrim(componente) = B1_COD
		and D_E_L_E_T_ = ''

UNION ALL

	SELECT 
		ipEmp, filial, op, 
		rtrim(produto) produto, 
		convert(varchar(10), cast(emissao as datetime), 103) emissao, 
		rtrim(componente) componente, 
		b.B1_DESC descEmp,
		qtdeEmp, 
		isnull(qtdeEmpCalc, 0) qtdeEmpCalc, 
		isnull(qtdeInformada, 0) qtdeInformada, 
		isnull(qtdeConsumida, 0) qtdeConsumida, 
		isnull(saldo, 0) saldo, 
		isnull(tipo, '') tipo, 
		isnull(situacao, '') situacao, 
		CASE isnull(situacao, '')
			WHEN 'I' THEN 'Integrada'
			WHEN 'K' THEN 'Informado'
			WHEN 'C' THEN 'Calculada'
			WHEN 'A' THEN 'Ajustada'
			WHEN 'V' THEN 'Re-Ajustar'
			WHEN 'W' THEN 'Web Inicial'
			WHEN 'P' THEN 'Parcial'
			WHEN 'T' THEN 'Total'
			ELSE isnull(situacao, '') 
		END sitDesc, b.B1_UM unidade
	FROM 
		oppcfLoteEmpenho a left join
		TMPRD..SB1020 b on
		1 = 1
		and rtrim(componente) = B1_COD
		and D_E_L_E_T_ = ''

UNION ALL

	SELECT 
		ipEmp, filial, op, 
		rtrim(produto) produto, 
		convert(varchar(10), cast(emissao as datetime), 103) emissao, 
		rtrim(componente) componente, 
		b.B1_DESC descEmp,
		qtdeEmp, 
		isnull(qtdeEmpCalc, 0) qtdeEmpCalc, 
		isnull(qtdeInformada, 0) qtdeInformada, 
		isnull(qtdeConsumida, 0) qtdeConsumida, 
		isnull(saldo, 0) saldo, 
		isnull(tipo, '') tipo, 
		isnull(situacao, '') situacao, 
		CASE isnull(situacao, '')
			WHEN 'I' THEN 'Integrada'
			WHEN 'K' THEN 'Informado'
			WHEN 'C' THEN 'Calculada'
			WHEN 'A' THEN 'Ajustada'
			WHEN 'V' THEN 'Re-Ajustar'
			WHEN 'W' THEN 'Web Inicial'
			WHEN 'P' THEN 'Parcial'
			WHEN 'T' THEN 'Total'
			ELSE isnull(situacao, '') 
		END sitDesc, b.B1_UM unidade
	FROM 
		oppcfLoteEmpenho a left join
		TMPRD..SB1040 b on
		1 = 1
		and rtrim(componente) = B1_COD
		and D_E_L_E_T_ = ''
)G

GO
