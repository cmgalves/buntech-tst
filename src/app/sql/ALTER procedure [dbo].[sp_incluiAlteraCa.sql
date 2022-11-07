ALTER procedure [dbo].[sp_incluiAlteraCaracteristica]

--sp_incluiAlteraCaracteristica 'I', '002', 'Carac numero 2'
--SELECT * FROM PCP..qualCarac
	@tipoCarac varchar(01),
	@codCarac varchar(03),
	@descCarac varchar(55)
as


if @tipoCarac = 'I'
	begin
		insert into PCP..qualCarac  
			(codCarac, descCarac)
		values
			(@codCarac, @descCarac)
	end

if @tipoCarac = 'A'
	begin
		update 
			PCP..qualCarac 
		set
			descCarac = @descCarac
		where
			codCarac = @codCarac
	end

GO
