SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET NOCOUNT ON
GO

ALTER procedure [dbo].[spcp_cria_lote_01] as

/*
processa lote por hora
spcp_cria_lote_01
*/


declare 
	@filial varchar(3), 
	@op varchar(11), 
	@produto varchar(15), 
	@especQuebra varchar(4), 
	@cabQtdeQuebra int


declare produtoLote cursor for
	select distinct
		filial, op, produto, especQuebra, cabQtdeQuebra
	from
		oppcfLote a inner join
		qualEspecCab b on
		1 = 1
		and produto = cabProduto
	where
		1 = 1
		and b.situacao = 'Concluida'
		and b.especQuebra = 'HORA'
		and lote = '000000000'
        --and filial = '101'
        --and produto = 'PA000119'
        --and op = '103PA000119'
open produtoLote
fetch next from produtoLote   
into @filial, @op, @produto, @especQuebra, @cabQtdeQuebra

--spcp_cria_lote_01
while @@FETCH_STATUS = 0
	begin
		
		-- limpar a tabela que gera os intervalos para itens pendentes
		truncate table PCP..oppcfLoteHora

		exec spcp_cria_lote_02 @filial, @op, @produto, @cabQtdeQuebra -- Cria tabela temporária com os intervalos possíveis
			
		fetch next from produtoLote   
		into @filial, @op, @produto, @especQuebra, @cabQtdeQuebra
	end

	-- fechar o cursor 
close produtoLote
deallocate produtoLote
GO
