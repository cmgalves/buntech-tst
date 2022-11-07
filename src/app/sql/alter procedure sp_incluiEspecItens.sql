

alter procedure sp_incluiEspecItens
	@iteProduto varchar(15),
    @iteRevisao varchar(03),
    @iteCarac varchar(03),
    @iteMin float,
    @iteMax float
as

-- procedure para inclusão de escecificações na tabela principal

/*
sp_incluiEspecItens 
    'PA000118', '001', '005', 20,30

SELECT * FROM qualEspecItens

	iteProduto, iteRevisao, iteCarac, iteMin, iteMax,

*/

	begin
		insert into PCP..qualEspecItens  
			(iteProduto, iteRevisao, iteCarac, iteMin, iteMax)
		values
			(@iteProduto, @iteRevisao, @iteCarac, @iteMin, @iteMax)
	end
GO
