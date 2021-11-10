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


  validDataFormat(xdData) {
    const arrData = xdData.split('/')

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

    url = `http://10.3.0.204:8095/DEV_REST/AJUST_EMP`

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

}
