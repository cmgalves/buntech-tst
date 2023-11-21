SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER procedure [dbo].[sp_incluiEspec]

-- procedure para inclusão de escecificações na tabela principal

/*
EXEC    PCP..sp_incluiEspec  'P800501',  'KELDOG+CROK BISCOITO ORIGINAL 900G',  '999',  '2023-01-20',  
'ITESPABV040',  'Concluida',  'qualObsGeral',  'qualObsRevisao',  'aplicacao',  'embalagem',  'feitoPor',  'aprovPor', 'especAlcada', 
 'especAnalise', 'especSequencia', 'especQuebra',
	'I',10, 'SIM', 0
SELECT * FROM PCP..qualEspecCab
select * from PCP..qualEspecItens 

*/

	@cabProduto varchar(15),
    @descrProd varchar(70),
    @cabRevisao varchar(03),
    @dataAprov varchar(10),
    @numEspec varchar(20),
    @situacao varchar(20),
    @qualObsGeral varchar(250),
    @qualObsRevisao varchar(250),
    @aplicacao varchar(70),
    @embalagem varchar(250),
    @feitoPor varchar(70), 
	@aprovPor varchar(70),
	@especAlcada varchar(20),
	@especAnalise varchar(20),
	@especSequencia varchar(20),
	@especQuebra varchar(20),
	@cTipo varchar(1),
	@cabQtdeQuebra FLOAT,
	@imprimeLaudo varchar(3),
	@tempoMaximo float
as




declare 
	@rev3digi varchar(3),
	@existRev int,
	@novaRev varchar(3)


set @novaRev = right(concat('000', rtrim(convert(varchar(3), cast(@cabRevisao as int) + 1))), 3) --numero da próxima revisão

if LEN(@cabRevisao ) < 3
	set @rev3digi = right(CONCAT('000', rtrim(@cabRevisao)), 3)
else
	set @rev3digi = right(@cabRevisao, 3)
	
	

if @cTipo = 'R'
	
	if @rev3digi = '000'
		begin
			insert into PCP..qualEspecCab  
				(cabProduto, descrProd, cabRevisao, dataAprov, numEspec, situacao, qualObsGeral, qualObsRevisao, aplicacao, embalagem, feitoPor, aprovPor,especAlcada,especAnalise,especSequencia,especQuebra,cabQtdeQuebra, imprimeLaudo, tempoMaximo)
			values
				(@cabProduto, @descrProd, '001', @dataAprov, @numEspec, @situacao, @qualObsGeral, @qualObsRevisao, @aplicacao, @embalagem, @feitoPor, @aprovPor,@especAlcada,@especAnalise,@especSequencia,@especQuebra,@cabQtdeQuebra, @imprimeLaudo, @tempoMaximo)

		end
	else
		begin
			update 
				PCP..qualEspecCab  
			set
				situacao = 'Encerrada'
			where
				1 = 1
				and cabProduto = @cabProduto 
				and cabRevisao = @rev3digi

			insert into PCP..qualEspecCab  
				(cabProduto, descrProd, cabRevisao, dataAprov, numEspec, situacao, qualObsGeral, qualObsRevisao, aplicacao, embalagem, feitoPor, aprovPor,especAlcada,especAnalise,especSequencia,especQuebra,cabQtdeQuebra, imprimeLaudo, tempoMaximo)
			values
				(@cabProduto, @descrProd, @novaRev, @dataAprov, @numEspec, @situacao, @qualObsGeral, @qualObsRevisao, @aplicacao, @embalagem, @feitoPor, @aprovPor,@especAlcada,@especAnalise,@especSequencia,@especQuebra,@cabQtdeQuebra, @imprimeLaudo, @tempoMaximo)

			

			insert into PCP..qualEspecItens select iteProduto, @novaRev iteRevisao, iteCarac, iteMin, iteMax, iteMeio, itetxt from PCP..qualEspecItens where iteRevisao = @rev3digi and iteProduto = @cabProduto
		end 

if @cTipo = 'I'
	
	if @rev3digi = '000'
		begin
			insert into PCP..qualEspecCab  
				(cabProduto, descrProd, cabRevisao, dataAprov, numEspec, situacao, qualObsGeral, qualObsRevisao, aplicacao, embalagem, feitoPor, aprovPor,especAlcada,especAnalise,especSequencia,especQuebra,cabQtdeQuebra, imprimeLaudo, tempoMaximo)
			values
				(@cabProduto, @descrProd, '001', @dataAprov, @numEspec, @situacao, @qualObsGeral, @qualObsRevisao, @aplicacao, @embalagem, @feitoPor, @aprovPor,@especAlcada,@especAnalise,@especSequencia,@especQuebra,@cabQtdeQuebra, @imprimeLaudo, @tempoMaximo)

		end
	else
		begin
			update 
				PCP..qualEspecCab  
			set
				situacao = 'Encerrada'
			where
				1 = 1
				and cabProduto = @cabProduto 
				and cabRevisao = isnull((select cabRevisao from PCP..qualEspecCab a inner join (select distinct max(idEspecCab) idcab from PCP..qualEspecCab where cabProduto = @cabProduto)b on idEspecCab = idcab), '000')

			insert into PCP..qualEspecCab  
				(cabProduto, descrProd, cabRevisao, dataAprov, numEspec, situacao, qualObsGeral, qualObsRevisao, aplicacao, embalagem, feitoPor, aprovPor,especAlcada,especAnalise,especSequencia,especQuebra,cabQtdeQuebra, imprimeLaudo, tempoMaximo)
			values
				(@cabProduto, @descrProd, @rev3digi, @dataAprov, @numEspec, @situacao, @qualObsGeral, @qualObsRevisao, @aplicacao, @embalagem, @feitoPor, @aprovPor,@especAlcada,@especAnalise,@especSequencia,@especQuebra,@cabQtdeQuebra, @imprimeLaudo, @tempoMaximo)

			insert into PCP..qualEspecItens select iteProduto, @rev3digi iteRevisao, iteCarac, iteMin, iteMax, iteMeio, itetxt from PCP..qualEspecItens a inner join (select iteProduto prod, max(iteRevisao) revis from PCP..qualEspecItens group by iteProduto) b on iteProduto = prod and iteRevisao = revis where iteProduto = @cabProduto
		end 

if @cTipo = 'A'

	begin
		update 
			PCP..qualEspecCab  
		set
			dataAprov = @dataAprov, 
			situacao = @situacao, 
			numEspec = @numEspec, 
			qualObsGeral = @qualObsGeral, 
			qualObsRevisao = @qualObsRevisao, 
			aplicacao = @aplicacao, 
			embalagem = @embalagem, 
			feitoPor = @feitoPor, 
			aprovPor = @aprovPor,
			especAlcada = @especAlcada ,
			especAnalise = @especAnalise,
			especSequencia= @especSequencia,
			especQuebra = @especQuebra,
			cabQtdeQuebra = @cabQtdeQuebra,
			imprimeLaudo =  @imprimeLaudo,
			tempoMaximo = @tempoMaximo 

		where
			1 = 1
			and cabProduto = @cabProduto 
			and cabRevisao = @rev3digi
	end

GO
