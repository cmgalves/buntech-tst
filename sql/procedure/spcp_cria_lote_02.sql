SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET NOCOUNT ON
GO

ALTER procedure [dbo].[spcp_cria_lote_02]
    @filial varchar(3),
    @op varchar(11),
    @produto varchar(15),
    @cabQtdeQuebra int
as


/*
processamento de lotes por hora
spcp_cria_lote_01
select * from PCP..oppcfLoteHora
select * from PCP..oppcfLote
truncate table PCP..oppcfLoteHora
*/


declare 
    @horade datetime,
    @horate datetime,
    @dia datetime,
    @intervalo int,
    @vezesde int,
    @vezeste int

set @intervalo = 24 / case when @cabQtdeQuebra = 0 then 1 else @cabQtdeQuebra end
set @horade = '00:00:00'

declare loteIntervalo cursor for
select distinct
    convert(date, dtime) dia
from
    PCP..oppcfLote
where
	1 = 1
    and filial = @filial
    and op = @op
    and produto = @produto
    and lote = '000000000'
order by
    1


open loteIntervalo
fetch next from loteIntervalo   
into @dia
-- spcp_cria_lote_01

while @@FETCH_STATUS = 0
	begin
		set @vezesde = 0
		set @vezeste = 1
		while ( @vezesde <= @intervalo)
			begin
				set @horade = CONVERT(datetime,DATEADD(hour,@cabQtdeQuebra*@vezesde,@dia)  )
				set @horate = CONVERT(datetime,DATEADD(hour,@cabQtdeQuebra*@vezeste,@dia)  )
				insert into PCP..oppcfLoteHora
					(filial, op, produto, horade, horate)
				values
					(
						@filial, @op, @produto,
						@horade, @horate
					)
				set @vezesde  = @vezesde  + 1
				set @vezeste  = @vezeste  + 1
			end
		fetch next from loteIntervalo   
		into @dia
	end

/*
exec spcp_cria_lote_01 
select * from PCP..oppcfLoteHora
*/

-- processa os lotes por hora
exec spcp_cria_lote_03 

-- fechar o cursor 
close loteIntervalo
deallocate loteIntervalo

GO
