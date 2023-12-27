USE [PCP]
GO

/****** Object:  StoredProcedure [dbo].[spcp_inclui_registro_oppcfLote]    Script Date: 08/12/2023 19:56:31 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


ALTER procedure [dbo].[spcp_inclui_registro_oppcfLote] as

DECLARE 
    @filial NVARCHAR(03),
    @cabProduto NVARCHAR(15)

/*
select * from oppcfLote
delete from oppcfLote
spcp_inclui_registro_oppcfLote

*/

DECLARE itens_prod CURSOR FOR   
SELECT '101' filial, cabProduto FROM qualEspecCab union all
SELECT '107' filial, cabProduto FROM qualEspecCab union all
SELECT '117' filial, cabProduto FROM qualEspecCab union all
SELECT '108' filial, cabProduto FROM qualEspecCab union all
SELECT '206' filial, cabProduto FROM qualEspecCab union all
SELECT '402' filial, cabProduto FROM qualEspecCab 

OPEN itens_prod

FETCH NEXT FROM itens_prod   
INTO @filial, @cabProduto

WHILE @@FETCH_STATUS = 0  
BEGIN
    INSERT into oppcfLote
        (filial,	op,					  produto,     qtde,   dtime,				dtcria,					codRecurso, qtdeImp, lote,     origem, stsLote, analise, intervaloLote, qtde_lote, loteAprov, dtAprov, dtProd, dtVenc, qtdeQuebra, quebra, situacao, loteAprov, usrAprovn1, usrAprovn2, usrAprovn3, dtAprovn1, dtAprovn2, dtAprovn3, intervalo)
    values(@filial, left('102' + @cabProduto, 11), @cabProduto, 0.882, CURRENT_TIMESTAMP, '2023-12-07 11:07:50.000', 'CLAUDI',	 0,		'000000000', 'S',  '',       'A00',   '',            0,         '',        '',      '',      '',    0,           0,      '',        '',            0,         0,         0,           '',        '',       '',              '')
	 
		
    -- PRINT @filial + '-' + @cabProduto
    -- PRINT '-------- produtos para produ��o --------';

    FETCH NEXT FROM itens_prod   
    INTO @filial, @cabProduto
    -- WAITFOR DELAY '00:00:05'
END
CLOSE itens_prod;
DEALLOCATE itens_prod;

--id_num, filial, op, produto, qtde, dtime, dtcria, codRecurso, qtdeImp, lote, origem, stsLote, analise, intervaloLote, qtde_lote, loteAprov, dtAprov, dtProd, dtVenc, qtdeQuebra, quebra, situacao, loteAprov, usrAprovn1, usrAprovn2, usrAprovn3, dtAprovn1, dtAprovn2, dtAprovn3, intervalo
GO


