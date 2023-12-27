SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER VIEW [dbo].[vw_pcp_relacao_op_lote_empenho] as --View_Portal_Op_Transf
SELECT 
	ipEmp, filial, op, 
    rtrim(produto) produto, 
    qtdeOP, 
    isnull(qtdeLote, 0) qtdeLote, 
    emissao, 
	rtrim(componente) componente, 
    b.B1_DESC descEmp,
	qtdeEmp, 
    isnull(qtdeEmpCalc, 0) qtdeEmpCalc, 
    isnull(saldo, 0) saldo, 
    isnull(tipo, '') tipo, 
    isnull(situacao, '') situacao, 
	CASE isnull(situacao, '')
		WHEN 'I' THEN 'Integrada'
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
	HOMOLOGACAO..SB1010 b on
	1 = 1
	and rtrim(componente) = B1_COD
	and D_E_L_E_T_ = ''



GO

-- SELECT * from vw_pcp_relacao_op_lote_empenho
--SELECT  filial, op, produto, qtdeOP, emissao, unidade,  componente, RTRIM(descEmp) descEmp, qtdeEmp FROM      vw_pcp_relacao_op_lote_empenho WHERE    1 = 1   AND filial =  '101'     AND op =  '00003101001' 
--SELECT  filial, op, produto, qtdeOP, emissao, unidade,  componente, descEmp, qtdeEmp FROM       vw_pcp_relacao_op_lote_empenho WHERE    1 = 1   AND filial =  '101'     AND op =  '00003101001' 