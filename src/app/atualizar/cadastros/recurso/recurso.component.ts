import { Component, OnInit, ViewChild } from '@angular/core';
import { funcsService } from '../../../funcs/funcs.service';
import { Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';

// tslint:disable-next-line:class-name
export interface cadRecurso {
  empresa: string;
  nome: string;
  email: string;
  senha: string;
  perfil: string;
  telefone: string;
  depto: string;
}

@Component({
  selector: 'app-recurso',
  templateUrl: './recurso.component.html',
  styleUrls: ['./recurso.component.css']
})

export class RecursoComponent implements OnInit {
  arrUserLogado = JSON.parse(localStorage.getItem('user'))[0];
  arrRecurso: any = [];
  arrRecursoTab: any = [];


  recursos: Observable<any>;
  displayedColumns: string[] = ['seq', 'filial', 'codigo', 'descricao', 'custo', 'setor', 'calendario'];
  dataSource: MatTableDataSource<cadRecurso>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  class: string = '';

  constructor(
    public router: Router,
    private funcJson: funcsService,
  ) { }

  ngOnInit(): void {
    if (this.arrUserLogado.perfil === 'Administrador') {
      this.buscaRecursos();
    } else {
      alert('Sem Acesso')
      this.router.navigate(['opResumo']);
    }
  }

  buscaRecursos() {
    let seq = 0
    const obj = {
      'filial': '',
      'codigo': '',
    };
    this.arrRecurso = this.funcJson.busca884('cadRecursos', obj);

    this.arrRecurso.subscribe(cada => {
      cada.forEach(xy => {
        seq++
        this.arrRecursoTab.push({
          'seq': seq,
          'filial': xy.filial,
          'codigo': xy.codigo,
          'descricao': xy.descricao,
          'custo': xy.custo,
          'setor': xy.setor,
          'calendario': xy.calendario,
        })
      });
      // localStorage.setItem('recurso', JSON.stringify(this.arrRecursoTab));
      this.dataSource = new MatTableDataSource(this.arrRecursoTab)
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
