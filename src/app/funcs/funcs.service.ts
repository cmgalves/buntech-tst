import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable, Subscription, forkJoin, of } from 'rxjs';
import 'rxjs/add/operator/map';
import { catchError, mergeMap } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})

export class funcsService {

  constructor(private _http: Http) { }

  execPar(_url, obj) {
    let url = '';
    const dstUrla = ['10.3.0.49:900'];
    url = `http://${dstUrla}/${_url}`
    $.ajaxSetup({ async: false });
    $.post(url, obj);
  }

  buscaPrt(_url, obj) {
    let url = '';
    const dstUrla = ['10.3.0.49:885'];

    url = `http://${dstUrla}/${_url}`

    return this._http.post(url, obj)
      .map((response: Response) => { return response.json() });

  }

  buscaPcfa(_url, obj) {
    let url = '';
    const dstUrla = ['10.3.0.49:886'];

    url = `http://${dstUrla}/${_url}`

    return this._http.post(url, obj)
      .map((response: Response) => response.json());

  }

  buscaPcfb(_url, obj) {
    let url = '';
    const dstUrla = ['10.3.0.49:887'];

    url = `http://${dstUrla}/${_url}`

    return this._http.post(url, obj)
      .map((response: Response) => response.json());

  }

  buscaPcfc(_url, obj) {
    let url = '';
    const dstUrla = ['10.3.0.49:888'];

    url = `http://${dstUrla}/${_url}`

    return this._http.post(url, obj)
      .map((response: Response) => response.json());

  }

  prodOP(obj) {
    let url = '';

    url = `http://10.3.0.204:8095/REST/AJUST_EMP`

    return this._http.put(url, obj)
      .map((response: Response) => response.json());

  }

  prodLote(obj) {
    let url = '';

    url = `http://10.3.0.204:8095/rest/APILOTES/APILOTEESP`

    return this._http.post(url, obj)
      .map((response: Response) => response.json());

  }

  buscaPar(_url) {
    let url = '';
    const dstUrla = ['10.3.0.49:900'];

    url = `http://${dstUrla}/${_url}`

    return this._http.get(url)
      .map((response: Response) => response.json());

  }

  execProd(_url, obj) {
    let url = '';
    const dstUrla = ['10.3.0.49:885'];
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


  gerarLote(obj: any, funcao: Function) {
    let url = '';
    const dstUrla = ['10.3.0.49:885'];
    let novosLotes = [];
    let finish = true;
    const MAX_REQUISITIONS = 10;

    url = `http://${dstUrla}/geraLoteInfo`;
    this._http.post(url, obj)
      .map((response: Response) => response.json()).subscribe(tabelas => {
        url = `http://${dstUrla}/geraLote`;
        let oppcfLote = tabelas.oppcfLote;
        let especificaGeral = tabelas.especifica;

        let produtosAtualizados = [];
        let requisicoes = [];
        let lotesAtualizar = oppcfLote.filter(q => q.lote == '000000000').slice(0, 200);
        if (lotesAtualizar.length == 0) return funcao();
        let produtoAtual = lotesAtualizar[0].produto;
        let LoteAtual = [...oppcfLote].filter(q => q.produto == produtoAtual).sort((a, b) => parseInt(a.lote) > parseInt(b.lote) ? -1 : 1)[0];
        let countLote = LoteAtual.stsLote != 'F' ? parseInt(LoteAtual.lote) : parseInt(LoteAtual.lote) + 1;
        if (countLote == 0) countLote = 1;
        let especificaAtual = especificaGeral.filter(q => q.cabProduto.trim() == produtoAtual.trim())[0];
        let qtdLote = LoteAtual.stsLote != 'F' ? (LoteAtual.qtde_lote == undefined ? 0 : LoteAtual.qtde_lote) : 0;
        let opAtual = lotesAtualizar[0].op;
        let cicloAtual = this.dividirDiaEmPartes(new Date(lotesAtualizar[0].dtime), especificaAtual.cabQtdeQuebra);
        let analise = 1;
        let intervaloInicial = (LoteAtual.intervaloLote) ? LoteAtual.intervaloLote.split('/')[0] :
          lotesAtualizar[0].dtime;
        let intervaloAtual = "";
        if (lotesAtualizar.length == 0) {
          funcao();
        }
        lotesAtualizar.forEach(async (lote, index) => {
          if (lote.produto.trim() != produtoAtual.trim()) {
            let intervalo = `${intervaloInicial}/${intervaloAtual}`;
            novosLotes.push({
              lote: countLote.toString().padStart(9, "0"),
              qtde_lote: qtdLote,
              intervaloLote: intervalo,
              op: opAtual,
              produto: produtoAtual,
              status: 'F'
            })

            produtoAtual = lote.produto;
            LoteAtual = [...oppcfLote].filter(q => q.produto == produtoAtual).sort((a, b) => parseInt(a) > parseInt(b) ? -1 : 1)[0];
            countLote = LoteAtual.stsLote != 'F' ? parseInt(LoteAtual.lote) : parseInt(LoteAtual.lote) + 1;
            if (countLote == 0) countLote = 1;
            especificaAtual = especificaGeral.filter(q => q.cabProduto.trim() == produtoAtual.trim())[0];
            qtdLote = LoteAtual.stsLote != 'F' ? (LoteAtual.qtde_lote == undefined ? 0 : LoteAtual.qtde_lote) : 0;
            opAtual = lote.op;
            cicloAtual = this.dividirDiaEmPartes(new Date(lote.dtime), especificaAtual.cabQtdeQuebra)
            analise = 1;
            intervaloInicial = (LoteAtual.intervaloAtual) ? LoteAtual.intervaloLote.split('/')[0] :
              lote.dtime;
            intervaloAtual = "";
          }
          if (especificaAtual.especQuebra == "QTDE") {
            if ((qtdLote + lote.qtde) >= especificaAtual.cabQtdeQuebra) {
              let intervalo = `${intervaloInicial}/${intervaloAtual}`;
              novosLotes.push({
                lote: countLote.toString().padStart(9, "0"),
                qtde_lote: qtdLote,
                intervaloLote: intervalo,
                op: undefined,
                produto: produtoAtual,
                status: 'F'
              })

              countLote++;
              qtdLote = 0;
              analise = 1;
            }
            finish = false;
            var newProduto = {
              lote: countLote.toString().padStart(9, "0"),
              analise: `A${(analise).toString().padStart(2, "0")}`,
              id: lote.id_num,
            }
            produtosAtualizados.push(newProduto)
            requisicoes.push(this._http.post(url, newProduto).pipe(catchError((error) => {
              return of(null);
            })));
          }
          if (especificaAtual.especQuebra == "HORA") {
            if (lote.op != opAtual) {
              let intervalo = `${intervaloInicial}/${intervaloAtual}`;

              novosLotes.push({
                lote: countLote.toString().padStart(9, "0"),
                qtde_lote: qtdLote,
                intervaloLote: intervalo,
                op: opAtual,
                status: 'F',
                produto: produtoAtual,
              })

              countLote++;
              qtdLote = 0;
              analise = 1;
              cicloAtual = this.dividirDiaEmPartes(new Date(lote.dtime), especificaAtual.cabQtdeQuebra);
              opAtual = lote.op;
              intervaloInicial = lote.dtime;
            }
            let analiseAtual = this.dividirDiaEmPartes(new Date(lote.dtime), especificaAtual.cabQtdeQuebra);
            if (analiseAtual != cicloAtual) {
              analise++;
              cicloAtual = analiseAtual;
            }
            var newProduto = {
              lote: countLote.toString().padStart(9, "0"),
              analise: `A${(analise).toString().padStart(2, "0")}`,
              id: lote.id_num,
            }
            produtosAtualizados.push(newProduto)
            requisicoes.push(this._http.post(url, newProduto).pipe(catchError((error) => {
              return of(null);
            })));
          }
          qtdLote += lote.qtde;
          intervaloAtual = lote.dtime;

          if (index == lotesAtualizar.length - 1) {
            let intervalo = `${intervaloInicial}/${intervaloAtual}`;

            novosLotes.push({
              lote: countLote.toString().padStart(9, "0"),
              qtde_lote: qtdLote,
              intervaloLote: intervalo,
              op: especificaAtual.especQuebra == "HORA" ? opAtual : "",
              status: 'A',
              produto: produtoAtual
            });
            forkJoin(requisicoes.map(observable =>
              observable.pipe(mergeMap(result => of(result), MAX_REQUISITIONS)
              )
            )
            ).subscribe(q => { this.atualizarLotes(novosLotes, funcao); });
          }
        });

      });

  }

  atualizarLotes(novosLotes: any[], funcao: Function) {
    const dstUrla = ['10.3.0.49:885'];

    novosLotes.forEach(q => {
      this._http.post(`http://${dstUrla}/atualizaLote`, q).subscribe(q => funcao());
    })
  }

  dividirDiaEmPartes(data, numeroDeDivisoes) {
    const hora = data.getHours();
    let divisaoDaHora = Math.ceil((hora + 1) / numeroDeDivisoes);

    return divisaoDaHora;
  }

  formatarDataParaString(data) {
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    const horas = String(data.getHours()).padStart(2, '0');
    const minutos = String(data.getMinutes()).padStart(2, '0');
    return `${dia}/${mes}/${ano} ${horas}:${minutos}`;
  }


  enviarLoteProteus(loteItem) {
    var dataValidade = new Date(loteItem.dtime); //pega a data de fabricação e soma um ano 
    dataValidade.setFullYear(loteItem.dtime.getFullYear() + 1); // para data de validade

    //verifica se o lote está aprovado
    if (loteItem.tipoAprova1 != "" && loteItem.tipoAprova2 != "" && loteItem.tipoAprova3 != "") {
      const obj = {
        'filial': loteItem.filial,
        'produto': loteItem.produto,
        'lote': loteItem.lote,
        'analise': loteItem.analise
      };
      let arrItens = this.buscaPrt('relacaoLoteAnalisa', obj); //Busca os dados do loteAnalise

      arrItens.forEach(item => {
        //percorre todos os dados do loteAnalise
        let obj2 = { //cria objeto para enviar ao proteus
          "cLFilial": loteItem.filial,
          "cProduto": loteItem.produto,
          "cOP": loteItem.op,
          "cLote": loteItem.lote,
          "cAnalise": loteItem.analise,
          "nQuantidade": loteItem.qtde,
          "cCaracteristica": item.id_num,
          "cResultado": item.situacao,
          "dValidade": dataValidade,
          "dFabricacao": loteItem.dtime,
          "cValMin": item.iteMin,
          "cValMax": item.iteMax,
          "cStatus": loteItem.status
        };

        this.prodLote(obj2); //Envia para o proteus
      });
    } else alert("Lote ainda não aprovado"); //alerta que o lote não está aprovado
  }
}
