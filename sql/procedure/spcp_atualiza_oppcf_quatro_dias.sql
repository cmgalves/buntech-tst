SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/*
Esta procedure tem como objetico trazer todos os dados referentes às OPs criadas nos últimos quatro dias
de acordo com o parâmetro @dias
*/
ALTER procedure [dbo].[spcp_atualiza_oppcf_quatro_dias]
as

declare 
	@dias int,
	@inc int
set @dias = 3
set @inc = 0

/*
	spcp_atualiza_oppcf_quatro_dias
	select * FROM oppcf order by dtime desc
	SELECT * FROM oppcf ORDER BY dtcria
	select * FROM oppcf
	select * FROM oppcfLote
	truncate table oppcfLote

*/


while @inc <= @dias

	begin

	--DELETA DADOS NOVOS DESATUALIZADOS
	DELETE FROM PCP..oppcf WHERE convert(varchar(8), cast(dtcria as date), 112) = convert(varchar(8), getdate() - (@dias - @inc), 112)

	--boa vista
	--LIMPA DADOS TEMP
	TRUNCATE TABLE PCP..oppcf004

	--PEGA DADOS NOVOS de acordo com a data da criação da OP
	insert into PCP..oppcf004
	select
		*
	from
		(
			select
				*
			from
				[BOA_VISTA].[PCF4].[dbo].[vw_pcp_op_pcfactory]
			where
				--convert(varchar(8), cast(dtcria as date), 112) = convert(varchar(8), getdate()- (0 - 0), 112)
				convert(varchar(8), cast(dtcria as date), 112) = convert(varchar(8), getdate()- (@dias - @inc), 112)
		union all
			select
				*
			from
				[CAMPINA_GRANDE].[PCF4].[dbo].[vw_pcp_op_pcfactory]
			where
				convert(varchar(8), cast(dtcria as date), 112) = convert(varchar(8), getdate() - (@dias - @inc), 112)
		union all
			select
				*
			from
				[INDAIATUBA].[PCF4].[dbo].[vw_pcp_op_pcfactory]
			where
				convert(varchar(8), cast(dtcria as date), 112) = convert(varchar(8), getdate()- (@dias - @inc), 112) 
		)k

	--INSERE OS DADOS NOVOS
	INSERT INTO PCP..oppcf
	SELECT
		*
	FROM
		PCP..oppcf004 a

	set @inc = @inc + 1
end
	

if @inc >0 
	begin
		--insere os dados novos na oppcfLote
		insert into PCP..oppcfLote
			(
				a.idEv, filial, op, produto, qtde, dtime, dtcria,
				codRecurso, qtdeImp, lote, origem, stsLote, analise, intervaloLote,
				qtde_lote, loteAprov, dtAprov, dtProd, dtVenc, qtdeQuebra, quebra, situacao,
				usrAprovn1, usrAprovn2, usrAprovn3, dtAprovn1, dtAprovn2, dtAprovn3,
				intervalo, recurso, codOpera, segundos, dataAprovacao, tipoAprova1, tipoAprova2,
				tipoAprova3, justificativa1, justificativa2, justificativa3, regTipo

			)
		SELECT
			a.idEv, left(op,3) filial, substring(op, 4, 11) op, substring(produto, 4, 15) produto, qtde, dtime, dtcria,
			codRecurso, 0 qtdeImp, '000000000' lote, 'S' origem, '' stsLote, 'A00' analise, ' ' intervaloLote,
			0 qtde_lote, ' ' loteAprov, ' ' dtAprov, '' dtProd, '' dtVenc, 0 qtdeQuebra, 0 quebra, situacao,
			0 usrAprovn1, 0 usrAprovn2, 0 usrAprovn3, '' dtAprovn1, '' dtAprovn2, '' dtAprovn3,
			'' intervalo, recurso, codOpera, segundos, ''dataAprovacao, '' tipoAprova1, '' tipoAprova2,
			'' tipoAprova3, '' justificativa1, '' justificativa2, '' justificativa3, 'S' regTipo
		-- into PCP..oppcfLote
		-- drop table PCP..oppcfLote
		FROM
			PCP..vw_pcp_registros_saldo a
		WHERE
			not exists
				(
					select
						*
					from
						PCP..oppcfLote b
		-- truncate table PCP..oppcfLote 
		-- select * from PCP..oppcfLote b
		-- select * from PCP..vw_pcp_registros_saldo b
					where
						1 = 1
						and a.idEv = b.idEv
			)
	end

GO
