create procedure [dbo].[sp_incluiEspecificacoes]

--sp_incluiAlteraCaracteristica 2, '001', 'descricação gocio'
--SELECT * FROM PCP..qualCarac
	@tipoCarac varchar(01),
	@codCarac varchar(03),
	@descCarac varchar(55)
as


if @tipoCarac = 'I'
	begin
		insert into PCP..qualCarac  
			(capProduto, descrProd, vigenciaDe, vigenciaAte, cabRevisao)
		values
			(@capProduto, @descrProd, @vigenciaDe, @vigenciaAte, @cabRevisao)
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


-- SELECT cabProduto, descrProd, vigenciaDe, vigenciaAte, cabRevisao FROM qualEspecCab
-- SELECT iteProduto, iteRevisao, iteCarac FROM qualEspecItens