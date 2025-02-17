import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { funcsService } from 'app/funcs/funcs.service';
import { funcGeral } from 'app/funcs/funcGeral';

export interface cadLote {
  seq: string;
  codigo: string;
  descricao: string;
  tipo: string;
  unidade: string;
  grupo: string;
  ncm: string;
  situacao: string;
  revisao: string;
  ativo: string;
}

@Component({
  selector: 'app-loteAprova',
  templateUrl: './loteAprova.component.html',
  styleUrls: ['./loteAprova.component.css']
})

export class LoteAprovaComponent implements OnInit {
  aUsr = JSON.parse(localStorage.getItem('user'))[0];
  aProd = JSON.parse(localStorage.getItem('loteAprv'));
  arrBusca: any = [];
  arrDados: any = [];
  aDados: any = [];
  Dados: any = [];
  filial: string = '';
  op: string = '';
  produto: string = '';
  descrProd: string = '';
  revisao: string = '';
  seq: string = '';
  validade: any = 0;
  especAlcada: string = '';
  analise: string = '';
  quebra: string = '';
  qtdeQuebra: string = '';
  lote: string = '';
  justificativa: string = '';
  justificativa1: string = '';
  justificativa2: string = '';
  justificativa3: string = '';
  nivel: string = '';
  n1: string = '';
  n2: string = '';
  n3: string = '';
  qtde: any = 0;
  qtdeTot: any = 0;
  dtProd: any = '';
  hrProd: any = '';
  dtVenc: any = '';
  obs: any = '';
  cTipo: any = 0;
  tpQuebra: string[] = ['Dia', 'Peso'];
  tpativo: string[] = ['Sim', 'Não'];
  lotes: Observable<any>;
  displayedColumns: string[] = ['op', 'descCarac', 'itemin', 'itemax', 'itemeio', 'result', 'situacao'];
  dataSource: MatTableDataSource<cadLote>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  class: string = '';

  constructor(
    public router: Router,
    private fj: funcsService,
    private fg: funcGeral,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.buscaLoteDetalhes();
    this.nivelAprovado(1);
  }

  nivelAprovado(nEnt) {
    this.arrBusca = {};
    this.aDados = [];
    const obj = {
      'filial': this.aProd.filial,
      'produto': this.aProd.produto,
      'lote': this.aProd.lote
    }
    this.arrBusca = this.fj.buscaPrt('relacaoNivelLoteAprova', obj);
    this.arrBusca.subscribe(cada => {
      cada.forEach(xy => {
        this.aDados.push({ nivel: xy.nivel, nivelAprov: xy.nivelAprov, situacao: xy.situacao })
        if (xy.nivelAprov == 'N1') {
          this.n1 = xy.situacao
        }
        if (xy.nivelAprov == 'N2') {
          this.n2 = xy.nivel == 'N1' ? 'Sem Aprovação' : xy.situacao
        }
        if (xy.nivelAprov == 'N3') {
          this.n3 = xy.nivel == 'N1' ? 'Sem Aprovação' : xy.nivel == 'N2' ? 'Sem Aprovação' : xy.situacao
        }
      });
      if (nEnt === 2) {
        this.confAprov()
      }
    });
  }

  buscaLoteDetalhes() {
    let ord = 0;
    let codCaracteristica = '';

    const obj = {
      'filial': this.aProd.filial,
      'produto': this.aProd.produto,
      'lote': this.aProd.lote,
      'analise': this.aProd.analise
    };
    this.arrBusca = this.fj.buscaPrt('relacaoLoteAnalisa', obj); //vw_pcp_relacao_lote_analisa

    this.arrBusca.subscribe(cada => {
      cada.forEach(xy => {
        ord++
        if (codCaracteristica.indexOf(xy.codCarac) < 0) {
          codCaracteristica += xy.codCarac
          this.arrDados.push({
            'id_num': xy.id_num,
            'idEspecCab': xy.idEspecCab,
            'idEspecItens': xy.idEspecItens,
            'filial': xy.filial,
            'produto': xy.produto,
            'descrProd': xy.descrProd,
            'lote': xy.lote,
            'analise': xy.analise,
            'qtde': xy.qtde,
            'cabRevisao': xy.cabRevisao,
            'dtVenc': xy.dtVenc,
            'especAlcada': xy.especAlcada,
            'iteCarac': xy.iteCarac,
            'codCarac': xy.codCarac,
            'descCarac': xy.descCarac,
            'iteMin': xy.iteMin,
            'iteMax': xy.iteMax,
            'iteMeio': xy.iteMeio,
            'iteTxt': xy.iteTxt,
            'situacao': xy.situacao.charAt(0).toUpperCase() + xy.situacao.slice(1).toLowerCase(),
            'result': xy.result,
            'resultxt': xy.resultxt,
            'op': xy.op,
            'nivel': xy.nivel
          })
          if (ord === 1) {
            this.filial = xy.filial
            this.produto = xy.produto
            this.lote = xy.lote
            this.analise = xy.analise
            this.descrProd = xy.descrProd
            this.revisao = xy.cabRevisao
            this.nivel = xy.nivel
            this.n1 = xy.dtAprovn1
            this.n2 = xy.dtAprovn2
            this.n3 = xy.dtAprovn3
            this.dtVenc = xy.dtVenc
            this.op = xy.op
            this.justificativa1 = this.aProd.justificativa1,
              this.justificativa2 = this.aProd.justificativa2,
              this.justificativa3 = this.aProd.justificativa3
          }
        }
        this.qtdeTot = this.fg.formatarNumero(xy.qtde)

      })
      this.dataSource = new MatTableDataSource(this.arrDados)
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  aprovaLote(tipo: string) {
    let nivAprov = '';
    let txtAprov = '';
    var tipoAprovn1 = this.aProd.tipoAprova1;
    var tipoAprovn2 = this.aProd.tipoAprova2;
    var tipoAprovn3 = this.aProd.tipoAprova3;
    var dtAprovn1 = this.aProd.dtAprovn1;
    var dtAprovn2 = this.aProd.dtAprovn2;
    var dtAprovn3 = this.aProd.dtAprovn3;   //Valores anteriores / valores padrão
    var usrAprovn1 = this.aProd.usrAprovn1;
    var usrAprovn2 = this.aProd.usrAprovn2;
    var usrAprovn3 = this.aProd.usrAprovn3;
    var justificativa1 = this.justificativa1;
    var justificativa2 = this.justificativa2;
    var justificativa3 = this.justificativa3;
    var loteAprov;

    const nivel = this.aProd.loteAprov == 'SEGREGADO' ? 'N1' : (this.aProd.loteAprov == 'REAVALIACAON2'
      && this.nivel.includes('N2') ? 'N2' : this.nivel.includes('N3') ? 'N3' : '');

    var rejeitaTodos = false;
    var aprovaTodos = false;
    var aprovaN3 = false;
    var aprovaN2 = false;
    var aprovaN1 = false;
    const DataAtual = new Date().toISOString().split('T')[0]; //A data de hoje

    if (!this.nivel.includes('N1')) {
      aprovaN1 = true;
      if (this.aProd.loteAprov == 'SEGREGRADO') this.aProd.loteAprov = 'REAVALIACAON2';
    }
    if (!this.nivel.includes('N2')) {
      aprovaN2 = true;
      if (this.aProd.loteAprov == 'REAVALIACAON2') this.aProd.loteAprov = 'REAVALIACAON3';
    }
    if (!this.nivel.includes('N3')) aprovaN3 = true;

    if (this.justificativa == "") {
      return alert("Justificativa é obrigatória");
    } // Checa se tem justificativa
    if (!(this.fj.acessoUsuario(this.aUsr, nivel)))
      return alert("Você não tem a permissão necessária para aprovar esse item"); //Checa se o usuário tem o perfil
    //que coincide com a alcada do lote
    if (!this.aUsr.linha.includes(this.aProd.linha) && this.aProd.linha != null)
      return alert("Você não pertence a mesma linha desse item");

    if (tipo != 'A') {
      rejeitaTodos = true; //Se o N1 reprova, reprova todos os níveis
      loteAprov = 'REPROVADO' //Altera o status do lote para reprovado
    }

    if (this.aProd.loteAprov == 'SEGREGADO' || rejeitaTodos || aprovaN1) { //Se a alcada conter N1 e for momento de
      usrAprovn1 = this.aUsr.codUser;                                       //de aprovar o N1 (lote Segregado)      
      dtAprovn1 = DataAtual;
      tipoAprovn1 = tipo;
      loteAprov = tipo == 'A' ? 'REAVALIACAO N2' : 'REPROVADO' //passa para o N2 Reavaliar ou rejeita
      nivAprov = 'N1';
      justificativa1 = this.justificativa;
    }
    if (this.aProd.loteAprov == 'REAVALIACAON2' || rejeitaTodos || aprovaN2) { //Se é possível aprovar
      usrAprovn2 = this.aUsr.codUser;                             //N2 ou se tudo será
      dtAprovn2 = DataAtual;                                      //reprovado
      tipoAprovn2 = tipo;
      if (tipo == 'A')
        loteAprov = aprovaN3 ? 'REAVALIACAO' : 'REAVALIACAO N3'; //passa para o N3 reavaliar ou finaliza
      nivAprov = 'N2';
      justificativa2 = this.justificativa;
    }

    if (this.aProd.loteAprov == 'REAVALIACAON3' || rejeitaTodos || aprovaN3) { //Se é possível aprovar
      usrAprovn3 = this.aUsr.codUser;                                         //N3 ou se tudo será
      dtAprovn3 = DataAtual;                                                  //reprovado
      tipoAprovn3 = tipo;
      if (tipo = 'A')
        loteAprov = aprovaN3 ? loteAprov : 'REAVALIACAO' //O que ocorre após o N3 aprovar? ¯\_(ツ)_/¯
      nivAprov = 'N3';
      justificativa3 = this.justificativa;
    }

    if (tipoAprovn1 == 'A' && tipoAprovn2 == 'A' && tipoAprovn3 == 'A') {
      loteAprov = 'APROVADO'; //Se todos aprovarem, muda para aprovado
      aprovaTodos = true;
    }

    if (nivAprov != '') {
      txtAprov = tipo === 'A' ? 'Confirma Aprovação?' : 'Confirma reprovação'

      const obj = {
        produto: this.produto,
        usrAprovn1: usrAprovn1,
        usrAprovn2: usrAprovn2,
        usrAprovn3: usrAprovn3, //Cria um objeto com todas os campos que serão alterados
        dtAprovn1: dtAprovn1,
        dtAprovn2: dtAprovn2,
        dtAprovn3: dtAprovn3,
        tipoAprovn1: tipoAprovn1,
        tipoAprovn2: tipoAprovn2,
        tipoAprovn3: tipoAprovn3,
        justificativa1: justificativa1,
        justificativa2: justificativa2,
        justificativa3: justificativa3,
        lote: this.lote,
        op: this.op,
        analise: this.analise,
        filial: this.filial,
        loteAprov: loteAprov,
      }

      this.fj.confirmDialog(txtAprov).subscribe(q => {
        if (q) {
          this.fj.buscaPrt('aprovalote', obj).subscribe(q => {
            if (aprovaTodos) {
              this.fj.buscaPrt('alteraValorAprovacao', obj).subscribe(f => {
                this.confirmaAjusteEmp(f[0]);
              })
            } else {
              if (rejeitaTodos) {
                this.fj.enviarLoteProteus(q[0])
              };

            }
          });
          this.nivelAprovado(2);
          localStorage.removeItem('voltaLoteReg');
          localStorage.setItem('voltaLoteReg', 'volta');

          this.router.navigate(['loteReg']);
        }
      });
    } else {
      alert("USUÁRIO NÃO TEM NÍVEL PARA APROVAÇÃO")
    };
  }


  confirmaAjusteEmp(objEmp) {
    this.fj.buscaPrt('pegaDados', objEmp).subscribe(q => {
      this.prodParcialOp(q[0], 'env', objEmp);
    });
  }


  // efetua a produção parcial da op 
  prodParcialOp(aOp, cOrig, aObjeto) {
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

    console.log(aOp);
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
    this.fj.prodOP(objEnv).subscribe(x => {
      alert(x.Sucesso.substring(2, 60))
      if (x.Sucesso === "T/Apontamento parcial efetuado com Sucesso!") {
        this.aprovacaoAutomatica(aObjeto)
        // this.fj.execProd('spcp_produz_op', objAponta);

        console.log(x.Sucesso)
        localStorage.removeItem('voltaLoteReg');
        localStorage.setItem('voltaLoteReg', 'vai');

        this.router.navigate(['loteReg']);

      } else {
        console.log(x.Sucesso)
        // alert(x.Sucesso.substring(2, 60))

      }
    }, error => {
      console.log(error);
      alert("Não foi possível enviar");
    });
  };


  aprovacaoAutomatica(aObjeto) {
    let cTipo = 'A'

    const obj = {
      produto: this.produto,
      usrAprovn1: aObjeto.usrAprovn1,
      usrAprovn2: aObjeto.usrAprovn2,
      usrAprovn3: aObjeto.usrAprovn3,
      dtAprovn1: new Date().toISOString().split('T')[0],
      dtAprovn2: new Date().toISOString().split('T')[0],
      dtAprovn3: new Date().toISOString().split('T')[0],
      justificativa1: "Aprovado automaticamente pela Análise das Características.",
      justificativa2: "Aprovado automaticamente pela Análise das Características.",
      justificativa3: "Aprovado automaticamente pela Análise das Características.",
      tipoAprovn1: "A",
      tipoAprovn2: "A",
      tipoAprovn3: "A",
      lote: this.lote,
      op: this.op,
      analise: this.analise,
      filial: this.filial,
      loteAprov: 'APROVADO'
    }
    this.fj.buscaPrt('aprovalote', obj).subscribe(q => {
      this.fj.buscaPrt('pegaDados', aObjeto).subscribe(q => {
        this.fj.enviarLoteProteus(q[0])
        // this.prodParcialOp(q[0], 'env');
      });
    });
  }


  confAprov() {
    let cResult: string = '';
    let nConta = 0;
    let cNiv = '';

    this.aDados.forEach(xy => {
      if (cNiv === '') {
        cNiv = xy.nivel

      }
      if (xy.nivel == 'N1') {
        nConta++;

        if (xy.situacao === 'Aprovado') {
          cResult = 'A'
        }
        if (xy.situacao === 'Rejeitado') {
          cResult = 'R'
        }
      }
      if (xy.nivel == 'N2') {
        if (xy.nivelAprov == 'N1' && (cResult == '' || cResult == 'A')) {
          nConta++;
          if (xy.situacao === 'Aprovado') {
            cResult = 'A'
          } else {
            cResult = 'R'
          }
        }
        if (xy.nivelAprov == 'N2' && (cResult == '' || cResult == 'A')) {
          nConta++;
          if (xy.situacao === 'Aprovado') {
            cResult = 'A'
          } else {
            cResult = 'R'
          }
        }
      }
      if (xy.nivel == 'N3') {
        if (xy.nivelAprov == 'N1' && (cResult == '' || cResult == 'A')) {
          nConta++;
          if (xy.situacao === 'Aprovado') {
            cResult = 'A'
          } else {
            cResult = 'R'
          }
        }
        if (xy.nivelAprov == 'N2' && (cResult == '' || cResult == 'A')) {
          nConta++;
          if (xy.situacao === 'Aprovado') {
            cResult = 'A'
          } else {
            cResult = 'R'
          }
        }
        if (xy.nivelAprov == 'N3' && (cResult == '' || cResult == 'A')) {
          nConta++;
          if (xy.situacao === 'Aprovado') {
            cResult = 'A'
          } else {
            cResult = 'R'
          }
        }
      }
    });
    if ((cNiv == 'N1' && nConta == 1) || (cNiv == 'N2' && nConta == 2) || (cNiv == 'N3' && nConta == 3)) {
      this.atuLoteProd(cResult)
    }
  }

  atuLoteProd(cSit: string) {
    let sitAprov = cSit === 'A' ? 'Aprovado' : 'Rejeitado'

    const obj = {
      'filial': this.filial,
      'op': ' ',
      'produto': this.produto,
      'descricao': this.descrProd,
      'lote': this.lote,
      'usrAprov': this.aUsr.codUser,
      'usrPerfil': '',
      'dtVenc': this.fg.btod(this.dtVenc),
      'qtde': this.qtdeTot,
      'revisao': this.revisao,
      'codCarac': ' ',
      'itemin': 0,
      'itemax': 0,
      'itemeio': ' ',
      'iteTxt': ' ',
      'result': 0,
      'resultxt': ' ',
      'situacao': sitAprov,
      'just': this.justificativa,
      'tipo': 'L',
    }
    this.fj.execProd('analisaAprovaLote', obj);
    this.atuLoteAprov(cSit)
  }

  atuLoteAprov(cSit: string) {
    this.arrBusca = {};
    let aProt = [];
    const obj = {
      'filial': this.aProd.filial,
      'produto': this.aProd.produto,
      'lote': this.aProd.lote
    }
    this.arrBusca = this.fj.buscaPrt('relacaoLoteProtheus', obj);
    this.arrBusca.subscribe(cada => {
      cada.forEach(xy => {
        const item = xy.itemin
        aProt.push({ "cLFilial": xy.filial, "cProduto": xy.produto, "cArmazem": '01', "cOP": xy.op, "cLote": xy.lote, "nQuantidade": xy.qtdeProd, "dValidade": xy.dtVenc, "dFabricacao": xy.dtProd, "cCaracteristica": xy.descCarac, "cValMin": xy.itemin.toString(), "cValMax": xy.itemax.toString(), "cResultado": xy.obtido.toString(), "cStatus": xy.sitLote })
      });
      const retProdParcial = this.fj.prodLote(aProt);
      retProdParcial.subscribe(ret => {
        if (ret.status) {
          if (confirm('processado') == true) {
            window.location.reload();
          } else {
            window.location.reload();
          }
        } else {
          alert('aguardando')
        }
      });
    });
  }


  temJustificativa() {
    const tst = this.arrDados
    let cRet = ''

    tst.forEach(xx => {
      if (xx.situacao == 'Reprovado' && (this.justificativa).length < 10 && cRet == '') {
        cRet = 'Reprovado'
      }
    });
    if (cRet == '') {
      return true
    } else {
      alert('Justificativa Obrigatória')
      return false
    }
  }

  exportExcel(fileName, sheetName) {
    const fn = fileName + '.xlsx';
    const sn = sheetName;
    const workSheet = XLSX.utils.json_to_sheet(this.dataSource.data, { header: [] });
    const workBook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, sn);
    XLSX.writeFile(workBook, fn);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // tecla para retorno de tela
  voltaLote() {
    localStorage.removeItem('voltaLoteReg');
    localStorage.setItem('voltaLoteReg', 'volta');
    this.router.navigate(['loteReg']);
  }

  reclassifica() {
    if (this.justificativa == "") {
      return alert("Justificativa é obrigatória");
    }
    const lote = this.aProd;
    this.aProd.justificativa3 = this.justificativa;
    lote.loteAprov = "RECLASSIFICA";

    const obj = {
      produto: this.produto,
      usrAprovn1: this.aUsr.codUser,
      usrAprovn2: this.aUsr.codUser,
      usrAprovn3: this.aUsr.codUser, //Cria um objeto com todas os campos que serão alterados
      dtAprovn1: new Date().toISOString().split('T')[0],
      dtAprovn2: new Date().toISOString().split('T')[0],
      dtAprovn3: new Date().toISOString().split('T')[0],
      tipoAprovn1: 'N',
      tipoAprovn2: 'N',
      tipoAprovn3: 'N',
      justificativa1: this.justificativa,
      justificativa2: this.justificativa,
      justificativa3: this.justificativa,
      lote: this.lote,
      op: this.op,
      analise: this.analise,
      filial: this.filial,
      loteAprov: "RECLASSIFICA",
    }

    this.fj.buscaPrt('aprovalote', obj).subscribe(q => {
      this.fj.enviarLoteProteus(q[0], true);
      location.reload();
    });
  }

  reclassificaMesmaOp() {
    const obj = {
      filial: this.aProd.filial,
      op: this.aProd.op,
      produto: this.aProd.produto,
      lote: this.aProd.lote,
      qtd: this.aProd.qtdeLote,
      analise: this.aProd.analise,
      analiseNova: "",
      usr: this.aUsr.codUser,
      tipoAprov: 'C',
    }

    this.fj.buscaPrt('reclassificaNovaOp', obj).subscribe(q => {
      if (q[0].analise != undefined) {
        obj.analiseNova = q[0].analise;
        this.fj.buscaPrt('zeraAnalise', obj).subscribe(q => {
          localStorage.removeItem('voltaLoteReg');
          localStorage.setItem('voltaLoteReg', 'volta');
          this.router.navigate(['loteReg'])
        });
      }
    });
  }

}
