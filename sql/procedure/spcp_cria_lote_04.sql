ALTER procedure [dbo].[spcp_cria_lote_04]
	@filial varchar(3),
	@op varchar(11),
	@produto varchar(15),
	@horade datetime,
	@horate datetime
as
/*
update PCP..oppcfLote set lote = '000000000', analise = 'A00'

processamento de lotes por hora
spcp_cria_lote_01
*/

declare 
    @lote varchar(9),
    @loteEspe varchar(9),
    @loteOP varchar(9),
    @loteProd varchar(9),
    @analise varchar(03),
    @analiseProx varchar(03),
    @qtdeLote int,
    @qtdeComLote int,
    @qtde int


set @qtde = (select count(*) qtdeLote from PCP..oppcfLote where filial = @filial and op = @op and produto = @produto and dtime >= @horade and dtime < @horate)
set @qtdeComLote = (select count(*) qtdeLote from PCP..oppcfLote where filial = @filial and op = @op and produto = @produto and dtime >= @horade and dtime < @horate and lote > '000000000')


if @qtde > 0
	begin
		set @analise = 'A00'
		set @analiseProx = 'A01'

		--verifica se tem registros no mesmo periodo som lote, se tiver, mantem o lote e a analise
		set @qtdeLote = (select count(*) qtdeLote from PCP..oppcfLote where filial = @filial and op = @op and produto = @produto and dtime >= @horade and dtime < @horate and lote > '000000000')

/*
spcp_cria_lote_01
update PCP..oppcfLote set lote = '000000000', analise = 'A00'
*/


		--qtde do lote igual a zero, vamos come�ar o proximo lote, caso seja 000000000 pegaremos o pr�ximo dispon�vel
		if @qtdeLote = 0
			begin
				
				--pegar o lote caso tenha um lote nessa OP, se tiver, o lote dispon�vel � este
				set @loteOP = isnull((select max(lote) from PCP..oppcfLote where filial = @filial and op = @op and produto = @produto), '000000000')

				--se a OP j� tem um lote, LoteOP, mantem o lote e verifica a an�lise
				if @loteOP > '000000000'
					begin
						set @analise = (SELECT MAX(analise) FROM PCP..oppcfLote WHERE filial = @filial and op = @op and produto = @produto and lote = @loteOP)
						set @analiseProx = 'A' + right('00' + convert(varchar(2), cast(right(@analise, 2) as int) + 1), 2)
						update PCP..oppcfLote set lote = @loteOP, analise = @analiseProx where filial = @filial and op = @op and produto = @produto and dtime >= @horade and dtime < @horate

						exec spcp_cria_lote_carac @filial, @produto, @loteOP, @analiseProx

					end

				if @loteOP = '000000000'
					begin 
						--pegar o lote no cadastro da especifica��o
						set @loteEspe = (select distinct loteAtual from PCP..qualEspecCab where cabProduto = @produto and situacao = 'Concluida')
						
						--pegar o lote caso tenha um lote nessa OP, se tiver, o lote dispon�vel � este
						set @loteProd = isnull((select max(lote) from PCP..oppcfLote where produto = @produto), '000000000')

						if @loteEspe >= @loteProd
							begin 
								set @lote = right('000000000' + convert(varchar(9), cast(@loteEspe as int) + 1), 9)
							end
						else
							begin 
								set @lote = right('000000000' + convert(varchar(9), cast(@loteProd as int) + 1), 9)
							end
						update PCP..oppcfLote set lote = @lote, analise = 'A01' where filial = @filial and op = @op and produto = @produto and dtime >= @horade and dtime < @horate
						exec spcp_cria_lote_carac @filial, @produto, @lote, 'A01'

					end
			end
		
/*
spcp_cria_lote_01
update PCP..oppcfLote set lote = '000000000', analise = 'A00'
*/
	
		if @qtdeLote > 0
			begin
				set @analise = (
								SELECT 
									MAX(analise) 
								FROM 
									PCP..oppcfLote 
								WHERE 
									1 = 1
									and filial = @filial 
									and op = @op 
									and produto = @produto 
									and dtime >= @horade 
									and dtime < @horate 
									and lote > '000000000'
								)

				update
					PCP..oppcfLote
				set
					analise = @analise
				where
					1 = 1
					and filial = @filial
					and op = @op 
					and produto = @produto
					and dtime >= @horade 
					and dtime < @horate
				
				exec spcp_cria_lote_carac @filial, @produto, @lote, @analise

			end
	end
GO


