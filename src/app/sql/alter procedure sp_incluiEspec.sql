alter procedure sp_incluiEspec

-- procedure para inclusão de escecificações na tabela principal

/*
sp_incluiEspec 
    'PA000118', 'descrição do produto', '001', '2022-11-03', '2023-11-03', 
    'Andamento', 'obs geral da ', 'obs da revisão', 'pra que serve', 
    'embalagem pra caramba', 'claudio', 'marcio'

SELECT * FROM qualEspecCab


SELECT     cabProduto, descrProd, cabRevisao, vigenciaDe,     vigenciaAte, situacao, qualObsGeral, qualObsRevisao,     aplicacao, embalagem, prazoValid, feitoPor, aprovPor,     iteProduto, iteRevisao, iteCarac, iteMin, iteMax, descCarac FROM     PCP..qualEspecCab inner join     PCP..qualEspecItens on     1 = 1     and cabProduto = iteProduto     and cabRevisao = iteRevisao inner join     PCP..qualCarac on     1 = 1     and iteCarac = codCarac WHERE     1 = 1     and cabProduto = 'undefined'



*/

	@cabProduto varchar(15),
    @descrProd varchar(70),
    @cabRevisao varchar(03),
    @vigenciaDe varchar(10),
    @vigenciaAte varchar(10),
    @situacao varchar(20),
    @qualObsGeral varchar(250),
    @qualObsRevisao varchar(250),
    @aplicacao varchar(70),
    @embalagem varchar(250),
    @feitoPor varchar(70),
    @aprovPor varchar(70)
as

	begin
		insert into PCP..qualEspecCab  
			(cabProduto, descrProd, cabRevisao, vigenciaDe, vigenciaAte, situacao, qualObsGeral, qualObsRevisao, aplicacao, embalagem, feitoPor, aprovPor)
		values
			(@cabProduto, @descrProd, @cabRevisao, @vigenciaDe, @vigenciaAte, @situacao, @qualObsGeral, @qualObsRevisao, @aplicacao, @embalagem, @feitoPor, @aprovPor)
	end
GO

