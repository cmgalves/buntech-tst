--ALTER view [dbo].[ETL_PBIX_EPRODUCAO_PCF] as
SELECT
  TBLProductionEv.IDWOHD AS chaveWOHD,
  TBLProductionEv.IDProdEv AS chaveProdEv,
  TBLResourceStatusEv.IDRSEv AS chaveResourceStatusEv,
  TBLProductionEv.IDResource AS idRecurso,
  DtProd AS dataProducao,
  Shift AS Turno,
  WOShiftProd AS prodTurno,
  WOShiftRework AS prodRetrabalho ,
  WOShiftScrap AS prodRejeitada,
  WOShiftReworkT AS tempoRetrabalhoT,
  WOShiftScrapT AS tempoRefugoT,
  WOShiftNoSchT AS tempoForaTurnoT,
  WOShiftPlanT AS tempoParadaPlanejadaT,
  WOShiftNPlanT AS tempoParadaNPlanejadaT,
  WOShiftRunT AS tempoProducaoT,
  WOShiftProdT,
  WOShiftReWorkT AS temporRetrabalhoT,
  TBLProductionEv.IDPlant,
  TBLResourceStatus.Classification AS idClassificacao ,
  TBLProductionEv.IDArea,
  TBLSector.Name AS setor,
  TBLSector.IDSector AS idSetor,
  IDSupLevel1,
  IDSuplevel2,
  TBLResourceStatusEv.ShiftDtStart AS dataRealPRD,
  TBLResourceStatusEv.ShiftDtEnd AS dataFinalPRD,
  TBLProductionEv.IDUserStart idUsuario,
  TBLResourceStatus.Name AS nomeStatus,
  RSClassification AS classificacao,
  TBLManagerGrp.Code AS grupo,
  TBLProductionEv.IDWODet AS chaveWODET,
  StdSpeed,
  FlgRetentiv
FROM
  TBLProductionEv
  INNER JOIN TBLResourceStatusEv ON TBLProductionEv.IDProdEv = TBLResourceStatusEv.IDProdEv
  INNER JOIN TBLResourceStatus ON TBLResourceStatusEv.IDResourceStatus=TBLResourceStatus.IDResourceStatus
  INNER JOIN TBLSector ON TBLProductionEv.IDSector=TBLSector.IDSector
  INNER JOIN TBLManagerGrp ON TBLProductionEv.IDManagerGrp=TBLManagerGrp.IDManagerGrp
WHERE
	 TBLProductionEv.FlgDeleted = 0
  AND TBLResourceStatusEv.FlgDeleted= 0
 
GO
