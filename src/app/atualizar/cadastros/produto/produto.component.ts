import { Component, OnInit, ViewChild } from '@angular/core';
import { funcsService } from '../../../shared/funcs/funcs.service';
import { Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';

// tslint:disable-next-line:class-name
export interface cadProduto {
  empresa: string;
  nome: string;
  email: string;
  senha: string;
  perfil: string;
  telefone: string;
  depto: string;
}

@Component({
  selector: 'app-produto',
  templateUrl: './produto.component.html',
  styleUrls: ['./produto.component.css']
})

export class ProdutoComponent implements OnInit {
  arrUserLogado = JSON.parse(localStorage.getItem('user'))[0];
  arrProduto: any = [];
  arrProdutoTab: any = [];


  produtos: Observable<any>;
  displayedColumns: string[] = ['seq', 'codigo', 'descricao', 'tipo', 'unidade', 'grupo', 'ncm', 'situacao'];
  dataSource: MatTableDataSource<cadProduto>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  class: string = '';

  constructor(
    public router: Router,
    private funcJson: funcsService,
  ) { }

  ngOnInit(): void {
    if (this.arrUserLogado.perfil === 'Administrador') {
      this.buscaProdutos();
    } else {
      alert('Sem Acesso')
      this.router.navigate(['opResumo']);
    }
  }

  buscaProdutos() {
    let seq = 0;
    const obj = {
      'produto': ''
    };
    this.arrProduto = this.funcJson.busca884('cadastroProdutos', obj);

    this.arrProduto.subscribe(cada => {
      cada.forEach(xy => {
        seq++
        this.arrProdutoTab.push({
          'seq': seq,
          'codigo': xy.codigo,
          'descricao': xy.descricao,
          'tipo': xy.tipo,
          'unidade': xy.unidade,
          'grupo': xy.grupo,
          'ncm': xy.ncm,
          'situacao': xy.situacao,
        })
  
      });
      
  
      this.dataSource = new MatTableDataSource(this.arrProdutoTab)
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


}
