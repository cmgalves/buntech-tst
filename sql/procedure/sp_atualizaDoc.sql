SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


ALTER procedure [dbo].[sp_atualizaDoc]

--sp_atualizaDoc 1, '402', '00159001001', '20220202'
	@tipo int,
    @filial varchar(3),
    @op varchar(11),
    @datadoc varchar(8),
    @qtdeinfo float,
    @itComp varchar(15),
    @itlote varchar(66)
    
as


declare 
    @qtdeReg as int,
    @itDesc varchar(60),
    @itUnidade varchar(3)


if @tipo = 1
	begin
		insert into PCP..DOC 
			(filial, op, emissao, produto, descricao, qtdeori, datadoc)
            SELECT 
                C2_FILIAL, C2_NUM + C2_ITEM + C2_SEQUEN, C2_EMISSAO, C2_PRODUTO, B.B1_DESC, C2_QUANT, @datadoc
            FROM 
                HOMOLOGACAO..SC2010 A INNER JOIN
                HOMOLOGACAO..SB1010 B ON
                C2_PRODUTO = B.B1_COD

            WHERE
                1 = 1
                AND A.R_E_C_D_E_L_ = 0
                AND B.R_E_C_D_E_L_ = 0
                AND C2_FILIAL = @filial
                AND C2_NUM + C2_ITEM + C2_SEQUEN = @op
                AND NOT EXISTS
                (
                    SELECT 
                        filial, op, datadoc 
                    FROM 
                        PCP..DOC
                    WHERE
                        1 = 1
                        AND filial = C2_FILIAL
                        AND op = C2_NUM + C2_ITEM + C2_SEQUEN
                        AND datadoc = @datadoc
                )

		insert into PCP..DOCITENS 
			(itfilial, itop, itcomp, ituni, itdesc, itqtdeorig, itdatadoc, itqtdeinfo, itaponta, itdel )
            SELECT 
                D4_FILIAL, D4_OP, D4_COD, B1_UM, B1_DESC, D4_QTDEORI, @datadoc, 0, 'S', 'S'
            FROM 
                HOMOLOGACAO..SD4010 A INNER JOIN
                HOMOLOGACAO..SB1010 B ON
                D4_COD = B1_COD

            WHERE
                1 = 1
                AND A.R_E_C_D_E_L_ = 0
                AND B.R_E_C_D_E_L_ = 0
                AND D4_FILIAL = @filial
                AND D4_OP = @op
                AND NOT EXISTS
                (
                    SELECT 
                        itfilial, itop, itdatadoc 
                    FROM 
                        PCP..DOCITENS
                    WHERE
                        1 = 1
                        AND itfilial = D4_FILIAL
                        AND itop = D4_OP
                        AND itdatadoc = @datadoc
                )

            
    end

if @tipo = 2
	begin
		UPDATE
            PCP..DOCITENS
        SET
            itqtdeinfo = @qtdeinfo, 
            lotenotaop = @itlote
        WHERE
            1 = 1
            AND itfilial = @filial
            AND itop = @op
            AND itcomp = @itComp
            AND itdatadoc = @datadoc
    end

if @tipo = 3
    begin
        set @qtdeReg = (
                    SELECT 
                        COUNT(*) 
                    FROM 
                        DOCITENS 
                    WHERE 
                        1 = 1
                        AND itfilial = @filial
                        AND itop = @op
                        AND itcomp = @itComp
                        AND itdatadoc = @datadoc
                        )
        set @itDesc = (
                    SELECT DISTINCT TOP 1
                        B1_DESC 
                    FROM 
                        HOMOLOGACAO..SB1010
                    WHERE
                        B1_COD = @itComp
                    )
        set @itUnidade = (
                    SELECT DISTINCT TOP 1
                        B1_UM 
                    FROM 
                        HOMOLOGACAO..SB1010
                    WHERE
                        B1_COD = @itComp
                    )
            
            if @qtdeReg = 0
                begin
                    insert into PCP..DOCITENS 
                            (itfilial, itop, itcomp, ituni, itdesc, itqtdeorig, itdatadoc, itqtdeinfo, lotenotaop, itaponta, itdel)
                    values(@filial, @op, @itComp, @itUnidade, @itDesc, 0, @datadoc, @qtdeinfo, @itlote, 'S', 'S')
                end
    end

if @tipo = 4
	begin
		UPDATE
            PCP..DOCITENS
        SET
            itaponta = (case when itaponta = 'N' then 'S' else 'N' end)
        WHERE
            1 = 1
            AND itfilial = @filial
            AND itop = @op
            AND itcomp = @itComp
            AND itdatadoc = @datadoc
    end

if @tipo = 5
	begin
		UPDATE
            PCP..DOCITENS
        SET
            itdel = (case when itdel = 'N' then 'S' else 'N' end)
        WHERE
            1 = 1
            AND itfilial = @filial
            AND itop = @op
            AND itcomp = @itComp
            AND itdatadoc = @datadoc
    end

if @tipo = 6
	begin
		DELETE
        FROM
            PCP..DOC
        WHERE
            1 = 1
            AND filial = @filial
            AND op = @op
            AND datadoc = @datadoc
		DELETE
        FROM
            PCP..DOCITENS
        WHERE
            1 = 1
            AND itfilial = @filial
            AND itop = @op
            AND itdatadoc = @datadoc
    end

if @tipo = 7
	begin
		
		DELETE
        FROM
            PCP..DOCITENS
        WHERE
            1 = 1
            AND itfilial = @filial
            AND itop = @op
            AND itdatadoc = @datadoc
            AND itcomp = @itComp
    end

--sp_atualizaDoc 3, '206', '30241001001', '20220221', 12, 'MEN00017', 'ESTE LOTE'
/*
SELECT * FROM DOCITENS
@tipo int,
    @filial varchar(3),
    @op varchar(11),
    @datadoc varchar(8),
    @qtdeinfo float,
    @itComp varchar(15),
    @itlote varchar(66)
*/

GO
