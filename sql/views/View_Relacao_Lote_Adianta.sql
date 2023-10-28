SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


ALTER view [dbo].[View_Relacao_Lote_Adianta] as
select 
	*
from 
	PCP..loteProd
GO
