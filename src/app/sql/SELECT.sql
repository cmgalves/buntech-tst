SELECT
    cabProduto, descrProd, cabRevisao, vigenciaDe,
    vigenciaAte, situacao, qualObsGeral, qualObsRevisao,
    aplicacao, embalagem, prazoValid, feitoPor, aprovPor,
    iteProduto, iteRevisao, iteCarac, iteMin, iteMax, descCarac
FROM
    qualEspecCab inner join
    qualEspecItens on
    1 = 1
    and cabProduto = iteProduto
    and cabRevisao = iteRevisao inner join
    qualCarac on
    1 = 1
    and iteCarac = codCarac
