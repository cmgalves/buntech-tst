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
	@id_num int,
	@fil varchar(3),
	@prod varchar(15),
	@op varchar(11),
	@lote varchar(9),
	@qtdes float,
	@quebraLote float,
	@quebraAnalise float

declare produtoLote cursor for
	select
        id_num, filial fil, produto prod, op, lote,
        qtde qtdes, qtdeQuebra quebraLote,
        qtdeQuebraAnalise quebraAnalise
    from
        oppcfLote a inner join
        qualEspecCab b on
            produto = cabProduto
    where
            1 = 1
        and a.regTipo = 'S'
        and a.produto = 'PAN00775'
        and a.op = '04758701001'
        and b.situacao = 'Concluida'
        and b.especQuebra = 'QTDE'
    order by
            2,3,4

open produtoLote
fetch next from produtoLote   
into @id_num, @fil, @prod, @op, @lote, @qtdes, @quebraLote, @quebraAnalise

--spcp_cria_lote_11
while @@FETCH_STATUS = 0
	begin
		update
			oppcfLote
		set
			regTipo = 'W'
		where
			1 = 1
			and id_num = @id_num
 
		exec spcp_cria_lote_12 @id_num, @fil, @prod, @op, @lote, @qtdes, @quebraLote, @quebraAnalise  -- processa lotes por qtde

		fetch next from produtoLote   
		into @id_num, @fil, @prod, @op, @lote, @qtdes, @quebraLote, @quebraAnalise
	end

--exec spcp_cria_lote_13  -- processa lotes por qtde para geração das análises
	-- fechar o cursor 
close produtoLote
deallocate produtoLote
GO
