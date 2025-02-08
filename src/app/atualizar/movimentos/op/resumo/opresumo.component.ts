import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { funcsService } from 'app/funcs/funcs.service';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { MatDialog } from '@angular/material/dialog';
import { funcGeral } from 'app/funcs/funcGeral';

// tslint:disable-next-line:class-name
export interface opResumo {
  FILIAL: string;
  OP: string;
  CODPROD: string;
  DESCRICAO: string;
  CODANT: string;
  QTDE: string;
  EMISSAO: string;
  FINAL: string;
  ENTREGUE: string;
  situacao: string;

}

@Component({
  selector: 'app-opresumo',
  templateUrl: './opresumo.component.html',
  styleUrls: ['./opresumo.component.css']
})


export class OpresumoComponent implements OnInit {
  aUsr = JSON.parse(localStorage.getItem('user'))[0];
  arrOpAnd: any = []; //JSON.parse(localStorage.getItem('user'))[0];
  arrOpPcf: any = []; //JSON.parse(localStorage.getItem('user'))[0];
  xcFilial: any = this.aUsr.empresa
  xcPerfil: any = this.aUsr.perfil
  aOp = JSON.parse(localStorage.getItem('op'));
  opFilter: any = ''
  arrRecA: any = [];
  arrRecB: any = [];
  arrProdA: any = [];
  arrProdB: any = [];
  arrOpAndA: any = [];
  arrOpAndB: any = [];
  aGrpA: any = [];
  aGrpB: any = [];
  aOpAndamentoResumo: any = [];
  aDadosOP: any = [];
  aDadosOPTab: any = [];
  aOpAnalitica: any = [];
  arrOpresumoTab: any = [];
  situacoes: any = [];
  arrFilial: any = ['101', '107', '117', '402', '108', '206']
  situacaoFiltro;

  opresumos: Observable<any>;
  displayedColumns: string[] = ['filial', 'op', 'rec', 'qtdeLote', 'qtdeEnv', 'qtdeSaldo', 'qtdeReprovado', 'diabr', 'situacao', 'filProd', 'edicao'];
  dataSource: MatTableDataSource<opResumo>;
  dataExcel: MatTableDataSource<opResumo>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    public router: Router,
    private fg: funcGeral,
    private fj: funcsService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.buscaOpresumos();
    this.buscaProdutos();
  }


  // busca as OPs nas tabelas do PCF para montar a tela inicial das OPs resumo - vw_pcp_relacao_op_lote
  buscaOpresumos() {
    let ord = 0;

    this.arrOpresumoTab = [];
    this.aOpAndamentoResumo = this.fj.buscaPrt('relacaoOpLote', {}); //vw_pcp_relacao_op_lote
    this.aOpAndamentoResumo.subscribe(cada => {
      cada.forEach(xy => {
        ord++
        this.arrOpresumoTab.push({
          'filial': xy.filial,
          'op': xy.op,
          'produto': xy.produto,
          'descricao': xy.descricao,
          'dtcria': xy.dtcria,
          'dtime': xy.dtime,
          'diabr': xy.diabr,
          'loteAprov': xy.loteAprov,
          'qtdeLote': xy.qtdeLote,
          'qtdeReprovado': xy.qtdeReprovado,
          'qtdeEnv': xy.qtdeEnv,
          'qtdeSaldo': xy.qtdeSaldo,
          'codSitu': xy.codSitu,
          'situacao': xy.situacao,
          'codRecurso': xy.codRecurso,
          'codOpera': xy.codOpera,
          'filProd': xy.filProd,
        })
        this.arrOpPcf.push({
          'FILIAL': xy.filial,
          'OP': xy.op,
          'APT': xy.diabr,
        })
        if (!this.situacoes.includes(xy.situacao)) {
          this.situacoes.push(xy.situacao)
        }
      });
      localStorage.setItem('opPcf', JSON.stringify(this.arrOpPcf));
      this.dataSource = new MatTableDataSource(this.arrOpresumoTab)
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

  }


  // visualização da OP
  visuOp(xcRow) {
    this.atuOP(xcRow.filial, xcRow.op, 'v')
    localStorage.setItem('op', JSON.stringify(xcRow));
    this.router.navigate(['opVisualiza']);
  }

  // ajusta da OP
  ajustaOp(xcRow) {
    this.atuOP(xcRow.filial, xcRow.op, 'a')
    localStorage.setItem('op', JSON.stringify(xcRow));
    this.router.navigate(['opAjusta']);
  }

  confirmaOp(xcRow) {
    const filOP = this.arrOpresumoTab.filter(x => x.op == xcRow.op);
    localStorage.removeItem('rowOp');

    localStorage.setItem('rowOp', JSON.stringify(filOP));
    this.atuOP(xcRow.filial, xcRow.op, 'c')
    this.router.navigate(['opConfirma']);
  }

  atuOP(xcFil, xcOp, xcTipo) {
    let obj = {
      'filial': xcFil,
      'op': xcOp,
      'tipo': xcTipo
    }
    this.fj.execProd('loteEmpenho', obj);  //PCP..spcp_lote_empenho
  }


  // exporta os dados para o excel
  exportExcel(fileName, sheetName) {
    const fn = fileName + '.xlsx';
    const sn = sheetName;
    const workSheet = XLSX.utils.json_to_sheet(this.dataSource.data, { header: [] });
    const workBook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, sn);
    XLSX.writeFile(workBook, fn);
  }


  // habilita e desabilita os dados os botões na tela da OP para ajuste de empenho
  btnDisable(aRow, tp) {
    if (tp === 'a') {

      if (aRow.situacao == 'Baixada') {
        if (aRow.filProd == 'S') {
          if (aRow.qtdeSaldo == 0) {
            return false;
          } else {
            return true;
          }
        } else {
          return false;
        }
      } else {
        return true
      }

      // if (!(("Interrompida Produção ").indexOf(aRow.situacao) > -1)) {
      //   if ((('Administrador | Apontador | Conferente-Apontador').indexOf(this.aUsr.perfil) > -1)) {
      //     return false; row.qtdeSaldo
      //   }
      // }
      if (aRow.situacao != 'Baixada' && aRow.filProd == 'N') {
        return false;
      }
    }

    // row.filProd == 'S' || row.qtdeSaldo > 0

    // habilita e desabilita os dados os botões na tela da OP para produção de OP
    if (tp === 'b') {
      if (aRow.filProd == 'S') {
        return true;
      }
      if (aRow.filProd == 'N') {
        return false;
      }
    }
    return true;
  }

  // habilita e desabilita os dados os botões na tela da OP
  // prodDisable(aRow, tp) {
  //   [disabled]="row.qtdeEnv < row.qtdeLote"
  //   row.filProd == 'S'

  //   if (tp === 'a') {
  //     if (!(("Interrompida Produção ").indexOf(aRow.situacao) > -1)) {
  //       if ((('Administrador | Apontador | Conferente-Apontador').indexOf(this.aUsr.perfil) > -1)) {
  //         return false;
  //       }
  //     }
  //   }
  //   return true
  // }

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

  filterSituacao(filterValue) {
    if (filterValue != undefined) {
      const arrayFiltrado = this.arrOpresumoTab.filter(q => q.situacao == this.situacoes[filterValue / 10]);
      this.dataSource = new MatTableDataSource(arrayFiltrado);
    } else {
      this.dataSource = new MatTableDataSource(this.arrOpresumoTab);
    }
  }


  atuResumos() {
    window.location.reload();
  }

  // exporta os dados para o excel
  expExcel(fileName, sheetName) {
    const fn = fileName + '.xlsx';
    const sn = sheetName;
    const workSheet = XLSX.utils.json_to_sheet(this.dataExcel.data, { header: [] });
    const workBook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, sn);
    XLSX.writeFile(workBook, fn);
  }

  // busca os produtos no cadastro para utilizar os dados necessários
  buscaProdutos() {
    const obj = {
      'produto': ''
    };
    this.arrProdB = [];
    this.arrProdA = this.fj.buscaPrt('cadastroProdutos', obj);

    this.arrProdA.subscribe(cada => {
      cada.forEach(xy => {
        if (xy.situacao === 'Liberado' && ('MP, PP, ME, MI, HR, GG, MO, PA, IN, LB, MK, MR, MT, PN, SP').indexOf(xy.tipo) > -1) {
          this.arrProdB.push({
            'codigo': xy.codigo,
            'descricao': xy.descricao,
            'unidade': xy.unidade,
            'retrabalho': xy.retrabalho,
            'mdo': xy.mdo,
          })
        }
      });
      localStorage.setItem('cadProd', JSON.stringify(this.arrProdB));
    });
  }

  // prodParcial(row) {
  //   // const num = 2
  //   // if (num == 2) {
  //   //   this.confirmaOp()
  //   // }
  //   this.fj.prodParcialOp(row, 'pcp');
  // }



  buscatblOutInteg() {
    let arrTab = []
    let arr886 = this.fj.buscaPcfa('tblOutInteg', {});
    let arr887 = this.fj.buscaPcfb('tblOutInteg', {});
    let arr888 = this.fj.buscaPcfc('tblOutInteg', {});

    if (arr888 != null) {
      arr888.subscribe(cada => {
        cada.forEach(xy => {
          arrTab.push({
            WOCode: xy.WOCode,
            ResourceCode: xy.ResourceCode,
            WODetCode: xy.WODetCode,
            ProductCode: xy.ProductCode,
            Integrated: xy.Integrated,
            Qty: xy.Qty,
            DtProduction: xy.DtProduction,
            DtCreation: xy.DtCreation,
            UserCode: xy.UserCode,
            ReWorkCode: xy.ReWorkCode,
          })
        });
        if (arr886 != null) {
          arr886.subscribe(cada => {
            cada.forEach(xy => {
              arrTab.push({
                WOCode: xy.WOCode,
                ResourceCode: xy.ResourceCode,
                WODetCode: xy.WODetCode,
                ProductCode: xy.ProductCode,
                Integrated: xy.Integrated,
                Qty: xy.Qty,
                DtProduction: xy.DtProduction,
                DtCreation: xy.DtCreation,
                UserCode: xy.UserCode,
                ReWorkCode: xy.ReWorkCode,
              })
            });
            if (arr887 != null) {
              arr887.subscribe(cada => {
                cada.forEach(xy => {
                  arrTab.push({
                    WOCode: xy.WOCode,
                    ResourceCode: xy.ResourceCode,
                    WODetCode: xy.WODetCode,
                    ProductCode: xy.ProductCode,
                    Integrated: xy.Integrated,
                    Qty: xy.Qty,
                    DtProduction: xy.DtProduction,
                    DtCreation: xy.DtCreation,
                    UserCode: xy.UserCode,
                    ReWorkCode: xy.ReWorkCode,
                  })
                });
                this.dataExcel = new MatTableDataSource(arrTab)
                this.expExcel('tblOutInteg', 'ops')
              });
            }
          });
        } else {
          if (arr887 != null) {
            arr887.subscribe(cada => {
              cada.forEach(xy => {
                arrTab.push({
                  WOCode: xy.WOCode,
                  ResourceCode: xy.ResourceCode,
                  WODetCode: xy.WODetCode,
                  ProductCode: xy.ProductCode,
                  Integrated: xy.Integrated,
                  Qty: xy.Qty,
                  DtProduction: xy.DtProduction,
                  DtCreation: xy.DtCreation,
                  UserCode: xy.UserCode,
                  ReWorkCode: xy.ReWorkCode,
                })
              });
              this.dataExcel = new MatTableDataSource(arrTab)
              this.expExcel('tblOutInteg', 'ops')
            });
          }
        }
      });
    } else {
      if (arr886 != null) {
        arr886.subscribe(cada => {
          cada.forEach(xy => {
            arrTab.push({
              WOCode: xy.WOCode,
              ResourceCode: xy.ResourceCode,
              WODetCode: xy.WODetCode,
              ProductCode: xy.ProductCode,
              Integrated: xy.Integrated,
              Qty: xy.Qty,
              DtProduction: xy.DtProduction,
              DtCreation: xy.DtCreation,
              UserCode: xy.UserCode,
              ReWorkCode: xy.ReWorkCode,
            })
          });
        });
      } else {
        if (arr887 != null) {
          arr887.subscribe(cada => {
            cada.forEach(xy => {
              arrTab.push({
                WOCode: xy.WOCode,
                ResourceCode: xy.ResourceCode,
                WODetCode: xy.WODetCode,
                ProductCode: xy.ProductCode,
                Integrated: xy.Integrated,
                Qty: xy.Qty,
                DtProduction: xy.DtProduction,
                DtCreation: xy.DtCreation,
                UserCode: xy.UserCode,
                ReWorkCode: xy.ReWorkCode,
              })
            });
            this.dataExcel = new MatTableDataSource(arrTab)
            this.expExcel('tblOutInteg', 'ops')
          });
        }
      }
    }
  }


}
