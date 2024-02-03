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
      console.log(x[0].mensagem)
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
    this.arrBusca = this.fj.buscaPrt('relacaoLoteAnalisa', obj); //vw_pcp_relacao_lote_analisa

    this.arrBusca.subscribe(cada => {
      // console.log(cada);
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
            'resultxt': xy.resultxt
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
      this.dataSource = new MatTableDataSource(this.arrDados)
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  aprovaLote(tipo: string) {
    let nivAprov = '';

    const obj = {
      'filial': this.filial,
      'op': ' ',
      'produto': this.produto,
      'descrProd': this.descrProd,
      'lote': this.lote,
      'usrAprov': this.aUsr.codUser,
      'usrPerfil': nivAprov,
      'dtVenc': this.fg.btod(this.dtVenc),
      'qtde': this.qtdeTot,
      'revisao': this.revisao,
      'codCarac': ' ',
      'iteMin': 0,
      'iteMax': 0,
      'iteMeio': ' ',
      'result': 0,
      'resultxt': ' ',
      'situacao': 'APROVADO',
      'just': 'Aprovação automática pela análise',
      'tipo': tipo,
    }
    this.fj.execProd('analisaAprovaLote', obj);
    this.atuLoteAprov()
  }

  atuLoteAprov() {
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
          if (confirm(ret.msg) == true) {
            window.location.reload();
          } else {
            window.location.reload();
          }
        } else {
          alert(ret.msg)
        }
      });
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
      return alert('Por favor, digite um valor numérico');
    } else {

      nbm = parseFloat(vNum);
      if (xcRow.iteMin > 0 || max > 0) //Checa se o intervalo existe
        if (nbm < xcRow.iteMin || nbm > max) //Checa se o valor está no intervalo
          sit = 'REPROVADO';
        else
          sit = 'APROVADO';
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
      filial: this.filial,
      produto: this.produto,
      lote: this.lote,
      analise: this.analise,
      loteAprov: situacaoAnalise,
      dataAprovacao: new Date().toISOString().split('T')[0]
    }
    /* espera confirmação do usuário */
    this.fj.confirmDialog(confirmText).subscribe(q => {
      if (q) {
        this.fj.buscaPrt('confirmaAnalise', obj).subscribe(q => {
          // console.log(q)
        });
        if (situacaoAnalise == 'APROVADO') this.aprovacaoAutomatica();
        this.router.navigate(['loteReg']);
      }
    });
  }


  aprovacaoAutomatica() {
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
      this.fj.enviarLoteProteus(q[0]);
      this.fj.prodParcialOp(q[0], 'env')
    });
  }

}
