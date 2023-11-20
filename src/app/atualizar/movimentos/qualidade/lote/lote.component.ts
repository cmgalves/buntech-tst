import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import * as XLSX from 'xlsx';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { funcsService } from '../../../../funcs/funcs.service';

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
}

@Component({
  selector: 'app-lote',
  templateUrl: './lote.component.html',
  styleUrls: ['./lote.component.css']
})

export class LoteComponent implements OnInit {
  arrUserLogado = JSON.parse(localStorage.getItem('user'))[0];
  arrLote: any = [];
  arrLoteTab: any = [];
  arrDados: any = [];
  arrCarac: any = [];
  filLote: string = '';
  filterLote: any = ['Todos', 'Com Lote', 'Sem Lote'];

  lotes: Observable<any>;
  displayedColumns: string[] = ['ord', 'produto', 'descricao', 'tipo', 'unidade', 'grupo', 'ncm', 'revisao', 'seq', 'validade', 'quebra', 'qtde', 'lote'];
  dataSource: MatTableDataSource<cadLote>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  class: string = '';

  constructor(
    public router: Router,
    private fj: funcsService,
  ) { }

  ngOnInit(): void {
    if (this.arrUserLogado.perfil.indexOf('Administrador') >= 0) {
      this.buscaLotes('Todos');
    } else {
      alert('Sem Acesso')
      this.router.navigate(['opResumo']);
    }
  }

  // busca a relação de produtos com as loteções
  buscaLotes(xcFil) {
    let ord = 0;
    const obj = {
      'xcFil': xcFil
    };
    this.arrLoteTab = [];
    this.arrLote = this.fj.buscaPrt('cadastroProdutosQualidadeLote', obj);
    this.arrLote.subscribe(cada => {
      cada.forEach(xy => {
        ord++
        // if (xcFil === 'Com Lote') {
        //   if (xy.seq !== '') {
        this.arrLoteTab.push({
          'ord': ord,
          'produto': xy.produto,
          'descricao': xy.descricao,
          'tipo': xy.tipo,
          'unidade': xy.unidade,
          'grupo': xy.grupo,
          'ncm': xy.ncm,
          'situacao': xy.situacao,
          'revisao': xy.revisao,
          'seq': xy.seq,
          'validade': xy.validade,
          'ativo': xy.ativo,
          'quebra': xy.quebra,
          'qtde': xy.qtde,
          'diaRevisao': xy.diaRevisao,
          'obs': xy.obs,
        })
        //   }
        // }
        // if (xcFil === 'Sem Lote') {
        //   if (xy.seq === '') {
        //     this.arrLoteTab.push({
        //       'ord': ord,
        //       'produto': xy.produto,
        //       'descricao': xy.descricao,
        //       'tipo': xy.tipo,
        //       'unidade': xy.unidade,
        //       'grupo': xy.grupo,
        //       'ncm': xy.ncm,
        //       'situacao': xy.situacao,
        //       'revisao': xy.revisao,
        //       'seq': xy.seq,
        //       'validade': xy.validade,
        //       'ativo': xy.ativo,
        //       'quebra': xy.quebra,
        //       'qtde': xy.qtde,
        //       'diaRevisao': xy.diaRevisao,
        //       'obs': xy.obs,
        //     })
        //   }
        // }
        // if (xcFil === 'Todos') {
        //   this.arrLoteTab.push({
        //     'ord': ord,
        //     'produto': xy.produto,
        //     'descricao': xy.descricao,
        //     'tipo': xy.tipo,
        //     'unidade': xy.unidade,
        //     'grupo': xy.grupo,
        //     'ncm': xy.ncm,
        //     'situacao': xy.situacao,
        //     'revisao': xy.revisao,
        //     'seq': xy.seq,
        //     'validade': xy.validade,
        //     'ativo': xy.ativo,
        //     'quebra': xy.quebra,
        //     'qtde': xy.qtde,
        //     'diaRevisao': xy.diaRevisao,
        //     'obs': xy.obs,
        //   })
        // }
      });
      this.filLote = xcFil;
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

  acessoLote(xcRow) {
    const _aProd = this.arrLoteTab.filter(x => (x.produto === xcRow.produto))[0];

    localStorage.removeItem('loteProd');

    localStorage.setItem('loteProd', JSON.stringify(_aProd));
    this.router.navigate(['loteGestao']);
  }

  altFilter(xcEvento) {
    this.buscaLotes(xcEvento.value)
  }

}
