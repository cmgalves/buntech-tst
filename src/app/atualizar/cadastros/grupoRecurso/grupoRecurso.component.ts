import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import * as XLSX from 'xlsx';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { funcsService } from '../../../funcs/funcs.service';

export interface cadGrupoRecurso {
  seq: BigInteger;
  codCarac: string;
  descCarac: string;
}

@Component({
  selector: 'app-grupoRecurso',
  templateUrl: './grupoRecurso.component.html',
  styleUrls: ['./grupoRecurso.component.css']
})

export class GrupoRecursoComponent implements OnInit {
  arrUserLogado = JSON.parse(localStorage.getItem('user'))[0];
  arrGrupoRecurso: any = [];
  arrGrupoRecursoTab: any = [];
  opFilter: any = ''
  idGrupo: string = '';
  recurso: string = '';
  grupo: string = '';
  ativo: string = '';
  aAtivo: string[] = ['S', 'N'];
  lForm: boolean = false;
  lBtnInc: boolean = false;
  lBtnAlt: boolean = false;

  grupoRecursos: Observable<any>;
  displayedColumns: string[] = ['idGrupo', 'recurso', 'grupo', 'ativo', 'edicao'];
  dataSource: MatTableDataSource<cadGrupoRecurso>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  class: string = '';

  constructor(
    public router: Router,
    private fj: funcsService,
  ) { }

  ngOnInit(): void {
    if (this.arrUserLogado.perfil === 'Administrador') {
      this.buscaGrupoRecursos();
    } else {
      alert('Sem Acesso')
      this.router.navigate(['opResumo']);
    }
  }

  buscaGrupoRecursos() {
    this.arrGrupoRecurso = this.fj.buscaPrt('cadGrupoRecursos', {});
    this.arrGrupoRecurso.subscribe(cada => {
      cada.forEach(xy => {
        this.arrGrupoRecursoTab.push({
          'idGrupo': xy.idGrupo,
          'recurso': xy.recurso,
          'grupo': xy.grupo,
          'ativo': xy.ativo,
        })
      });

      this.dataSource = new MatTableDataSource(this.arrGrupoRecursoTab)
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

  manutGrupo(nOpt, aLin) {
    if (nOpt === 1) {
      this.lForm = !this.lForm;
      this.lBtnInc = true;
      this.lBtnAlt = false;
      this.idGrupo = ''
      this.recurso = ''
      this.grupo = ''
      this.ativo = ''
    }

    if (nOpt === 2) {
      let obj = {
        'tipoGrupo': 'I',
        'idGrupo': 0,
        'recurso': this.recurso,
        'grupo': this.grupo,
        'ativo': this.ativo,
      }
      this.fj.execProd('incluiAlteraGrupoRecurso', obj);
      this.lForm = !this.lForm;
      window.location.reload();
    }

    if (nOpt === 3) {
      let obj = {
        'tipoGrupo': 'A',
        'idGrupo': this.idGrupo,
        'recurso': this.recurso,
        'grupo': this.grupo,
        'ativo': this.ativo,
      }
      this.fj.execProd('incluiAlteraGrupoRecurso', obj);
      this.lForm = !this.lForm;
      window.location.reload();
    }

    if (nOpt === 4) {
      this.lForm = !this.lForm;
      this.lBtnInc = false;
      this.lBtnAlt = true;
      this.idGrupo = aLin.idGrupo
      this.recurso = aLin.recurso
      this.grupo = aLin.grupo
      this.ativo = aLin.ativo
    }
  }
}
