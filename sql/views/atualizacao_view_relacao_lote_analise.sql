SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER view [dbo].[View_Relacao_Lote_Analisa] as

--select * from loteAnalise
--alter table loteAnalise add nivel varchar(2)
select 
	* 
from 
(
	select 
		'analise' as orig, filial, op, produto, descricao, lote, nivel, 
		dtAprov, usrAprov, hrAprov, dtAnalise, hrAnalise, usrAnalise, 
		dtVenc, qtdeProd, qtdeTot, revisao, a.codCarac, descCarac, itemin, itemax, itemeio, 
		result, situacao, iteTxt, resultxt, sitFim, ISNULL(a.imprimeLaudo, 'SIM') as imprimeLaudo
	from 
		loteAnalise a inner join 
		qualCarac b on
		1 = 1
		and a.codCarac = b.codCarac

	 union all

	select * from 
	(select distinct
		'produc' as orig, filial, op, produto, descricao, lote, nivel,
		dtAprov, usrAprov, '' hrAprov, '' dtAnalise, '' hrAnalise, 0 usrAnalise, 
		dtVenc, qtdeProd, qtdeTot, revisao, codCarac, descCarac, iteMin itemin, iteMax itemax, iteMeio itemeio,
		'' result, situacao, iteTxt, '' resultxt, '' sitFim, '' imprimeLaudo
	from 
		loteProd a left join
		(
			select 
				cabProduto, cabRevisao, codCarac, iteCarac, descCarac, iteMin, iteMax, iteMeio, iteTxt
			from 
				qualEspecCab a inner join 
				qualEspecItens b on
				1 = 1
				and cabProduto = iteProduto
				and cabRevisao = iteRevisao inner join 
				qualCarac c on
				1 = 1
				and iteCarac = codCarac
			where 
				1 = 1
				and situacao <> 'Encerrada'
				--and cabProduto =  'PAN01166'
		)b on
		1 = 1
		and produto = cabProduto
	)l
	where
		not exists
		(
			select 
				w.filial, w.op, w.produto, w.lote, w.codCarac
			from 
				loteAnalise w
			where
				w.filial = l.filial
				and w.op = l.op 
				and w.produto = l.produto
				and w.lote = l.lote
				and w.codCarac = l.codCarac
		)
	

) AS mm
--where  produto =  'PAN01051' and lote = '000000002' and filial = '108'
GO

SELECT * FROM View_Relacao_Lote_Analisa