import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import * as XLSX from 'xlsx';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { funcsService } from '../../../../funcs/funcs.service';

export interface cadEspecifica {
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
  selector: 'app-especifica',
  templateUrl: './especifica.component.html',
  styleUrls: ['./especifica.component.css']
})

export class EspecificaComponent implements OnInit {
  arrUserLogado = JSON.parse(localStorage.getItem('user'))[0];
  arrEspecifica: any = [];
  arrEspecificaTab: any = [];
  arrDados: any = [];
  arrCarac: any = [];
  cfilEspecProd: string = '';
  afilEspecProd: any = ['Todos', 'Concluida', 'Andamento', 'Fora Vigência', 'Encerrada', 'Sem Epecificação'];

  especificas: Observable<any>;
  displayedColumns: string[] = ['seq', 'codigo', 'descricao', 'tipo', 'unidade', 'grupo', 'ncm', 'revisao', 'situacao', 'revisa'];
  dataSource: MatTableDataSource<cadEspecifica>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  class: string = '';

  constructor(
    public router: Router,
    private fj: funcsService,
  ) { }

  ngOnInit(): void {
    if (this.arrUserLogado.perfil === 'Administrador') {
      this.buscaEspecificas('Todos');
    } else {
      alert('Sem Acesso')
      this.router.navigate(['opResumo']);
    }
  }


  altFilter(xcEvento) {
    this.buscaEspecificas(xcEvento.value)
  }

  // busca a relação de produtos com as especificações
  buscaEspecificas(xcFil) {
    let seq = 0;
    this.arrEspecificaTab = [];

    this.arrEspecifica = this.fj.buscaPrt('cadastroProdutosQualidade', { 'xcFil': xcFil }); //View_Portal_Cadastro_Produto_Qualidade
    this.arrEspecifica.subscribe(xd => {
      xd.forEach(xy => {
        seq++
        this.arrEspecificaTab.push({
          'seq': seq,
          'codigo': xy.codigo,
          'descricao': xy.descricao,
          'tipo': xy.tipo,
          'unidade': xy.unidade,
          'grupo': xy.grupo,
          'ncm': xy.ncm,
          'situacao': xy.situacao,
          'revisao': xy.revisao,
        })
      });

      this.dataSource = new MatTableDataSource(this.arrEspecificaTab)
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

  acessoEspec(xcRow) {
    localStorage.setItem('especProd', JSON.stringify(xcRow));
    this.router.navigate(['revisa']);
  }

}
