--ALTER view [dbo].[vw_pcp_caracteristica] as

SELECT
    idEspecCab, idEspecItens, cabProduto, descrProd, 
    especAlcada, especQuebra, cabQtdeQuebra, iteCarac, 
    iteMin, iteMax, iteMeio, itetxt, cabRevisao
FROM 
    qualEspecCab a inner join 
    qualEspecItens b on 
    1 = 1
    and a.cabProduto = b.iteProduto
WHERE
    situacao <> 'Encerrada'
order by 
    2
GO

