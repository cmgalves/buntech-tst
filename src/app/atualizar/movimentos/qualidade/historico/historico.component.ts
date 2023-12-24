import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import * as XLSX from 'xlsx';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { funcsService } from '../../../../funcs/funcs.service';

export interface cadHistorico {
  seq: string;
  cabProduto: string;
  descrProd: string;
  cabRevisao: string;
  vigenciaDe: string;
  vigenciaAte: string;
  situacao: string;
  revisa: string;
}

@Component({
  selector: 'app-historico',
  templateUrl: './historico.component.html',
  styleUrls: ['./historico.component.css']
})

export class HistoricoComponent implements OnInit {
  arrUserLogado = JSON.parse(localStorage.getItem('user'))[0];
  arrHistorico: any = [];
  arrHistoricoTab: any = [];
  arrDados: any = [];
  arrCarac: any = [];

  historicos: Observable<any>;
  displayedColumns: string[] = ['seq', 'cabProduto', 'descrProd', 'cabRevisao', 'feitoPor', 'dataAprov', 'situacao', 'revisa'];
  dataSource: MatTableDataSource<cadHistorico>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  class: string = '';

  constructor(
    public router: Router,
    private fj: funcsService,
  ) { }

  ngOnInit(): void {
    if (this.arrUserLogado.perfil === 'Administrador') {
      this.buscaHistoricos();
    } else {
      alert('Sem Acesso')
      this.router.navigate(['opResumo']);
    }
  }


  // busca a relação de produtos com as historicoções
  buscaHistoricos() {
    let seq = 0;

    this.arrHistorico = this.fj.buscaPrt('relacaoHistorico', {}); //vw_pcp_historico_revisoes
    this.arrHistorico.subscribe(cada => {
      cada.forEach(xy => {
        seq++
        this.arrHistoricoTab.push({
          'seq': seq,
          'cabProduto': xy.cabProduto,
          'descrProd': xy.descrProd,
          'cabRevisao': xy.cabRevisao,
          'situacao': xy.situacao,
          'qualObsGeral': xy.qualObsGeral,
          'qualObsRevisao': xy.qualObsRevisao,
          'feitoPor': xy.feitoPor,
          'dataAprov': xy.dataAprov
        })
      });

      this.dataSource = new MatTableDataSource(this.arrHistoricoTab)
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

  acessoHist(xcRow) {
    localStorage.setItem('histRev', JSON.stringify(xcRow));
    this.router.navigate(['histrevisa']);
  }

}
