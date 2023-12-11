SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET NOCOUNT ON
GO

ALTER procedure [dbo].[spcp_cria_lote_03] as

/*
processamento de lotes por hora
spcp_cria_lote_01
*/

declare 
    @filial varchar(3),
    @op varchar(11),
    @produto varchar(15),
    @horade datetime,
    @horate datetime,
	@i int

set @i = 0 

declare loteInt cursor for
select distinct 
	filial, op, produto, horade, horate
from 
	PCP..oppcfLoteHora 
order by
    filial, op, produto, horade, horate

-- spcp_cria_lote_01
open loteInt
fetch next from loteInt   
into @filial, @op, @produto, @horade, @horate

while @@FETCH_STATUS = 0
	begin
        -- chama a função para verificar se já tem lote
		
		exec spcp_cria_lote_04 @filial, @op, @produto, @horade, @horate

		fetch next from loteInt   
		into @filial, @op, @produto, @horade, @horate
	end
close loteInt
deallocate loteInt
GO
