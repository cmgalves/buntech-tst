SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
create TABLE [dbo].[qualEspecCab](
	[idEspecCab] [int] IDENTITY(1,1) NOT NULL,
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
	[aprovPor] [varchar](70) NULL,
	[especAlcada] [varchar](20) NULL,
	[especAnalise] [varchar](20) NULL,
	[especQuebra] [varchar](20) NULL,
	[especSequencia] [varchar](20) NULL,
	[cabQtdeQuebra] FLOAT NULL,
PRIMARY KEY CLUSTERED 
(
	[idEspecCab] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
