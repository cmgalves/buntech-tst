import { Component, OnInit, ViewChild } from '@angular/core';
import { funcsService } from '../../../shared/funcs/funcs.service';
import { Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';

// tslint:disable-next-line:class-name
export interface cadEstrutura {
  empresa: string;
  nome: string;
  email: string;
  senha: string;
  perfil: string;
  telefone: string;
  depto: string;
}

@Component({
  selector: 'app-estrutura',
  templateUrl: './estrutura.component.html',
  styleUrls: ['./estrutura.component.css']
})

export class EstruturaComponent implements OnInit {
  arrUserLogado = JSON.parse(localStorage.getItem('user'))[0];
  arrEstrutura: any = [];
  arrEstruturaTab: any = [];


  estruturas: Observable<any>;
  displayedColumns: string[] = ['seq', 'filial', 'codPai', 'descPai', 'tipoPai', 'codComp', 'descComp', 'tipoComp', 'unidadeComp', 'basePai', 'qtde', 'perda', 'nivel'];
  dataSource: MatTableDataSource<cadEstrutura>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    public router: Router,
    private funcJson: funcsService,
  ) { }

  ngOnInit(): void {
    if (this.arrUserLogado.perfil === 'Administrador') {
      this.buscaEstruturas();
    } else {
      alert('Sem Acesso')
      this.router.navigate(['opResumo']);
    }
  }


  buscaEstruturas() {
    let seq = 0
    const obj = {
      'produto': '',
      'filial': ''
    };
    this.arrEstrutura = this.funcJson.busca884('cadEstruturas', obj);

    this.arrEstrutura.subscribe(cada => {
      cada.forEach(xy => {
        seq++
        this.arrEstruturaTab.push({ 
          'seq': seq,
          'filial': xy.filial,
          'codPai': xy.codPai,
          'descPai': xy.descPai,
          'tipoPai': xy.tipoPai,
          'codComp': xy.codComp,
          'descComp': xy.descComp,
          'tipoComp': xy.tipoComp,
          'unidadeComp': xy.unidadeComp,
          'basePai': xy.basePai,
          'qtde': xy.qtde,
          'perda': xy.perda,
          'nivel': xy.nivel,
        })

      });
      this.dataSource = new MatTableDataSource(this.arrEstruturaTab)
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
