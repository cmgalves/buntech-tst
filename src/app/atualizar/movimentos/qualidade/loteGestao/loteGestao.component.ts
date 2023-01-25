import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
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
  selector: 'app-loteGestao',
  templateUrl: './loteGestao.component.html',
  styleUrls: ['./loteGestao.component.css']
})

export class LoteGestaoComponent implements OnInit {
  arrUserLogado = JSON.parse(localStorage.getItem('user'))[0];
  aProd: any = JSON.parse(localStorage.getItem('loteProd'));
  cProd: string = this.aProd.produto
  arrLote: any = [];
  arrLoteTab: any = [];
  produto: string = '';
  descricao: string = '';
  revisao: string = '';
  seq: string = '';
  validade: any = 0;
  quebra: string = '';
  qtde: any = 0;
  obs: any = '';
  cTipo: any = 0;
  tpQuebra: string[] = ['DIA', 'PESO'];
  tpativo: string[] = ['SIM', 'NAO'];
  lotes: Observable<any>;
  displayedColumns: string[] = ['ord', 'produto', 'descricao', 'revisao', 'seq', 'validade', 'ativo', 'quebra', 'qtde', 'diaRevisao', 'obs'];
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
    this.buscaLotes();
  }

  // busca a relação de produtos com as loteções
  buscaLotes() {
    let ord = 0;

    this.arrLote = this.fj.buscaPrt('relacaoProdLote', { 'produto': this.cProd });
    this.arrLote.subscribe(cada => {
      cada.forEach(xy => {
        ord++
        this.arrLoteTab.push({
          'ord': ord,
          'produto': xy.produto,
          'descricao': xy.descricao,
          'revisao': xy.revisao,
          'seq': xy.seq,
          'validade': xy.validade,
          'ativo': xy.ativo,
          'quebra': xy.quebra,
          'qtde': xy.qtde,
          'diaRevisao': this.fg.dtob(xy.diaRevisao),
          'obs': xy.obs,
        })
        this.produto = xy.produto
        this.descricao = xy.descricao
        this.revisao = xy.revisao
        this.seq = xy.seq
        this.validade = xy.validade
        this.quebra = xy.quebra
        this.qtde = xy.qtde
        this.obs = xy.obs
      });
      if (this.produto === '') {
        this.produto = this.aProd.produto
        this.descricao = this.aProd.descricao
        this.revisao = this.aProd.revisao
        this.seq = '000000001'
        this.validade = 12
        this.quebra = 'PESO'
        this.qtde = this.aProd.qtde
        this.obs = this.aProd.obs
      }
      this.dataSource = new MatTableDataSource(this.arrLoteTab)
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

  confLote(cTipo) {

    if (cTipo === 'R' && this.revisao === '000') {
      alert('Este produto ainda não tem lote!')
      return;
    }
    if (cTipo === 'C' && (this.seq === '' || this.validade === 0 || this.quebra === '' || this.qtde === 0)) {
      alert('Informações Incompletas, voltar e corrigir!')
      return;
    }
    const obj = {
      'produto': this.produto,
      'descricao': this.descricao,
      'revisao': this.revisao,
      'seq': this.seq,
      'validade': this.validade,
      'quebra': this.quebra,
      'qtde': this.qtde,
      'obs': this.obs,
      'cTipo': cTipo,
    }
    this.fj.execProd('manuLote', obj);
    this.atuTela()
  }

  atuTela() {
    window.location.reload();
  }


  // tecla para retorno de tela
  voltaLote() {
    localStorage.removeItem('loteProd');
    this.router.navigate(['lote']);
  }

  altSeq(xcEvento) {
    this.seq = this.fg.direita('000000000' + xcEvento.target.value, 9)
  }

}
