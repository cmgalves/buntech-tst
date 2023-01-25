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
  selector: 'app-loteAnalisa',
  templateUrl: './loteAnalisa.component.html',
  styleUrls: ['./loteAnalisa.component.css']
})

export class LoteAnalisaComponent implements OnInit {
  aUsr = JSON.parse(localStorage.getItem('user'))[0];
  aProd = JSON.parse(localStorage.getItem('loteAnalisa'));
  arrBusca: any = [];
  arrDados: any = [];
  Dados: any = [];
  filial: string = '';
  op: string = '';
  produto: string = '';
  descricao: string = '';
  revisao: string = '';
  seq: string = '';
  validade: any = 0;
  quebra: string = '';
  qtdeQuebra: string = '';
  lote: string = '';
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
  editInd = null;
  tpQuebra: string[] = ['Dia', 'Peso'];
  tpativo: string[] = ['Sim', 'Não'];
  lotes: Observable<any>;
  displayedColumns: string[] = ['op', 'codCarac', 'descCarac', 'itemin', 'itemax', 'itemeio', 'result', 'situacao', 'editResult'];
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

    const obj = {
      'filial': this.aProd.filial,
      'produto': this.aProd.produto,
      'lote': this.aProd.lote
    };
    this.arrBusca = this.fj.buscaPrt('relacaoLoteAnalisa', obj);
    this.arrBusca.subscribe(cada => {
      cada.forEach(xy => {
        ord++
        this.arrDados.push({
          'filial': xy.filial,
          'op': xy.op,
          'produto': xy.produto,
          'descricao': xy.descricao,
          'lote': xy.lote,
          'dtAprov': xy.dtAprov,
          'usrAprov': xy.usrAprov,
          'dtVenc': xy.dtVenc,
          'qtdeTot': xy.qtdeTot,
          'revisao': xy.revisao,
          'codCarac': xy.codCarac,
          'descCarac': xy.descCarac,
          'itemin': xy.itemin,
          'itemax': xy.itemax,
          'itemeio': xy.itemeio,
          'result': xy.result,
          'situacao': xy.situacao,
        })
        this.filial = xy.filial
        this.produto = xy.produto
        this.descricao = xy.descricao
        this.revisao = xy.revisao
        this.lote = xy.lote
        this.qtdeTot = xy.qtdeTot
        this.dtVenc = this.fg.dtob(xy.dtVenc)
      });

      this.dataSource = new MatTableDataSource(this.arrDados)
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
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
  editLinha(e, i) {
    this.editInd = i;
  }

  editResult(xcRow, tipo) {
    let sit: string = 'Aprovado'
    let vResult = (<HTMLInputElement>(document.getElementById("idResult"))).value.replace(',', '.')

    if (+vResult < xcRow.itemin || vResult > xcRow.itemax) {
      sit = 'Reprovado'
    }


    const obj = {
      'filial': this.filial,
      'op': xcRow.op,
      'produto': this.produto,
      'descricao': this.descricao,
      'lote': this.lote,
      'usrAprov': this.aUsr.codUser,
      'dtVenc': this.fg.btod(this.dtVenc),
      'qtde': this.qtdeTot,
      'revisao': this.revisao,
      'codCarac': xcRow.codCarac,
      'itemin': xcRow.itemin,
      'itemax': xcRow.itemax,
      'itemeio': xcRow.itemeio,
      'result': vResult,
      'situacao': sit,
      'tipo': 'A',

    }
    this.fj.execProd('analisaAprovaLote', obj);
    window.location.reload();
  }
}
