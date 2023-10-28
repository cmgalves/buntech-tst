SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER procedure [dbo].[sp_manuLote]
	@filial varchar(3),
	@op varchar(11),
	@produto varchar(15),
	@descricao varchar(70),
    @revisao varchar(3),
    @lote varchar(9),
    @validade int,
    @quebra varchar(4),
    @nivel varchar(2),
    @qtde float,
    @obs varchar(250),
    @usuario int,
	@cTipo varchar(1)
as

/*
EXEC    PCP..sp_manuLote  '108',  '03942501001',  'PAN01053',  'PIPICAT GRANULADO SANITARIO CLASSIC CN 12KG 1X1',  '001',  '000000050',  12,  'PESO',  'N1',  20,  '',  1,  'P' 

SELECT DISTINCT CAST(EMISSAO AS DATETIME) FROM OP WHERE FILIAL = '108' AND OP = '03939501001' AND EMISSAO <> ''

SELECT * FROM PCP..qualLote
DELETE FROM PCP..qualLote
*/
declare 
	@existRev int,
	@qtSaldo float, --saldo a ser lançado nos lotes
	@qtUsada float, --qtde já usada do lote
	@ultLote varchar(9), --Ultimo lote usado
	@loteCad varchar(9), --Ultimo lote usado
	@auxLote varchar(9), --lote auxiliar para calculo
	@ultimaRev varchar(3),
	@novaRev varchar(3),
	@ultimaSeq varchar(3),
	@novaSeq varchar(3),
	@dtHoje varchar(8),
	@hrHoje varchar(5),
	@dtEmis varchar(10),
	@dtVenc varchar(8),
    @qtLote float,
    @obsAntes varchar(25)



set @existRev = isnull((select count(*) from PCP..qualLote where produto = @produto), 0)
set @ultimaRev = isnull((select max(revisao) from PCP..qualLote where produto = @produto), '001')
set @novaRev = right(concat('000', rtrim(convert(varchar(3), cast(@ultimaRev as int) + 1))), 3)
set @ultimaSeq = isnull((select max(seq) from PCP..qualLote where produto = @produto and lote = @lote), '000')
set @novaSeq = right(concat('000', rtrim(convert(varchar(3), cast(@ultimaSeq as int) + 1))), 3)
set @loteCad = isnull((select max(lote) from PCP..qualLote where produto = @produto), '000000001')
set @dtHoje = (select convert(varchar(10), getdate(), 112))
set @hrHoje = (select convert(varchar(5), getdate(), 108))
set @dtEmis = isnull((SELECT DISTINCT EMISSAO FROM OP WHERE FILIAL = @filial AND OP = @op AND EMISSAO <> ''), '')
set @dtVenc = (convert(varchar(8), dateadd(month, @validade, convert(datetime, @dtEmis, 103)), 112))
set @qtLote = isnull((select qtde from PCP..qualLote where produto = @produto and ativo = 'SIM'), 0)
set @qtUsada = isnull((select sum(qtdeProd) qt from PCP..loteProd where produto = @produto and situacao = 'Aberto'), 0)
--convert(varchar(8), dateadd(month, validade, convert(datetime, EMISSAO, 103)), 112) dtVenc, 

if @cTipo = 'I' --Incluir lote novo, sem revisões anteriores

	if @revisao = '000'
		begin
			insert into PCP..qualLote  
				(produto, descricao, lote, diaRevisao, hrRevisao, validade, qtde, seq, quebra, revisao, ativo, obs, nivel, usuario)
			values
				(@produto, @descricao, @lote, @dtHoje, @hrHoje, @validade, @qtde, @novaSeq, @quebra, '001', 'SIM', @obs, @nivel, @usuario)

		end

if @cTipo = 'R' --Incluir revisões ao lote

	begin
		update 
			PCP..qualLote  
		set
			ativo = 'NAO'
		where
			1 = 1
			and produto = @produto 
			and revisao = @revisao

		insert into PCP..qualLote  
			(produto, descricao, lote, diaRevisao, hrRevisao, validade, qtde, seq, quebra, revisao, ativo, obs, nivel, usuario)
		values
			(@produto, @descricao, @lote, @dtHoje, @hrHoje, @validade, @qtde, @novaSeq, @quebra, @novaRev, 'SIM', @obs, @nivel, @usuario)

	end

if @cTipo = 'P' --Produção Parcia ou total da OP

	begin
		set @qtSaldo = @qtde
		while (@qtSaldo > 0)
			begin
				if @qtUsada > 0
					begin
						set @ultLote = (select distinct lote from loteProd where produto = @produto and situacao = 'Aberto')
						if @ultLote < @loteCad
							begin
								set @ultLote = @loteCad
							end
					end
				if @qtUsada = 0
					begin
						if @ultLote = ''
							begin
								set @ultLote = (select distinct lote from PCP..qualLote where produto = @produto and ativo = 'SIM')
							end
						else
							begin
								set @auxLote = isnull((select max(lote) from loteProd where produto = @produto group by produto), '')
								
								if @auxLote >= @loteCad
									begin
										set @ultLote = right(concat('000000000', rtrim(convert(varchar(9), cast(@auxLote as int) + 1))), 9)
										--set @ultLote = @loteCad
									end
								if @auxLote < @loteCad
									begin
										set @ultLote = @loteCad
										--set @ultLote = @loteCad
									end
							end
						
					end

				if @qtSaldo = @qtLote - @qtUsada and @qtSaldo > 0
					begin
						insert into PCP..loteProd  
							(filial, op, produto, descricao, lote, loteAprov, dtAprov, usrAprov, usrProd, dtProd, hrProd, dtVenc, qtdeProd, qtdeQuebra, qtdeTot, quebra, nivel, revisao, situacao, fechamento, obs)
						values
							(@filial, @op, @produto, @descricao, @ultLote, '',    '',     0,        @usuario, @dtHoje, @hrHoje, @dtVenc, @qtSaldo, @qtLote, @qtde, @quebra, @nivel, @revisao, 'Fechado', '', @obs)
						set @qtSaldo = 0
						set @qtUsada = 0
						update PCP..loteProd set situacao = 'Fechado', fechamento = (select convert(varchar(10), getdate(), 112)) where produto = @produto and lote = @ultLote
						update PCP..qualLote set lote = @ultLote where produto = @produto and ativo = 'SIM'

					end
				if @qtSaldo < @qtLote - @qtUsada and @qtSaldo > 0
					begin
						insert into PCP..loteProd  
							(filial, op, produto, descricao, lote, loteAprov, dtAprov, usrAprov, usrProd, dtProd, hrProd, dtVenc, qtdeProd, qtdeQuebra, qtdeTot, quebra, nivel, revisao, situacao, fechamento, obs)
						values
							(@filial, @op, @produto, @descricao, @ultLote, '',    '',     0,        @usuario, @dtHoje, @hrHoje, @dtVenc, @qtSaldo, @qtLote, @qtde, @quebra, @nivel, @revisao, 'Aberto', '', @obs)
						set @qtSaldo = 0
						set @qtUsada = 0
					end

				if @qtSaldo > @qtLote - @qtUsada and @qtSaldo > 0
					begin
						insert into PCP..loteProd  
							(filial, op, produto, descricao, lote, loteAprov, dtAprov, usrAprov, usrProd, dtProd, hrProd, dtVenc, qtdeProd, qtdeQuebra, qtdeTot, quebra, nivel, revisao, situacao, fechamento, obs)
						values
							(@filial, @op, @produto, @descricao, @ultLote, '',    '',     0,        @usuario, @dtHoje, @hrHoje, @dtVenc, @qtLote - @qtUsada, @qtLote, @qtde, @quebra, @nivel, @revisao, 'Fechado', '', @obs)
						print(@qtSaldo)
						print(@qtLote)
						print(@qtUsada)
						print(@ultLote)
						set @qtSaldo = @qtSaldo - (@qtLote - @qtUsada)
						set @qtUsada = 0

						update PCP..loteProd set situacao = 'Fechado', fechamento = (select convert(varchar(10), getdate(), 112)) where produto = @produto and lote = @ultLote
						update PCP..qualLote set lote = @ultLote where produto = @produto and ativo = 'SIM'

					end
			end

--EXEC    PCP..sp_manuLote  '108',  '03939501001',  'PAN01166',  'ME.AU PET GRANULADO SANITARIO GRAOS FINOS CN 4KG 6X1',  '001',  '000000001',  12,  'PESO',  'N1',  11,  '',  1,  'P' 

			--select * from PCP..loteProd
	end


if @cTipo = 'A' --Antecipar o fechamento do Lote
	
	begin
		--set @obsAntes = 'Antecipado pelo usuário: ' + rtrim(ltrim(convert(varchar(20), @usuario)))
		update 
			PCP..loteProd  
		set
			situacao = 'Fechado', 
			fechamento = (select convert(varchar(10), getdate(), 112)),
			userJusti = @usuario,
			--obs = @obsAntes,
			justificativa = @obs
		where
			1 = 1
			and filial = @filial
			and produto = @produto
			and lote = @lote


	end



GO
