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
  descrProd: string;
  tipo: string;
  unidade: string;
  grupo: string;
  ncm: string;
  situacao: string;
  revisao: string;
  ativo: string;
}

@Component({
  selector: 'app-loteAnalisa',
  templateUrl: './loteAnalisa.component.html',
  styleUrls: ['./loteAnalisa.component.css']
})

export class LoteAnalisaComponent implements OnInit {
  aUsr = JSON.parse(localStorage.getItem('user'))[0];
  arrUserLogado = JSON.parse(localStorage.getItem('user'))[0];
  aProd = JSON.parse(localStorage.getItem('loteAnalisa'));
  arrBusca: any = [];
  arrDados: any = [];
  Dados: any = [];
  filial: string = '';
  op: string = '';
  produto: string = '';
  descrProd: string = '';
  revisao: string = '';
  seq: string = '';
  especAlcada: string = '';
  validade: any = 0;
  quebra: string = '';
  qtdeQuebra: string = '';
  lote: string = '';
  analise: string = '';
  qtde: any = 0;
  qtdeTot: any = 0;
  usrAprov: any = '';
  usrAnalise: any = '';
  dtProd: any = '';
  hrProd: any = '';
  carac: any = '';
  itemin: any = '';
  itemax: any = '';
  itemeio: any = '';
  result: any = '';
  situacao: any = '';
  dtVenc: any = '';
  obs: any = '';
  cTipo: any = 0;
  lAnalise: boolean = false;
  lEdit: boolean = false;
  editInd = null;
  tpQuebra: string[] = ['Dia', 'Peso'];
  tpativo: string[] = ['Sim', 'Não'];
  lotes: Observable<any>;
  displayedColumns: string[] = ['codCarac', 'descCarac', 'iteMin', 'iteMax', 'iteMeio', 'result', 'situacao', 'editResult'];
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
    this.criarLoteCaracteristica();
  }



  // busca a relação de produtos com as loteções
  criarLoteCaracteristica() {
    const obj = {
      'fil': this.aProd.filial,
      'prod': this.aProd.produto,
      'lote': this.aProd.lote,
      'analise': this.aProd.analise
    };

    this.fj.buscaPrt('criarLoteCaracteristica', obj).subscribe(x => {
      this.buscaLoteDetalhes();

    }); //vw_pcp_relacao_lote_analisa

  }
  // busca a relação de produtos com as loteções
  buscaLoteDetalhes() {
    let ord = 0;
    let codCaracteristica = '';
    this.lAnalise = false
    this.lEdit = false

    const obj = {
      'filial': this.aProd.filial,
      'produto': this.aProd.produto,
      'lote': this.aProd.lote,
      'analise': this.aProd.analise
    };
    this.arrBusca = this.fj.buscaPrt('relacaoLoteAnalisa', obj); //vw_pcp_relacao_lote_analisa]

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
            'situacao': xy.situacao.charAt(0).toUpperCase() + xy.situacao.slice(1).toLowerCase(),
            'result': xy.result,
            'resultxt': xy.resultxt,
            'nivel': xy.nivel,
            'parametro': xy.parametro
          })
          if (ord === 1) {
            this.filial = xy.filial
            this.produto = xy.produto
            this.lote = xy.lote
            this.analise = xy.analise
            this.descrProd = xy.descrProd
            this.revisao = xy.cabRevisao
            this.especAlcada = xy.especAlcada
            this.op = xy.op;
          }
        }
        this.qtdeTot = this.fg.formatarNumero(xy.qtde)

      })
      this.dataSource = new MatTableDataSource(this.arrDados);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }


  editLinha(e, i) {
    this.editInd = i;
  }

  editResult(xcRow) {
    let sit: string = '';
    let vResultxt: string = '';
    let vNum = (<HTMLInputElement>(document.getElementById("idResult"))).value.toUpperCase();
    const max = xcRow.iteMax == 0 ? Number.MAX_VALUE : xcRow.iteMax;
    var nbm = 0;
    let dtAtual = new Date();
    vNum = vNum.replace(',', '.');
    if (isNaN(parseFloat(vNum))) /*Checa se o valor inserido é numérico*/ {
      if (xcRow.iteMax == 0 && xcRow.iteMin == 0) {
        vResultxt = vNum.toString();
        if (vNum == 'S') sit = 'APROVADO';
        if (vNum == 'N') sit = 'REPROVADO';
      } else
        return alert('Por favor, digite um valor numérico');
    } else {
      nbm = parseFloat(vNum);
      if (!(xcRow.iteMin == 0 && xcRow.iteMax == 0)) //Checa se o intervalo existe
        if (nbm < xcRow.iteMin || nbm > max) //Checa se o valor está no intervalo
          sit = 'REPROVADO';
        else
          sit = 'APROVADO';
      else return alert("Valor inválido");
    }
    const obj = {
      'filial': this.filial,
      'produto': this.produto,
      'lote': this.lote,
      'analise': this.analise,
      'carac': xcRow.codCarac,
      'result': nbm,
      'dtAnalise': dtAtual.toISOString().split('T')[0],
      'hrAnalise': dtAtual.getHours(),
      'resultxt': vResultxt,
      'situacao': sit,
      'usrAnalise': this.aUsr.codUser,
      'loteAprov': 'ANDAMENTO',
      'dataAprovacao': ''
    }

    this.fj.execProd('aprovacaoLote', obj);
    this.fj.execProd('confirmaAnalise', obj);
    location.reload();
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
    this.router.navigate(['loteReg']);
  }

  alteraImprimeLaudo(row) {
    var obj = { id_loteProd: row.id_loteProd }
    this.fj.execProd('analisaAprovaLote', obj);
  }

  confirmar() {
    let situacaoAnalise = '';
    //Checar a situacao de todos os itens
    const rejeitado = this.arrDados.filter(q => q.situacao.toUpperCase() === 'REPROVADO');
    const emBranco = this.arrDados.filter(q => q.situacao.toUpperCase() === '');
    const aprovado = this.arrDados.filter(q => q.situacao.toUpperCase() === 'APROVADO');
    let confirmText = "";
    //Se algum em branco necessário aprovar todos, se não, aprovação segue normalmente
    if (emBranco.length > 0) confirmText = "DESEJA FINALIZAR A ANÁLISE?";
    else confirmText = "CONFIRMAR APROVAÇÃO"
    //se existe algum rejeitado lote será segregado
    if (rejeitado.length > 0) {
      situacaoAnalise = 'SEGREGADO';
      confirmText = "DESEJA FINALIZAR A ANÁLISE?";
    }
    //Se existir algum aprovado, lote será aprovado
    else if (aprovado.length > 0)
      situacaoAnalise = 'APROVADO';

    //Gera objeto para confirmação
    const obj = {
      lote: this.lote,
      op: this.op,
      analise: this.analise,
      filial: this.filial,
      produto: this.produto,
      loteAprov: situacaoAnalise,
      dataAprovacao: new Date().toISOString().split('T')[0]
    }
    /* espera confirmação do usuário */
    this.fj.confirmDialog(confirmText).subscribe(q => {
      if (q) {
        if (situacaoAnalise == 'APROVADO') {
          this.fj.buscaPrt('confirmaAnalise', obj).subscribe(q => {
            this.fj.buscaPrt('pegaDados', obj).subscribe(q => {
              this.prodParcialOp(q[0], 'env', obj);
            });

          });
        }
        if (situacaoAnalise == 'SEGREGADO') {
          this.fj.buscaPrt('confirmaAnalise', obj).subscribe(q => {
            alert('Lote Segregado pendente de Aprovação ou Reprovação');
            this.router.navigate(['loteReg']);
          });
        }
      }
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
      usrAprovn1: this.arrUserLogado.codUser,
      usrAprovn2: this.arrUserLogado.codUser,
      usrAprovn3: this.arrUserLogado.codUser,
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
        this.fj.enviarLoteProteus(q[0]);
        // this.prodParcialOp(q[0], 'env');
      });
    });
  }

}
