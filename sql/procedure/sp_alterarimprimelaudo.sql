SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER PROCEDURE sp_alterarimprimelaudo
    @ID int
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @NovoValor NVARCHAR(3)

    SELECT @NovoValor = 
        CASE 
            WHEN imprimeLaudo = 'SIM' THEN 'NÃO'
            WHEN imprimeLaudo = 'NÃO' THEN 'SIM'
            WHEN imprimeLaudo = NULL THEN 'NÃO'
            ELSE NULL
        END
    FROM loteAnalise
    WHERE id_loteProd = @ID

    IF @NovoValor IS NOT NULL
    BEGIN
        UPDATE loteAnalise
        SET imprimeLaudo = @NovoValor
        WHERE id_loteProd = @ID
    END
    ELSE
    BEGIN
        PRINT @NovoValor
    END
END;
