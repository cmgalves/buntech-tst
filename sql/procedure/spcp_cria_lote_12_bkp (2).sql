SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



ALTER procedure [dbo].[spcp_cria_lote_12]
    @filial varchar(3),
    @produto varchar(15),
    @qtdeQuebraLote float,
    @qtdeQuebraAnalise float
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
	@qtdes float,
	@qtdeAnalise float,
	@qtdeLote float,
	@qtdeAponta float,
	@dtime datetime,
	@saldoLote float,
	@saldoAnalise float,
	@saldoFalta float,
	@analise varchar(3),
	@analiseOp varchar(3),
	@analiseProx varchar(3),
	@analiseSituacao varchar(15),
	@lote varchar(9),
	@loteFilial varchar(9),
	@loteProduto varchar(9),
	@loteAtual varchar(9),
	@loteMax varchar(9),
	@loteEspec varchar(9)

set @qtdeLote = 0
set @qtdes = (select sum(qtde) qtdes from oppcfLote where filial = @filial and produto = @produto and regTipo = 'T')
-- declare prodQtde cursor for

-- /*
-- spcp_cria_lote_11
-- select max(lote) from oppcfLote where lote <> '000000000' and produto = 'PAN00775'
-- */
-- while @@FETCH_STATUS = 0
		-- definição do lote
	while @qtdes > 0
		begin 
			set @loteEspec = (select loteAtual from PCP..qualEspecCab where cabProduto = @produto and situacao = 'Concluida')
			set @loteFilial = (isnull((select max(lote) from oppcfLote where filial = @filial and produto = @produto and lote <> '000000000'), '000000000'))
			set @loteProduto = (isnull((select max(lote) from oppcfLote where produto = @produto and lote <> '000000000'), '000000000'))
			if @loteFilial = '000000000'
				begin
					if @loteProduto = '000000000'
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
										@qtdeQuebraAnalise, @qtdeQuebraAnalise, 
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
												@qtdeQuebraAnalise, @qtdeQuebraAnalise, 
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
												@qtdeQuebraAnalise, @qtdeQuebraAnalise, 
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
					set @qtdeAnalise = (select sum(qtdeAnalise) from PCP..oppcfLote where filial = @filial and produto = @produto and lote = @loteFilial and analise = @analise)
					
					if @qtdeQuebraLote > @qtdeLote
						begin 
							if @qtdeQuebraAnalise > @qtdeAnalise
								begin 
									set @saldoAnalise = @qtdeQuebraAnalise - @qtdeAnalise
									print @saldoAnalise
								end
							else
								begin 
									set @saldoLote = @qtdeQuebraLote - @qtdeLote
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
												@qtdeQuebraLote, @qtdeQuebraAnalise, 
												max(recurso), max(codOpera), 0 segundos, 'L' regTipo
											from
												PCP..oppcfLote
											where
												regTipo = 'T'							
											group by
												origem, stsLote
											set @qtdes = @qtdes - @saldoAnalise
										end

									print @qtdes
									print @saldoLote
								end
							-- set @saldoAnalise = @qtdeQuebraAnalise - @qtdeAnalise
						end
					
				end

			-- set @qtdes = @qtdes - 200
			-- if @qtdeLote = 0
			-- 	begin 
			-- 		set @loteAtual = '000000001'
			-- 	end
			-- else 
			-- 	begin
			-- 		if @qtdeLote < @qtdeQuebraLote
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
			
		end
	
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
	-- 			print @op
	-- 			print @opAtual
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
-- 				-- print @analise
-- 				-- print @qtdeAponta
-- 				-- -- print @id_num
-- 				-- -- print @lote
-- 				-- print @op
-- 				-- -- print @qtdes
-- 				-- -- print @dtime
-- 				-- set @qtdeAponta = @qtdeAponta + 1	
-- 			end 
-- 	end 

-- sp_help 'oppcfLote'

GO
