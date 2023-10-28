SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER procedure [dbo].[sp_alteraSenhaUsuario]

--sp_alteraSenhaUsuario 1, '124125'
	@codUser int,
	@senhaNew varchar(80)
as


		update 
			usuarios 
		set
			senha = @senhaNew
		where
			codigo = @codUser

GO
