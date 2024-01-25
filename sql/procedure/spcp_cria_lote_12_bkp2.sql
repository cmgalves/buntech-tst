USE [PCP]
GO

/****** Object:  StoredProcedure [dbo].[spcp_cria_lote_12]    Script Date: 22/01/2024 19:03:57 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


ALTER procedure [dbo].[spcp_cria_lote_12]
    @filial varchar(3),
    @produto varchar(15),
    @qtdeQuebraL float,
    @qtdeQuebraA float
as


/*
processamento de lotes por quantidade
spcp_cria_lote_11
select * from PCP..oppcfLote
select * from PCP..oppcfLote where produto = 'PAN01051'
truncate table PCP..oppcfLote
truncate table PCP..oppcf
10804758701001, 10804760001001, 10804760201001, 10804760301001
*/


declare 
	@id_num int,
	@fil varchar(3),
	@prod varchar(15),
	@lote varchar(9),
	@loteAnt varchar(9),
	@loteAprov varchar(15),
	@qtdeLote float,
	@qtdeQuebra float, 
	@analise varchar(3), 
	@qtdeAnalise float, 
	@qtdeQuebraAnalise float, 
	@regTipo varchar(1),
	@qtdes float,
	@saldoLote float,
	@saldoAnalise float,
	@loteFilial varchar(9),
	@loteProduto varchar(9),
	@loteEspec varchar(9)

set @saldoLote = 0
set @qtdes = (isnull((select sum(qtde) qtdes from oppcfLote where filial = '108' and produto = 'PAN00843' and regTipo = 'W'), 0))
-- declare prodQtde cursor for

-- /*
-- spcp_cria_lote_11
-- select max(lote) from oppcfLote where lote <> '000000000' and produto = 'PAN00775'
-- */
-- while @@FETCH_STATUS = 0
		-- definição do lote

declare produtoAnalise cursor for
	select
		id_num, a.filial, a.produto, a.lote, loteAprov, qtdeLote, qtdeQuebra, analise, qtdeAnalise, qtdeQuebraAnalise, regTipo
		--, *
	from
		oppcfLote a inner join
		(
			select distinct
				filial, produto, lote
			from
				oppcfLote
			where
				loteAprov = 'ABERTO'		
		) b on
		a.filial = b.filial 
		and a.produto = b.produto
		and a.lote = b.lote
	where
		1 = 1
		and a.filial = @filial
		and a.produto = @produto
		and a.lote > '000000000'
		--and regTipo not in ('T', 'x', 'S')
	order by
		a.lote
open produtoAnalise
fetch next from produtoAnalise   
into @id_num, @fil, @prod, @lote, @loteAprov, @qtdeLote, @qtdeQuebra, @analise, @qtdeAnalise, @qtdeQuebraAnalise, @regTipo

--spcp_cria_lote_11
while @@FETCH_STATUS = 0
	begin
		set @loteAnt = @lote
		set @saldoLote = @saldoLote + @qtdeLote
		if @loteAprov <> 'ABERTO'
			begin
				set @qtdes = @qtdes - @qtdeLote
			end
		else 
			begin
				set @saldoAnalise = @qtdeQuebraAnalise - @qtdeAnalise
				if @saldoAnalise > 0 and @saldoLote < @qtdeQuebra 
					begin 
						if @qtdes >= @saldoAnalise
							begin
								update PCP..oppcfLote set qtde = qtde + @saldoAnalise, qtdeLote = qtdeLote + @saldoAnalise, qtdeAnalise = qtdeAnalise + @saldoAnalise, qtdeImp = 5 where id_num = @id_num
								set @qtdes = @qtdes - (@qtdeQuebraAnalise - @qtdeAnalise)
							end
						else
							begin 
								update PCP..oppcfLote set qtde = qtde + @qtdes, qtdeLote = qtdeLote + @qtdes, qtdeAnalise = qtdeAnalise + @qtdes, qtdeImp = 5 where id_num = @id_num
								set @qtdes = 0
							end
					end 
			
			end
		
		fetch next from produtoAnalise   
		into @id_num, @fil, @prod, @lote, @loteAprov, @qtdeLote, @qtdeQuebra, @analise, @qtdeAnalise, @qtdeQuebraAnalise, @regTipo
		if @loteAnt <> @lote
			begin
				set @saldoLote = 0
			end
	end

	while @qtdes > 0
		begin 
			set @loteEspec = (select loteAtual from PCP..qualEspecCab where cabProduto = @produto and situacao = 'Concluida')
			set @loteFilial = (isnull((select max(lote) from oppcfLote where filial = @filial and produto = @produto and lote <> '000000000'), '000000000'))
			set @loteProduto = (isnull((select max(lote) from oppcfLote where produto = @produto and lote <> '000000000'), '000000000'))
			if @loteFilial = '000000000'
				begin
					if @loteProduto = '000000000'
						begin
							set @lote = right('000000000' + convert(varchar(9), cast(@loteEspec as int) + 1), 9)
							
							if @qtdes > @qtdeQuebraA
								begin
									print 1
									insert PCP..oppcfLote (
										filial, produto, op, 
										qtde, qtdeLote, qtdeAnalise, 
										dtime, dtcria, 
										codRecurso, lote, 
										origem, stsLote, 
										analise, loteAprov, qtdeQuebra, 
										qtdeQuebraAnalise, 
										recurso, codOpera, segundos, regTipo)
									select distinct
										@filial, @produto, '', 
										@qtdeQuebraA, @qtdeQuebraA, @qtdeQuebraA, 
										max(dtime), max(dtcria), 
										max(codRecurso), @lote, 
										'S' origem, ' ' stsLote, 
										'A01', 'ABERTO', @qtdeQuebraL, 
										@qtdeQuebraA, 
										max(recurso), max(codOpera), 0 , 'B'
									from
										PCP..oppcfLote
									where
										regTipo = 'W'							
									group by
										origem, stsLote
									set @qtdes = @qtdes - @qtdeQuebraA
									print '1 depois'
								end
							else
								begin
									print 2
									insert PCP..oppcfLote (
										filial, produto, op, 
										qtde, qtdeLote, qtdeAnalise, 
										dtime, dtcria, 
										codRecurso, lote, 
										origem, stsLote, 
										analise, loteAprov, qtdeQuebra, 
										qtdeQuebraAnalise, 
										recurso, codOpera, segundos, regTipo)
									select distinct
										@filial, @produto, '',  
										@qtdes, @qtdes, @qtdes, 
										max(dtime), max(dtcria), 
										max(codRecurso), @lote, 
										'S' origem, ' ' stsLote, 
										'A01', 'ABERTO', @qtdeQuebraL, 
										@qtdeQuebraA, 
										max(recurso), max(codOpera), 0 segundos, 'L' regTipo
									from
										PCP..oppcfLote
									where
										regTipo = 'W'							
									group by
										origem, stsLote
									print '2 depois'
									set @qtdes = 0
								end
						end
					else
						begin
							set @lote = right('000000000' + convert(varchar(9), cast(@loteProduto as int) + 1), 9)
							if @qtdes > @qtdeQuebraA
								begin
									print 3
									insert PCP..oppcfLote (
										filial, produto, op,  
										qtde, qtdeLote, qtdeAnalise, 
										dtime, dtcria, 
										codRecurso, lote, 
										origem, stsLote, 
										analise, loteAprov, qtdeQuebra, 
										qtdeQuebraAnalise, 
										recurso, codOpera, segundos, regTipo)
									select distinct
										@filial, @produto, '',
										@qtdeQuebraA, @qtdeQuebraA, @qtdeQuebraA, 
										max(dtime), max(dtcria), 
										max(codRecurso), @lote, 
										'S' origem, ' ' stsLote, 
										'A01', 'ABERTO', @qtdeQuebraL, 
										@qtdeQuebraA, 
										max(recurso), max(codOpera), 0 segundos, 'L' regTipo
									from
										PCP..oppcfLote
									where
										regTipo = 'W'							
									group by
										origem, stsLote
									print '3 depois'
									set @qtdes = @qtdes - @qtdeQuebraA
								end
							else
								begin
									print 4
									insert PCP..oppcfLote (
										filial, produto, op, 
										qtde, qtdeLote, qtdeAnalise, 
										dtime, dtcria, 
										codRecurso, lote, 
										origem, stsLote, 
										analise, loteAprov, qtdeQuebra, 
										qtdeQuebraAnalise, 
										recurso, codOpera, segundos, regTipo)
									select distinct
										@filial, @produto, '', 
										@qtdes, @qtdes, @qtdes, 
										max(dtime), max(dtcria), 
										max(codRecurso), @lote, 
										'S' origem, ' ' stsLote, 
										'A01', 'ABERTO', @qtdeQuebraL, 
										@qtdeQuebraA, 
										max(recurso), max(codOpera), 0 segundos, 'L' regTipo
									from
										PCP..oppcfLote
									where
										regTipo = 'W'							
									group by
										origem, stsLote
									print '4 depois'
									set @qtdes = 0
								end
						end
				end
			else
				begin
					set @qtdeLote = (isnull((select sum(qtdeLote) from PCP..oppcfLote where filial = @filial and produto = @produto and lote = @loteFilial), 0))
					if @qtdeLote >= @qtdeQuebraL
						begin
							if @loteProduto >= @loteEspec
								begin 
									set @lote = right('000000000' + convert(varchar(9), cast(@loteProduto as int) + 1), 9)
								end
							else
								begin 
									set @lote = right('000000000' + convert(varchar(9), cast(@loteEspec as int) + 1), 9)
								end
							set @analise = 'A01'
						end
					else
						begin
							set @lote = @loteFilial
						end
					
					set @qtdeLote = (isnull((select sum(qtdeLote) from PCP..oppcfLote where filial = @filial and produto = @produto and lote = @lote), 0))
					set @saldoLote = @qtdeQuebraL - @qtdeLote
					if @qtdes > @saldoLote
						begin
							while @saldoLote > 0
								begin
									if @saldoLote > @qtdeQuebraA
										begin 
											set @analise = 'A' + right('00' + convert(varchar(2), cast(right((isnull((select max(analise) from PCP..oppcfLote where filial = @filial and produto = @produto and lote = @lote), 'A00')), 2) as int) + 1), 2)
											print 5
											insert PCP..oppcfLote (
												filial, produto, op, 
												qtde, qtdeLote, qtdeAnalise, 
												dtime, dtcria, 
												codRecurso, lote, 
												origem, stsLote, 
												analise, loteAprov, qtdeQuebra, 
												qtdeQuebraAnalise, 
												recurso, codOpera, segundos, regTipo)
											select distinct
												filial, produto, '', 
												@qtdeQuebraA, @qtdeQuebraA, @qtdeQuebraA, 
												'', '', 
												max(codRecurso), @lote, 
												'S', ' ', 
												@analise, 'ABERTO', qtdeQuebra, 
												qtdeQuebraAnalise, 
												max(recurso), max(codOpera), 0 segundos, 'C' regTipo
											from
												PCP..oppcfLote
											where
												filial = @filial
												and produto = @produto
												and lote = '000000000'
											group by
												filial, produto, qtdeQuebra, qtdeQuebraAnalise
											print '5 depois'
											set @qtdes = @qtdes - @qtdeQuebraA
											set @saldoLote = @saldoLote - @qtdeQuebraA
										end
									else
										begin 
											set @analise = 'A' + right('00' + convert(varchar(2), cast(right((isnull((select max(analise) from PCP..oppcfLote where filial = @filial and produto = @produto and lote = @lote), 'A00')), 2) as int) + 1), 2)
											print 6
											insert PCP..oppcfLote (
												filial, produto, op, 
												qtde, qtdeLote, qtdeAnalise, 
												dtime, dtcria, 
												codRecurso, lote, 
												origem, stsLote, 
												analise, loteAprov, qtdeQuebra, 
												qtdeQuebraAnalise, 
												recurso, codOpera, segundos, regTipo)
											select distinct
												filial, produto, '',
												@saldoLote, @saldoLote, @saldoLote, 
												'', '', 
												max(codRecurso), @lote, 
												'S', ' ', 
												@analise, 'ABERTO', qtdeQuebra, 
												qtdeQuebraAnalise, 
												max(recurso), max(codOpera), 0 segundos, 'D' regTipo
											from
												PCP..oppcfLote
											where
												filial = @filial
												and produto = @produto
												and lote = '000000000'
											group by
												filial, produto, qtdeQuebra, qtdeQuebraAnalise
											print '6 depois'
											set @qtdes = @qtdes - @saldoLote
											set @saldoLote = 0
										end
								end 
							end 
					else
						begin
							if @qtdes > @qtdeQuebraA
								begin 
									set @analise = 'A' + right('00' + convert(varchar(2), cast(right((isnull((select max(analise) from PCP..oppcfLote where filial = @filial and produto = @produto and lote = @lote), 'A00')), 2) as int) + 1), 2)
									--set @analise = 'A' + right('00' + convert(varchar(2), cast(right((select max(analise) from PCP..oppcfLote where filial = @filial and produto = @produto and lote = @loteProduto), 2) as int) + 1), 2)
									print 7
									insert PCP..oppcfLote (
										filial, produto, op, 
										qtde, qtdeLote, qtdeAnalise, 
										dtime, dtcria, 
										codRecurso, lote, 
										origem, stsLote, 
										analise, loteAprov, qtdeQuebra, 
										qtdeQuebraAnalise, 
										recurso, codOpera, segundos, regTipo)
									select distinct
										filial, produto, '',
										@qtdeQuebraA, @qtdeQuebraA, @qtdeQuebraA, 
										'', '', 
										max(codRecurso), @lote, 
										'S', ' ', 
										@analise, 'ABERTO', qtdeQuebra, 
										qtdeQuebraAnalise, 
										max(recurso), max(codOpera), 0 segundos, 'E' regTipo
									from
										PCP..oppcfLote
									where
										filial = @filial
										and produto = @produto
										and lote = '000000000'
									group by
										filial, produto, qtdeQuebra, qtdeQuebraAnalise
									print '7 depois'
									set @qtdes = @qtdes - @qtdeQuebraA
								end
							else
								begin 
									set @analise = 'A' + right('00' + convert(varchar(2), cast(right((isnull((select max(analise) from PCP..oppcfLote where filial = @filial and produto = @produto and lote = @lote), 'A00')), 2) as int) + 1), 2)
									--set @analise = 'A' + right('00' + convert(varchar(2), cast(right((select max(analise) from PCP..oppcfLote where filial = @filial and produto = @produto and lote = @loteProduto), 2) as int) + 1), 2)
									print 8
									insert PCP..oppcfLote (
										filial, produto, op, 
										qtde, qtdeLote, qtdeAnalise, 
										dtime, dtcria, 
										codRecurso, lote, 
										origem, stsLote, 
										analise, loteAprov, qtdeQuebra, 
										qtdeQuebraAnalise, 
										recurso, codOpera, segundos, regTipo)
									select distinct
										filial, produto, '', 
										@qtdes, @qtdes, @qtdes, 
										'', '', 
										max(codRecurso), @lote, 
										'S', ' ', 
										@analise, 'ABERTO', qtdeQuebra, 
										qtdeQuebraAnalise, 
										max(recurso), max(codOpera), 0 segundos, 'F' regTipo
									from
										PCP..oppcfLote
									where
										filial = @filial
										and produto = @produto
										and lote = '000000000'
									group by
										filial, produto, qtdeQuebra, qtdeQuebraAnalise
									print '8 depois'
									set @qtdes = 0
								end
						end
				end
		end
		update
			oppcfLote
		set
			regTipo = 'T'
		where
			filial = @filial
			and produto = @produto
			and lote = '000000000'
			and regTipo = 'W'



close produtoAnalise
deallocate produtoAnalise

--//--------------------------------------------------------------------------							
	/*
	if @qtdes > @qtdeQuebraAnalise
								begin
									
									
									
									set @lote = right('000000000' + convert(varchar(9), cast(@loteEspec as int) + 1), 9)
									set @analise = 'A01'
									insert PCP..oppcfLote (
										filial, produto, 
										qtde, qtdeLote, qtdeAnalise, 
										dtime, dtcria, 
										codRecurso, lote, 
										origem, stsLote, 
										analise, loteAprov, 
										qtdeQuebra, qtdeQuebraAnalise, 
										recurso, codOpera, segundos, regTipo)
									select distinct
										@filial, @produto, 
										@qtdeQuebraAnalise, @qtdeQuebraAnalise, @qtdeQuebraAnalise, 
										max(dtime), max(dtcria), 
										max(codRecurso), @lote, 
										'S' origem, ' ' stsLote, 
										@analise, 'ABERTO' loteAprov,
										@qtdeQuebraL, @qtdeQuebraAnalise, 
										max(recurso), max(codOpera), 0 segundos, 'L' regTipo
									from
										PCP..oppcfLote
									where
										regTipo = 'T'							
									group by
										origem, stsLote
									set @qtdes = @qtdes - @qtdeQuebraAnalise
								end
						end
					else
						begin
							if @loteProduto >= @loteEspec 
								begin 
									if @qtdes > @qtdeQuebraAnalise
										begin
											set @lote = right('000000000' + convert(varchar(9), cast(@loteProduto as int) + 1), 9)
											set @analise = 'A01'
											insert PCP..oppcfLote (
												filial, produto, 
												qtde, qtdeLote, qtdeAnalise, 
												dtime, dtcria, 
												codRecurso, lote, 
												origem, stsLote, 
												analise, loteAprov, 
												qtdeQuebra, qtdeQuebraAnalise, 
												recurso, codOpera, segundos, regTipo)
											select distinct
												@filial, @produto, 
												@qtdeQuebraAnalise, @qtdeQuebraAnalise, @qtdeQuebraAnalise, 
												max(dtime), max(dtcria), 
												max(codRecurso), @lote, 
												'S' origem, ' ' stsLote, 
												@analise, 'ABERTO' loteAprov,
												@qtdeQuebraL, @qtdeQuebraAnalise, 
												max(recurso), max(codOpera), 0 segundos, 'L' regTipo
											from
												PCP..oppcfLote
											where
												regTipo = 'T'							
											group by
												origem, stsLote
											set @qtdes = @qtdes - @qtdeQuebraAnalise
										end								
								end
							else
								begin 
									if @qtdes > @qtdeQuebraAnalise
										begin
											set @lote = right('000000000' + convert(varchar(9), cast(@loteEspec as int) + 1), 9)
											set @analise = 'A01'
											insert PCP..oppcfLote (
												filial, produto, 
												qtde, qtdeLote, qtdeAnalise, 
												dtime, dtcria, 
												codRecurso, lote, 
												origem, stsLote, 
												analise, loteAprov, 
												qtdeQuebra, qtdeQuebraAnalise, 
												recurso, codOpera, segundos, regTipo)
											select distinct
												@filial, @produto, 
												@qtdeQuebraAnalise, @qtdeQuebraAnalise, @qtdeQuebraAnalise, 
												max(dtime), max(dtcria), 
												max(codRecurso), @lote, 
												'S' origem, ' ' stsLote, 
												@analise, 'ABERTO' loteAprov,
												@qtdeQuebraL, @qtdeQuebraAnalise, 
												max(recurso), max(codOpera), 0 segundos, 'L' regTipo
											from
												PCP..oppcfLote
											where
												regTipo = 'T'							
											group by
												origem, stsLote
											set @qtdes = @qtdes - @qtdeQuebraAnalise
										end								
								end
						end
					
				end
			else 
				begin 
					set @analise = (select max(analise) from PCP..oppcfLote where filial = @filial and produto = @produto and lote = @loteFilial )
					set @qtdeLote = (select sum(qtdeLote) from PCP..oppcfLote where filial = @filial and produto = @produto and lote = @loteFilial )
					if @qtdeLote < @qtdeQuebraL
						begin 
							set @saldoLote = @qtdeQuebraL - @qtdeLote
							set @qtdeAnalise = (select sum(qtdeAnalise) from PCP..oppcfLote where filial = @filial and produto = @produto and lote = @loteFilial and analise = @analise)
							
							
							if @qtdeQuebraAnalise > @qtdeAnalise
								begin 
									set @saldoAnalise = @qtdeQuebraAnalise - @qtdeAnalise
								end
							else
								begin 
									set @saldoLote = @qtdeQuebraL - @qtdeLote
									set @saldoAnalise = @qtdeQuebraAnalise
									if @saldoLote > @saldoAnalise
										begin 
											set @analise = 'A' + right('00' + convert(varchar(2), cast(right(@analise, 2) as int) + 1), 2)
											insert PCP..oppcfLote (
												filial, produto, 
												qtde, qtdeLote, qtdeAnalise, 
												dtime, dtcria, 
												codRecurso, lote, 
												origem, stsLote, 
												analise, loteAprov, 
												qtdeQuebra, qtdeQuebraAnalise, 
												recurso, codOpera, segundos, regTipo)
											select distinct
												@filial, @produto, 
												@saldoAnalise, @saldoAnalise, @saldoAnalise, 
												max(dtime), max(dtcria), 
												max(codRecurso), @lote, 
												'S' origem, ' ' stsLote, 
												@analise, 'ABERTO' loteAprov,
												@qtdeQuebraL, @qtdeQuebraAnalise, 
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
										
										end 
									
								end
							-- set @saldoAnalise = @qtdeQuebraAnalise - @qtdeAnalise
						end
					else
						begin 
							set @qtdes = @qtdes - 100
						end
					set @qtdes = @qtdes - 200
				end
				*/
			-- set @qtdes = @qtdes - 200
			-- if @qtdeLote = 0
			-- 	begin 
			-- 		set @loteAtual = '000000001'
			-- 	end
			-- else 
			-- 	begin
			-- 		if @qtdeLote < @qtdeQuebraL
			-- 			begin
			-- 				set @lote = @loteAtual
			-- 				set @analise = (isnull((select max(analise) from oppcfLote where filial = @filial and produto = @produto and lote = @loteAtual), 0))		
			-- 			end
			-- 		else 
			-- 			begin 
			-- 				set @loteAtual = right('000000000' + convert(varchar(9), cast(@loteAtual as int) + 1), 9)
			-- 				if @loteAtual >= @loteEspec
			-- 					begin 
			-- 						set @lote = @loteAtual
			-- 					end
			-- 				else
			-- 					begin 
			-- 						set @lote = @loteEspec
			-- 					end
			-- 				set @analise = 'A01'
			-- 			end
			-- 	end
				-- fim da definição do lote
			
		--end
	
	-- update PCP..oppcfLote set regTipo = 'S' where produto = 'PAN00775'

	--update PCP..oppcfLote set regTipo = 'S' where produto = 'PAN00775'

	-- begin
	-- 	set @opAtual = @op
	-- 	set @qtdeAponta = @qtdeAponta + @qtdes
	-- 	if @qtdeAponta <= 0
	-- 		begin
	-- 			update PCP..oppcfLote set regTipo = 'N', qtde_lote = 0 where id_num = @id_num
	-- 		end
	-- 	else
	-- 		begin
	-- 			set @loteOp = (isnull((select max(lote) from oppcfLote where op = @op and lote <> '000000000'), '000000000'));
				
	-- 			-- caso já exista algum lote para esta OP 
	-- 			if @loteOp <> '000000000'
	-- 				begin
	-- 					set @lote = @loteOp
	-- 					set @analise = (select max(analise) from oppcfLote where filial = @filial and op = @op and lote = @lote)
	-- 					set @analiseSituacao = (select max(loteAprov) from oppcfLote where filial = @filial and op = @op and lote = @lote and analise = @analise)
	-- 					if @analiseSituacao <> 'ABERTO'
	-- 						begin 
	-- 							-- set @analise = 'A' + right('00' + convert(varchar(2), cast(right(@analise, 2) as int) + 1), 2)
	-- 							set @qtdeLote = @qtdeQuebra
	-- 						end
	-- 					else
	-- 						begin 
	-- 							set @qtdeLote = (select qtde from oppcfLote where filial = @filial and op = @op and lote = @lote and analise = @analise)
	-- 						end
	-- 					set @saldo = @qtdeAponta
	-- 					set @qtdeAponta = 0
	-- 					if @qtdeLote <= @qtdeQuebra
	-- 						begin
	-- 							set @saldoFalta = @qtdeQuebra -  @qtdeLote
	-- 							if @saldo < @saldoFalta
	-- 								begin
	-- 									update PCP..oppcfLote set qtde = qtde + @saldo where filial = @filial and op = @op and lote = @lote and analise = @analise
	-- 									update PCP..oppcfLote set regTipo = 'N', qtde_lote = qtde where id_num = @id_num
	-- 								end
	-- 							else
	-- 								begin
	-- 									update PCP..oppcfLote set qtde = qtde + @saldoFalta where filial = @filial and op = @op and lote = @lote and analise = @analise
										
	-- 									set @saldo = @saldo - @saldoFalta
										
	-- 									while @saldo > 0
	-- 										begin
	-- 											set @analise = 'A' + right('00' + convert(varchar(2), cast(right(@analise, 2) as int) + 1), 2)
	-- 											if @saldo >= @qtdeQuebra
	-- 												begin
	-- 													insert PCP..oppcfLote (
	-- 															filial, op, produto, 
	-- 															qtde, dtime, dtcria, codRecurso, 
	-- 															lote, origem, stsLote, 
	-- 															analise, intervaloLote, 
	-- 															qtdeImp, loteAprov, 
	-- 															qtdeQuebra, recurso, codOpera, segundos, regTipo)
	-- 														SELECT
	-- 															filial, op, produto, 
	-- 															@qtdeQuebra, dtime, dtcria, codRecurso, 
	-- 															@lote, origem, stsLote, 
	-- 															@analise, intervaloLote, 
	-- 															0 qtdeImp,  'ABERTO' loteAprov,
	-- 															@qtdeQuebra, recurso, codOpera, segundos, 'L' regTipo
	-- 														FROM
	-- 															PCP..oppcfLote
	-- 														WHERE
	-- 															id_num = @id_num
														
	-- 													exec spcp_cria_lote_carac @filial, @produto, @lote, @analise
	-- 												end
	-- 											else
	-- 												begin
	-- 													insert PCP..oppcfLote (
	-- 															filial, op, produto, 
	-- 															qtde, dtime, dtcria, codRecurso, 
	-- 															lote, origem, stsLote, 
	-- 															analise, intervaloLote, 
	-- 															qtdeImp, loteAprov,
	-- 															qtdeQuebra, recurso, codOpera, segundos, regTipo)
	-- 														SELECT
	-- 															filial, op, produto, 
	-- 															@saldo, dtime, dtcria, codRecurso, 
	-- 															@lote, origem, stsLote, 
	-- 															@analise, intervaloLote, 
	-- 															0 qtdeImp,  'ABERTO' loteAprov,
	-- 															@qtdeQuebra, recurso, codOpera, segundos, 'L' regTipo
	-- 														FROM
	-- 															PCP..oppcfLote
	-- 														WHERE
	-- 															id_num = @id_num
															
	-- 													exec spcp_cria_lote_carac @filial, @produto, @lote, @analise
	-- 												end
	-- 											set @saldo = @saldo - @qtdeQuebra
	-- 										end
	-- 									update PCP..oppcfLote set regTipo = 'N', qtde_lote = qtde where id_num = @id_num
										
	-- 								end
	-- 						end
	-- 				end 
				



	-- 			if @loteOp = '000000000'
	-- 				begin
	-- 					set @loteEspec = (select loteAtual from PCP..qualEspecCab where cabProduto = @produto and situacao = 'Concluida')
	-- 					set @loteMax = (select max(lote) from PCP..oppcfLote where produto = @produto)
	-- 					set @lote = case when @loteEspec > @loteMax then @loteEspec else @loteMax end 
	-- 					set @lote = right('000000000' + convert(varchar(9), cast(@lote as int) + 1), 9)
	-- 					set @analise = 'A01'
						
	-- 					set @saldo = @qtdeAponta
	-- 					set @qtdeAponta = 0
	-- 					while @saldo > 0
	-- 						begin
	-- 							if @saldo >= @qtdeQuebra
	-- 								begin
	-- 									insert PCP..oppcfLote (
	-- 											filial, op, produto, 
	-- 											qtde, dtime, dtcria, codRecurso, 
	-- 											lote, origem, stsLote, 
	-- 											analise, intervaloLote, 
	-- 											qtdeImp, loteAprov,
	-- 											qtdeQuebra, recurso, codOpera, segundos, regTipo)
	-- 										SELECT
	-- 											filial, op, produto, 
	-- 											@qtdeQuebra, dtime, dtcria, codRecurso, 
	-- 											@lote, origem, stsLote, 
	-- 											@analise, intervaloLote, 
	-- 											0 qtdeImp,  'ABERTO' loteAprov,
	-- 											@qtdeQuebra, recurso, codOpera, segundos, 'L' regTipo
	-- 										FROM
	-- 											PCP..oppcfLote
	-- 										WHERE
	-- 											id_num = @id_num
										
	-- 									exec spcp_cria_lote_carac @filial, @produto, @lote, @analise
	-- 								end
	-- 							if @saldo < @qtdeQuebra
	-- 								begin
	-- 									insert PCP..oppcfLote (
	-- 											filial, op, produto, qtde, dtime, dtcria, codRecurso, 
	-- 											lote, origem, stsLote, 
	-- 											analise, intervaloLote, 
	-- 											qtdeImp, loteAprov,
	-- 											qtdeQuebra, recurso, codOpera, segundos, regTipo)
	-- 										SELECT
	-- 											filial, op, produto, 
	-- 											@saldo, dtime, dtcria, codRecurso, 
	-- 											@lote, origem, stsLote, 
	-- 											@analise, intervaloLote, 
	-- 											0 qtdeImp,  'ABERTO' loteAprov,
	-- 											@qtdeQuebra, recurso, codOpera, segundos, 'L' regTipo
	-- 										FROM
	-- 											PCP..oppcfLote
	-- 										WHERE
	-- 											id_num = @id_num
	-- 									exec spcp_cria_lote_carac @filial, @produto, @lote, @analise
	-- 								end
	-- 							set @saldo = @saldo - @qtdeQuebra
	-- 							set @analise = 'A' + right('00' + convert(varchar(2), cast(right(@analise, 2) as int) + 1), 2)
							
	-- 						end
	-- 					update PCP..oppcfLote set regTipo = 'N', qtde_lote = qtde where id_num = @id_num
	-- 		end 
		
	-- 	-- verificação da mudança de op
	-- 	if @opAtual <> @op
	-- 		begin 
	-- 	-- set @qtdeAponta = 0
	-- 		end 
	-- end
--spcp_cria_lote_11

	-- fechar o cursor 
-- if @qtdeAponta < 0
-- 	begin 
-- 		while @qtdeAponta < 0
-- 			begin 
-- 				set @analise = (isnull((select max(analise) from PCP..oppcfLote where filial = @filial and op = @op and lote >'000000000' and regTipo = 'L'), 'A00')) 
-- 				if @analise <> 'A00'
-- 					begin 
-- 						set @qtdeAnalise = (select qtde from PCP..oppcfLote where filial = @filial and op = @op and analise = @analise and regTipo = 'L') 
-- 						if @qtdeAnalise >= (@qtdeAponta * -1)
-- 							begin 
-- 								update PCP..oppcfLote set qtde = @qtdeAnalise + @qtdeAponta, qtde_lote = @qtdeAnalise + @qtdeAponta where filial = @filial and op = @op and analise = @analise and regTipo = 'L'
-- 								set @qtdeAponta = 0
-- 							end
-- 						else 
-- 							begin 
-- 								update PCP..oppcfLote set qtde = 0, qtde_lote = 0,  regTipo = 'E' where filial = @filial and op = @op and analise = @analise and regTipo = 'L'
-- 								set @qtdeAponta = @qtdeAponta + @qtdeAnalise
-- 							end

-- 					end
-- 				-- set @qtdeAponta = @qtdeAponta + 1	
-- 			end 
-- 	end 

-- sp_help 'oppcfLote'

GO


