SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER procedure [dbo].[sp_atualiza_OP]
	@filial varchar(3),
	@op varchar(11)
as

--sp_atualiza_OP '108', '00258901001'
--drop procedure DESENVOLVIMENTO..sp_atualiza_OP '108', '00258901001'

INSERT INTO PCP..OP

--SELECT * FROM PCP..OP

SELECT 
	A.* 
FROM 
	HOMOLOGACAO..View_Portal_OP_Config A LEFT JOIN
	PCP..OP B ON
	1 = 1
	AND A.FILIAL = B.FILIAL
	AND A.OP = B.OP
	AND A.COMPONENTE = B.COMPONENTE
WHERE
	1 = 1
	AND ISNULL(B.FILIAL, '') = ''
	AND A.OP = @op
	AND A.FILIAL = @filial

GO
