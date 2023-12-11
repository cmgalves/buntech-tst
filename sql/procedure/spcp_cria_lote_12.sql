SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET NOCOUNT ON
GO

ALTER procedure [dbo].[spcp_cria_lote_12]
    @filial varchar(3),
    @produto varchar(15),
    @cabQtdeQuebra int
as


/*
processamento de lotes por quantidade
spcp_cria_lote_11
select * from PCP..oppcfLoteHora
select * from PCP..oppcfLote where produto = 'PAN01051'
truncate table PCP..oppcfLoteHora
*/


declare 
	@id_num int,
	@qtde float,
	@dtime datetime,
	@lote varchar(9),
	@qtdeLote float,
	@loteMax varchar(9),
	@loteEspec varchar(9)

	--seleciona o maior lote por filial
	set @lote = (select max(lote) from PCP..oppcfLote where filial = @filial and produto = @produto)
	set @qtdeLote = 0

declare prodQtde cursor for
	select
		id_num, qtde, dtime
	from
		oppcfLote
	where
		1 = 1
		--and filial = '101'
		--and produto = 'PA000118'
		and filial = @filial
		and produto = @produto
		and lote = '000000000'
	order by
		filial, produto, dtime
		

open prodQtde
fetch next from prodQtde   
into @id_num, @qtde, @dtime

--spcp_cria_lote_11
while @@FETCH_STATUS = 0
	begin
		
		set @qtdeLote = isnull((select sum(qtde) from PCP..oppcfLote where filial = @filial and produto = @produto and lote = @lote), 0) + @qtde
		
		if @qtdeLote <= @cabQtdeQuebra
			begin
				if @lote = '000000000'
					begin
						set @loteEspec = (select loteAtual from PCP..qualEspecCab where cabProduto = @produto and situacao = 'Concluida')
						set @loteMax = (select max(lote) from PCP..oppcfLote where produto = @produto)
						if @loteEspec > @loteMax
							begin
								set @lote = right('000000000' + convert(varchar(9), cast(@loteEspec as int) + 1), 9)
							end
						else
							begin
								set @lote = right('000000000' + convert(varchar(9), cast(@loteMax as int) + 1), 9)
							end
						update PCP..oppcfLote set lote = @lote, analise = 'A01' where id_num = @id_num
					end
				else
					begin
						update PCP..oppcfLote set lote = @lote, analise = 'A01' where id_num = @id_num
					end

			end 
		else
			begin
				set @loteEspec = (select loteAtual from PCP..qualEspecCab where cabProduto = @produto and situacao = 'Concluida')
				set @loteMax = (select max(lote) from PCP..oppcfLote where produto = @produto)
				if @loteEspec > @loteMax
					begin
						set @lote = right('000000000' + convert(varchar(9), cast(@loteEspec as int) + 1), 9)
					end
				else
					begin
						set @lote = right('000000000' + convert(varchar(9), cast(@loteMax as int) + 1), 9)
					end
				update PCP..oppcfLote set lote = @lote, analise = 'A01' where id_num = @id_num
			end
		fetch next from prodQtde   
		into @id_num, @qtde, @dtime
	end
--spcp_cria_lote_11

	-- fechar o cursor 
close prodQtde
deallocate prodQtde



GO
