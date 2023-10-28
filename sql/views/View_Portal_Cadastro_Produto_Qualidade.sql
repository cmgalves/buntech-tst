SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



ALTER view [dbo].[View_Portal_Cadastro_Produto_Qualidade] as
-- View para os produtos que estão disponíveis para o PCF

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
		case 
			when convert(varchar(10), getdate(), 112) < convert(varchar(8), cast(vigenciaDe as datetime), 112) or convert(varchar(10), getdate(), 112) > convert(varchar(8), cast(vigenciaAte as datetime), 112) 
			then 'Fora Vigência'
			when isnull(situacao, '') = ''
			then 'Sem Epecificação'
			when isnull(situacao, '') <> ''
			then situacao
			else ''
		end situacao
	FROM
		HOMOLOGACAO..SB1010 A LEFT JOIN
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
        --AND B1_COD = 'P800501'
		AND B1_TIPO IN ('PA', 'PP') 
		AND B1_XINTPCF <> ''
--order by  9 desc

--select * from PCP..qualEspecCab

GO
