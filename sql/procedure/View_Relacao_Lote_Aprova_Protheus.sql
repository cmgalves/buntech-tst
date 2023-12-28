SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER procedure [dbo].[sp_manuLoteAnalisaAprova]
	@filial varchar(3),
	@op varchar(11),
	@produto varchar(15),
	@descricao varchar(70),
    @lote varchar(9),
    @usr int,
    @usrPerf varchar(2),
    @dtVenc varchar(8),
    @qtde float,
    @revisao varchar(3),
    @codCarac varchar(3),
    @itemin float,
    @itemax float,
    @itemeio varchar(50),
    @itetxt varchar(35),
    @result float,
    @resultxt varchar(10),
    @situacao varchar(15),
    @just varchar(250),
	@cTipo varchar(1)
as
/*,  '               ',  77,  'Reprovado',  'A' 

EXEC    PCP..sp_manuLoteAnalisaAprova  '108',  '03940601001',  'PAN01056',  'PIPICAT GRANULADO SANITARIO FLORAL CN 4KG 6X1',  '000000004',  1,  'Qualidade N1',  '20240315',  12,  '001',  '001',  10,  15,  'ITMA-035',  '',  2,  '2',  'Reprovado',  '',  'E'

loteAnalise
SELECT DISTINCT CAST(EMISSAO AS DATETIME) FROM OP WHERE FILIAL = '108' AND OP = '03939501001' AND EMISSAO <> ''

SELECT * FROM PCP..qualLote
DELETE FROM PCP..qualLote
*/

declare 
	@dtAprov varchar(8), 
	@hrAprov varchar(5),
	@dtAnalise varchar(8), 
	@hrAnalise varchar(5), 
	@nivel varchar(2), 
	@nivelAprov varchar(2), 
	@existReg int, 
	@qtdeProd float

set @dtAnalise = (select convert(varchar(8), getdate(), 112))
set @hrAnalise = (select convert(varchar(5), getdate(), 108))

set @dtAprov = (select convert(varchar(8), getdate(), 112))
set @hrAprov = (select convert(varchar(5), getdate(), 108))

set @existReg = isnull((select count(*) from loteAnalise where filial = @filial and op = @op and produto = @produto and lote = @lote and codCarac = @codCarac), 0)
set @qtdeProd = isnull((select sum(qtdeProd) from loteProd where filial = @filial and op = @op and produto = @produto and lote = @lote), 0)
set @nivel = isnull((select distinct nivel from loteProd where filial = @filial and produto = @produto and lote = @lote), '')

--EXEC    PCP..sp_manuLoteAnalisaAprova  '108',  ' ',  'PAN01070',  'MITZI GRANULADO SANITARIO CN 12KG 1X1',  '000000002',  1,  'N3',  '20240309',  20,  '001',  ' ',  0,  0,  ' ',  ' ',  0,  '0',  'Rejeitado',  'asdlçm moamsompwq pd qwoaso qwd asp c pas pas dpas d qwd isd',  'R' 

--select distinct nivel from loteProd where filial = '108' and produto = 'PAN01070' and lote = '000000001'

--select * from loteAprov 

if @cTipo = 'L' --Aprovação do Lote tela loteAprova - apenas para atualizar os dados

	begin
		set @result = isnull((select distinct result from loteProd where filial = @filial and produto = @produto and lote = @lote), '')
		set @resultxt = isnull((select distinct resultxt from loteProd where filial = @filial and produto = @produto and lote = @lote), '')
		update 
			loteAprov
		set 
			sitFim = @situacao
		where
			1 = 1
			and filial = @filial 
			and produto = @produto 
			and lote = @lote 
			and ativo = 'SIM'
		
		update 
			loteProd
		set 
			usrAprov = @usr,
			dtAprov = @dtAprov,
			hrAprov = @hrAprov, 
			situacao = @situacao, 
			resultado = @situacao,
			result = ' ', 
			resultxt = ' ', 
			userJusti = @usr,
			justificativa = @just 

		where
			1 = 1
			and filial = @filial 
			and produto = @produto 
			and lote = @lote 
	end

if @cTipo = 'A' --Aprovação do Lote tela loteAprova
	begin
		update 
			loteAprov
		set 
			ativo = 'NAO'
		where
			1 = 1
			and filial = @filial 
			and produto = @produto 
			and lote = @lote 
			and nivelAprov = @usrPerf
			and ativo = 'SIM'

		insert into PCP..loteAprov  
			(filial, op, produto, descricao, lote, revisao, nivel, nivelAprov, dtAprov, hrAprov, usrAprov, dtVenc, qtdeProd, situacao, justificativa, result, resultxt, ativo)
		values
			(@filial, @op, @produto, @descricao, @lote, @revisao, @nivel, @usrPerf, @dtAprov, @hrAprov, @usr, @dtVenc, @qtdeProd, @situacao, @just, @result, @resultxt, 'SIM')
	end


if @cTipo = 'B' --Aprovação do Lote automático pela análise
	begin
		
		insert into PCP..loteAprov  
			(filial, op, produto, descricao, lote, revisao, nivel, nivelAprov, dtAprov, hrAprov, usrAprov, dtVenc, qtdeProd, situacao, justificativa, result, resultxt, ativo, sitFim)
		values
			(@filial, @op, @produto, @descricao, @lote, @revisao, @nivel, @usrPerf, @dtAprov, @hrAprov, @usr, @dtVenc, @qtdeProd, @situacao, @just, @result, @resultxt, 'SIM', @situacao)
		
		update 
			loteProd
		set 
			usrAprov = @usr,
			dtAprov = @dtAprov,
			hrAprov = @hrAprov, 
			situacao = @situacao, 
			resultado = @situacao, 
			result = ' ', 
			resultxt = ' ', 
			userJusti = @usr,
			justificativa = @just 
		where
			1 = 1
			and filial = @filial 
			and produto = @produto 
			and lote = @lote 

		update 
			loteAnalise
		set 
			sitFim = @situacao
		where
			1 = 1
			and filial = @filial 
			and produto = @produto 
			and lote = @lote 

	end


if @cTipo = 'R' --Rejeição do Lote tela loteAprova
	begin
		update 
			loteAprov
		set 
			ativo = 'NAO'
		where
			1 = 1
			and filial = @filial 
			and produto = @produto 
			and lote = @lote 
			and nivelAprov = @usrPerf
			and ativo = 'SIM'

		insert into PCP..loteAprov  
			(filial, op, produto, descricao, lote, revisao, nivel, nivelAprov, dtAprov, hrAprov, usrAprov, dtVenc, qtdeProd, situacao, justificativa, result, resultxt, ativo)
		values
			(@filial, @op, @produto, @descricao, @lote, @revisao, @nivel, @usrPerf, @dtAprov, @hrAprov, @usr, @dtVenc, @qtdeProd, @situacao, @just, @result, @resultxt, 'SIM')
	end


if @cTipo = 'E' --Incluir, editar / alterar caracteristica do lote Analise de lote
	begin
		if @existReg > 0 
			begin
				update
					loteAnalise
				set
					dtAnalise = @dtAnalise, 
					hrAnalise = @hrAnalise,
					usrAnalise = @usr,
					situacao = @situacao,
					result = @result,
					resultxt = @resultxt 
				where
					1 = 1
					and filial = @filial
					and op = @op
					and produto = @produto
					and lote = @lote 
					and codCarac = @codCarac 
			end
		if @existReg = 0
			begin
				insert into PCP..loteAnalise  
					(filial, op, produto, descricao, lote, nivel, dtAprov, hrAprov, dtAnalise, hrAnalise, usrAprov, usrAnalise, dtVenc, qtdeProd, qtdeTot, revisao, codCarac, itemin, itemax, itemeio, result, situacao, itetxt, resultxt)
				values
					(@filial, @op, @produto, @descricao, @lote, @nivel, @dtAprov, @hrAprov, @dtAnalise, @hrAnalise, 0, @usr, @dtVenc, @qtdeProd, @qtde, @revisao, @codCarac, @itemin, @itemax, @itemeio, @result, @situacao, @itetxt, @resultxt)
			end
		update 
			loteProd 
		set 
			loteAprov = situac,
			dtAnaliseStatus = (select convert(varchar(8), getdate(), 112))
		from 
			loteProd a inner join 
			View_Relacao_Lote_Analisa_Situacao b on
			1 = 1
			and a.filial = b.filial
			and a.op = b.op
			and a.produto = b.produto
			and a.lote = b.lote
	--	where a.loteAprov <> situac
	end
	--alter table loteProd add dtAnaliseStatus varchar(8)

GO
