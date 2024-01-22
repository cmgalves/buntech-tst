USE [PCP]
GO

/****** Object:  StoredProcedure [dbo].[spcp_cria_lote_11]    Script Date: 22/01/2024 06:53:26 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO



alter procedure [dbo].[spcp_cria_lote_13] as

/*
processa as análise por quantidade dentro dos lotes.
levantamento apenas o produto com a qtde de quebra
spcp_cria_lote_11
spcp_cria_lote_13
*/


declare
	@analise varchar(3),
	@qtdeLote float,
	@qtdeAnalise float,
	@saldoLote float,
	@saldoAnalise float,
	@id_num  int


declare produtoLoteAnalise cursor for
	select distinct
		id_num, qtdeLote, qtdeQuebraAnalise
	from
		oppcfLote a
	where
		1 = 1
		and regTipo = 'L'
	order by
		1

open produtoLoteAnalise
fetch next from produtoLoteAnalise   
into @id_num, @qtdeLote, @qtdeAnalise

--spcp_cria_lote_11
while @@FETCH_STATUS = 0
	begin
		set @analise = 'A01'
		if @qtdeLote >= @qtdeAnalise
			begin 
				update PCP..oppcfLote set qtde = @qtdeAnalise, qtdeLote = @qtdeAnalise, qtdeAnalise = @qtdeAnalise, analise = 'A01', regTipo = 'A' where id_num = @id_num
				set @saldoLote = @qtdeLote - @qtdeAnalise
			end
		else
			begin 
				update PCP..oppcfLote set qtde = @qtdeLote, qtdeLote = @qtdeLote, qtdeAnalise = @qtdeLote, analise = 'A01', regTipo = 'A' where id_num = @id_num
				set @saldoLote = 0
			end

		while @saldoLote > 0
			begin 
				set @analise = 'A' + right('00' + convert(varchar(2), cast(right(@analise, 2) as int) + 1), 2)
				if @saldoLote >= @qtdeAnalise
					begin 
						--print '16 @qtdes < @qtdeQuebraLote'
						insert PCP..oppcfLote (
							filial, produto, 
							qtde, qtdeLote, qtdeAnalise, 
							dtime, dtcria, 
							codRecurso, lote, 
							origem, stsLote, 
							analise, loteAprov, qtdeQuebra, 
							qtdeQuebraAnalise, 
							recurso, codOpera, segundos, regTipo)
						select distinct
							filial, produto, 
							@qtdeAnalise, @qtdeAnalise, @qtdeAnalise, 
							dtime, dtcria, 
							codRecurso, lote, 
							'S' origem, ' ' stsLote, 
							@analise, 'ABERTO', qtdeQuebra, 
							qtdeQuebraAnalise, 
							recurso, codOpera, 0 segundos, 'A' regTipo
						from
							PCP..oppcfLote
						where
							id_num = @id_num
				
						set @saldoLote = @saldoLote - @qtdeAnalise
					end
				else
					begin 
						--print '17 @qtdes < @qtdeQuebraLote'
						insert PCP..oppcfLote (
							filial, produto, 
							qtde, qtdeLote, qtdeAnalise, 
							dtime, dtcria, 
							codRecurso, lote, 
							origem, stsLote, 
							analise, loteAprov, qtdeQuebra, 
							qtdeQuebraAnalise, 
							recurso, codOpera, segundos, regTipo)
						select distinct
							filial, produto, 
							@saldoLote, @saldoLote, @saldoLote, 
							dtime, dtcria, 
							codRecurso, lote, 
							'S' origem, ' ' stsLote, 
							@analise, 'ABERTO', qtdeQuebra, 
							qtdeQuebraAnalise, 
							recurso, codOpera, 0 segundos, 'A' regTipo
						from
							PCP..oppcfLote
						where
							id_num = @id_num
				
						set @saldoLote = @saldoLote - @qtdeAnalise
					end
			end
		fetch next from produtoLoteAnalise   
		into @id_num, @qtdeLote, @qtdeAnalise
		
	end

	-- fechar o cursor 
close produtoLoteAnalise
deallocate produtoLoteAnalise
GO


