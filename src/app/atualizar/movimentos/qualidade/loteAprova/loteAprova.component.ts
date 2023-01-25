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
  Dados: any = [];
  filial: string = '';
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
  }

  // busca a relação de produtos com as loteções
  buscaLoteDetalhes() {
    let ord = 0;

    const obj = {
      'filial': this.aProd.filial,
      'produto': this.aProd.produto,
      'lote': this.aProd.lote
    };
    this.arrBusca = this.fj.buscaPrt('relacaoLoteAprova', obj);
    this.arrBusca.subscribe(cada => {
      cada.forEach(xy => {
        ord++
        this.arrDados.push({
          'id_loteProd': xy.id_loteProd,
          'filial': xy.filial,
          'op': xy.op,
          'produto': xy.produto,
          'descricao': xy.descricao,
          'lote': xy.lote,
          'dtAprov': xy.dtAprov,
          'usrAprov': xy.usrAprov,
          'usrProd': xy.usrProd,
          'dtVenc': xy.dtVenc,
          'qtdeTot': xy.qtdeTot,
          'revisao': xy.revisao,
          'situacao': xy.situacao,
          'descCarac': xy.descCarac,
          'itemin': xy.itemin,
          'itemax': xy.itemax,
          'itemeio': xy.itemeio,
          'result': xy.result,
        })
        this.filial = xy.filial
        this.produto = xy.produto
        this.descricao = xy.descricao
        this.revisao = xy.revisao
        this.lote = xy.lote
        this.quebra = xy.quebra
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

  aprovaLote(tipo: string) {

    const obj = {
      'filial': this.filial,
      'op': ' ',
      'produto': this.produto,
      'descricao': this.descricao,
      'lote': this.lote,
      'usrAprov': this.aUsr.codUser,
      'dtVenc': this.fg.btod(this.dtVenc),
      'qtde': this.qtdeTot,
      'revisao': this.revisao,
      'codCarac': ' ',
      'itemin': ' ',
      'itemax': ' ',
      'itemeio': ' ',
      'result': ' ',
      'situacao': ' ',
      'tipo': tipo,
    }
    this.fj.execProd('analisaAprovaLote', obj);
    window.location.reload();
  }
}
