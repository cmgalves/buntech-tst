SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



ALTER procedure [dbo].[spcp_cria_lote_12]
    @filial varchar(3),
    @produto varchar(15),
    @qtdeQuebra float
as


/*
processamento de lotes por quantidade
spcp_cria_lote_11
select * from PCP..oppcfLote
select * from PCP..oppcfLote where produto = 'PAN01051'
truncate table PCP..oppcfLote
truncate table PCP..oppcf
*/


declare 
	@id_num int,
	@op varchar(11),
	@qtde float,
	@dtime datetime,
	@qtdeAnalise float,
	@saldo float,
	@saldoFalta float,
	@qtdeLote float,
	@analise varchar(3),
	@analiseOp varchar(3),
	@analiseProx varchar(3),
	@lote varchar(9),
	@loteOp varchar(9),
	@loteMax varchar(9),
	@loteEspec varchar(9)


declare prodQtde cursor for
	select
		id_num, op, qtde, dtime
	from
		oppcfLote
	where
		1 = 1
		and filial = '108'
		and produto = 'PAN00136'
		-- and filial = @filial
		-- and produto = @produto
		and lote = '000000000'
		and regTipo = 'S'
	order by
		filial, produto, op, dtime
		

open prodQtde
fetch next from prodQtde   
into @id_num, @op, @qtde, @dtime

--spcp_cria_lote_11
while @@FETCH_STATUS = 0
	begin
		set @loteOp = (isnull((select max(lote) from oppcfLote where op = @op and lote <> '000000000'), '000000000'));
		if @loteOp <> '000000000'
			begin
				set @lote = @loteOp
				set @analise = (select max(analise) from oppcfLote where filial = @filial and op = @op and lote = @lote)
				set @qtdeLote = (select qtde from oppcfLote where filial = @filial and op = @op and lote = @lote and analise = @analise)
				set @saldo = @qtde
				if @qtdeLote <= @qtdeQuebra
					begin
						set @saldoFalta = @qtdeQuebra -  @qtdeLote
						if @saldo < @saldoFalta
							begin
								update PCP..oppcfLote set qtde = qtde + @saldo where filial = @filial and op = @op and lote = @lote and analise = @analise
								update PCP..oppcfLote set regTipo = 'N' where id_num = @id_num
							end
						else
							begin
								update PCP..oppcfLote set qtde = qtde + @saldoFalta where filial = @filial and op = @op and lote = @lote and analise = @analise
								
								set @saldo = @saldo - @saldoFalta
								
								while @saldo > 0
									begin
										set @analise = 'A' + right('00' + convert(varchar(2), cast(right(@analise, 2) as int) + 1), 2)
										if @saldo >= @qtdeQuebra
											begin
												insert PCP..oppcfLote (
														filial, op, produto, 
														qtde, dtime, dtcria, codRecurso, 
														lote, origem, stsLote, 
														analise, intervaloLote, 
														qtdeImp, loteAprov, 
														qtdeQuebra, recurso, codOpera, segundos, regTipo)
													SELECT
														filial, op, produto, 
														@qtdeQuebra, dtime, dtcria, codRecurso, 
														@lote, origem, stsLote, 
														@analise, intervaloLote, 
														0 qtdeImp,  'ABERTO' loteAprov,
														@qtdeQuebra, recurso, codOpera, segundos, 'L' regTipo
													FROM
														PCP..oppcfLote
													WHERE
														id_num = @id_num
												
												exec spcp_cria_lote_carac @filial, @produto, @lote, @analise
											end
										else
											begin
												insert PCP..oppcfLote (
														filial, op, produto, 
														qtde, dtime, dtcria, codRecurso, 
														lote, origem, stsLote, 
														analise, intervaloLote, 
														qtdeImp, loteAprov,
														qtdeQuebra, recurso, codOpera, segundos, regTipo)
													SELECT
														filial, op, produto, 
														@saldo, dtime, dtcria, codRecurso, 
														@lote, origem, stsLote, 
														@analise, intervaloLote, 
														0 qtdeImp,  'ABERTO' loteAprov,
														@qtdeQuebra, recurso, codOpera, segundos, 'L' regTipo
													FROM
														PCP..oppcfLote
													WHERE
														id_num = @id_num
													
												exec spcp_cria_lote_carac @filial, @produto, @lote, @analise
											end
										set @saldo = @saldo - @qtdeQuebra
									end
								update PCP..oppcfLote set regTipo = 'N' where id_num = @id_num
								
							end
					end
			end 
		



		if @loteOp = '000000000'
			begin
				set @loteEspec = (select loteAtual from PCP..qualEspecCab where cabProduto = @produto and situacao = 'Concluida')
				set @loteMax = (select max(lote) from PCP..oppcfLote where produto = @produto)
				set @lote = case when @loteEspec > @loteMax then @loteEspec else @loteMax end 
				set @lote = right('000000000' + convert(varchar(9), cast(@lote as int) + 1), 9)
				set @analise = 'A01'
				
				set @saldo = @qtde
				while @saldo > 0
					begin
						if @saldo >= @qtdeQuebra
							begin
								insert PCP..oppcfLote (
										filial, op, produto, 
										qtde, dtime, dtcria, codRecurso, 
										lote, origem, stsLote, 
										analise, intervaloLote, 
										qtdeImp, loteAprov,
										qtdeQuebra, recurso, codOpera, segundos, regTipo)
									SELECT
										filial, op, produto, 
										@qtdeQuebra, dtime, dtcria, codRecurso, 
										@lote, origem, stsLote, 
										@analise, intervaloLote, 
										0 qtdeImp,  'ABERTO' loteAprov,
										@qtdeQuebra, recurso, codOpera, segundos, 'L' regTipo
									FROM
										PCP..oppcfLote
									WHERE
										id_num = @id_num
								
								exec spcp_cria_lote_carac @filial, @produto, @lote, @analise
							end
						if @saldo < @qtdeQuebra
							begin
								insert PCP..oppcfLote (
										filial, op, produto, qtde, dtime, dtcria, codRecurso, 
										lote, origem, stsLote, 
										analise, intervaloLote, 
										qtdeImp, loteAprov,
										qtdeQuebra, recurso, codOpera, segundos, regTipo)
									SELECT
										filial, op, produto, 
										@saldo, dtime, dtcria, codRecurso, 
										@lote, origem, stsLote, 
										@analise, intervaloLote, 
										0 qtdeImp,  'ABERTO' loteAprov,
										@qtdeQuebra, recurso, codOpera, segundos, 'L' regTipo
									FROM
										PCP..oppcfLote
									WHERE
										id_num = @id_num
								exec spcp_cria_lote_carac @filial, @produto, @lote, @analise
							end
						set @saldo = @saldo - @qtdeQuebra
						set @analise = 'A' + right('00' + convert(varchar(2), cast(right(@analise, 2) as int) + 1), 2)
					
					end
				update PCP..oppcfLote set regTipo = 'N' where id_num = @id_num
			end 
		fetch next from prodQtde   
		into @id_num, @op, @qtde, @dtime

	end
--spcp_cria_lote_11

	-- fechar o cursor 
close prodQtde
deallocate prodQtde

-- sp_help 'oppcfLote'

GO
