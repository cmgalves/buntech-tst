SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



ALTER view [dbo].[View_Portal_Empresa] as

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
		HOMOLOGACAO..SYS_COMPANY WITH(NOLOCK)
	WHERE 
		D_E_L_E_T_ = ''


GO
