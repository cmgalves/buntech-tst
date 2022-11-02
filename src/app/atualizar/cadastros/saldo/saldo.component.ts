import { Component, OnInit, ViewChild } from '@angular/core';
import { funcsService } from '../../../funcs/funcs.service';
import { Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';

// tslint:disable-next-line:class-name
export interface cadSaldo {
  empresa: string;
  nome: string;
  email: string;
  senha: string;
  perfil: string;
  telefone: string;
  depto: string;
}

@Component({
  selector: 'app-saldo',
  templateUrl: './saldo.component.html',
  styleUrls: ['./saldo.component.css']
})

export class SaldoComponent implements OnInit {
  arrUserLogado = JSON.parse(localStorage.getItem('user'))[0];
  arrSaldo: any = [];
  arrSaldoTab: any = [];


  saldos: Observable<any>;
  displayedColumns: string[] = ['seq', 'filial', 'codigo', 'descricao', 'armazem', 'saldo', 'empenhado'];
  dataSource: MatTableDataSource<cadSaldo>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  class: string = '';

  constructor(
    public router: Router,
    private funcJson: funcsService,
  ) { }

  ngOnInit(): void {
    if (('Administrador | Conferente | Conferente-Apontador').indexOf(this.arrUserLogado.perfil) > -1) {
      this.buscaSaldos();
    } else {
      alert('Sem Acesso')
      this.router.navigate(['opResumo']);
    }
  }

  buscaSaldos() {
    let seq = 0
    const obj = {
      'codigo': '',
      'armazem': '',
      'filial': '',
    };
    this.arrSaldo = this.funcJson.busca884('cadSaldos', obj);

    this.arrSaldo.subscribe(cada => {
      cada.forEach(xy => {
        seq++
        this.arrSaldoTab.push({
          'seq': seq,
          'filial': xy.filial,
          'codigo': xy.codigo,
          'descricao': xy.descricao,
          'armazem': xy.armazem,
          'saldo': xy.saldo,
          'cm': xy.cm,
          'empenhado': xy.empenhado,
        })

      });
      this.dataSource = new MatTableDataSource(this.arrSaldoTab)
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
