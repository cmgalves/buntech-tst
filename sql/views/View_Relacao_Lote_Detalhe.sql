SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER VIEW [dbo].[View_Relacao_Lote_Detalhe]
AS
    SELECT
        *
    FROM
        PCP..loteProd
GO
