
select
	*
	into PCP..qualEspecCab_20250121
from
	PCP..qualEspecCab


DROP TABLE PCP..qualEspecCab;



CREATE TABLE [dbo].[qualEspecCab](
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
	[especAlcada] [varchar](20) NULL,
	[especQuebra] [varchar](20) NULL,
	[especSequencia] [varchar](20) NULL,
	[cabQtdeQuebra] [float] NULL,
	[loteAtual] [varchar](9) NULL,
	[feitoPor] [int] NULL,
	[aprovPor] [int] NULL,
	[especAnalise] [varchar](1) NULL,
	[imprimeLaudo] [varchar](1) NULL,
	[qtdeAnalise] [float] NULL,
	[validadeMeses] [int] NULL,
	[linha] [varchar](35) NULL,
	[geraAnalise] [varchar](1) NULL,
PRIMARY KEY CLUSTERED 
(
	[idEspecCab] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO



insert into qualEspecCab 
(cabProduto, 
	descrProd, 
	cabRevisao, 
	numEspec, 
	dataAprov, 
	vigenciaDe, 
	vigenciaAte, 
	situacao, 
	qualObsGeral, 
	qualObsRevisao, 
	aplicacao, 
	embalagem, 
	feitoPor, 
	aprovPor, 
	cabQtdeQuebra, 
	qtdeAnalise)

select 
	cabProduto, 
	descrProd, 
	cabRevisao, 
	numEspec, 
	dataAprov, 
	vigenciaDe, 
	vigenciaAte, 
	situacao, 
	qualObsGeral, 
	qualObsRevisao, 
	aplicacao, 
	embalagem, 
	feitoPor, 
	aprovPor, 
	cabQtdeQuebra, 
	qtdeAnalise
from qualEspecCab_20250121