--ALTER view [dbo].[View_Relacao_Espec] as
SELECT
    cabProduto, descrProd, cabRevisao, dataAprov, numEspec, 
	situacao, qualObsGeral, qualObsRevisao,
    aplicacao, embalagem, feitoPor, aprovPor,especAlcada,
	especAnalise,especQuebra,especSequencia, loteAtual,
    isnull(iteProduto, '') iteProduto, isnull(iteRevisao, '') iteRevisao,
    isnull(iteCarac, '') iteCarac, isnull(iteMin, 0) iteMin,
    isnull(iteMax, 0) iteMax, isnull(iteMeio, '') iteMeio, isnull(iteTxt, '') iteTxt, 
    isnull(codCarac, '') codCarac, isnull(descCarac, '') descCarac, cabQtdeQuebra, 
    imprimeLaudo, isnull(tempoMaximo,0) tempoMaximo
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
	situacao <> 'Encerrada'


GO
