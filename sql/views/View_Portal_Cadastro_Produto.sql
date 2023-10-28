SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



ALTER view [dbo].[View_Portal_Cadastro_Produto] as
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
	HOMOLOGACAO..SB1010 
WHERE 
	1 = 1
	AND D_E_L_E_T_ = ''
	--AND B1_XTRANSF <> ''
GO
