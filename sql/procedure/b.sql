SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER procedure [dbo].[spcp_atualiza_oppcf_cem_dias] as

declare 
	@dias int,
	@inc int,
	@fim int
set @dias = 200
set @inc = 0
set @fim = 11
/*
	spcp_atualiza_oppcf_cem_dias
	select * FROM oppcf order by dtime desc
	DELETE FROM oppcf
*/


while @inc <= (@dias - @fim)

	begin
		
		--boa vista

		--LIMPA DADOS TEMP
		TRUNCATE TABLE oppcftemp

		--PEGA DADOS NOVOS
		insert into oppcftemp
		select 
			* 
		from 
			[BOA_VISTA].[PCF4].[dbo].[vw_pcp_op_pcfactory]
			--order by dtime desc
		where
			convert(varchar(8), cast(dtcria as date), 112) = convert(varchar(8), getdate()- (@dias - @inc), 112)
	
		insert into oppcftemp
		select 
			* 
		from 
			[CAMPINA_GRANDE].[PCF4].[dbo].[vw_pcp_op_pcfactory]
		where
			convert(varchar(8), cast(dtcria as date), 112) = convert(varchar(8), getdate()- (@dias - @inc), 112)
	
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
