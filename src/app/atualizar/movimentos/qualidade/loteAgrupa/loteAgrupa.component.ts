import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { funcsService } from 'app/funcs/funcs.service';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { MatDialog } from '@angular/material/dialog';

// tslint:disable-next-line:class-name
export interface opDocumento {
  FILIAL: string;
  OP: string;
  CODPROD: string;
  DESCRICAO: string;
  CODANT: string;
  QTDE: string;
  EMISSAO: string;
  FINAL: string;
  ENTREGUE: string;
  SITUACAO: string;

}

@Component({
  selector: 'app-loteAgrupa',
  templateUrl: './loteAgrupa.component.html',
  styleUrls: ['./loteAgrupa.component.css']
})


export class LoteAgrupaComponent implements OnInit {
  arrUserLogado = JSON.parse(localStorage.getItem('user'))[0];
  arrOpAnd: any = []; //JSON.parse(localStorage.getItem('user'))[0];
  arrOpPcf: any = []; //JSON.parse(localStorage.getItem('user'))[0];
  xcFilial: any = this.arrUserLogado.empresa;
  xcPerfil: any = this.arrUserLogado.perfil;
  numOP = JSON.parse(localStorage.getItem('op'));
  opConta: any = 0;
  opFilRepet: any = 'filop';
  opFilter: any = '';
  arrRecA: any = [];
  arrRecB: any = [];
  arrProdA: any = [];
  arrProdB: any = [];
  arrOpAndA: any = [];
  arrLoteAgrupa: any = [];
  arrOpdocumento: any = [];
  arrOpdocumento886: any = [];
  arrOpdocumento887: any = [];
  arrOpdocumento888: any = [];
  arrOpdocumentoTab: any = [];


  opdocumentos: Observable<any>;
  displayedColumns: string[] = ['filial',
    'produto',
    'descricao',
    'lote',
    'qtdeTotal',
    'saldoAnalisar',
    'qtdeAprovada',
    'qtdeReprovado',
    'qtdeReclassifica',
    'situacao',
    'manutencao'];
  dataSource: MatTableDataSource<opDocumento>;
  dataExcel: MatTableDataSource<opDocumento>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    public router: Router,
    private fj: funcsService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.buscaLoteAgrupa();
  }

  // busca os produtos no cadastro para utilizar os dados necessários
  buscaLoteAgrupa() {
    this.arrOpAndA = this.fj.buscaPrt('relacaoLoteAgrupa', {});
    this.arrOpAndA.subscribe(cada => {
      cada.forEach(xy => {
        this.arrLoteAgrupa.push({
          'filial': xy.filial,
          'produto': xy.produto,
          'descricao': xy.descricao,
          'lote': xy.lote,
          'qtdeTotal': xy.qtde,
          'saldoAnalisar': xy.saldoAnalisar,
          'qtdeAprovada': xy.qtdeAprovado,
          'qtdeReprovado': xy.qtdeReprovado,
          'qtdeReclassifica': xy.qtdeReclassifica,
          'situacao': xy.situacao
        });
      });
      this.dataSource = new MatTableDataSource(this.arrLoteAgrupa)
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }


  // aplicar o filtro ao digitar na tela dos itens
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  acessoLoteReg(row) {
    localStorage.setItem('loteReg', JSON.stringify(row));
    this.router.navigate(['loteReg']);
  }
  // exporta os dados para o excel
  expExcel(fileName, sheetName) {
    const fn = fileName + '.xlsx';
    const sn = sheetName;
    const workSheet = XLSX.utils.json_to_sheet(this.dataSource.data, { header: [] });
    const workBook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, sn);
    XLSX.writeFile(workBook, fn);
  }

  classeItem(row) {
    return (row.situacao.charAt(0).toUpperCase() + row.situacao.slice(1).toLowerCase()).replace(' ', '').replace('.', '');
  }

  imprimeLote() {
    alert('Imprime Lote')
  }

}
