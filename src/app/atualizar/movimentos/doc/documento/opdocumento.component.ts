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
  selector: 'app-opdocumento',
  templateUrl: './opdocumento.component.html',
  styleUrls: ['./opdocumento.component.css']
})


export class OpdocumentoComponent implements OnInit {
  arrUserLogado = JSON.parse(localStorage.getItem('user'))[0];
  arrOpAnd: any = []; //JSON.parse(localStorage.getItem('user'))[0];
  arrOpPcf: any = []; //JSON.parse(localStorage.getItem('user'))[0];
  xcFilial: any = this.arrUserLogado.empresa;
  xcPerfil: any = this.arrUserLogado.perfil;
  numOP = JSON.parse(localStorage.getItem('op'));
  opConta: any = 0;
  opFilRepet: any = '';
  opFilter: any = '';
  arrRecA: any = [];
  arrRecB: any = [];
  arrProdA: any = [];
  arrProdB: any = [];
  arrOpAndA: any = [];
  arrOpAndB: any = [];
  arrOpdocumento886: any = [];
  arrOpdocumento887: any = [];
  arrOpdocumento888: any = [];
  arrOpdocumentoTab: any = [];
  arrFilial: any = ['101', '107', '117', '402', '108', '206'];

  // Campina Grande - 888
  // Servidor de HML:10.3.0.92
  // Filiais:101,107,117,402

  // Boa vista - 886
  // Servidor de HML:10.1.0.250
  // Filiais:108


  // Indaiatuba - 887
  // Servidor de HML: 10.3.0.204
  // Filiais:206


  opdocumentos: Observable<any>;
  displayedColumns: string[] = ['SEQ', 'FILIAL', 'OP', 'CODPROD', 'SITUACAO', 'EDICAO'];
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
    if (this.numOP !== null) {
      this.opFilter = this.numOP[0].OP
    }

    this.buscaOpsAndamentoProtheus();
  }

  // busca os produtos no cadastro para utilizar os dados necessários
  buscaOpsAndamentoProtheus() {

    this.arrOpAndA = this.fj.buscaPrt('ordemProducaoAndamento', {});

    this.arrOpAndA.subscribe(cada => {
      cada.forEach(xy => {
        this.arrOpAndB.push({
          'filial': xy.FILIAL,
          'op': xy.OP,
          'produto': xy.PRODUTO,
          'emissao': xy.EMISSAO,
          'qtde': xy.QTDE,
          'entregue': xy.ENTREGUE,
          'final': xy.FINAL,
          'dtpon': xy.DTFIM,
        })
      });
      localStorage.setItem('opAndamento', JSON.stringify(this.arrOpAndB));
      this.buscaOpdocumentos();
    });
  }


  // busca as OPs nas tabelas do PCF para montar a tela inicial das OPs resumo
  buscaOpdocumentos() {
    this.arrOpAnd = JSON.parse(localStorage.getItem('opAndamento'));

    const obj = {
      'filial': this.xcFilial,
      'perfil': this.xcPerfil
    };
    let conta = 0
    this.arrOpdocumento886 = this.fj.buscaPcfa('ops', obj);
    this.arrOpdocumento887 = this.fj.buscaPcfb('ops', obj);
    this.arrOpdocumento888 = this.fj.buscaPcfc('ops', obj);

    if (this.arrOpdocumento888 != null) {
      this.arrOpdocumento888.subscribe(cada => {
        cada.forEach(xy => {
          this.pushTabela(xy);
        });
        if (this.arrOpdocumento886 != null) {
          this.arrOpdocumento886.subscribe(cada => {
            cada.forEach(xy => {
              this.pushTabela(xy);
            });
            if (this.arrOpdocumento887 != null) {
              this.arrOpdocumento887.subscribe(cada => {
                cada.forEach(xy => {
                  this.pushTabela(xy);
                });
                localStorage.setItem('opPcf', JSON.stringify(this.arrOpPcf));
                this.dataSource = new MatTableDataSource(this.arrOpdocumentoTab)
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
                this.applyFilter()
                if (this.numOP !== null) {
                  this.opFilter = this.numOP[0].OP
                }
              });
            }
          });
        } else {
          if (this.arrOpdocumento887 != null) {
            this.arrOpdocumento887.subscribe(cada => {
              cada.forEach(xy => {
                this.pushTabela(xy);
              });
              localStorage.setItem('opPcf', JSON.stringify(this.arrOpPcf));
              this.dataSource = new MatTableDataSource(this.arrOpdocumentoTab)
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
              this.applyFilter()
              if (this.numOP !== null) {
                this.opFilter = this.numOP[0].OP
              }
            });
          }
        }
      });
    } else {
      if (this.arrOpdocumento886 != null) {
        this.arrOpdocumento886.subscribe(cada => {
          cada.forEach(xy => {
            this.pushTabela(xy);
          });
        });
      } else {
        if (this.arrOpdocumento887 != null) {
          this.arrOpdocumento887.subscribe(cada => {
            cada.forEach(xy => {
              this.pushTabela(xy);
            });
            localStorage.setItem('opPcf', JSON.stringify(this.arrOpPcf));
            this.dataSource = new MatTableDataSource(this.arrOpdocumentoTab)
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.applyFilter()
            if (this.numOP !== null) {
              this.opFilter = this.numOP[0].OP
            }
          });
        }
      }
    }
  }


  pushTabela(xy) {

    if (this.opFilRepet === '' || this.opFilRepet.indexOf(xy.filial + xy.op) === -1) {
      this.opFilRepet += xy.filial + xy.op
      const filOP = this.arrOpAnd.filter(x => (x.filial === xy.filial && x.op === xy.op));
      if (filOP.length > 0) {
        let sitDesc = filOP[0].final !== '' ? 'Integrada' : xy.situDesc
        // this.opConta++
        this.arrOpdocumentoTab.push({
          'SEQ': this.opConta++,
          'FILIAL': xy.filial,
          'OP': xy.op,
          'CODPROD': filOP[0].produto,
          'SITUACAO': sitDesc,
        })
        this.arrOpPcf.push({
          'FILIAL': xy.filial,
          'OP': xy.op,
          'APT': xy.dia,
        })
      }
    }

  }

  // aplica o filtro na tabela de OPs
  applyFilter() {
    const filterValue = this.opFilter;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

    if (this.opFilter.length >= 10) {
      this.opFilter = ''
    }
    localStorage.removeItem('op');

  }


  acessoDoclista(xcRow) {
    const filOP = this.arrOpdocumentoTab.filter(x => x.OP == xcRow.OP);
    localStorage.setItem('op', JSON.stringify(filOP));
    this.router.navigate(['doclista']);
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

}
