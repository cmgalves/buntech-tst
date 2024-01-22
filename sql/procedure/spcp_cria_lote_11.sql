SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


ALTER procedure [dbo].[spcp_cria_lote_11] as

/*
processa lote por quantidade.
levantamento apenas o produto com a qtde de quebra
spcp_cria_lote_11
*/


declare 
	@filial varchar(3), 
	@op varchar(11), 
	@produto varchar(15), 
	@especQuebra varchar(4), 
	@cabQtdeQuebra int, 
	@qtdeAnalise  int


declare produtoLote cursor for
	select distinct
		a.filial, a.produto, b.especQuebra, b.cabQtdeQuebra, b.qtdeAnalise
	from
		oppcfLote a inner join
		qualEspecCab b on
		produto = cabProduto
	where
		b.situacao = 'Concluida'
		and b.especQuebra = 'QTDE'
		and filial = '108'
		and a.produto = 'PAN00775'
		and a.lote = '000000000'
		and a.regTipo = 'S'

open produtoLote
fetch next from produtoLote   
into @filial, @produto, @especQuebra, @cabQtdeQuebra, @qtdeAnalise

--spcp_cria_lote_11
while @@FETCH_STATUS = 0
	begin
		
		update
			oppcfLote
		set
			regTipo = 'T'
		where
			filial = @filial
			and produto = @produto
			and lote = '000000000'
			and regTipo = 'S'
 
		exec spcp_cria_lote_12 @filial, @produto, @cabQtdeQuebra, @qtdeAnalise  -- processa lotes por qtde

		fetch next from produtoLote   
		into @filial, @produto, @especQuebra, @cabQtdeQuebra, @qtdeAnalise
	end

	-- fechar o cursor 
close produtoLote
deallocate produtoLote
GO
