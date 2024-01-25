-- spcp_cria_lote_11

--update PCP..oppcfLote set regTipo = 'S' where produto = 'PAN00775' and regTipo = 'T'


select 
	filial, op, produto, regTipo, lote, qtde, qtdeLote, analise, qtdeAnalise, qtdeAnalise, qtdeQuebraAnalise, * 
--delete
--delete PCP..oppcfLote where op = '' 
from 
--update PCP..oppcfLote set regTipo = 'S' from
--update PCP..oppcfLote set regTipo = 'x' from
	PCP..oppcfLote 
where 
	1 = 1 
	--and op = '04761401001'
	and produto = 'PAN00779'
	--and id_num = 54
	--and regTipo <> 'S'
	--and regTipo = 'W'
	--and regTipo = 'T'
	--and regTipo not in ('x')
	--and regTipo in ('x')
	--and regTipo not in ('x', 'T', 'W')
	--and regTipo = 'A'
--order by 2 desc

-- spcp_cria_lote_11


/*
truncate table PCP..oppcf
truncate table PCP..oppcfLote
truncate table PCP..oppcfLoteHora
truncate table PCP..oppcfLoteAnalise
truncate table PCP..oppcfLoteEmpenho

select * from PCP..qualEspecCab where cabProduto = 'PAN00779'


if @qtdeLote > 0 
				begin
					set @saldoLote = @qtdeQuebraLote - @qtdeAnalise
					set @qtdeAnalise = (isnull((select sum(qtde) from oppcfLote where filial = @filial and produto = @produto and lote = @loteAtual and analise = @analise), 0))
					if @qtdeAnalise < @qtdeQuebraAnalise 
						begin 
							set @saldoAnalise = @qtdeQuebraAnalise - @qtdeAnalise
								insert PCP..oppcfLote (
									filial, produto, 
									qtde, dtime, dtcria, 
									codRecurso, lote, 
									origem, stsLote, 
									analise, loteAprov, 
									qtdeQuebra, qtdeQuebraAnalise, 
									recurso, codOpera, segundos, regTipo)
								select distinct
									@filial, @produto, 
									@saldoAnalise, max(dtime), max(dtcria), 
									max(codRecurso), @lote, 
									'S' origem, ' ' stsLote, 
									@analise, 'ABERTO' loteAprov,
									@qtdeQuebraLote, @qtdeQuebraAnalise, 
									max(recurso), max(codOpera), 0 segundos, 'L' regTipo
								from
									PCP..oppcfLote
								where
									regTipo = 'T'							
								group by
									origem, stsLote
							set @qtdes = @qtdes - @saldoAnalise
							set @saldoAnalise = 0
						end
					else 
						begin 
							print 'dahsk'
						end 
				end
			else 
				begin
					print @filial
					print @produto
					print @saldoAnalise
					print @lote
					print @analise
					print @qtdeQuebraLote
					print @qtdeQuebraAnalise
					set @saldoAnalise = @qtdeQuebraAnalise
					insert PCP..oppcfLote (
						filial, produto, 
						qtde, dtime, dtcria, 
						codRecurso, lote, 
						origem, stsLote, 
						analise, loteAprov, 
						qtdeQuebra, qtdeQuebraAnalise, 
						recurso, codOpera, segundos, regTipo)
					select distinct
						@filial, @produto, 
						@saldoAnalise, max(dtime), dtcria, 
						max(codRecurso), @lote, 
						'S' origem, ' ' stsLote, 
						@analise, 'ABERTO' loteAprov,
						@qtdeQuebraLote, @qtdeQuebraAnalise, 
						recurso, codOpera, 0 segundos, 'L' regTipo
					from
						PCP..oppcfLote
					where
						regTipo = 'T'							
					group by
						dtcria, recurso, codOpera
					set @qtdes = @qtdes - @saldoAnalise
					set @saldoAnalise = 0
				end

*/