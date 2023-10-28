SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


ALTER procedure [dbo].[spcp_atualiza_oppcf_quatro_dias] as

/*
Esta procedure tem como objetico trazer todos os dados referentes às OPs criadas nos últimos quatro dias

*/


declare 
	@dias int,
	@inc int
set @dias = 4
set @inc = 0

/*

	spcp_atualiza_oppcf_quatro_dias
	select * FROM oppcf order by dtime desc
	DELETE FROM oppcf

*/


while @inc <= @dias

	begin
		--boa vista
		--LIMPA DADOS TEMP
		TRUNCATE TABLE oppcftemp

		--PEGA DADOS NOVOS de acordo com a data da criação da OP
		insert into oppcftemp
		select 
			* 
		from 
			[BOA_VISTA].[PCF4].[dbo].[vw_pcp_op_pcfactory]
		where
			--convert(varchar(8), cast(dtcria as date), 112) = convert(varchar(8), getdate()- (0 - 0), 112)
			convert(varchar(8), cast(dtcria as date), 112) = convert(varchar(8), getdate()- (@dias - @inc), 112)
	
		insert into oppcftemp
		select 
			* 
		from 
			[CAMPINA_GRANDE].[PCF4].[dbo].[vw_pcp_op_pcfactory]
		where
			convert(varchar(8), cast(dtcria as date), 112) = convert(varchar(8), getdate() - (@dias - @inc), 112)
	
		insert into oppcftemp
		select 
			* 
		from 
			[INDAIATUBA].[PCF4].[dbo].[vw_pcp_op_pcfactory]
		where
			convert(varchar(8), cast(dtcria as date), 112) = convert(varchar(8), getdate()- (@dias - @inc), 112) 
	
		--DELETA DADOS NOVOS DESATUALIZADOS
		DELETE FROM oppcf WHERE convert(varchar(8), cast(dtcria as date), 112) = convert(varchar(8), getdate() - (@dias - @inc), 112)
 

		 --INSERE OS DADOS NOVOS
		INSERT INTO oppcf
		SELECT 
			*
		FROM 
			oppcftemp a
		WHERE
			NOT EXISTS
			(
				SELECT 
					op 
				FROM 
					oppcf b
				WHERE
					1 = 1
					and a.op = b.op
					and a.dtime = b.dtime
					and a.qtde = b.qtde
			)
	
		set @inc = @inc + 1
	end

GO
