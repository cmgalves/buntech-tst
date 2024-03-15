import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'app/components/confirm-dialog/confirm-dialog.component';
import { Observable, Subscription, forkJoin, of } from 'rxjs';
import 'rxjs/add/operator/map';
import { catchError, mergeMap } from 'rxjs/operators';
import { funcGeral } from './funcGeral';



@Injectable({
  providedIn: 'root'
})

export class funcsService {

  constructor(
    private _http: Http,
    public dialog: MatDialog,
  ) { }

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


  enviarLoteProteus(loteItem, reclassifica = false) {
    let nVai = 0
    var caracEnviadas = 0;
    let codCaracteristica = [];
    //verifica se o lote está aprovado
    if ((loteItem.tipoAprova1 != "" && loteItem.tipoAprova2 != "" && loteItem.tipoAprova3 != "") || reclassifica) {
      const obj = {
        'filial': loteItem.filial,
        'produto': loteItem.produto,
        'lote': loteItem.lote,
        'analise': loteItem.analise,
        'op': loteItem.op,
        'statusEnvio': 'NÃO ENVIADO'
      };
      const arrItens = this.buscaPrt('relacaoLoteAnalisa', obj); //Busca os dados do loteAnalise
      this.buscaPrt('alteraStatusEnvio', obj);
      const objs = [];
      arrItens.subscribe(cada => {
        cada.forEach((item, index) => {
          if (codCaracteristica.indexOf(item.codCarac) < 0) {
            codCaracteristica.push(item.codCarac);
            //console.log(cada);
            //percorre todos os dados do loteAnalise
            objs.push({ //cria objeto para enviar ao proteus
              "cLFilial": loteItem.filial,
              "cProduto": loteItem.produto,
              "cOP": loteItem.op,
              "cLote": loteItem.lote,
              "cAnalise": loteItem.analise,
              "nQuantidade": loteItem.qtdeLote,
              "cCaracteristica": item.descCarac,
              "cResultado": item.resultxt != "" ? item.parametro : item.result.toString(),
              "dValidade": this.converterParaDDMMYY(loteItem.dtime, item.validadeMeses),
              "dFabricacao": this.converterParaDDMMYY(loteItem.dtime),
              "cJustificativa": loteItem.justificativa3,
              "cValMin": item.iteMin.toString(),
              "cValMax": item.iteMax.toString(),
              "cStatus": this.formataStatus(loteItem.loteAprov),
              "cImprime": item.imprimeLaudo
            });
          }
        });

        let enviado = true;
        objs.forEach((obj2, index) => {
          this.prodLote([obj2]).subscribe(q => {
            if (q.status === false || q.ok === false) {
              enviado = false;
            }
            console.log('qtd enviada');
            if (index == objs.length - 1) {
              this.prodParcialOp(loteItem, 'env');
              obj.statusEnvio = enviado ? 'ENVIADO' : 'NÃO ENVIADO'
              this.buscaPrt('alteraStatusEnvio', obj).subscribe(f => console.log('alteraStatus', f));
            }
          }, error => {
            console.log(error);
            obj.statusEnvio = 'NÃO ENVIADO'
            this.buscaPrt('alteraStatusEnvio', obj).subscribe(f => f);
          });
        })
      });

    } else alert("Lote ainda não aprovado"); //alerta que o lote não está aprovado
  }

  formataStatus(str) {
    if (!str.includes('-'))
      return str.replace(' ', '');
    return str.split('-')[1].replace(' ', '');
  }


  confirmDialog(confirmText: string, botoes = ['SIM', 'NÃO']): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { text: confirmText, botoes: botoes },
    })

    return dialogRef.afterClosed();
  }

  acessoUsuario(usuario, acesso) {
    const perfil = usuario.perfil;
    if (usuario.perfil.includes('Administrador')) return true;
    return perfil.includes(acesso) || acesso.includes(perfil);
  }



  // efetua a produção parcial da op 
  prodParcialOp(aOp, cOrig) {
    let cArm = ''
    let qtdeProd = 0
    if (cOrig == 'pcp') {
      qtdeProd = aOp.qtdeLote > aOp.qtdeEnv ? aOp.saldoProd : aOp.saldoProd - 0.01
    } else qtdeProd = aOp.qtde > aOp.qtdeEnv ? aOp.saldoProd : aOp.saldoProd - 0.01

    if (aOp.loteAprov == 'APROVADO') {
      cArm = '01'
    } else if (aOp.loteAprov == 'REPROVADO') {
      cArm = '97'
    } else {
      cArm = '44'
    }
    const objEnv = {
      cFilialOp: aOp.filial,
      cNumOp: aOp.op,
      cC2Prod: aOp.produto,
      cC2Local: cArm,
      cDocAjst: 'DOCPARCI',
      nC2QtdOri: 1, //aOp.qtdeLote,
      nC2QtdAjst: aOp.qtdeLote,
      cTipoProd: 'P',
      nQtdEntrg: qtdeProd, // qtde utilizada para a produção
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
    this.prodOP(objEnv).subscribe(x => {
      alert(x.Sucesso.substring(2, 60))
      if (x.Sucesso === "T/Apontamento parcial efetuado com Sucesso!") {
        // alert(x.Sucesso.substring(2, 60))
        this.execProd('spcp_produz_op', objAponta);
        console.log(x.Sucesso)
        if (cOrig == 'pcp') {
          alert(x.Sucesso.substring(2, 60))
          // window.location.reload();
        }
      } else {
        console.log(x.Sucesso)
      }
    }, error => {
      console.log(error);
      alert("Não foi possível enviar");
    });
  };

  converterParaDDMMYY(dataString, plus = 0) {
    // Divide a string da data nos componentes dia, mês e ano
    var partes = dataString.split('/');
    // Obtém os componentes da data
    var dia = partes[0];
    var mes = parseInt(partes[1]);
    var ano = parseInt(partes[2]);

    mes = plus != 0 ? (mes + plus) % 12 : mes;
    plus = plus != 0 ? Math.trunc(plus / 12) : 0;
    ano += plus
    // Retorna a data formatada
    return dia + '/' + mes.toString().padStart(2, '0') + '/' + ano.toString().slice(-2);
  }

}
