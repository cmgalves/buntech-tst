SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER procedure [dbo].[sp_incluiAlteraUsuario]

--sp_incluiAlteraUsuario 0, 'empresa', 'nome', 'email', 'senha', 'perfil', 'depto', 'telefone'
	@codUser int,
	@empresa varchar(170),
	@nome varchar(80),
	@email varchar(80),
	@senha varchar(80),
	@perfil varchar(20),
	@depto varchar(50),
	@telefone varchar(13)
as


if @codUser = 0
	begin
		insert into usuarios 
			(empresa, nome, email, senha, perfil, depto, telefone)
		values
			(@empresa, @nome, @email, @senha, @perfil, @depto, @telefone)
	end

if @codUser > 0
	begin
		update 
			usuarios 
		set
			empresa = @empresa,
			nome = @nome,
			senha = @senha,
			perfil = @perfil,
			depto = @depto, 
			telefone = @telefone
		where
			codigo = @codUser
	end

GO
