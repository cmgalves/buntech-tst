SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER view [dbo].[View_Portal_Cadastro_Produto_Qualidade_Lote] as
-- View para os produtos que estão disponíveis para o PCF

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
		HOMOLOGACAO..SB1010 A LEFT JOIN
		(
			select 
				* 
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
        --AND B1_COD = 'P800501'
		AND B1_TIPO IN ('PA', 'PP') 
		AND B1_XINTPCF <> ''
	--order by  9 desc

	--select * from PCP..qualEspecCab

GO
