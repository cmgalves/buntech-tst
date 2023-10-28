SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER procedure [dbo].[sp_atualizaCabecDoc]
    @filial varchar(3),
    @op varchar(11),
    @datadoc varchar(8),
    @clotea varchar(20),
    @cloteb varchar(20),
    @clotec varchar(20),
    @cloted varchar(20),
    @clotee varchar(20),
    @clotef varchar(20),
    @cloteg varchar(20),
    @cloteh varchar(20),
    @clotei varchar(20),
    @clotej varchar(20),
    @clotek varchar(50),
    @clotel varchar(50),
    @nlotea float,
    @nloteb float,
    @nlotec float,
    @nloted float,
    @nlotee float,
    @nlotef float,
    @nloteg float,
    @nloteh float,
    @nlotei float,
    @nlotej float,
    @nlotek float,
    @nlotel float,
    @lider varchar(35),
    @processo varchar(35),
    @observ varchar(200),
    @turno1 varchar(1),
    @turno2 varchar(1),
    @turno3 varchar(1) 
as

UPDATE
    PCP..DOC
SET
    clotea = @clotea, 
    cloteb = @cloteb, 
    clotec = @clotec, 
    cloted = @cloted, 
    clotee = @clotee, 
    clotef = @clotef, 
    cloteg = @cloteg, 
    cloteh = @cloteh, 
    clotei = @clotei, 
    clotej = @clotej, 
    clotek = @clotek, 
    clotel = @clotel, 
    nlotea = @nlotea, 
    nloteb = @nloteb, 
    nlotec = @nlotec, 
    nloted = @nloted, 
    nlotee = @nlotee, 
    nlotef = @nlotef, 
    nloteg = @nloteg, 
    nloteh = @nloteh, 
    nlotei = @nlotei, 
    nlotej = @nlotej, 
    nlotek = @nlotek, 
    nlotel = @nlotel, 
    lider = @lider, 
    processo = @processo, 
    observ = @observ, 
    turno1 = @turno1, 
    turno2 = @turno2, 
    turno3 = @turno3
WHERE
    1 = 1
    AND filial = @filial
    AND op = @op
    AND datadoc = @datadoc

--sp_atualizaDoc 3, '206', '30241001001', '20220221', 12, 'MEN00017', 'ESTE LOTE'
/*
SELECT * FROM DOC
SELECT DISTINCT     * FROM   DOC A INNER JOIN   DOCITENS ON   1 = 1   AND filial = itfilial   AND op = itop   AND datadoc = itdatadoc WHERE     1 = 1     AND filial = '206'      AND op = '30241001001'  AND datadoc = '20220227'

EXEC    PCP..sp_atualizaCabecDoc   
    '206',    '30241001001',   '20220227',   
    'ELDER',   '',   '',   '',   'da',   '',   '',   '',   
    'a',   '',   '',   '',   0,   0,   0,  0 ,   0,   0,  0 ,   0,  0 ,  0 ,  0 , 0  ,   
    'ALANO JONHSON',   'Moagem',   '',   'S',   'N',   'N'
    
*/

GO
