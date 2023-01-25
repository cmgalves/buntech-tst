use PCP

--DROP TABLE qualCarac 
CREATE TABLE qualCarac (
    codCarac varchar(03),
    descCarac varchar(55)
);

--DROP TABLE qualEspecCab 
CREATE TABLE qualEspecCab (
    cabProduto varchar(15),
    descrProd varchar(70),
    cabRevisao varchar(03),
    numEspec varchar(20),
    dataAprov varchar(10),
    vigenciaDe varchar(10),
    vigenciaAte varchar(10),
    situacao varchar(20),
    qualObsGeral varchar(250),
    qualObsRevisao varchar(250),
    aplicacao varchar(70),
    embalagem varchar(250),
	feitoPor varchar(70), 
	aprovPor varchar(70)
);

--DROP TABLE qualEspecItens 
CREATE TABLE qualEspecItens (
    iteProduto varchar(15),
    iteRevisao varchar(03),
    iteCarac varchar(03),
    iteMin float,
    iteMax float,
);