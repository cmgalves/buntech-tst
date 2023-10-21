--ALTER view [dbo].[ETL_PBIX_OP_PCF] as
  
 
SELECT 

P.IDWOHD,
W.IDProduct as codProduto,
CONCAT(SUBSTRING ( W.Code ,0 , 4),'-',W.IDProduct) as chaveProduto,
CONCAT(P.IDWOHD,'-',D.Code) AS chaveDetOP,
W.IDWOSituation as situacao,
W.Code op,
SUBSTRING ( W.Code ,0 , 4)+'-'+ CAST( W.IDWOHD AS NVARCHAR(10)) chaveWOHD,
SUBSTRING ( W.Code ,0 , 4)filial,
W.IDWOtype ,
W.DtIssue,
W.DtDue,
MAX(P.SeqWODet) AS Sequencia,
D.Code AS Operacao,
E.Status,
E.DtLastStatusChange,
E.IDUserLastStatusChange,

SUM(WOShiftProd) AS WOProd,
SUM(WOShiftRework) AS WOReWork,
SUM(WOScrap) AS WOScrap



FROM TBLProductionEv AS P

INNER JOIN TBLWOHD AS W ON W.IDWOHD= P.IDWOHD
INNER JOIN TBLWODet AS D ON D.IDWODet= P.IDWODet
INNER JOIN TBLWOHDQtyEv E ON P.IDWOHD = E.IDWOHD
INNER JOIN (SELECT MAX(SeqWODet) SeqWODet, IDWOHD FROM TBLProductionEv TBL GROUP BY IDWOHD )  AS G ON  P.SeqWODet= G.SeqWODet AND G.IDWOHD = P.IDWOHD

WHERE 
FlgDeleted=0

GROUP BY P.SeqWODet,
W.Code,
P.IDWOHD,
W.IDProduct,
W.IDWOSituation,
G.SeqWODet,
G.IDWOHD,
W.IDWOtype ,
W.DtIssue,
W.DtDue,
W.IDWOHD,
D.Code,
E.Status,
E.DtLastStatusChange,
E.IDUserLastStatusChange


GO
