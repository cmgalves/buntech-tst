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
  itetxt: any = '';
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
  displayedColumns: string[] = ['codCarac', 'descCarac', 'iteMin', 'iteMax', 'iteMeio', 'iteTxt', 'result', 'situacao', 'editResult'];
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
            'situacao': xy.situacao,
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
      'iteTxt': ' ',
      'result': 0,
      'resultxt': ' ',
      'situacao': 'Aprovado',
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
    var nbm = 0;
    let dtAtual = new Date();

    if (isNaN(parseFloat(vNum))) {
      vResultxt = vNum;
      if (vNum == 'N') {
        sit = 'Reprovado';
      } else if (vNum == 'S') sit = 'Aprovado';
      else return alert('Por favor, digite S ou N ou um valor numérico');
    } else {
      nbm = parseFloat(vNum);
      console.log(xcRow.iteMin);
      if (xcRow.iteMin > 0 || xcRow.iteMax > 0)
        if (nbm < xcRow.iteMin || nbm > xcRow.iteMax)
          sit = 'Reprovado';
        else
          sit = 'Aprovado';
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
      'usrAnalise': this.aUsr.codUser
    }
    this.fj.execProd('aprovacaoLote', obj);
    window.location.reload();
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

  confirmar(){
    var situacaoAnalise = '';
    var dataAprovacao = '';
    var rejeitado = this.arrDados.filter(q => q.situacao != 'Aprovado');
    if(rejeitado.length != 0){
      situacaoAnalise = 'ANDAMENTO';
    } else situacaoAnalise = 'APROVADO';

    var obj = {
      filial: this.filial,
      produto: this.produto,
      lote: this.lote,
      analise: this.analise,
      loteAprov: situacaoAnalise,
      dataAprovacao: new Date().toISOString().split('T')[0]
    }

    this.fj.buscaPrt('confirmaAnalise', obj).subscribe(q => console.log(q));
   // window.location.reload();
  }

}
