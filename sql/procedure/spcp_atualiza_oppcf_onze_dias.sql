--ALTER procedure [dbo].[spcp_atualiza_oppcf_onze_dias] as

declare 
	@dias int,
	@inc int,
	@fim int
set @dias = 11
set @inc = 0
set @fim = 4
/*
	spcp_atualiza_oppcf_onze_dias
	select * FROM oppcf order by dtcria desc
	DELETE FROM oppcf
*/


while @inc <= (@dias - @fim)

	begin
		
		--boa vista
		--DELETA DADOS NOVOS DESATUALIZADOS
		DELETE FROM PCP..oppcf WHERE convert(varchar(8), cast(dtcria as date), 112) = convert(varchar(8), getdate() - (@dias - @inc), 112)

		--LIMPA DADOS TEMP
		TRUNCATE TABLE oppcf011

		--PEGA DADOS NOVOS
		insert into PCP..oppcf011
		select 
			* 
		from 
		(
			select 
				* 
			from 
				[BOA_VISTA].[PCF4].[dbo].[vw_pcp_op_pcfactory]
				--order by dtime desc
			where
				convert(varchar(8), cast(dtcria as date), 112) = convert(varchar(8), getdate()- (@dias - @inc), 112)
			union all
			select 
				* 
			from 
				[CAMPINA_GRANDE].[PCF4].[dbo].[vw_pcp_op_pcfactory]
			where
				convert(varchar(8), cast(dtcria as date), 112) = convert(varchar(8), getdate()- (@dias - @inc), 112)
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
			PCP..oppcf011 a
		
		set @inc = @inc + 1
	end

GO


