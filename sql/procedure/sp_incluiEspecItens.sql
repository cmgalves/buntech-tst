SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


ALTER procedure [dbo].[sp_incluiEspecItens]
	@iteProduto varchar(15),
    @iteRevisao varchar(03),
    @iteCarac varchar(03),
    @iteMin float,
    @iteMax float,
    @iteMeio varchar(100),
    @iteTxt varchar(35),
    @iteTp varchar(01)
as

-- procedure para inclusão de escecificações na tabela principal

/*
EXEC    PCP..sp_incluiEspecItens  'PAN00009',  '223',  '084',  15,  15,  '999',  '888',  'I' 
EXEC    PCP..sp_incluiEspecItens  'PAN00009',  '223',  '084',  15.000,  15.000,  '666',  '555',  'A' 
EXEC    PCP..sp_incluiEspecItens  'PAN00009',  '224',  '084',  15.000,  15.000,  'meio',  'par',  'A'
SELECT * FROM qualEspecItens

	iteProduto, iteRevisao, iteCarac, iteMin, iteMax,

*/

declare 
	@existEspec int


if @iteTp = 'E'
	begin
		delete
			PCP..qualEspecItens  
		where
			1 = 1
			and iteProduto = @iteProduto
			and iteRevisao = @iteRevisao
			and iteCarac = @iteCarac
	end

else
	begin
		set @existEspec = isnull((
								select 
									count(*) 
								from 
									PCP..qualEspecItens 
								where 
									1 = 1
									and iteProduto = @iteProduto 
									and iteRevisao = @iteRevisao
									and iteCarac = @iteCarac), 0)
		
			begin
				if @existEspec = 0
					begin
						insert into PCP..qualEspecItens  
							(iteProduto, iteRevisao, iteCarac, iteMin, iteMax, iteTxt, iteMeio)
						values
							(@iteProduto, @iteRevisao, @iteCarac, @iteMin, @iteMax, @iteTxt, @iteMeio)
					end
				if @existEspec > 0
					begin
						update 
							PCP..qualEspecItens  
						set
							iteMin = @iteMin, 
							iteMax = @iteMax,
							iteTxt = @iteTxt,
							iteMeio = @iteMeio
						where
							1 = 1
							and iteProduto = @iteProduto
							and iteRevisao = @iteRevisao
							and iteCarac = @iteCarac
					end
			end
	end
GO
