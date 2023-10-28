

SELECT
    a.op, a.recurso, a.produto, a.producao, b.producao,
    a.producao-b.producao dif
FROM
    PCP..vw_pcp_pcf a inner join
    PCF_Integ..View_pcf b
    on
    1 = 1
    and a.op = b.op collate Latin1_General_CI_AS
    and a.produto = b.produto collate Latin1_General_CI_AS
    and a.operacao = b.operacao collate Latin1_General_CI_AS
where
    a.producao-b.producao not between -0.001 and 0.001
order by
    6