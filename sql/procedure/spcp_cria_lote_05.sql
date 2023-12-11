USE [PCP]
GO

/****** Object:  StoredProcedure [dbo].[spcp_cria_lote_01]    Script Date: 09/12/2023 19:09:02 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

set nocount on

go

create procedure [dbo].[spcp_cria_lote_11] as

/*
processa lote por quantidade
spcp_cria_lote_11
*/


declare 
	@filial varchar(3), 
	@op varchar(11), 
	@produto varchar(15), 
	@especQuebra varchar(4), 
	@cabQtdeQuebra int


declare produtoLote cursor for
	select distinct
		filial, '' op, produto, especQuebra, cabQtdeQuebra
	from
		oppcfLote a inner join
		qualEspecCab b on
		1 = 1
		and produto = cabProduto
	where
		1 = 1
		and b.situacao = 'Concluida'
		and b.especQuebra = 'QTDE'
		and lote = '000000000'

open produtoLote
fetch next from produtoLote   
into @filial, @op, @produto, @especQuebra, @cabQtdeQuebra

--spcp_cria_lote_11
while @@FETCH_STATUS = 0
	begin
		
		exec spcp_cria_lote_12 @filial, @op, @produto, @cabQtdeQuebra  -- processa lotes por qtde

		fetch next from produtoLote   
		into @filial, @op, @produto, @especQuebra, @cabQtdeQuebra
	end

	-- fechar o cursor 
close produtoLote
deallocate produtoLote
GO


