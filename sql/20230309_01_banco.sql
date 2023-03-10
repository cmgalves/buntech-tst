USE [master]
GO
/****** Object:  Database [PCP]    Script Date: 09/03/2023 01:36:23 ******/
CREATE DATABASE [PCP]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'PCP', FILENAME = N'D:\Program Files\Microsoft SQL Server\MSSQL13.MSSQLSERVER\MSSQL\DATA\PCP.mdf' , SIZE = 134144KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'PCP_log', FILENAME = N'D:\Program Files\Microsoft SQL Server\MSSQL13.MSSQLSERVER\MSSQL\DATA\PCP.ldf' , SIZE = 136192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
GO
ALTER DATABASE [PCP] SET COMPATIBILITY_LEVEL = 130
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [PCP].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [PCP] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [PCP] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [PCP] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [PCP] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [PCP] SET ARITHABORT OFF 
GO
ALTER DATABASE [PCP] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [PCP] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [PCP] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [PCP] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [PCP] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [PCP] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [PCP] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [PCP] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [PCP] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [PCP] SET  DISABLE_BROKER 
GO
ALTER DATABASE [PCP] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [PCP] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [PCP] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [PCP] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [PCP] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [PCP] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [PCP] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [PCP] SET RECOVERY FULL 
GO
ALTER DATABASE [PCP] SET  MULTI_USER 
GO
ALTER DATABASE [PCP] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [PCP] SET DB_CHAINING OFF 
GO
ALTER DATABASE [PCP] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [PCP] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [PCP] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [PCP] SET QUERY_STORE = OFF
GO
USE [PCP]
GO
ALTER DATABASE SCOPED CONFIGURATION SET LEGACY_CARDINALITY_ESTIMATION = OFF;
GO
ALTER DATABASE SCOPED CONFIGURATION SET MAXDOP = 0;
GO
ALTER DATABASE SCOPED CONFIGURATION SET PARAMETER_SNIFFING = ON;
GO
ALTER DATABASE SCOPED CONFIGURATION SET QUERY_OPTIMIZER_HOTFIXES = OFF;
GO
USE [PCP]
GO
/****** Object:  User [revitalizacao]    Script Date: 09/03/2023 01:36:24 ******/
CREATE USER [revitalizacao] WITHOUT LOGIN WITH DEFAULT_SCHEMA=[dbo]
GO
/****** Object:  User [pcp]    Script Date: 09/03/2023 01:36:24 ******/
CREATE USER [pcp] FOR LOGIN [pcp] WITH DEFAULT_SCHEMA=[dbo]
GO
/****** Object:  User [BRIND01TD01\Administrator]    Script Date: 09/03/2023 01:36:24 ******/
CREATE USER [BRIND01TD01\Administrator] FOR LOGIN [BRIND01TD01\Administrator] WITH DEFAULT_SCHEMA=[dbo]
GO
ALTER ROLE [db_owner] ADD MEMBER [pcp]
GO
ALTER ROLE [db_accessadmin] ADD MEMBER [pcp]
GO
/****** Object:  Table [dbo].[qualCarac]    Script Date: 09/03/2023 01:36:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[qualCarac](
	[codCarac] [varchar](3) NULL,
	[descCarac] [varchar](55) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[qualEspecCab]    Script Date: 09/03/2023 01:36:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[qualEspecCab](
	[cabProduto] [varchar](15) NULL,
	[descrProd] [varchar](70) NULL,
	[cabRevisao] [varchar](3) NULL,
	[numEspec] [varchar](20) NULL,
	[dataAprov] [varchar](10) NULL,
	[vigenciaDe] [varchar](10) NULL,
	[vigenciaAte] [varchar](10) NULL,
	[situacao] [varchar](20) NULL,
	[qualObsGeral] [varchar](250) NULL,
	[qualObsRevisao] [varchar](250) NULL,
	[aplicacao] [varchar](70) NULL,
	[embalagem] [varchar](250) NULL,
	[feitoPor] [varchar](70) NULL,
	[aprovPor] [varchar](70) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[qualEspecItens]    Script Date: 09/03/2023 01:36:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[qualEspecItens](
	[iteProduto] [varchar](15) NULL,
	[iteRevisao] [varchar](3) NULL,
	[iteCarac] [varchar](3) NULL,
	[iteMin] [float] NULL,
	[iteMax] [float] NULL,
	[iteMeio] [varchar](100) NULL,
	[itetxt] [nchar](15) NULL
) ON [PRIMARY]
GO
/****** Object:  View [dbo].[View_Relacao_Espec_Hist]    Script Date: 09/03/2023 01:36:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/*
SELECT * FROM View_Relacao_Espec_Hist
*/

CREATE view [dbo].[View_Relacao_Espec_Hist] as
SELECT
    cabProduto, descrProd, cabRevisao, dataAprov, numEspec,
    situacao, qualObsGeral, qualObsRevisao,
    aplicacao, embalagem, feitoPor, aprovPor,
    isnull(iteProduto, '') iteProduto, isnull(iteRevisao, '') iteRevisao,
    isnull(iteCarac, '') iteCarac, isnull(iteMin, '') iteMin,
    isnull(iteMax, '') iteMax, isnull(iteMeio, '') iteMeio, 
	isnull(descCarac, '') descCarac
FROM
    PCP..qualEspecCab left join
    PCP..qualEspecItens c on
    1 = 1
    and cabProduto = iteProduto
    and cabRevisao = iteRevisao left join
    PCP..qualCarac d on
    1 = 1
    and iteCarac = codCarac
GO
/****** Object:  View [dbo].[View_Relacao_Espec]    Script Date: 09/03/2023 01:36:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



CREATE view [dbo].[View_Relacao_Espec] as
SELECT
    cabProduto, descrProd, cabRevisao, dataAprov, numEspec, 
	situacao, qualObsGeral, qualObsRevisao,
    aplicacao, embalagem, feitoPor, aprovPor,
    isnull(iteProduto, '') iteProduto, isnull(iteRevisao, '') iteRevisao,
    isnull(iteCarac, '') iteCarac, isnull(iteMin, 0) iteMin,
    isnull(iteMax, 0) iteMax, isnull(iteMeio, '') iteMeio, isnull(itetxt, '') itetxt, isnull(codCarac, '') codCarac, isnull(descCarac, '') descCarac
FROM
    PCP..qualEspecCab a inner join
	(
		select 
			cabProduto prod, max(cabRevisao) rev
		from 
			PCP..qualEspecCab
		group by
			cabProduto
	) b on
	1 = 1
	and cabProduto = prod
    and cabRevisao = rev left join
    PCP..qualEspecItens c on
    1 = 1
    and cabProduto = iteProduto
    and cabRevisao = iteRevisao left join
    PCP..qualCarac d on
    1 = 1
    and iteCarac = codCarac
where
	situacao <> 'Encerrada'


GO
/****** Object:  Table [dbo].[OP]    Script Date: 09/03/2023 01:36:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[OP](
	[FILIAL] [varchar](3) NULL,
	[OP] [varchar](11) NULL,
	[EMISSAO] [varchar](10) NULL,
	[FINAL] [varchar](10) NULL,
	[QTDE] [float] NOT NULL,
	[ENTREGUE] [float] NOT NULL,
	[PRODUTO] [varchar](15) NULL,
	[CODANT] [varchar](15) NULL,
	[DESCRICAO] [varchar](70) NULL,
	[ARMAZEM] [varchar](2) NULL,
	[COMPONENTE] [varchar](15) NULL,
	[DESCRIC] [varchar](70) NULL,
	[QTDEORI] [float] NOT NULL,
	[QTDEPCF] [float] NULL,
	[QTDECAL] [float] NULL,
	[SALDO] [float] NULL,
	[ROTEIRO] [varchar](2) NULL,
	[OPERACAO] [varchar](2) NULL,
	[UNIDADE] [varchar](2) NULL,
	[TIPO] [varchar](1) NOT NULL,
	[SITUACA] [varchar](1) NOT NULL
) ON [PRIMARY]
GO
/****** Object:  View [dbo].[View_Portal_Op_Transf]    Script Date: 09/03/2023 01:36:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE VIEW [dbo].[View_Portal_Op_Transf] as
SELECT * FROM (
SELECT 
	RTRIM(FILIAL) FILIAL, 
	RTRIM(OP) OP, 
	EMISSAO, 
	FINAL, 
	QTDE, 
	ENTREGUE, 
	RTRIM(PRODUTO) PRODUTO, 
	RTRIM(CODANT) CODANT, 
	RTRIM(DESCRICAO) DESCRICAO, 
	RTRIM(ARMAZEM) ARMAZEM, 
	RTRIM(COMPONENTE) COMPONENTE, 
	RTRIM(DESCRIC) DESCRIC, 
	QTDEORI, 
	QTDEPCF, 
	QTDECAL, 
	ISNULL(B2_QATU, 0) SALDO, 
	B1_QB BASE, 
	B1_XTRANSF XTRANSF, 
	B1_XINDICA XINDICA, 
	B1_XMOD XMOD, 
	ROTEIRO, 
	OPERACAO, 
	RTRIM(UNIDADE) UNIDADE,
	rtrim(TIPO) TIPO, 
	RTRIM(SITUACA) SITUACA,
	CASE
		WHEN SITUACA = 'I' THEN 'Integrada'
		WHEN SITUACA = 'C' THEN 'Calculada'
		WHEN SITUACA = 'A' THEN 'Ajustada'
		WHEN SITUACA = 'V' THEN 'Re-Ajustar'
		WHEN SITUACA = 'W' THEN 'Web Inicial'
		WHEN SITUACA = 'P' THEN 'Parcial'
		WHEN SITUACA = 'T' THEN 'Total'
		ELSE SITUACA 
	END SITUDESC
FROM 
	--SELECT * FROM 
	PCP..OP A WITH (NOLOCK) LEFT JOIN
	--SELECT * FROM 
	HOMOLOGACAO..SB2010 B WITH (NOLOCK) ON
	1 = 1
	AND FILIAL = B2_FILIAL
	AND COMPONENTE = B2_COD
	AND B.R_E_C_D_E_L_ = 0
	AND B2_LOCAL = '01' INNER JOIN
	--SELECT * FROM 
	HOMOLOGACAO..SB1010 C WITH (NOLOCK) ON
	1 = 1
	AND PRODUTO = B1_COD
	AND C.R_E_C_D_E_L_ = 0
)p

--WHERE FILIAL = '108' AND OP = '03939501001'

GO
/****** Object:  View [dbo].[View_Portal_Cadastro_Produto_Qualidade]    Script Date: 09/03/2023 01:36:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



CREATE view [dbo].[View_Portal_Cadastro_Produto_Qualidade] as
-- View para os produtos que estão disponíveis para o PCF

	SELECT
		rtrim(B1_COD) codigo,
		rtrim(B1_DESC) descricao,
		rtrim(B1_TIPO) tipo,
		rtrim(B1_UM) unidade,
		rtrim(B1_GRUPO) grupo,
		rtrim(B1_POSIPI) ncm,
		rtrim(B1_XTRANSF) retrabalho,
		rtrim(B1_XINDICA) mdo,
		isnull(cabRevisao, '000') revisao,
        rtrim(case when B1_MSBLQL = '1' then'Bloqueado' else 'Liberado' end) sit,
		case 
			when convert(varchar(10), getdate(), 112) < convert(varchar(8), cast(vigenciaDe as datetime), 112) or convert(varchar(10), getdate(), 112) > convert(varchar(8), cast(vigenciaAte as datetime), 112) 
			then 'Fora Vigência'
			when isnull(situacao, '') = ''
			then 'Sem Epecificação'
			when isnull(situacao, '') <> ''
			then situacao
			else ''
		end situacao
	FROM
		HOMOLOGACAO..SB1010 A LEFT JOIN
		(
			select 
				* 
			from 
				PCP..qualEspecCab c inner join
				(
					select 
						cabProduto cabPrd, max(cabRevisao) mxRev
					from 
						PCP..qualEspecCab
					group by
						cabProduto
				)d on
				1 = 1
				and cabProduto = cabPrd
				and cabRevisao = mxRev		
		) B ON
		1 = 1
		AND B1_COD = cabProduto
	WHERE 
		1 = 1
		AND D_E_L_E_T_ = ''
        --AND B1_COD = 'P800501'
		AND B1_TIPO IN ('PA', 'PP') 
		AND B1_XINTPCF <> ''
--order by  9 desc

--select * from PCP..qualEspecCab

GO
/****** Object:  Table [dbo].[qualLote]    Script Date: 09/03/2023 01:36:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[qualLote](
	[id_lote] [int] IDENTITY(1,1) NOT NULL,
	[produto] [varchar](15) NULL,
	[descricao] [varchar](70) NULL,
	[lote] [varchar](9) NULL,
	[diaRevisao] [varchar](8) NULL,
	[hrRevisao] [varchar](5) NULL,
	[validade] [int] NULL,
	[qtde] [float] NULL,
	[seq] [varchar](3) NULL,
	[quebra] [varchar](4) NULL,
	[revisao] [varchar](3) NULL,
	[ativo] [varchar](3) NULL,
	[obs] [varchar](250) NULL,
	[nivel] [varchar](2) NULL,
	[usuario] [int] NULL
) ON [PRIMARY]
GO
/****** Object:  View [dbo].[View_Portal_Cadastro_Produto_Qualidade_Lote]    Script Date: 09/03/2023 01:36:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE view [dbo].[View_Portal_Cadastro_Produto_Qualidade_Lote] as
-- View para os produtos que estão disponíveis para o PCF

	SELECT
		rtrim(B1_COD) produto,
		rtrim(B1_DESC) descricao,
		rtrim(B1_TIPO) tipo,
		rtrim(B1_UM) unidade,
		rtrim(B1_GRUPO) grupo,
		rtrim(B1_POSIPI) ncm,
		rtrim(B1_XTRANSF) retrabalho,
		rtrim(B1_XINDICA) mdo,
		isnull(revisao, '000') revisao,
		isnull(seq, '') seq,
		isnull(validade, 0) validade,
		case
			when isnull(ativo, '') = '' then ''
			else ativo
		end ativo,
		case
			when isnull(quebra, '') = '' then ''
			else quebra
		end quebra,
		isnull(qtde, 0) qtde,
		isnull(diaRevisao, '') diaRevisao,
		isnull(obs, '') obs,
        rtrim(case when B1_MSBLQL = '1' then'Bloqueado' else 'Liberado' end) sit
	FROM
		HOMOLOGACAO..SB1010 A LEFT JOIN
		(
			select 
				* 
			from 
				PCP..qualLote c inner join
				(
					select 
						produto cabPrd, max(revisao) mxRev
					from 
						PCP..qualLote
					group by
						produto
				)d on
				1 = 1
				and produto = cabPrd
				and revisao = mxRev		
		) B ON
		1 = 1
		AND B1_COD = produto
	WHERE 
		1 = 1
		AND D_E_L_E_T_ = ''
        --AND B1_COD = 'P800501'
		AND B1_TIPO IN ('PA', 'PP') 
		AND B1_XINTPCF <> ''
	--order by  9 desc

	--select * from PCP..qualEspecCab

GO
/****** Object:  View [dbo].[View_Relacao_Produto_Lote]    Script Date: 09/03/2023 01:36:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE view [dbo].[View_Relacao_Produto_Lote] as

select 
	id_lote, produto, descricao, lote, diaRevisao, hrRevisao, validade, qtde, seq, quebra, revisao, ativo, obs, nivel, usuario
from 
	qualLote
GO
/****** Object:  Table [dbo].[loteProd]    Script Date: 09/03/2023 01:36:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[loteProd](
	[id_loteProd] [int] IDENTITY(1,1) NOT NULL,
	[filial] [varchar](3) NULL,
	[op] [varchar](11) NULL,
	[produto] [varchar](15) NULL,
	[descricao] [varchar](70) NULL,
	[lote] [varchar](9) NULL,
	[loteAprov] [varchar](9) NULL,
	[dtAprov] [varchar](8) NULL,
	[usrAprov] [int] NULL,
	[usrProd] [int] NULL,
	[dtProd] [varchar](8) NULL,
	[hrProd] [varchar](8) NULL,
	[dtVenc] [varchar](8) NULL,
	[qtdeProd] [float] NULL,
	[qtdeQuebra] [float] NULL,
	[qtdeTot] [float] NULL,
	[quebra] [varchar](4) NULL,
	[nivel] [varchar](2) NULL,
	[revisao] [varchar](3) NULL,
	[situacao] [varchar](15) NULL,
	[fechamento] [varchar](10) NULL,
	[obs] [varchar](250) NULL,
	[resultado] [varchar](15) NULL,
	[justificativa] [varchar](250) NULL,
	[userJusti] [int] NULL
) ON [PRIMARY]
GO
/****** Object:  View [dbo].[View_Relacao_Lote_Registro]    Script Date: 09/03/2023 01:36:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE view [dbo].[View_Relacao_Lote_Registro] as
select 
	id_loteProd, filial, op, produto, descricao, lote, 
	loteAprov, dtAprov, usrAprov, usrProd, dtProd, 
	hrProd, dtVenc, qtdeProd, qtdeQuebra, qtdeTot, 
	quebra, nivel, revisao, situacao, resultado, fechamento, obs
from 
	loteProd
GO
/****** Object:  View [dbo].[View_Relacao_Lote_Detalhe]    Script Date: 09/03/2023 01:36:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

create view [dbo].[View_Relacao_Lote_Detalhe] as
select * from loteProd
GO
/****** Object:  View [dbo].[View_Relacao_Lote_Adianta]    Script Date: 09/03/2023 01:36:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE view [dbo].[View_Relacao_Lote_Adianta] as
select 
	id_loteProd, filial, op, produto, descricao, lote, 
	loteAprov, dtAprov, usrAprov, usrProd, dtProd, 
	hrProd, dtVenc, qtdeProd, qtdeQuebra, qtdeTot, 
	quebra, nivel, revisao, situacao, resultado, fechamento, obs, justificativa
from 
	loteProd
GO
/****** Object:  Table [dbo].[loteAnalise]    Script Date: 09/03/2023 01:36:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[loteAnalise](
	[id_loteProd] [int] IDENTITY(1,1) NOT NULL,
	[filial] [varchar](3) NULL,
	[op] [varchar](11) NULL,
	[produto] [varchar](15) NULL,
	[descricao] [varchar](70) NULL,
	[lote] [varchar](9) NULL,
	[dtAprov] [varchar](8) NULL,
	[hrAprov] [varchar](8) NULL,
	[dtAnalise] [varchar](8) NULL,
	[hrAnalise] [varchar](8) NULL,
	[usrAprov] [int] NULL,
	[usrAnalise] [int] NULL,
	[dtVenc] [varchar](8) NULL,
	[qtdeTot] [float] NULL,
	[revisao] [varchar](3) NULL,
	[codCarac] [varchar](3) NULL,
	[itemin] [float] NULL,
	[itemax] [float] NULL,
	[itemeio] [varchar](50) NULL,
	[result] [float] NULL,
	[situacao] [varchar](15) NULL,
	[itetxt] [varchar](35) NULL,
	[resultxt] [varchar](10) NULL
) ON [PRIMARY]
GO
/****** Object:  View [dbo].[View_Relacao_Lote_Analisa]    Script Date: 09/03/2023 01:36:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE view [dbo].[View_Relacao_Lote_Analisa] as

select 
	id_loteProd, filial, op, produto, descricao, lote, 
	dtAprov, usrAprov, hrAprov, dtAnalise, hrAnalise, usrAnalise, 
	dtVenc, qtdeTot, revisao, a.codCarac, descCarac, itemin, itemax, itemeio, 
	result, situacao, itetxt, resultxt
from 
	loteAnalise a inner join 
	qualCarac b on
	1 = 1
	and a.codCarac = b.codCarac

 union all

select 
	id_loteProd, filial, op, produto, descricao, lote, 
	dtAprov, usrAprov, '' hrAprov, '' dtAnalise, '' hrAnalise, 0 usrAnalise, 
	dtVenc, qtdeTot, revisao, codCarac, descCarac, iteMin itemin, iteMax itemax, iteMeio itemeio,
	'' result, situacao, itetxt, '' resultxt
from 
	loteProd a left join
	(
		select 
			cabProduto, cabRevisao, codCarac, iteCarac, descCarac, iteMin, iteMax, iteMeio, itetxt
		from 
			qualEspecCab a inner join 
			qualEspecItens b on
			1 = 1
			and cabProduto = iteProduto
			and cabRevisao = iteRevisao inner join 
			qualCarac c on
			1 = 1
			and iteCarac = codCarac
		where 
			1 = 1
			and situacao <> 'Encerrada'
	)b on
	1 = 1
	and produto = cabProduto
	and not exists
	(
		select 
			filial, op, produto, lote
		from 
			loteAnalise w
		where
			1 = 1
			and w.filial = filial
			and w.op = op 
			and w.produto = produto
			and w.lote = lote
	)
GO
/****** Object:  View [dbo].[View_Portal_Cadastro_Produto]    Script Date: 09/03/2023 01:36:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



CREATE view [dbo].[View_Portal_Cadastro_Produto] as
SELECT 
	rtrim(B1_COD) codigo, 
	rtrim(B1_DESC) descricao, 
	rtrim(B1_TIPO) tipo, 
	rtrim(B1_UM) unidade, 
	rtrim(B1_GRUPO) grupo, 
	rtrim(B1_POSIPI) ncm, 
	rtrim(B1_XTRANSF) retrabalho, 
	rtrim(B1_XINDICA) mdo, 
	rtrim(case when B1_MSBLQL = '1' then'Bloqueado' else 'Liberado' end) situacao
FROM 
	HOMOLOGACAO..SB1010 
WHERE 
	1 = 1
	AND D_E_L_E_T_ = ''
	--AND B1_XTRANSF <> ''
GO
/****** Object:  View [dbo].[View_Portal_Cadastro_Recursos]    Script Date: 09/03/2023 01:36:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



CREATE View [dbo].[View_Portal_Cadastro_Recursos] as
SELECT 
	rtrim(H1_FILIAL) filial, 
	rtrim(H1_CODIGO) codigo, 
	rtrim(H1_DESCRI) descricao, 
	rtrim(H1_CCUSTO) custo, 
	rtrim(H1_CTRAB) setor, 
	rtrim(H1_CALEND) calendario
FROM 
	HOMOLOGACAO..SH1010 
WHERE
	1 = 1
	AND R_E_C_D_E_L_ = 0
GO
/****** Object:  View [dbo].[View_Portal_Empresa]    Script Date: 09/03/2023 01:36:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



CREATE view [dbo].[View_Portal_Empresa] as

	SELECT	
		M0_CODIGO AS 'codEmp', 
		M0_CODFIL AS 'codFil', 
		M0_FILIAL AS 'nomeFil', 
		M0_NOMECOM AS 'nomeComercial',
		M0_CGC AS 'CNPJ',
		M0_INSC AS 'IE',
		M0_ENDENT AS 'Endereco',
		M0_CIDENT as 'Cidade',
		M0_ESTENT as 'Estado'
	FROM 
		HOMOLOGACAO..SYS_COMPANY WITH(NOLOCK)
	WHERE 
		D_E_L_E_T_ = ''


GO
/****** Object:  View [dbo].[View_Portal_Estrutura]    Script Date: 09/03/2023 01:36:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



CREATE VIEW [dbo].[View_Portal_Estrutura] as
WITH 
	ESTRUT( 
		FILIAL, CODIGO, COD_PAI, COD_COMP, 
		QTD, PERDA, DT_INI, DT_FIM, NIVEL 
		) AS 
( 
	SELECT 
		G1_FILIAL, G1_COD PAI, G1_COD, G1_COMP, 
		G1_QUANT, G1_PERDA, G1_INI, 
		G1_FIM, 1 AS NIVEL 
	FROM 
		HOMOLOGACAO..SG1010 A (NOLOCK) 
	WHERE 
		D_E_L_E_T_ = ''

	UNION ALL 

	SELECT 
		G1_FILIAL, CODIGO, G1_COD, G1_COMP, QTD * G1_QUANT, G1_PERDA, G1_INI, G1_FIM, NIVEL + 1 
	FROM 
		HOMOLOGACAO..SG1010 A WITH (NOLOCK) INNER JOIN 
		ESTRUT B ON 
		G1_COD = COD_COMP 
	WHERE 
		1 = 1
		AND D_E_L_E_T_ = '' 
)

SELECT 
	rtrim(FILIAL) filial, 
	rtrim(CODIGO) codigo, 
	rtrim(B.B1_DESC) descCodigo, 
	rtrim(B.B1_TIPO) tipo, 
	rtrim(COD_PAI) codPai, 
	rtrim(C.B1_DESC) descPai , 
	rtrim(C.B1_TIPO) tipoPai, 
	rtrim(COD_COMP) codComp, 
	rtrim(D.B1_DESC) descComp, 
	rtrim(D.B1_TIPO) tipoComp, 
	rtrim(C.B1_QB) basePai, 
	QTD qtde, 
	PERDA perda, 
	rtrim(D.B1_UM) unidadeComp, 
	DT_INI dtIni, 
	DT_FIM dtFim, 
	NIVEL nivel      
FROM 
	ESTRUT A INNER JOIN 
	HOMOLOGACAO..SB1010 B WITH (NOLOCK) ON 
	1 = 1
	AND B.D_E_L_E_T_ = '' 
	AND B.B1_COD = A.CODIGO INNER JOIN 
	HOMOLOGACAO..SB1010 C WITH (NOLOCK) ON 
	1 = 1
	AND C.D_E_L_E_T_ = '' 
	AND C.B1_COD = COD_PAI INNER JOIN 
	HOMOLOGACAO..SB1010 D WITH (NOLOCK) ON 
	1 = 1
	AND D.D_E_L_E_T_ = '' 
	AND D.B1_COD = COD_COMP 
GO
/****** Object:  View [dbo].[View_Portal_OP]    Script Date: 09/03/2023 01:36:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO




CREATE VIEW [dbo].[View_Portal_OP] as

--select OP, FINAL, DTFIM, TESTE, * from (
SELECT 
	RTRIM(C2_FILIAL) FILIAL,
	RTRIM(C2_NUM)+RTRIM(C2_ITEM)+RTRIM(C2_SEQUEN) OP, 
	CONVERT(VARCHAR(10), CAST(C2_EMISSAO AS DATETIME), 103) EMISSAO, 
	/*
	CASE 
		WHEN C2_DATRF = '' 
		THEN '' 
		ELSE CONVERT(VARCHAR(10), CAST(C2_DATRF AS DATETIME), 103) 
	END FINAL, 
	*/
	C2_QUANT QTDE, 
	C2_QUJE ENTREGUE, 
	RTRIM(B.B1_COD) PRODUTO, 
	RTRIM(B.B1_CODANT) CODANT,
	RTRIM(B.B1_DESC) DESCRICAO, 
	RTRIM(D4_LOCAL) ARMAZEM, 
	RTRIM(D4_COD) COMPONENTE, 
	RTRIM(D.B1_DESC) DESCRIC, 
	D4_QTDEORI QTDEORI, 
	ROUND(B2_QATU, 2) SALDO, 
	RTRIM(D4_ROTEIRO) ROTEIRO, 
	RTRIM(D4_OPERAC) OPERACAO, 
	RTRIM(D.B1_UM) UNIDADE,
	CASE 
		WHEN ISNULL(DTFIM, '') = '' 
		THEN '' 
		ELSE CONVERT(VARCHAR(10), CAST(DTFIM AS DATETIME), 103) 
	END DTFIM,
	CASE 
		WHEN 
			CASE 
				WHEN C2_DATRF = '' THEN ''
				WHEN C2_DATRF <> '' AND  ISNULL(DTFIM, '') <> '' 
				THEN CASE WHEN C2_DATRF > DTFIM THEN DTFIM ELSE C2_DATRF END
				WHEN ISNULL(DTFIM, '') = '' 
				THEN C2_DATRF
			END = '' 
		THEN ''
		ELSE CONVERT(VARCHAR(10), CAST(
			CASE 
				WHEN C2_DATRF = '' THEN ''
				WHEN C2_DATRF <> '' AND  ISNULL(DTFIM, '') <> '' 
				THEN CASE WHEN C2_DATRF > DTFIM THEN DTFIM ELSE C2_DATRF END
				WHEN ISNULL(DTFIM, '') = '' 
				THEN C2_DATRF
			END AS DATETIME), 103) 
	END FINAL
FROM 
	HOMOLOGACAO..SC2010 A WITH (NOLOCK) INNER JOIN
	HOMOLOGACAO..SB1010 B WITH (NOLOCK) ON
	C2_PRODUTO = B.B1_COD INNER JOIN
	HOMOLOGACAO..SD4010 C WITH (NOLOCK) ON
	C2_NUM+C2_ITEM+C2_SEQUEN = D4_OP AND
	C2_FILIAL = D4_FILIAL INNER JOIN
	HOMOLOGACAO..SB1010 D WITH (NOLOCK) ON
	D4_COD = D.B1_COD LEFT JOIN
	--SELECT * FROM 
	HOMOLOGACAO..SB2010 E WITH (NOLOCK) ON
	1 = 1
	AND D4_FILIAL = B2_FILIAL
	AND D4_COD = B2_COD
	AND E.R_E_C_D_E_L_ = 0
	AND B2_LOCAL = '01' LEFT JOIN
	(
		SELECT 
			H6_OP OP, MAX(H6_DTAPONT) DTFIM 
		FROM 
			HOMOLOGACAO..SH6010  WITH (NOLOCK) 
		WHERE 
			R_E_C_D_E_L_ = 0 
		GROUP BY 
			H6_OP	
	) F ON
	C2_NUM+C2_ITEM+C2_SEQUEN = F.OP
WHERE
	1 = 1
	AND A.R_E_C_D_E_L_ = 0
	AND B.R_E_C_D_E_L_ = 0
	AND C.R_E_C_D_E_L_ = 0
	AND D.R_E_C_D_E_L_ = 0
	AND (C2_DATRF = '' OR left(C2_DATRF, 6) >= convert(varchar(6),DATEADD(month, -1, getdate()), 112) )

--) m  where FINAL <> '' AND DTFIM <> '' ORDER BY 2
GO
/****** Object:  View [dbo].[View_Portal_OP_Config]    Script Date: 09/03/2023 01:36:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE VIEW [dbo].[View_Portal_OP_Config] as


SELECT 
	RTRIM(C2_FILIAL) FILIAL, 
	RTRIM(C2_NUM)+RTRIM(C2_ITEM)+RTRIM(C2_SEQUEN) OP, 
	CONVERT(VARCHAR(10), CAST(C2_EMISSAO AS DATETIME), 103) EMISSAO, 
	CASE 
		WHEN C2_DATRF = '' 
		THEN '' 
		ELSE CONVERT(VARCHAR(10), CAST(C2_DATRF AS DATETIME), 103) 
	END FINAL, 
	C2_QUANT QTDE, 
	C2_QUJE ENTREGUE, 
	RTRIM(B.B1_COD) PRODUTO, 
	RTRIM(B.B1_CODANT) CODANT,
	RTRIM(B.B1_DESC) DESCRICAO, 
	RTRIM(D4_LOCAL) ARMAZEM, 
	RTRIM(D4_COD) COMPONENTE, 
	RTRIM(D.B1_DESC) DESCRIC, 
	D4_QTDEORI QTDEORI, 
	0 QTDEPCF, 
	0 QTDECAL, 
	0 SALDO, 
	RTRIM(D4_ROTEIRO) ROTEIRO, 
	RTRIM(D4_OPERAC) OPERACAO, 
	RTRIM(D.B1_UM) UNIDADE,
	'E' TIPO,
	'W' SITUACA
	--INTO PCP..OP
	--TRUNCATE TABLE PCP..OP
	--DROP TABLE PCP..OP
FROM 
	HOMOLOGACAO..SC2010 A WITH (NOLOCK) INNER JOIN
	HOMOLOGACAO..SB1010 B WITH (NOLOCK) ON
	C2_PRODUTO = B.B1_COD INNER JOIN
	HOMOLOGACAO..SD4010 C WITH (NOLOCK) ON
	C2_NUM+C2_ITEM+C2_SEQUEN = D4_OP AND
	C2_FILIAL = D4_FILIAL INNER JOIN
	HOMOLOGACAO..SB1010 D WITH (NOLOCK) ON
	D4_COD = D.B1_COD
WHERE
	1 = 1
	AND A.R_E_C_D_E_L_ = 0
	AND B.R_E_C_D_E_L_ = 0
	AND C.R_E_C_D_E_L_ = 0
	AND D.R_E_C_D_E_L_ = 0
GO
/****** Object:  View [dbo].[View_Portal_Saldo_Estoque]    Script Date: 09/03/2023 01:36:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



CREATE View [dbo].[View_Portal_Saldo_Estoque] as
SELECT 
	rtrim(B2_FILIAL) filial, 
	rtrim(B2_COD) codigo, 
	rtrim(B1_DESC) descricao, 
	rtrim(B2_LOCAL) armazem, 
	B2_QATU saldo, 
	B2_CMFF1 cm, 
	B2_QEMP empenhado
FROM 
	HOMOLOGACAO..SB2010 A INNER JOIN
	HOMOLOGACAO..SB1010 B ON
	B2_COD = B1_COD
WHERE
	1 = 1
	AND B1_TIPO IN ('PA', 'MP', 'EM', 'MO')
	AND A.R_E_C_D_E_L_ = 0
	AND B.R_E_C_D_E_L_ = 0
	--AND (B2_QATU <> 0 OR (B2_QATU = 0 AND B2_RESERVA <> 0))
GO
/****** Object:  View [dbo].[View_ajusta_OP]    Script Date: 09/03/2023 01:36:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE view [dbo].[View_ajusta_OP] as
SELECT 
	G1_FILIAL FILIAL, 
	G1_COD PRODUTO, 
	B.B1_DESC DESCPRO, 
	G1_COMP COMPONENTE, 
	C.B1_DESC DESCCOMP, 
	G1_QUANT QTDE,  
	B.B1_QB BASE, 
	--@QTDE / B.B1_QB * G1_QUANT CALC,
	C.B1_TIPO TIPO, 
	C.B1_UM UNIDADE
FROM 
	--SELECT * FROM 
	HOMOLOGACAO..SG1010 A WITH (NOLOCK) INNER JOIN
	--SELECT * FROM 
	HOMOLOGACAO..SB1010 B WITH (NOLOCK) ON
	1 = 1
	AND G1_COD = B.B1_COD INNER JOIN
	--SELECT * FROM 
	HOMOLOGACAO..SB1010 C WITH (NOLOCK) ON
	1 = 1
	AND G1_COMP = C.B1_COD 
WHERE
	1 = 1
	--AND G1_FILIAL = '101'
	--AND G1_COD = 'PAN00090'
	AND G1_MSBLQL <> '1'
	AND B.B1_QB > 0
	AND A.R_E_C_D_E_L_ = 0
	AND B.R_E_C_D_E_L_ = 0
	AND C.R_E_C_D_E_L_ = 0
	
GO
/****** Object:  Table [dbo].[DOC]    Script Date: 09/03/2023 01:36:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[DOC](
	[filial] [varchar](3) NULL,
	[op] [varchar](11) NULL,
	[produto] [varchar](15) NULL,
	[descricao] [varchar](70) NULL,
	[qtdeori] [float] NOT NULL,
	[clotea] [varchar](20) NULL,
	[cloteb] [varchar](20) NULL,
	[clotec] [varchar](20) NULL,
	[cloted] [varchar](20) NULL,
	[clotee] [varchar](20) NULL,
	[clotef] [varchar](20) NULL,
	[cloteg] [varchar](20) NULL,
	[cloteh] [varchar](20) NULL,
	[clotei] [varchar](20) NULL,
	[clotej] [varchar](20) NULL,
	[clotek] [varchar](50) NULL,
	[clotel] [varchar](50) NULL,
	[nlotea] [float] NULL,
	[nloteb] [float] NULL,
	[nlotec] [float] NULL,
	[nloted] [float] NULL,
	[nlotee] [float] NULL,
	[nlotef] [float] NULL,
	[nloteg] [float] NULL,
	[nloteh] [float] NULL,
	[nlotei] [float] NULL,
	[nlotej] [float] NULL,
	[nlotek] [float] NULL,
	[nlotel] [float] NULL,
	[lider] [varchar](35) NULL,
	[processo] [varchar](35) NULL,
	[observ] [varchar](200) NULL,
	[turno1] [varchar](1) NULL,
	[turno2] [varchar](1) NULL,
	[turno3] [varchar](1) NULL,
	[datadoc] [varchar](8) NULL,
	[emissao] [varchar](8) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[DOCITENS]    Script Date: 09/03/2023 01:36:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[DOCITENS](
	[itfilial] [varchar](3) NOT NULL,
	[itop] [varchar](11) NOT NULL,
	[itdatadoc] [varchar](8) NOT NULL,
	[itcomp] [varchar](15) NOT NULL,
	[itdesc] [varchar](70) NOT NULL,
	[itqtdeorig] [float] NOT NULL,
	[itqtdeinfo] [float] NULL,
	[itdel] [varchar](1) NULL,
	[itaponta] [varchar](1) NULL,
	[lotenotaop] [varchar](66) NULL,
	[ituni] [varchar](3) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[cadastro]    Script Date: 09/03/2023 01:36:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[cadastro](
	[nome] [varchar](50) NULL,
	[email] [varchar](50) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[loteAprov]    Script Date: 09/03/2023 01:36:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[loteAprov](
	[id_loteProd] [int] IDENTITY(1,1) NOT NULL,
	[filial] [varchar](3) NULL,
	[op] [varchar](11) NULL,
	[produto] [varchar](15) NULL,
	[descricao] [varchar](70) NULL,
	[lote] [varchar](9) NULL,
	[revisao] [varchar](3) NULL,
	[nivel] [varchar](2) NULL,
	[nivelAprov] [varchar](2) NULL,
	[dtAprov] [varchar](8) NULL,
	[hrAprov] [varchar](5) NULL,
	[usrAprov] [int] NULL,
	[dtVenc] [varchar](8) NULL,
	[qtdeProd] [float] NULL,
	[situacao] [varchar](15) NULL,
	[fechamento] [varchar](10) NULL,
	[justificativa] [varchar](250) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[parametros]    Script Date: 09/03/2023 01:36:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[parametros](
	[conect] [varchar](20) NULL,
	[usur] [varchar](30) NULL,
	[pass] [varchar](30) NULL,
	[serv] [varchar](30) NULL,
	[db] [varchar](30) NULL,
	[tipo] [varchar](30) NULL,
	[host] [varchar](30) NULL,
	[prt] [varchar](30) NULL,
	[encrypt] [varchar](30) NULL,
	[enableArithAbort] [varchar](30) NULL,
	[dialect] [varchar](30) NULL,
	[instanceName] [varchar](255) NULL,
	[obs] [varchar](255) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[recursos]    Script Date: 09/03/2023 01:36:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[recursos](
	[recurso] [varchar](11) NULL,
	[grupo] [varchar](15) NULL,
	[ativo] [varchar](1) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[user2]    Script Date: 09/03/2023 01:36:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[user2](
	[codigo] [int] IDENTITY(1,1) NOT NULL,
	[empresa] [varchar](170) NULL,
	[nome] [varchar](80) NULL,
	[email] [varchar](80) NULL,
	[senha] [varbinary](max) NULL,
	[perfil] [varchar](20) NULL,
	[depto] [varchar](50) NULL,
	[telefone] [varchar](13) NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[usuarios]    Script Date: 09/03/2023 01:36:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[usuarios](
	[codigo] [int] IDENTITY(1,1) NOT NULL,
	[empresa] [varchar](170) NULL,
	[nome] [varchar](80) NULL,
	[email] [varchar](80) NULL,
	[senha] [varchar](25) NULL,
	[perfil] [varchar](20) NULL,
	[depto] [varchar](50) NULL,
	[telefone] [varchar](13) NULL,
PRIMARY KEY CLUSTERED 
(
	[codigo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  StoredProcedure [dbo].[sp_ajusta_OP]    Script Date: 09/03/2023 01:36:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE procedure [dbo].[sp_ajusta_OP] 
	@FILIAL VARCHAR(3), 
	@OP VARCHAR(11), 
	@PRODUTO VARCHAR(15), 
	@DESCPROD VARCHAR(40), 
	@CODANT VARCHAR(15), 
	@COMPONENTE VARCHAR(15), 
	@DESCCOMP VARCHAR(40), 
	@TIPO VARCHAR(1), 
	@SITUACA VARCHAR(1), 
	@UNIDADE VARCHAR(2), 
	@QTDEPCF FLOAT,
	@QTDEINF FLOAT
AS
--sp_ajusta_OP '101', '00312801001', 'PAN00095', 'PERLITE FA 2000 BIG BAG 210KG', '', 'GGF3010201', 'PALLET PBR MADEIRA NOVO DUPLA FACE 1,00X1,20', 'M', 'C', 'H', 10, 16.666666666666668
--EXEC    sp_ajusta_OP   '101',   '00275101001',   'PAN00090',   'undefined',   'PA001432',   'GAS311202',   'GAS EXPANSAO - CG',   'E',   'C',   'M3',   86.176,   0

/*
CODANT: ""
COMPONENTE: "GGF3010201"
DESCCOMP: "GASTOS GERAIS MOAGEM - CG"
DESCPROD: "PERLITE FA 8000 SACO 16KG"
FILIAL: "101"
OP: "00314701001"
PRODUTO: "PAN00099"
QTDEINF: 2.25
QTDEPCF: 10
SITUACA: "C"
TIPO: "M"
UNIDADE: "H"
*/
--SELECT * FROM PCP..OP WHERE OP = '00236901001'

declare 
	@QTDE int, 
	@QTDECAL FLOAT,
	@ESTRUTURA INT

SET @QTDE = (SELECT COUNT(*) FROM PCP..OP WHERE FILIAL = @FILIAL AND OP = @OP AND PRODUTO = @PRODUTO AND COMPONENTE = @COMPONENTE)
SET @ESTRUTURA = (SELECT COUNT(*) FROM TMPRD..SG1010 WHERE G1_FILIAL = @FILIAL AND G1_COD = @PRODUTO AND G1_COMP = @COMPONENTE)

--sp_ajusta_OP FILIAL, OP, PA, DESCPA, CODANT, COMP, DESCCOMP, TIPO, SITUAÇÃO, UNIDADE, QYDEPCF, QTDEINF
--sp_ajusta_OP '101', '00314701001', 'PAN00099', 'PERLITE FA 2000 BIG BAG 210KG', '', 'GGF3010201', 'PALLET PBR MADEIRA NOVO DUPLA FACE 1,00X1,20', 'M', 'C', 'H', 10, 2.25

IF @SITUACA NOT IN ('A', 'P')

	BEGIN
		IF @QTDEINF > 0
			BEGIN
				SET @QTDECAL = ROUND(@QTDEINF, 4)
			END
		IF @QTDEINF = 0 AND @TIPO <> 'M'
			BEGIN

				SET @QTDECAL = ROUND(ISNULL((
									SELECT 
										ROUND(G1_QUANT / ((100 - G1_PERDA) / 100) * (@QTDEPCF / CASE WHEN B1_QB = 0 THEN 1 ELSE B1_QB END), 4)
									FROM 
										TMPRD..SG1010 A WITH (NOLOCK) INNER JOIN
										TMPRD..SB1010 B WITH (NOLOCK) ON
										G1_COD = B1_COD
									WHERE
										1 = 1
										AND A.R_E_C_D_E_L_ = 0
										AND B.R_E_C_D_E_L_ = 0
										--AND G1_FILIAL = '101'
										--AND G1_COD = 'PAN00090'
										--AND G1_COMP = 'GAS311202'
										AND G1_FILIAL = @FILIAL
										AND G1_COD = @PRODUTO
										AND G1_COMP = @COMPONENTE
								), 0), 4)

				--SELECT * FROM PCP..OP 
			END

		IF @QTDEINF = 0 AND @TIPO = 'M'
			BEGIN

				SET @QTDECAL = ROUND(ISNULL((
									SELECT 
										ROUND(G1_QUANT * (@QTDEINF / CASE WHEN B1_QB = 0 THEN 1 ELSE B1_QB END), 4)
									FROM 
										TMPRD..SG1010 A WITH (NOLOCK) INNER JOIN
										TMPRD..SB1010 B WITH (NOLOCK) ON
										G1_COD = B1_COD
									WHERE
										1 = 1
										AND A.R_E_C_D_E_L_ = 0
										AND B.R_E_C_D_E_L_ = 0
										--AND G1_FILIAL = '101'
										--AND G1_COD = 'PAN00090'
										--AND G1_COMP = 'GAS311202'
										AND G1_FILIAL = @FILIAL
										AND G1_COD = @PRODUTO
										AND G1_COMP = @COMPONENTE
								), 0), 4)

				--SELECT * FROM PCP..OP 
			END


		--QUANDO TEM O PRODUTO NO EMPENHO
		IF @QTDE = 1
			BEGIN
				UPDATE 
					PCP..OP
				SET
					QTDECAL = round(@QTDECAL, 4),
					SITUACA = CASE WHEN @SITUACA = 'K' THEN 'C' ELSE @SITUACA END
				WHERE 
					1 = 1
					AND FILIAL = @FILIAL 
					AND OP = @OP
					AND PRODUTO = @PRODUTO 
					AND COMPONENTE = @COMPONENTE
					AND TIPO <> CASE WHEN @SITUACA = 'K' THEN 'K' ELSE 'C' END
			END
		--QUANDO NÃO TEM O PRODUTO NO EMPENHO
		IF @QTDE = 0
			BEGIN
				IF @COMPONENTE = 'GGF3010201' AND @ESTRUTURA = 0
					BEGIN
						SET @ESTRUTURA = 0
					END
				ELSE
					BEGIN
						INSERT INTO PCP..OP 
							(FILIAL, OP, PRODUTO, DESCRICAO, CODANT, COMPONENTE, DESCRIC, ARMAZEM, QTDEPCF, QTDECAL, UNIDADE, TIPO, SITUACA, QTDE, QTDEORI, SALDO, ENTREGUE, ROTEIRO, OPERACAO, EMISSAO, FINAL )
						VALUES
							(@FILIAL, @OP, @PRODUTO, @DESCPROD, @CODANT, @COMPONENTE, @DESCCOMP, '01', ROUND(@QTDEPCF, 4), ROUND(@QTDEINF, 4), @UNIDADE, @TIPO, @SITUACA, 0, 0, 0, '', '01', '', '', '')
					END
			END
	END

IF @SITUACA = 'A'
	BEGIN
		UPDATE
			PCP..OP
		SET
			SITUACA = @SITUACA
		WHERE 
			1 = 1
			AND FILIAL = @FILIAL 
			AND OP = @OP
	END	

IF @SITUACA = 'V'
	BEGIN
		UPDATE
			PCP..OP
		SET
			SITUACA = @SITUACA
		WHERE 
			1 = 1
			AND FILIAL = @FILIAL 
			AND OP = @OP
	END	

IF @SITUACA = 'P'
	BEGIN
		UPDATE
			PCP..OP
		SET
			SITUACA = @SITUACA
		WHERE 
			1 = 1
			AND FILIAL = @FILIAL 
			AND OP = @OP
	END	
GO
/****** Object:  StoredProcedure [dbo].[sp_ajusta_OP_OLD]    Script Date: 09/03/2023 01:36:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE procedure [dbo].[sp_ajusta_OP_OLD] 
	@FILIAL VARCHAR(3), 
	@OP VARCHAR(11), 
	@PRODUTO VARCHAR(15), 
	@DESCPROD VARCHAR(40), 
	@CODANT VARCHAR(15), 
	@COMPONENTE VARCHAR(15), 
	@DESCCOMP VARCHAR(40), 
	@TIPO VARCHAR(1), 
	@SITUACA VARCHAR(1), 
	@UNIDADE VARCHAR(2), 
	@QTDEPCF FLOAT,
	@QTDEINF FLOAT
AS
--sp_ajusta_OP '101', '00275101001', 'PAN00090', 'ALP 10 ORANGE F 7 DRUM 40KG', 'PAN0067133', 'MEN00165', 'PALLET PBR MADEIRA NOVO DUPLA FACE 1,00X1,20', 'R', 'C', 'UN', 12
--EXEC    sp_ajusta_OP   '101',   '00275101001',   'PAN00090',   'undefined',   'PA001432',   'GAS311202',   'GAS EXPANSAO - CG',   'E',   'C',   'M3',   86.176,   0

--SELECT * FROM PCP..OP WHERE OP = '00236901001'

declare @QTDE int, @QTDECAL FLOAT

SET @QTDE = (SELECT COUNT(*) FROM PCP..OP WHERE FILIAL = @FILIAL AND OP = @OP AND PRODUTO = @PRODUTO AND COMPONENTE = @COMPONENTE)


IF @SITUACA NOT IN ('A', 'P')
	BEGIN
		IF @QTDEINF > 0
			BEGIN
				SET @QTDECAL = ROUND(@QTDEINF, 5)
			END
		IF @QTDEINF = 0 AND @TIPO <> 'M'
			BEGIN
				SET @QTDECAL = ISNULL((
									SELECT 
										--G1_COMP, G1_QUANT * (100 / CASE WHEN B1_QB = 0 THEN 1 ELSE B1_QB END)
										G1_QUANT * (@QTDEPCF / CASE WHEN B1_QB = 0 THEN 1 ELSE B1_QB END)
									FROM 
										TMPRD..SG1010 A WITH (NOLOCK) INNER JOIN
										TMPRD..SB1010 B WITH (NOLOCK) ON
										G1_COD = B1_COD
									WHERE
										1 = 1
										AND A.R_E_C_D_E_L_ = 0
										AND B.R_E_C_D_E_L_ = 0
										--AND G1_FILIAL = '101'
										--AND G1_COD = 'PAN00090'
										--AND G1_COMP = 'GAS311202'
										AND G1_FILIAL = @FILIAL
										AND G1_COD = @PRODUTO
										AND G1_COMP = @COMPONENTE
								), 0)

				--SELECT * FROM PCP..OP 
			END

		IF @QTDEINF = 0 AND @TIPO = 'M'
			BEGIN
				SET @QTDECAL = ISNULL((
									SELECT 
										--G1_COMP, G1_QUANT * (100 / CASE WHEN B1_QB = 0 THEN 1 ELSE B1_QB END)
										G1_QUANT * (@QTDEINF / CASE WHEN B1_QB = 0 THEN 1 ELSE B1_QB END)
									FROM 
										TMPRD..SG1010 A WITH (NOLOCK) INNER JOIN
										TMPRD..SB1010 B WITH (NOLOCK) ON
										G1_COD = B1_COD
									WHERE
										1 = 1
										AND A.R_E_C_D_E_L_ = 0
										AND B.R_E_C_D_E_L_ = 0
										--AND G1_FILIAL = '101'
										--AND G1_COD = 'PAN00090'
										--AND G1_COMP = 'GAS311202'
										AND G1_FILIAL = @FILIAL
										AND G1_COD = @PRODUTO
										AND G1_COMP = @COMPONENTE
								), 0)

				--SELECT * FROM PCP..OP 
			END


		IF @QTDE = 1
			BEGIN
				UPDATE 
					PCP..OP
				SET
					QTDECAL = round(@QTDECAL, 5),
					SITUACA = CASE WHEN @SITUACA = 'K' THEN 'C' ELSE @SITUACA END
				WHERE 
					1 = 1
					AND FILIAL = @FILIAL 
					AND OP = @OP
					AND PRODUTO = @PRODUTO 
					AND COMPONENTE = @COMPONENTE
					AND TIPO <> CASE WHEN @SITUACA = 'K' THEN 'K' ELSE 'C' END
			END

			
		IF @QTDE = 0

			BEGIN
				INSERT INTO PCP..OP 
					(FILIAL, OP, PRODUTO, DESCRICAO, CODANT, COMPONENTE, DESCRIC, ARMAZEM, QTDEPCF, QTDECAL, UNIDADE, TIPO, SITUACA, QTDE, QTDEORI, SALDO, ENTREGUE, ROTEIRO, OPERACAO, EMISSAO, FINAL )
				VALUES
					(@FILIAL, @OP, @PRODUTO, @DESCPROD, @CODANT, @COMPONENTE, @DESCCOMP, '01', @QTDEPCF, ROUND(@QTDEINF, 5), @UNIDADE, @TIPO, @SITUACA, 0, 0, 0, '', '01', '', '', '')
			END

	END

IF @SITUACA = 'A'
	BEGIN
		UPDATE
			PCP..OP
		SET
			SITUACA = @SITUACA
		WHERE 
			1 = 1
			AND FILIAL = @FILIAL 
			AND OP = @OP
	END	

IF @SITUACA = 'V'
	BEGIN
		UPDATE
			PCP..OP
		SET
			SITUACA = @SITUACA
		WHERE 
			1 = 1
			AND FILIAL = @FILIAL 
			AND OP = @OP
	END	

IF @SITUACA = 'P'
	BEGIN
		UPDATE
			PCP..OP
		SET
			SITUACA = @SITUACA
		WHERE 
			1 = 1
			AND FILIAL = @FILIAL 
			AND OP = @OP
	END	
GO
/****** Object:  StoredProcedure [dbo].[sp_ajusta_mod]    Script Date: 09/03/2023 01:36:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[sp_ajusta_mod] @CC varchar(10) as


--SELECT * FROM PCP..OP
--sp_ajusta_mod '3060206'

SELECT 
	B1_COD, B1_DESC
FROM 
	TMPRD..SB1010
WHERE
	1 = 1
	AND RTRIM(SUBSTRING(B1_COD, 4, 10)) =  @CC
	AND R_E_C_D_E_L_ = 0
	AND B1_XINDICA = ''

UNION ALL

SELECT 
	B1_COD, B1_DESC
FROM 
	TMPRD..SB1010
WHERE
	1 = 1
	AND RTRIM(SUBSTRING(B1_XINDICA, 4, 10)) =  @CC
	AND R_E_C_D_E_L_ = 0
	AND B1_XINDICA = ''
GO
/****** Object:  StoredProcedure [dbo].[sp_altParametros]    Script Date: 09/03/2023 01:36:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE procedure [dbo].[sp_altParametros]
	@conect varchar(20),
	@usur varchar(30),
	@pass varchar(30),
	@serv varchar(30),
	@db varchar(30),
	@tipo varchar(30),
	@host varchar(30),
	@prt varchar(30),
	@encrypt varchar(30),
	@enableArithAbort varchar(30),
	@dialect varchar(30),
	@instanceName varchar(255)
as


update 
	parametros 
set
	usur=@usur,
	pass=@pass,
	serv=@serv,
	db=@db,
	tipo=@tipo,
	host=@host,
	prt=@prt,
	encrypt=@encrypt,
	enableArithAbort=@enableArithAbort,
	dialect=@dialect,
	instanceName=@instanceName
where
	conect = @conect

	/*
	sp_altParametros '785', 'sql_ppi', 'pcf', '10.3.0.44\SQLPROTHEUS', 'TMPRD', 'mssql', '10.3.0.44', '1433', '1', '1', 'mssql', 'SQLPROTHEUS'
	SELECT conect, usur, pass, serv, db, tipo, host, prt, encrypt, enableArithAbort, dialect, instanceName FROM parametros order by 1

*/
GO
/****** Object:  StoredProcedure [dbo].[sp_alteraSenhaUsuario]    Script Date: 09/03/2023 01:36:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE procedure [dbo].[sp_alteraSenhaUsuario]

--sp_alteraSenhaUsuario 1, '124125'
	@codUser int,
	@senhaNew varchar(80)
as


		update 
			usuarios 
		set
			senha = @senhaNew
		where
			codigo = @codUser

GO
/****** Object:  StoredProcedure [dbo].[sp_atualizaCabecDoc]    Script Date: 09/03/2023 01:36:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE procedure [dbo].[sp_atualizaCabecDoc]
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
/****** Object:  StoredProcedure [dbo].[sp_atualizaDoc]    Script Date: 09/03/2023 01:36:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE procedure [dbo].[sp_atualizaDoc]

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
                TMPRD..SC2010 A INNER JOIN
                TMPRD..SB1010 B ON
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
                TMPRD..SD4010 A INNER JOIN
                TMPRD..SB1010 B ON
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
                        TMPRD..SB1010
                    WHERE
                        B1_COD = @itComp
                    )
        set @itUnidade = (
                    SELECT DISTINCT TOP 1
                        B1_UM 
                    FROM 
                        TMPRD..SB1010
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
/****** Object:  StoredProcedure [dbo].[sp_atualiza_OP]    Script Date: 09/03/2023 01:36:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE procedure [dbo].[sp_atualiza_OP]
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
	TMPRD..View_Portal_OP_Config A LEFT JOIN
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
/****** Object:  StoredProcedure [dbo].[sp_incluiAlteraCaracteristica]    Script Date: 09/03/2023 01:36:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
create procedure [dbo].[sp_incluiAlteraCaracteristica]

--sp_incluiAlteraCaracteristica 001, 'descricação do negocio'
	@tipoCarac int,
	@codCarac varchar(03),
	@descCarac varchar(55)
as


if @tipoCarac = 1
	begin
		insert into PCP..qualCarac  
			(codCarac, descCarac)
		values
			(@codCarac, @descCarac)
	end

if @tipoCarac = 2
	begin
		update 
			PCP..qualCarac 
		set
			descCarac = @descCarac
		where
			codCarac = @codCarac
	end

GO
/****** Object:  StoredProcedure [dbo].[sp_incluiAlteraUsuario]    Script Date: 09/03/2023 01:36:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE procedure [dbo].[sp_incluiAlteraUsuario]

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
/****** Object:  StoredProcedure [dbo].[sp_incluiEspec]    Script Date: 09/03/2023 01:36:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO






CREATE procedure [dbo].[sp_incluiEspec]

-- procedure para inclusão de escecificações na tabela principal

/*
EXEC    PCP..sp_incluiEspec  'PAN00009',  'PIPICAT GRANULADO SANITARIO ULTRA DRY ORIGINAL 4KG 6X1',  '999',  '2023-01-20',  'ITESPABV040',  'Concluida',  '',  '',  '',  '',  '',  '',  'I' 
SELECT * FROM PCP..qualEspecCab
select * from PCP..qualEspecItens 

*/

	@cabProduto varchar(15),
    @descrProd varchar(70),
    @cabRevisao varchar(03),
    @dataAprov varchar(10),
    @numEspec varchar(20),
    @situacao varchar(20),
    @qualObsGeral varchar(250),
    @qualObsRevisao varchar(250),
    @aplicacao varchar(70),
    @embalagem varchar(250),
    @feitoPor varchar(70), 
	@aprovPor varchar(70),
	@cTipo varchar(1)
as




declare 
	@existRev int,
	@novaRev varchar(3)


set @novaRev = right(concat('000', rtrim(convert(varchar(3), cast(@cabRevisao as int) + 1))), 3) --numero da próxima revisão


if @cTipo = 'R'
	
	if @cabRevisao = '000'
		begin
			insert into PCP..qualEspecCab  
				(cabProduto, descrProd, cabRevisao, dataAprov, numEspec, situacao, qualObsGeral, qualObsRevisao, aplicacao, embalagem, feitoPor, aprovPor)
			values
				(@cabProduto, @descrProd, '001', @dataAprov, @numEspec, @situacao, @qualObsGeral, @qualObsRevisao, @aplicacao, @embalagem, @feitoPor, @aprovPor)

		end
	else
		begin
			update 
				PCP..qualEspecCab  
			set
				situacao = 'Encerrada'
			where
				1 = 1
				and cabProduto = @cabProduto 
				and cabRevisao = @cabRevisao

			insert into PCP..qualEspecCab  
				(cabProduto, descrProd, cabRevisao, dataAprov, numEspec, situacao, qualObsGeral, qualObsRevisao, aplicacao, embalagem, feitoPor, aprovPor)
			values
				(@cabProduto, @descrProd, @novaRev, @dataAprov, @numEspec, @situacao, @qualObsGeral, @qualObsRevisao, @aplicacao, @embalagem, @feitoPor, @aprovPor)

			

			insert into PCP..qualEspecItens select iteProduto, @novaRev iteRevisao, iteCarac, iteMin, iteMax, iteMeio, itetxt from PCP..qualEspecItens where iteRevisao = @cabRevisao and iteProduto = @cabProduto
		end 

if @cTipo = 'I'
	
	if @cabRevisao = '000'
		begin
			insert into PCP..qualEspecCab  
				(cabProduto, descrProd, cabRevisao, dataAprov, numEspec, situacao, qualObsGeral, qualObsRevisao, aplicacao, embalagem, feitoPor, aprovPor)
			values
				(@cabProduto, @descrProd, '001', @dataAprov, @numEspec, @situacao, @qualObsGeral, @qualObsRevisao, @aplicacao, @embalagem, @feitoPor, @aprovPor)

		end
	else
		begin
			update 
				PCP..qualEspecCab  
			set
				situacao = 'Encerrada'
			where
				1 = 1
				and cabProduto = @cabProduto 
				and cabRevisao = isnull((select distinct max(iteRevisao) from PCP..qualEspecItens where iteProduto = @cabProduto group by iteProduto), '000')

			insert into PCP..qualEspecCab  
				(cabProduto, descrProd, cabRevisao, dataAprov, numEspec, situacao, qualObsGeral, qualObsRevisao, aplicacao, embalagem, feitoPor, aprovPor)
			values
				(@cabProduto, @descrProd, @cabRevisao, @dataAprov, @numEspec, @situacao, @qualObsGeral, @qualObsRevisao, @aplicacao, @embalagem, @feitoPor, @aprovPor)

			insert into PCP..qualEspecItens select iteProduto, @cabRevisao iteRevisao, iteCarac, iteMin, iteMax, iteMeio, itetxt from PCP..qualEspecItens a inner join (select iteProduto prod, max(iteRevisao) revis from PCP..qualEspecItens group by iteProduto) b on iteProduto = prod and iteRevisao = revis where iteProduto = @cabProduto
		end 

if @cTipo = 'A'

	begin
		update 
			PCP..qualEspecCab  
		set
			dataAprov = @dataAprov, 
			situacao = @situacao, 
			numEspec = @numEspec, 
			qualObsGeral = @qualObsGeral, 
			qualObsRevisao = @qualObsRevisao, 
			aplicacao = @aplicacao, 
			embalagem = @embalagem, 
			feitoPor = @feitoPor, 
			aprovPor = @aprovPor
		where
			1 = 1
			and cabProduto = @cabProduto 
			and cabRevisao = @cabRevisao
	end

	/*
set @existRev = isnull((
						select 
							count(*) 
						from 
							PCP..qualEspecCab 
						where 
							1 = 1
							and situacao <> 'Encerrada'
							and cabProduto = @cabProduto 
							and cabRevisao = @cabRevisao), 0)

if @existRev = 0
	begin
		insert into PCP..qualEspecCab  
			(cabProduto, descrProd, cabRevisao, vigenciaDe, vigenciaAte, situacao, qualObsGeral, qualObsRevisao, aplicacao, embalagem, feitoPor, aprovPor)
		values
			(@cabProduto, @descrProd, @cabRevisao, @vigenciaDe, @vigenciaAte, @situacao, @qualObsGeral, @qualObsRevisao, @aplicacao, @embalagem, @feitoPor, @aprovPor)
	end
if @existRev > 0
	begin
		update 
			PCP..qualEspecCab  
		set
			vigenciaDe = @vigenciaDe, 
			vigenciaAte = @vigenciaAte, 
			situacao = @situacao, 
			qualObsGeral = @qualObsGeral, 
			qualObsRevisao = @qualObsRevisao, 
			aplicacao = @aplicacao, 
			embalagem = @embalagem, 
			feitoPor = @feitoPor, 
			aprovPor = @aprovPor
		where
			1 = 1
			and cabProduto = @cabProduto 
			and cabRevisao = @cabRevisao
	end*/
GO
/****** Object:  StoredProcedure [dbo].[sp_incluiEspecItens]    Script Date: 09/03/2023 01:36:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO






CREATE procedure [dbo].[sp_incluiEspecItens]
	@iteProduto varchar(15),
    @iteRevisao varchar(03),
    @iteCarac varchar(03),
    @iteMin float,
    @iteMax float,
    @iteMeio varchar(100),
    @itetxt varchar(35),
    @iteTp varchar(01)
as

-- procedure para inclusão de escecificações na tabela principal

/*
EXEC    PCP..sp_incluiEspecItens  'PAN00009',  '223',  '084',  15,  15,  '999',  '888',  'I' 
EXEC    PCP..sp_incluiEspecItens  'PAN00009',  '223',  '084',  15.000,  15.000,  '666',  '555',  'A' 
EXEC    PCP..sp_incluiEspecItens  'PAN00009',  '224',  '084',  15.000,  15.000,  'meio',  'par',  'A'
SELECT * FROM qualEspecItens

	iteProduto, iteRevisao, iteCarac, iteMin, iteMax,

*/

declare 
	@existEspec int


if @iteTp = 'E'
	begin
		delete
			PCP..qualEspecItens  
		where
			1 = 1
			and iteProduto = @iteProduto
			and iteRevisao = @iteRevisao
			and iteCarac = @iteCarac
	end

else
	begin
		set @existEspec = isnull((
								select 
									count(*) 
								from 
									PCP..qualEspecItens 
								where 
									1 = 1
									and iteProduto = @iteProduto 
									and iteRevisao = @iteRevisao
									and iteCarac = @iteCarac), 0)
		
			begin
				if @existEspec = 0
					begin
						insert into PCP..qualEspecItens  
							(iteProduto, iteRevisao, iteCarac, iteMin, iteMax, itetxt, iteMeio)
						values
							(@iteProduto, @iteRevisao, @iteCarac, @iteMin, @iteMax, @itetxt, @iteMeio)
					end
				if @existEspec > 0
					begin
						update 
							PCP..qualEspecItens  
						set
							iteMin = @iteMin, 
							iteMax = @iteMax,
							itetxt = @itetxt,
							iteMeio = @iteMeio
						where
							1 = 1
							and iteProduto = @iteProduto
							and iteRevisao = @iteRevisao
							and iteCarac = @iteCarac
					end
			end
	end
GO
/****** Object:  StoredProcedure [dbo].[sp_manuLote]    Script Date: 09/03/2023 01:36:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO






--todas as operações com lote

CREATE procedure [dbo].[sp_manuLote]
	@filial varchar(3),
	@op varchar(11),
	@produto varchar(15),
	@descricao varchar(70),
    @revisao varchar(3),
    @lote varchar(9),
    @validade int,
    @quebra varchar(4),
    @nivel varchar(2),
    @qtde float,
    @obs varchar(250),
    @usuario int,
	@cTipo varchar(1)
as

/*
EXEC    PCP..sp_manuLote  '108',  '',  'PAN01166',  '',  '',  '000000027',  0,  '',  '',  0,  'precisamos para completar a entrega',  undefined,  'A' 

SELECT DISTINCT CAST(EMISSAO AS DATETIME) FROM OP WHERE FILIAL = '108' AND OP = '03939501001' AND EMISSAO <> ''

SELECT * FROM PCP..qualLote
DELETE FROM PCP..qualLote
*/
declare 
	@existRev int,
	@qtSaldo float, --saldo a ser lançado nos lotes
	@qtUsada float, --qtde já usada do lote
	@ultLote varchar(9), --Ultimo lote usado
	@auxLote varchar(9), --lote auxiliar para calculo
	@ultimaRev varchar(3),
	@novaRev varchar(3),
	@ultimaSeq varchar(3),
	@novaSeq varchar(3),
	@dtHoje varchar(8),
	@hrHoje varchar(5),
	@dtEmis varchar(10),
	@dtVenc varchar(8),
    @qtLote float,
    @obsAntes varchar(25)



set @existRev = isnull((select count(*) from PCP..qualLote where produto = @produto), 0)
set @ultimaRev = isnull((select max(revisao) from PCP..qualLote where produto = @produto), '001')
set @novaRev = right(concat('000', rtrim(convert(varchar(3), cast(@ultimaRev as int) + 1))), 3)
set @ultimaSeq = isnull((select max(seq) from PCP..qualLote where produto = @produto and lote = @lote), '000')
set @novaSeq = right(concat('000', rtrim(convert(varchar(3), cast(@ultimaSeq as int) + 1))), 3)
set @dtHoje = (select convert(varchar(10), getdate(), 112))
set @hrHoje = (select convert(varchar(5), getdate(), 108))
set @dtEmis = isnull((SELECT DISTINCT EMISSAO FROM OP WHERE FILIAL = @filial AND OP = @op AND EMISSAO <> ''), '')
set @dtVenc = (convert(varchar(8), dateadd(month, @validade, convert(datetime, @dtEmis, 103)), 112))
set @qtLote = isnull((select qtde from PCP..qualLote where produto = @produto and ativo = 'SIM'), 0)
set @qtUsada = isnull((select qtdeProd from PCP..loteProd where produto = @produto and situacao = 'Aberto'), 0)
--convert(varchar(8), dateadd(month, validade, convert(datetime, EMISSAO, 103)), 112) dtVenc, 

if @cTipo = 'I' --Incluir lote novo, sem revisões anteriores

	if @revisao = '000'
		begin
			insert into PCP..qualLote  
				(produto, descricao, lote, diaRevisao, hrRevisao, validade, qtde, seq, quebra, revisao, ativo, obs, nivel, usuario)
			values
				(@produto, @descricao, @lote, @dtHoje, @hrHoje, @validade, @qtde, @novaSeq, @quebra, '001', 'SIM', @obs, @nivel, @usuario)

		end

if @cTipo = 'R' --Incluir revisões ao lote

	begin
		update 
			PCP..qualLote  
		set
			ativo = 'NAO'
		where
			1 = 1
			and produto = @produto 
			and revisao = @revisao

		insert into PCP..qualLote  
			(produto, descricao, lote, diaRevisao, hrRevisao, validade, qtde, seq, quebra, revisao, ativo, obs, nivel, usuario)
		values
			(@produto, @descricao, @lote, @dtHoje, @hrHoje, @validade, @qtde, @novaSeq, @quebra, @novaRev, 'SIM', @obs, @nivel, @usuario)

	end

if @cTipo = 'P' --Produção Parcia ou total da OP

	begin
		set @qtSaldo = @qtde
		while (@qtSaldo > 0)
			begin
				if @qtUsada > 0
					begin
						set @ultLote = (select lote from loteProd where produto = @produto and situacao = 'Aberto')
					end
				if @qtUsada = 0
					begin
						set @auxLote = isnull((select max(lote) from loteProd where produto = @produto group by produto), '')
						if @ultLote = ''
							begin
								set @ultLote = (select lote from PCP..qualLote where produto = @produto and ativo = 'SIM')
							end
						else
							begin
								set @ultLote = right(concat('000000000', rtrim(convert(varchar(9), cast(@auxLote as int) + 1))), 9)
							end
						
					end

				if @qtSaldo = @qtLote - @qtUsada and @qtSaldo > 0
					begin
						insert into PCP..loteProd  
							(filial, op, produto, descricao, lote, loteAprov, dtAprov, usrAprov, usrProd, dtProd, hrProd, dtVenc, qtdeProd, qtdeQuebra, qtdeTot, quebra, nivel, revisao, situacao, fechamento, obs)
						values
							(@filial, @op, @produto, @descricao, @ultLote, '',    '',     0,        @usuario, @dtHoje, @hrHoje, @dtVenc, @qtSaldo, @qtLote, @qtde, @quebra, @nivel, @revisao, 'Fechado', '', @obs)
						set @qtSaldo = 0
						set @qtUsada = 0
						update PCP..loteProd set situacao = 'Fechado', fechamento = (select convert(varchar(10), getdate(), 112)) where produto = @produto and lote = @ultLote

					end
				if @qtSaldo < @qtLote - @qtUsada and @qtSaldo > 0
					begin
						insert into PCP..loteProd  
							(filial, op, produto, descricao, lote, loteAprov, dtAprov, usrAprov, usrProd, dtProd, hrProd, dtVenc, qtdeProd, qtdeQuebra, qtdeTot, quebra, nivel, revisao, situacao, fechamento, obs)
						values
							(@filial, @op, @produto, @descricao, @ultLote, '',    '',     0,        @usuario, @dtHoje, @hrHoje, @dtVenc, @qtSaldo, @qtLote, @qtde, @quebra, @nivel, @revisao, 'Aberto', '', @obs)
						set @qtSaldo = 0
						set @qtUsada = 0
					end

				if @qtSaldo > @qtLote - @qtUsada and @qtSaldo > 0
					begin
						insert into PCP..loteProd  
							(filial, op, produto, descricao, lote, loteAprov, dtAprov, usrAprov, usrProd, dtProd, hrProd, dtVenc, qtdeProd, qtdeQuebra, qtdeTot, quebra, nivel, revisao, situacao, fechamento, obs)
						values
							(@filial, @op, @produto, @descricao, @ultLote, '',    '',     0,        @usuario, @dtHoje, @hrHoje, @dtVenc, @qtLote - @qtUsada, @qtLote, @qtde, @quebra, @nivel, @revisao, 'Fechado', '', @obs)
						print(@qtSaldo)
						print(@qtLote)
						print(@qtUsada)
						print(@ultLote)
						set @qtSaldo = @qtSaldo - (@qtLote - @qtUsada)
						set @qtUsada = 0

						update PCP..loteProd set situacao = 'Fechado', fechamento = (select convert(varchar(10), getdate(), 112)) where produto = @produto and lote = @ultLote

					end
			end

--EXEC    PCP..sp_manuLote  '108',  '03939501001',  'PAN01166',  'ME.AU PET GRANULADO SANITARIO GRAOS FINOS CN 4KG 6X1',  '001',  '000000001',  12,  'PESO',  'N1',  11,  '',  1,  'P' 

			--select * from PCP..loteProd
	end


if @cTipo = 'A' --Antecipar o fechamento do Lote
	
	begin
		--set @obsAntes = 'Antecipado pelo usuário: ' + rtrim(ltrim(convert(varchar(20), @usuario)))
		update 
			PCP..loteProd  
		set
			situacao = 'Fechado', 
			fechamento = (select convert(varchar(10), getdate(), 112)),
			userJusti = @usuario,
			--obs = @obsAntes,
			justificativa = @obs
		where
			1 = 1
			and filial = @filial
			and produto = @produto
			and lote = @lote


	end



GO
/****** Object:  StoredProcedure [dbo].[sp_manuLoteAnalisaAprova]    Script Date: 09/03/2023 01:36:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE procedure [dbo].[sp_manuLoteAnalisaAprova]
   --EXEC    PCP..sp_Analisa_Aprova_Lote  '108',  '03939501001',  'PAN01166',  'ME.AU PET GRANULADO SANITARIO GRAOS FINOS CN 4KG 6X1',  '000000029',  1,  '20240124',  11,  '001',  '001',  10,  15,  'ITAM-035',  17,  'Reprovado',  'A' 
	@filial varchar(3),
	@op varchar(11),
	@produto varchar(15),
	@descricao varchar(70),
    @lote varchar(9),
    @usr int,
    @dtVenc varchar(8),
    @qtde float,
    @revisao varchar(3),
    @codCarac varchar(3),
    @itemin float,
    @itemax float,
    @itemeio varchar(50),
    @result float,
    @situacao varchar(15),
    @itetxt varchar(35),
    @resultxt varchar(10),
	@cTipo varchar(1)
as


/*
EXEC    PCP..sp_manuLote  '108',  '',  'PAN01166',  '',  '',  '000000027',  0,  '',  '',  0,  'precisamos para completar a entrega',  undefined,  'A' 
loteAnalise
SELECT DISTINCT CAST(EMISSAO AS DATETIME) FROM OP WHERE FILIAL = '108' AND OP = '03939501001' AND EMISSAO <> ''

SELECT * FROM PCP..qualLote
DELETE FROM PCP..qualLote
*/

declare 
	@dtAprov varchar(8), 
	@hrAprov varchar(5),
	@dtAnalise varchar(8), 
	@hrAnalise varchar(5)

if @cTipo = 'A' --Incluir lote novo, sem revisões anteriores
	begin
		insert into PCP..loteAnalise  
			(filial, op, produto, descricao, lote, dtAprov, hrAprov, dtAnalise, hrAnalise, usrAprov, usrAnalise, dtVenc, qtdeTot, revisao, codCarac, itemin, itemax, itemeio, result, situacao, itetxt, resultxt)
		values
			(@filial, @op, @produto, @descricao, @lote, @dtAprov, @hrAprov, @dtAnalise, @hrAnalise, 0, @usr, @dtVenc, @qtde, @revisao, @codCarac, @itemin, @itemax, @itemeio, @result, @situacao, @itetxt, @resultxt)
	end



GO
/****** Object:  StoredProcedure [dbo].[sp_produzLote]    Script Date: 09/03/2023 01:36:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE procedure [dbo].[sp_produzLote]
	@fil VARCHAR(3),
	@ops VARCHAR(11),
	@qtd FLOAT,
	@tip VARCHAR(1)
AS
--
/*
sp_produzLote '108', '03324401001', 15, 'T'

--SELECT * FROM PCP..OP WHERE OP = '00236901001'

	AND FILIAL = '108'	
	AND OP = '03324401001'


*/

declare @filial varchar(003),
	@op varchar(011),
	@produto varchar(015),
	@descricao varchar(070),
	@lote varchar(009),
	@dtProd varchar(008),
	@hrProd varchar(008),
	@dtVenc varchar(008),
	@qtde float,
	@qtdeTot float,
	@seqProd varchar(003),
	@quebra varchar(001),
	@revisao varchar(003),
	@obs varchar(255),
	@nLoop int

set @nLoop = 0


DECLARE loteCursor CURSOR FOR  
SELECT distinct
	FILIAL filial, OP op, 
	PRODUTO produto, DESCRICAO descricao, 
	convert(varchar(8), convert(datetime, EMISSAO, 103), 112) dtProd, 
	convert(varchar(8), CONVERT(time, GETDATE()))  hrProd, 
	convert(varchar(8), dateadd(month, validade, convert(datetime, EMISSAO, 103)), 112) dtVenc, 
	0 qtde, 0 qtdeTot, 
	seq lote, '001' seqProd, quebra, 
	revisao, obs
FROM 
	OP a inner join
	qualLote b on
	a.PRODUTO = b.produto
WHERE
	1 = 1
	AND FILIAL = '108'	
	AND OP = '03324401001'
	AND EMISSAO <> ''
	AND ativo = 'S';  

OPEN loteCursor;  

FETCH NEXT FROM loteCursor INTO @filial, @op, @produto, @descricao, @lote, @dtProd, @hrProd, @dtVenc, @qtde, @qtdeTot, @seqProd, @quebra, @revisao, @obs;  
WHILE @@FETCH_STATUS = 0  
	BEGIN  
		if @nLoop = 1
			begin
				Print '   ' + @filial + '      '+  @produto + '      '+  @descricao + '      '+  @dtProd 
			end
		set @nLoop = @nLoop + 1
		FETCH NEXT FROM loteCursor INTO @filial, @op, @produto, @descricao, @lote, @dtProd, @hrProd, @dtVenc, @qtde, @qtdeTot, @seqProd, @quebra, @revisao, @obs; 
	END;  
CLOSE loteCursor;  
DEALLOCATE loteCursor;  
GO
/****** Object:  StoredProcedure [dbo].[sp_produzOP]    Script Date: 09/03/2023 01:36:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE procedure [dbo].[sp_produzOP]
	@FILIAL VARCHAR(3),
	@OP VARCHAR(11),
	@QTDE FLOAT,
	@TIPO VARCHAR(1)
AS
--sp_ajusta_OP '101', '00275101001', 'PAN00090', 'ALP 10 ORANGE F 7 DRUM 40KG', 'PAN0067133', 'MEN00165', 'PALLET PBR MADEIRA NOVO DUPLA FACE 1,00X1,20', 'R', 'C', 'UN', 12
--EXEC    sp_ajusta_OP   '101',   '00275101001',   'PAN00090',   'undefined',   'PA001432',   'GAS311202',   'GAS EXPANSAO - CG',   'E',   'C',   'M3',   86.176,   0

--SELECT * FROM PCP..OP WHERE OP = '00236901001'
IF @TIPO = 'P'
	BEGIN
		UPDATE 
			PCP..OP
		SET
			ENTREGUE = ENTREGUE + @QTDE,
			SITUACA = 'P'
		WHERE 
			1 = 1
			AND FILIAL = @FILIAL
			AND OP = @OP
	END
	
IF @TIPO = 'T'
	BEGIN
		UPDATE 
			PCP..OP
		SET
			ENTREGUE = QTDEPCF,
			SITUACA = 'T'
		WHERE 
			1 = 1
			AND FILIAL = @FILIAL
			AND OP = @OP
	END
	
GO
USE [master]
GO
ALTER DATABASE [PCP] SET  READ_WRITE 
GO
