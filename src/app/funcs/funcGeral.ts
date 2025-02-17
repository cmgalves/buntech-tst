import { Injectable } from '@angular/core';
import {map} from 'rxjs';
import * as XLSX from 'xlsx';
import { funcsService } from './funcs.service';


@Injectable({
  providedIn: 'root'
})

export class funcGeral {

  constructor(
    private fj: funcsService,
  ) { }

  retNumber() {
    let xd = new Date()
    let xDia = ''
    xDia += xd.getFullYear() + ("0" + (xd.getMonth() + 1)).slice(-2)
    xDia += ("0" + xd.getDate()).slice(-2)
    xDia += ("0" + xd.getHours()).slice(-2)
    xDia += ("0" + xd.getMinutes()).slice(-2)
    xDia += ("0" + xd.getSeconds()).slice(-2)
    xDia += ("0" + xd.getMilliseconds()).slice(-4)

    return xDia
  }


  // exporta os dados para o excel
  exportaExcel(aCabec, aDados, cTit, cSheet) {
    const wb = XLSX.utils.book_new();
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
    XLSX.utils.sheet_add_aoa(ws, aCabec);
    XLSX.utils.sheet_add_json(ws, aDados, { origin: 'A2', skipHeader: true });
    XLSX.utils.book_append_sheet(wb, ws, cSheet);
    XLSX.writeFile(wb, cTit + '.xlsx');
  }


  toHHMMSS = (secs) => {
    let horaRet
    var sec_num = parseInt(secs, 10)
    var hours = Math.floor(sec_num / 3600)
    var minutes = Math.floor(sec_num / 60) % 60
    var seconds = sec_num % 60

    horaRet = [hours, minutes, seconds]
      .map(v => v < 10 ? "0" + v : v)
      .filter((v, i) => v !== "00" || i > 0)
      .join(":")

    return horaRet.length === 2 ? '00:00:' + horaRet : horaRet.length === 5 ? '00:' + horaRet : horaRet

  }

  viraHoras = (secs) => {
    var sec_num = parseInt(secs, 12)
    var hours = Math.floor(sec_num / 3600) === 0 ? '000' : Math.floor(sec_num / 3600)
    var minutes = Math.floor(sec_num / 60) % 60
    var seconds = sec_num % 60

    return [hours, minutes, seconds]
      .map(v => v < 10 ? "0" + v : v)
      .filter((v, i) => v !== "00" || i > 0)
      .join(":")
  }

  datadehoje(tp) {
    var data = new Date();
    var dia = ('0' + String(data.getDate())).slice(-2);
    var mes = ('0' + String(data.getMonth() + 1)).slice(-2);
    var ano = data.getFullYear();
    if (tp === 'brasuca') {
      return dia + '/' + mes + '/' + ano;
    }
    if (tp === 'americanada') {
      return ano + '-' + mes + '-' + dia;
    }
  }

  validDataFormat(xdData) {
    const arrData = xdData.split('/')
    const data = new Date();
    const aDiaMes = ['01', 31, '02', 29, '03', 31, '04', 30, '05', 31, '06', 30, '07', 31, '08', 31, '09', 30, '10', 31, '11', 30, '12', 31]
    const ano = data.getFullYear();

    // valida o ano correto
    if (arrData[2] > ano + 1 || arrData[2] < ano - 1) {
      alert('ANO INVÁLIDO')
      return false
    }

    // valida o dia correto
    for (let xi = 0; xi < aDiaMes.length; xi++) {
      if (aDiaMes[xi] == arrData[1]) {
        if (arrData[0] === '00' || arrData[0] > aDiaMes[xi + 1]) {
          alert('DIA INVÁLIDO')
          return false
        }
      }
    }

    // valida o mês correto
    if (arrData[1] < '01' || arrData[1] > '12') {
      alert('MES INVÁLIDO')
      return false
    }

    if (
      arrData[0].length !== 2 ||
      arrData[1].length !== 2 ||
      arrData[2].length !== 4
    ) {
      alert('Formato Data = dd/mm/aaaa')
      return false
    }
    return true
  }


  validDataAmerica(xdData) {
    const arrData = xdData.split('-')
    // valida o ano correto
    if (arrData[0].length != 4) {
      alert('ANO INVÁLIDO')
      return false
    } else {
      return true
    }
  }

  dtoa(xdData) {
    const ano = xdData.substring(0, 4)
    const mes = xdData.substring(4, 6)
    const dia = xdData.substring(6, 8)

    return mes + '+' + dia + '+' + ano
  }

  dtob(xdData) {
    const ano = xdData.substring(0, 4)
    const mes = xdData.substring(4, 6)
    const dia = xdData.substring(6, 8)
    return dia + '/' + mes + '/' + ano
  }

  btod(xdData) {
    const aDt = xdData.split('/')
    return aDt[2] + aDt[1] + aDt[0]
  }

  direita(str, n) {
    if (n <= 0)
      return "";
    else if (n > String(str).length)
      return str;
    else {
      var iLen = String(str).length;
      return String(str).substring(iLen, iLen - n);
    }
  }

  formatarNumero(numero) {
    return numero.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4
    });
  }


  // efetua a produção parcial da op 
  prodParcialOp(aOp, cOrig) {
    let cArm = ''
    let qtdeProd = 0

    qtdeProd = aOp.qtdeLote > aOp.qtdeEnv ? aOp.saldoProd : aOp.saldoProd - 0.01
    cArm = '01'
    const objEnv = {
      cFilialOp: aOp.filial,
      cNumOp: aOp.op,
      cC2Prod: qtdeProd,
      cC2Local: aOp.produto,
      cDocAjst: 'DOCPARCI',
      nC2QtdOri: aOp.qtdeLote,
      nC2QtdAjst: qtdeProd,
      cTipoProd: 'P',
      nQtdEntrg: qtdeProd,
      cOperacao: aOp.codOpera,
      cRecurso: aOp.codRecurso,
      dDataApt: aOp.dtime,
      ItensD4: []
    };
    const objAponta = {
      filial: aOp.filial,
      op: aOp.op,
      lote: aOp.lote,
      qtde: qtdeProd,
      tipo: 'P',
    };

    this.fj.prodOP(objEnv).subscribe(x => {
      alert(x.Sucesso.substring(2, 60))
      if (x.Sucesso === "T/Apontamento parcial efetuado com Sucesso!") {
        this.fj.execProd('spcp_produz_op', objAponta);
      }
      //window.location.reload();
    });
  };



}
