SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


ALTER procedure [dbo].[spcp_lote_empenho] 
	@filial VARCHAR(3), 
	@op VARCHAR(11), 
	@tipo VARCHAR(1)
as


/*
spcp_lote_empenho '101', '00003101001', 'v'

TRUNCATE TABLE PCP..oppcfLoteEmpenho
SELECT * FROM PCP..oppcfLoteEmpenho
*/


if @tipo in ('v', 'a')
	begin
		
		insert into PCP..oppcfLoteEmpenho (filial, op, produto, qtdeOP, emissao, componente, qtdeEmp)
		select 
			C2_FILIAL, D4_OP, C2_PRODUTO, C2_QUANT, C2_EMISSAO, D4_COD, D4_QTDEORI
		from
			HOMOLOGACAO..SC2010 A INNER JOIN
			HOMOLOGACAO..SD4010 B ON
			1 = 1
			AND C2_FILIAL = D4_FILIAL
			AND C2_NUM+C2_ITEM+C2_SEQUEN = D4_OP
		WHERE 
			1 = 1
			AND D4_FILIAL = @filial 
			AND C2_NUM+C2_ITEM+C2_SEQUEN = @op
			AND D4_OP = @op
			AND A.D_E_L_E_T_ = ' '
			AND B.D_E_L_E_T_ = ' '
			AND NOT EXISTS (
				SELECT 
					op 
				FROM
					PCP..oppcfLoteEmpenho 
				WHERE 
					1 = 1
					AND D4_FILIAL = filial 
					AND D4_OP = op
			)
	end


	/*
	select 
		C2_FILIAL, C2_NUM, C2_ITEM, C2_SEQUEN, C2_OP, C2_DATRF, C2_QUANT, C2_QUJE, * 
	from
		--UPDATE HOMOLOGACAO..SC2010 SET C2_NUM = '000031', C2_ITEM = '01', C2_SEQUEN = '001', C2_OP = '00003101001' FROM
		HOMOLOGACAO..SC2010 
	WHERE 
		1 = 1
		AND C2_FILIAL = '101'
		AND C2_EMISSAO >= '20231001'
		AND C2_DATRF = ''
		AND C2_OP = '00003101001'

	select 
		* 
	from
		--UPDATE HOMOLOGACAO..SD4010 SET D4_OP = '00003101001' FROM
		HOMOLOGACAO..SD4010 
	WHERE 
		1 = 1
		AND D4_FILIAL = '101'
		AND D4_OP = '00003101001'
*/

-- SET @QTDE = (SELECT COUNT(*) FROM PCP..OP WHERE FILIAL = @FILIAL AND OP = @OP AND PRODUTO = @PRODUTO AND COMPONENTE = @COMPONENTE)
-- SET @ESTRUTURA = (SELECT COUNT(*) FROM HOMOLOGACAO..SG1010 WHERE G1_FILIAL = @FILIAL AND G1_COD = @PRODUTO AND G1_COMP = @COMPONENTE)

-- --sp_ajusta_OP FILIAL, OP, PA, DESCPA, CODANT, COMP, DESCCOMP, TIPO, SITUAÇÃO, UNIDADE, QYDEPCF, QTDEINF
-- --sp_ajusta_OP '101', '00314701001', 'PAN00099', 'PERLITE FA 2000 BIG BAG 210KG', '', 'GGF3010201', 'PALLET PBR MADEIRA NOVO DUPLA FACE 1,00X1,20', 'M', 'C', 'H', 10, 2.25

-- IF @SITUACA NOT IN ('A', 'P')

-- 	BEGIN
-- 		IF @QTDEINF > 0
-- 			BEGIN
-- 				SET @QTDECAL = ROUND(@QTDEINF, 4)
-- 			END
-- 		IF @QTDEINF = 0 AND @TIPO <> 'M'
-- 			BEGIN
-- 				SET @QTDECAL = ROUND(ISNULL((
-- 									SELECT 
-- 										ROUND(G1_QUANT / ((100 - G1_PERDA) / 100) * (@QTDEPCF / CASE WHEN B1_QB = 0 THEN 1 ELSE B1_QB END), 4)
-- 									FROM 
-- 										HOMOLOGACAO..SG1010 A WITH (NOLOCK) INNER JOIN
-- 										HOMOLOGACAO..SB1010 B WITH (NOLOCK) ON
-- 										G1_COD = B1_COD
-- 									WHERE
-- 										1 = 1
-- 										AND A.R_E_C_D_E_L_ = 0
-- 										AND B.R_E_C_D_E_L_ = 0
-- 										AND G1_FILIAL = @FILIAL
-- 										AND G1_COD = @PRODUTO
-- 										AND G1_COMP = @COMPONENTE
-- 								), 0), 4)
-- 			END

-- 		IF @QTDEINF = 0 AND @TIPO = 'M'
-- 			BEGIN

-- 				SET @QTDECAL = ROUND(ISNULL((
-- 									SELECT 
-- 										ROUND(G1_QUANT * (@QTDEINF / CASE WHEN B1_QB = 0 THEN 1 ELSE B1_QB END), 4)
-- 									FROM 
-- 										HOMOLOGACAO..SG1010 A WITH (NOLOCK) INNER JOIN
-- 										HOMOLOGACAO..SB1010 B WITH (NOLOCK) ON
-- 										G1_COD = B1_COD
-- 									WHERE
-- 										1 = 1
-- 										AND A.R_E_C_D_E_L_ = 0
-- 										AND B.R_E_C_D_E_L_ = 0
-- 										--AND G1_FILIAL = '101'
-- 										--AND G1_COD = 'PAN00090'
-- 										--AND G1_COMP = 'GAS311202'
-- 										AND G1_FILIAL = @FILIAL
-- 										AND G1_COD = @PRODUTO
-- 										AND G1_COMP = @COMPONENTE
-- 								), 0), 4)

-- 				--SELECT * FROM PCP..OP 
-- 			END


-- 		--QUANDO TEM O PRODUTO NO EMPENHO
-- 		IF @QTDE = 1
-- 			BEGIN
-- 				UPDATE 
-- 					PCP..OP
-- 				SET
-- 					QTDECAL = round(@QTDECAL, 4),
-- 					SITUACA = CASE WHEN @SITUACA = 'K' THEN 'C' ELSE @SITUACA END
-- 				WHERE 
-- 					1 = 1
-- 					AND FILIAL = @FILIAL 
-- 					AND OP = @OP
-- 					AND PRODUTO = @PRODUTO 
-- 					AND COMPONENTE = @COMPONENTE
-- 					AND TIPO <> CASE WHEN @SITUACA = 'K' THEN 'K' ELSE 'C' END
-- 			END
-- 		--QUANDO NÃO TEM O PRODUTO NO EMPENHO
-- 		IF @QTDE = 0
-- 			BEGIN
-- 				IF @COMPONENTE = 'GGF3010201' AND @ESTRUTURA = 0
-- 					BEGIN
-- 						SET @ESTRUTURA = 0
-- 					END
-- 				ELSE
-- 					BEGIN
-- 						INSERT INTO PCP..OP 
-- 							(FILIAL, OP, PRODUTO, DESCRICAO, CODANT, COMPONENTE, DESCRIC, ARMAZEM, QTDEPCF, QTDECAL, UNIDADE, TIPO, SITUACA, QTDE, QTDEORI, SALDO, ENTREGUE, ROTEIRO, OPERACAO, EMISSAO, FINAL )
-- 						VALUES
-- 							(@FILIAL, @OP, @PRODUTO, @DESCPROD, @CODANT, @COMPONENTE, @DESCCOMP, '01', ROUND(@QTDEPCF, 4), ROUND(@QTDEINF, 4), @UNIDADE, @TIPO, @SITUACA, 0, 0, 0, '', '01', '', '', '')
-- 					END
-- 			END
-- 	END

-- IF @SITUACA = 'A'
-- 	BEGIN
-- 		UPDATE
-- 			PCP..OP
-- 		SET
-- 			SITUACA = @SITUACA
-- 		WHERE 
-- 			1 = 1
-- 			AND FILIAL = @FILIAL 
-- 			AND OP = @OP
-- 	END	

-- IF @SITUACA = 'V'
-- 	BEGIN
-- 		UPDATE
-- 			PCP..OP
-- 		SET
-- 			SITUACA = @SITUACA
-- 		WHERE 
-- 			1 = 1
-- 			AND FILIAL = @FILIAL 
-- 			AND OP = @OP
-- 	END	

-- IF @SITUACA = 'P'
-- 	BEGIN
-- 		UPDATE
-- 			PCP..OP
-- 		SET
-- 			SITUACA = @SITUACA
-- 		WHERE 
-- 			1 = 1
-- 			AND FILIAL = @FILIAL 
-- 			AND OP = @OP
-- 	END	
-- GO
GO
