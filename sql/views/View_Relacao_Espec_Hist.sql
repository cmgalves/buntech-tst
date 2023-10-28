SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/*
SELECT * FROM View_Relacao_Espec_Hist
*/

ALTER view [dbo].[View_Relacao_Espec_Hist] as
SELECT
    cabProduto, descrProd, cabRevisao, dataAprov, numEspec,
    situacao, qualObsGeral, qualObsRevisao,
    aplicacao, embalagem, feitoPor, aprovPor,
    isnull(iteProduto, '') iteProduto, isnull(iteRevisao, '') iteRevisao,
    isnull(iteCarac, '') iteCarac, isnull(iteMin, '') iteMin,
    isnull(iteMax, '') iteMax, isnull(iteMeio, '') iteMeio, 
	isnull(descCarac, '') descCarac
FROM
    PCP..qualEspecCab left join
    PCP..qualEspecItens c on
    1 = 1
    and cabProduto = iteProduto
    and cabRevisao = iteRevisao left join
    PCP..qualCarac d on
    1 = 1
    and iteCarac = codCarac
GO
