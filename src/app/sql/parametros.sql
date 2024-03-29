/*
   sábado, 24 de dezembro de 202208:25:12
   Usuário: sql_ppi
   Servidor: 10.3.0.44\SQLPROTHEUS
   Banco de Dados: PCP
   Aplicativo: 
*/

/* Para impedir possíveis problemas de perda de dados, analise este script detalhadamente antes de executá-lo fora do contexto do designer de banco de dados.*/
BEGIN TRANSACTION
SET QUOTED_IDENTIFIER ON
SET ARITHABORT ON
SET NUMERIC_ROUNDABORT OFF
SET CONCAT_NULL_YIELDS_NULL ON
SET ANSI_NULLS ON
SET ANSI_PADDING ON
SET ANSI_WARNINGS ON
COMMIT
BEGIN TRANSACTION
GO
ALTER TABLE dbo.parametros ADD
	obs varchar(255) NULL
GO
ALTER TABLE dbo.parametros SET (LOCK_ESCALATION = TABLE)
GO
COMMIT
