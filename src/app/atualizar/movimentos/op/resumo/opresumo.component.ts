import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { funcsService } from 'app/shared/funcs/funcs.service';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { MatDialog } from '@angular/material/dialog';

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
  SITUACAO: string;

}

@Component({
  selector: 'app-opresumo',
  templateUrl: './opresumo.component.html',
  styleUrls: ['./opresumo.component.css']
})


export class OpresumoComponent implements OnInit {
  arrUserLogado = JSON.parse(localStorage.getItem('user'))[0];
  arrOpAnd: any = []; //JSON.parse(localStorage.getItem('user'))[0];
  arrOpPcf: any = []; //JSON.parse(localStorage.getItem('user'))[0];
  xcFilial: any = this.arrUserLogado.empresa
  xcPerfil: any = this.arrUserLogado.perfil
  numOP = JSON.parse(localStorage.getItem('op'));
  opFilter: any = ''
  arrRecA: any = [];
  arrRecB: any = [];
  arrProdA: any = [];
  arrProdB: any = [];
  arrOpAndA: any = [];
  arrOpAndB: any = [];
  arrOpresumo886: any = [];
  arrOpresumo887: any = [];
  arrOpresumo888: any = [];
  arrOpresumoTab: any = [];
  arrFilial: any = ['101', '107', '117', '402', '108', '206']

  // Campina Grande - 888
  // Servidor de HML:10.3.0.92
  // Filiais:101,107,117,402

  // Boa vista - 886
  // Servidor de HML:10.1.0.250
  // Filiais:108


  // Indaiatuba - 887
  // Servidor de HML: 10.3.0.204
  // Filiais:206


  opresumos: Observable<any>;
  displayedColumns: string[] = ['SEQ', 'FILIAL', 'OP', 'RECURSO', 'OPERACAO', 'EMISSAO', 'FINAL', 'CODPROD', 'QTDEPCF', 'QTDEPRT', 'ENTREGUE', 'RETRABALHO', 'HORAS', 'SITUACAO', 'EDICAO'];
  dataSource: MatTableDataSource<opResumo>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    public router: Router,
    private funcJson: funcsService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    if (this.numOP !== null) {
      this.opFilter = this.numOP[0].OP
    }

    this.buscaOpsAndamentoProtheus();
    this.buscaRecursos();
    this.buscaProdutos();
  }

  // busca os produtos no cadastro para utilizar os dados necessários
  buscaProdutos() {
    const obj = {
      'produto': ''
    };
    this.arrProdA = this.funcJson.busca884('cadastroProdutos', obj);

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

  // busca os produtos no cadastro para utilizar os dados necessários
  buscaOpsAndamentoProtheus() {
    const obj = {
      'op': ''
    };
    this.arrOpAndA = this.funcJson.busca883('ordemProducaoAndamento', obj);

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
      this.buscaOpresumos();
    });
  }

  // busca a relação de recursos que podem ser usados na produção da OP
  buscaRecursos() {
    const obj = {
      'filial': '',
      'codigo': '',
    };
    this.arrRecA = this.funcJson.busca884('cadRecursos', obj);

    this.arrRecA.subscribe(cada => {
      cada.forEach(xy => {
        this.arrRecB.push({
          'filial': xy.filial,
          'codigo': xy.codigo,
          'custo': xy.custo,
        })
      });
      localStorage.setItem('recurso', JSON.stringify(this.arrRecB));
    });
  }


  // busca as OPs nas tabelas do PCF para montar a tela inicial das OPs resumo
  buscaOpresumos() {
    this.arrOpAnd = JSON.parse(localStorage.getItem('opAndamento'));

    const obj = {
      'filial': this.xcFilial,
      'perfil': this.xcPerfil
    };
    let conta = 0
    this.arrOpresumo886 = this.funcJson.busca886('ops', obj);
    this.arrOpresumo887 = this.funcJson.busca887('ops', obj);
    this.arrOpresumo888 = this.funcJson.busca888('ops', obj);

    if (this.arrOpresumo888 != null) {
      this.arrOpresumo888.subscribe(cada => {
        cada.forEach(xy => {
          const filOP = this.arrOpAnd.filter(x => (x.filial === xy.filial && x.op === xy.op));
          if (filOP.length > 0) {
            let sitDesc = filOP[0].final !== '' ? 'Integrada' : xy.situDesc
            conta++
            this.arrOpresumoTab.push({
              'SEQ': conta,
              'FILIAL': xy.filial,
              'OP': xy.op,
              'RECURSO': xy.recurso,
              'OPERACAO': xy.operacao,
              'EMISSAO': filOP[0].emissao,
              'FINAL': filOP[0].final,
              'ENTREGUE': filOP[0].entregue,
              'CODPROD': filOP[0].produto,
              'QTDEPRT': filOP[0].qtde,
              'QTDEPCF': xy.producao,
              'RETRABALHO': xy.retrabalho,
              'SEGUNDOS': xy.segundos,
              'HORAS': this.funcJson.toHHMMSS(xy.segundos),
              'SITUACAO': sitDesc,
            })
            this.arrOpPcf.push({
              'FILIAL': xy.filial,
              'OP': xy.op,
              'APT': xy.dia,
            })
          }

        });
        if (this.arrOpresumo886 != null) {
          this.arrOpresumo886.subscribe(cada => {
            cada.forEach(xy => {
              const filOP = this.arrOpAnd.filter(x => (x.filial === xy.filial && x.op === xy.op));
              if (filOP.length > 0) {
                let sitDesc = filOP[0].final !== '' ? 'Integrada' : xy.situDesc
                conta++
                this.arrOpresumoTab.push({
                  'SEQ': conta,
                  'FILIAL': xy.filial,
                  'OP': xy.op,
                  'RECURSO': xy.recurso,
                  'OPERACAO': xy.operacao,
                  'EMISSAO': filOP[0].emissao,
                  'FINAL': filOP[0].final,
                  'ENTREGUE': filOP[0].entregue,
                  'CODPROD': filOP[0].produto,
                  'QTDEPRT': filOP[0].qtde,
                  'QTDEPCF': xy.producao,
                  'RETRABALHO': xy.retrabalho,
                  'SEGUNDOS': xy.segundos,
                  'HORAS': this.funcJson.toHHMMSS(xy.segundos),
                  'SITUACAO': sitDesc,
                })
                this.arrOpPcf.push({
                  'FILIAL': xy.filial,
                  'OP': xy.op,
                  'APT': xy.dia,
                })
              }
            });
            if (this.arrOpresumo887 != null) {
              this.arrOpresumo887.subscribe(cada => {
                cada.forEach(xy => {
                  const filOP = this.arrOpAnd.filter(x => (x.filial === xy.filial && x.op === xy.op));
                  if (filOP.length > 0) {
                    let sitDesc = filOP[0].final !== '' ? 'Integrada' : xy.situDesc
                    conta++
                    this.arrOpresumoTab.push({
                      'SEQ': conta,
                      'FILIAL': xy.filial,
                      'OP': xy.op,
                      'RECURSO': xy.recurso,
                      'OPERACAO': xy.operacao,
                      'EMISSAO': filOP[0].emissao,
                      'FINAL': filOP[0].final,
                      'ENTREGUE': filOP[0].entregue,
                      'CODPROD': filOP[0].produto,
                      'QTDEPRT': filOP[0].qtde,
                      'QTDEPCF': xy.producao,
                      'RETRABALHO': xy.retrabalho,
                      'SEGUNDOS': xy.segundos,
                      'HORAS': this.funcJson.toHHMMSS(xy.segundos),
                      'SITUACAO': sitDesc,
                    })
                    this.arrOpPcf.push({
                      'FILIAL': xy.filial,
                      'OP': xy.op,
                      'APT': xy.dia,
                    })
                  }
                });
                localStorage.setItem('opPcf', JSON.stringify(this.arrOpPcf));
                this.dataSource = new MatTableDataSource(this.arrOpresumoTab)
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
                this.applyFilter()
              });
            }
          });
        } else {
          if (this.arrOpresumo887 != null) {
            this.arrOpresumo887.subscribe(cada => {
              cada.forEach(xy => {
                const filOP = this.arrOpAnd.filter(x => (x.filial === xy.filial && x.op === xy.op));
                if (filOP.length > 0) {
                  let sitDesc = filOP[0].final !== '' ? 'Integrada' : xy.situDesc
                  conta++
                  this.arrOpresumoTab.push({
                    'SEQ': conta,
                    'FILIAL': xy.filial,
                    'OP': xy.op,
                    'RECURSO': xy.recurso,
                    'OPERACAO': xy.operacao,
                    'EMISSAO': filOP[0].emissao,
                    'FINAL': filOP[0].final,
                    'ENTREGUE': filOP[0].entregue,
                    'CODPROD': filOP[0].produto,
                    'QTDEPRT': filOP[0].qtde,
                    'QTDEPCF': xy.producao,
                    'RETRABALHO': xy.retrabalho,
                    'SEGUNDOS': xy.segundos,
                    'HORAS': this.funcJson.toHHMMSS(xy.segundos),
                    'SITUACAO': sitDesc,
                  })
                  this.arrOpPcf.push({
                    'FILIAL': xy.filial,
                    'OP': xy.op,
                    'APT': xy.dia,
                  })
                }
              });
              localStorage.setItem('opPcf', JSON.stringify(this.arrOpPcf));
              this.dataSource = new MatTableDataSource(this.arrOpresumoTab)
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
              this.applyFilter()
            });
          }
        }
      });
    } else {
      if (this.arrOpresumo886 != null) {
        this.arrOpresumo886.subscribe(cada => {
          cada.forEach(xy => {
            const filOP = this.arrOpAnd.filter(x => (x.filial === xy.filial && x.op === xy.op));
            if (filOP.length > 0) {
              let sitDesc = filOP[0].final !== '' ? 'Integrada' : xy.situDesc
              conta++
              this.arrOpresumoTab.push({
                'SEQ': conta,
                'FILIAL': xy.filial,
                'OP': xy.op,
                'RECURSO': xy.recurso,
                'OPERACAO': xy.operacao,
                'EMISSAO': filOP[0].emissao,
                'FINAL': filOP[0].final,
                'ENTREGUE': filOP[0].entregue,
                'CODPROD': filOP[0].produto,
                'QTDEPRT': filOP[0].qtde,
                'QTDEPCF': xy.producao,
                'RETRABALHO': xy.retrabalho,
                'SEGUNDOS': xy.segundos,
                'HORAS': this.funcJson.toHHMMSS(xy.segundos),
                'SITUACAO': sitDesc,
              })
              this.arrOpPcf.push({
                'FILIAL': xy.filial,
                'OP': xy.op,
                'APT': xy.dia,
              })
            }
          });
        });
      } else {
        if (this.arrOpresumo887 != null) {
          this.arrOpresumo887.subscribe(cada => {
            cada.forEach(xy => {
              const filOP = this.arrOpAnd.filter(x => (x.filial === xy.filial && x.op === xy.op));
              if (filOP.length > 0) {
                let sitDesc = filOP[0].final !== '' ? 'Integrada' : xy.situDesc
                conta++
                this.arrOpresumoTab.push({
                  'SEQ': conta,
                  'FILIAL': xy.filial,
                  'OP': xy.op,
                  'RECURSO': xy.recurso,
                  'OPERACAO': xy.operacao,
                  'EMISSAO': filOP[0].emissao,
                  'FINAL': filOP[0].final,
                  'ENTREGUE': filOP[0].entregue,
                  'CODPROD': filOP[0].produto,
                  'QTDEPRT': filOP[0].qtde,
                  'QTDEPCF': xy.producao,
                  'RETRABALHO': xy.retrabalho,
                  'SEGUNDOS': xy.segundos,
                  'HORAS': this.funcJson.toHHMMSS(xy.segundos),
                  'SITUACAO': sitDesc,
                })
                this.arrOpPcf.push({
                  'FILIAL': xy.filial,
                  'OP': xy.op,
                  'APT': xy.dia,
                })
              }
            });
            localStorage.setItem('opPcf', JSON.stringify(this.arrOpPcf));
            this.dataSource = new MatTableDataSource(this.arrOpresumoTab)
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.applyFilter()
          });
        }
      }
    }
  }

  visuOp(xcRow) {
    const filOP = this.arrOpresumoTab.filter(x => x.OP == xcRow.OP);
    localStorage.setItem('op', JSON.stringify(filOP));
    this.atuOP(filOP[0].FILIAL, filOP[0].OP)
    this.router.navigate(['opVisualiza']);
  }

  ajustaOp(xcRow) {
    const filOP = this.arrOpresumoTab.filter(x => x.OP == xcRow.OP);
    localStorage.setItem('op', JSON.stringify(filOP));
    this.atuOP(filOP[0].FILIAL, filOP[0].OP)
    this.router.navigate(['opAjusta']);
  }

  confirmaOp(xcRow) {
    const filOP = this.arrOpresumoTab.filter(x => x.OP == xcRow.OP);
    localStorage.setItem('op', JSON.stringify(filOP));
    console.log(filOP);
    this.atuOP(filOP[0].FILIAL, filOP[0].OP)
    this.router.navigate(['opConfirma']);
  }

  atuOP(xcFil, xcOp) {
    let obj = {
      'filial': xcFil,
      'op': xcOp,
    }
    this.funcJson.execProd('atualiza_OP', obj);
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


  // habilita e desabilita os dados os botões na tela da OP
  btnDisable(aRow, tp) {
    let lRet = true

    lRet = aRow.FINAL === ''
    if (lRet) {
      lRet = ("Baixada ").indexOf(aRow.SITUACAO) > -1;

      if (tp === 'a') {
        lRet = lRet === false ? lRet : (('Administrador | Apontador | Conferente-Apontador').indexOf(this.arrUserLogado.perfil) > -1);
      }

      if (tp === 'c') {
        lRet = ("Produção | Interrompida ").indexOf(aRow.SITUACAO) > -1 || ("Baixada ").indexOf(aRow.SITUACAO) > -1;
        lRet = lRet === false ? lRet : (('Administrador | Conferente | Conferente-Apontador').indexOf(this.arrUserLogado.perfil) > -1);
      }
    }
    return !lRet
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


  atuResumos() {
    
    window.location.reload();
  }


}
