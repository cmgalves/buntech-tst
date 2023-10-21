USE PCF4
GO
ALTER VIEW [dbo].[vw_pcp_op_pcfactory] as

select 
	op, produto, sum(qtde) qtde, dtime,  dtcria, codRecurso, recurso, codOpera, situacao, segundos
from 
(
	select
	--	sum(c.qty)
		a.code1 op, 
		d.code produto, 
		isnull(b.WOShiftProd, 0) qtde, 
		b.DtTimeStamp dtime, 
		a.DtCreation dtcria, 
		e.code codRecurso, 
		e.name recurso, 
		f.code codOpera, 
		g.Status situacao,
		b.WOShiftRunT segundos, 
		b.idwohd chave
	from 
		TBLWOhd a with (nolock) inner join --tabela das ops
		TBLProductionEv b with (nolock)  on --lançamentos
		a.idwohd = b.idwohd inner join
		TBLProduct d with (nolock)  on  --tabela de produção
		a.IDProduct = d.IDProduct inner join
		TBLResource e with (nolock)  on
		e.IDResource = b.IDResource inner join
		TBLWODet f with (nolock)  on
		f.IDWOHD = a.IDWOHD
		and e.IDResource = f.IDReUSE PCF4
GO
ALTER VIEW [dbo].[vw_pcp_op_pcfactory] as

select 
	op, produto, sum(qtde) qtde, dtime,  dtcria, codRecurso, recurso, codOpera, situacao, segundos
from 
(
	select
	--	sum(c.qty)
		a.code1 op, 
		d.code produto, 
		isnull(b.WOShiftProd, 0) qtde, 
		b.DtTimeStamp dtime, 
		a.DtCreation dtcria, 
		e.code codRecurso, 
		e.name recurso, 
		f.code codOpera, 
		g.Status situacao,
		b.WOShiftRunT segundos, 
		b.idwohd chave
	from 
		TBLWOhd a with (nolock) inner join --tabela das ops
		TBLProductionEv b with (nolock)  on --lançamentos
		a.idwohd = b.idwohd inner join
		TBLProduct d with (nolock)  on  --tabela de produção
		a.IDProduct = d.IDProduct inner join
		TBLResource e with (nolock)  on
		e.IDResource = b.IDResource inner join
		TBLWODet f with (nolock)  on
		f.IDWOHD = a.IDWOHD
		and e.IDResource = f.IDResource inner join
		TBLWOHDQtyEv g on a.IDWOHD = g.IDWOHD

	where
		1 = 1
		and b.FlgDeleted = '0'
		and b.WOShiftRunT > 0
)s
where
	1 = 1
	-- AND chave = 1107
	--and op = '00442001001'
group by
	op, produto, dtime, dtcria, codRecurso, recurso, codOpera, situacao, segundos

GO
source inner join
		TBLWOHDQtyEv g on a.IDWOHD = g.IDWOHD

	where
		1 = 1
		and b.FlgDeleted = '0'
		and b.WOShiftRunT > 0
)s
where
	1 = 1
	-- AND chave = 1107
	--and op = '00442001001'
group by
	op, produto, dtime, dtcria, codRecurso, recurso, codOpera, situacao, segundos

GO
