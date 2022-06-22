import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
// import { HttpClient, Response } from '@angular/common/http';
import { map } from 'rxjs/operators';
import 'rxjs/add/operator/map';
import { MatDialog } from '@angular/material/dialog';



@Injectable({
  providedIn: 'root'
})

export class funcsService {

  constructor(private _http: Http) { }

  buscaPost(_url, obj) {
    let url = '';
    const dstUrla = ['10.3.0.48:884'];

    url = `http://${dstUrla}/${_url}`

    return this._http.post(url, obj)
      .map((response: Response) => response.json());

  }

  busca883(_url, obj) {
    let url = '';
    const dstUrla = ['10.3.0.48:883'];

    url = `http://${dstUrla}/${_url}`

    return this._http.post(url, obj)
      .map((response: Response) => response.json());

  }
  busca884(_url, obj) {
    let url = '';
    const dstUrla = ['10.3.0.48:884'];

    url = `http://${dstUrla}/${_url}`

    return this._http.post(url, obj)
      .map((response: Response) => response.json());

  }

  busca885(_url, obj) {
    let url = '';
    const dstUrla = ['10.3.0.48:885'];

    url = `http://${dstUrla}/${_url}`

    return this._http.post(url, obj)
      .map((response: Response) => response.json());

  }

  busca886(_url, obj) {
    let url = '';
    const dstUrla = ['10.3.0.48:886'];

    url = `http://${dstUrla}/${_url}`

    return this._http.post(url, obj)
      .map((response: Response) => response.json());

  }

  busca887(_url, obj) {
    let url = '';
    const dstUrla = ['10.3.0.48:887'];

    url = `http://${dstUrla}/${_url}`

    return this._http.post(url, obj)
      .map((response: Response) => response.json());

  }

  busca888(_url, obj) {
    let url = '';
    const dstUrla = ['10.3.0.48:888'];

    url = `http://${dstUrla}/${_url}`

    return this._http.post(url, obj)
      .map((response: Response) => response.json());

  }

  buscaGet(_url) {
    let url = '';
    const dstUrla = ['10.3.0.48:884'];

    url = `http://${dstUrla}/${_url}`

    return this._http.get(url)
      .map((response: Response) => response.json());

  }

  prodOP(obj) {
    let url = '';

    // url = `http://10.3.0.204:8095/DEV_REST/AJUST_EMP`
    url = `http://10.3.0.204:8095/REST/AJUST_EMP`
   
    return this._http.put(url, obj)
      .map((response: Response) => response.json());

  }

  execProd(_url, obj) {
    let url = '';
    const dstUrla = ['10.3.0.48:883'];

    url = `http://${dstUrla}/${_url}`

    $.ajaxSetup({ async: false });

    $.post(url, obj);

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
    if (tp = 'brasuca') {
      return dia + '/' + mes + '/' + ano;
    }
    if (tp = 'americanada') {
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

}
