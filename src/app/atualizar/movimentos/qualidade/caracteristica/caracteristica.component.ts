import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import * as XLSX from 'xlsx';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { funcsService } from '../../../../funcs/funcs.service';

export interface cadCaracteristica {
  seq: BigInteger;
  codCarac: string;
  descCarac: string;
}

@Component({
  selector: 'app-caracteristica',
  templateUrl: './caracteristica.component.html',
  styleUrls: ['./caracteristica.component.css']
})

export class CaracteristicaComponent implements OnInit {
  arrUserLogado = JSON.parse(localStorage.getItem('user'))[0];
  arrCaracteristica: any = [];
  arrCaracteristicaTab: any = [];
  opFilter: any = ''
  codCarac: string = '';
  descCarac: string = '';
  seq: any = 0;
  lForm: boolean = false;
  lBtnInc: boolean = false;
  lBtnAlt: boolean = false;

  caracteristicas: Observable<any>;
  displayedColumns: string[] = ['seq', 'codCarac', 'descCarac', 'produto', 'edicao', 'itens'];
  dataSource: MatTableDataSource<cadCaracteristica>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  class: string = '';

  constructor(
    public router: Router,
    private fj: funcsService,
  ) { }

  ngOnInit(): void {
    if (this.arrUserLogado.perfil === 'Administrador') {
      this.buscaCaracteristicas();
    } else {
      alert('Sem Acesso')
      this.router.navigate(['opResumo']);
    }
  }

  buscaCaracteristicas() {
    const obj = {
      'caracteristica': ''
    };
    this.arrCaracteristica = this.fj.buscaPrt('cadastroCaracteristicas', obj);

    this.arrCaracteristica.subscribe(cada => {
      this.seq = 0
      cada.forEach(xy => {
        this.seq++
        this.arrCaracteristicaTab.push({
          'seq': this.seq,
          'codCarac': xy.codCarac,
          'descCarac': xy.descCarac,
        })

      });

      this.dataSource = new MatTableDataSource(this.arrCaracteristicaTab)
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
    const filterValue = this.opFilter;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }



  manutCarac(nOpt, aLin) {
    if (nOpt === 1) {
      this.lForm = !this.lForm;
      this.lBtnInc = true;
      this.lBtnAlt = false;
      this.codCarac = (this.seq + 1).toString().padStart(3, '0');
    }

    if (nOpt === 2) {
      let obj = {
        'tipoCarac': 'I',
        'codCarac': this.codCarac,
        'descCarac': this.descCarac,
      }
      this.fj.execProd('incluiAlteraCaracteristica', obj);
      this.lForm = !this.lForm;
      window.location.reload();
    }

    if (nOpt === 3) {
      let obj = {
        'tipoCarac': 'A',
        'codCarac': this.codCarac,
        'descCarac': this.descCarac,
      }
      this.fj.execProd('incluiAlteraCaracteristica', obj);
      this.lForm = !this.lForm;
      window.location.reload();
    }

    if (nOpt === 4) {
      this.lForm = !this.lForm;
      this.lBtnInc = false;
      this.lBtnAlt = true;
      this.codCarac = aLin.codCarac
      this.descCarac = aLin.descCarac
    }
  }
}
