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
  aGrpA: any = [];
  aGrpB: any = [];
  aOpAndamentoResumo: any = [];
  aOpAnalitica: any = [];
  arrOpresumoTab: any = [];
  arrFilial: any = ['101', '107', '117', '402', '108', '206']
  situacoes = ["Sem Status", "Produção", "Liberada", "Planejada", "Interrompida", "Baixada", "Encerrada", "Cancelada"];
  situacaoFiltro;

  opresumos: Observable<any>;
  displayedColumns: string[] = ['id_loteRegProd', 'filial', 'op', 'lote', 'analise', 'dtcria', 'loteAprov', 'dtAprov', 'edicao'];
  dataSource: MatTableDataSource<opResumo>;
  dataExcel: MatTableDataSource<opResumo>;
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

    this.buscaOpresumos();
    this.buscaGrupo();
    this.buscaRecursos();
    this.buscaProdutos();
  }

  
  // busca as OPs nas tabelas do PCF para montar a tela inicial das OPs resumo
  buscaOpresumos() {
    let ord = 0;
    const obj = {
      'loteAprov': 'APROVADO',
    };
    this.arrOpresumoTab = [];

    this.aOpAndamentoResumo = this.fj.buscaPrt('relacaoOpLote', obj);

    this.aOpAndamentoResumo.subscribe(cada => {
      cada.forEach(xy => {
        ord++
        this.arrOpresumoTab.push({
          'id_loteRegProd': xy.id_loteRegProd,
          'filial': xy.filial,
          'op': xy.op,
          'produto': xy.produto,
          'descricao': xy.descricao,
          'lote': xy.lote,
          'analise': xy.analise,
          'dtcria': xy.dtcria,
          'loteAprov': xy.loteAprov,
          'dtAprov': xy.dtcria,
        })
      });
      this.dataSource = new MatTableDataSource(this.arrOpresumoTab)
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

  }


  buscaGrupo() {
    this.aGrpA = this.fj.buscaPrt('agrupaRecursos', {});
    this.aGrpA.subscribe(cada => {
      cada.forEach(xy => {
        this.aGrpB.push({
          'recurso': xy.recurso,
          'grupo': xy.grupo,
        })
      });
    });
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
      this.buscaOpresumos();
    });
  }

  // busca a relação de recursos que podem ser usados na produção da OP
  buscaRecursos() {
    const obj = {
      'filial': '',
      'codigo': '',
    };
    this.arrRecA = this.fj.buscaPrt('cadRecursos', obj);

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


  visuOp(xcRow) {
    localStorage.setItem('op', JSON.stringify(xcRow));
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
    this.fj.execProd('atualiza_OP', obj);
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
    if (tp === 'a') {
      if ((("Baixada ").indexOf(aRow.SITUACAO) > -1)) {
        if ((('Administrador | Apontador | Conferente-Apontador').indexOf(this.arrUserLogado.perfil) > -1)) {
          return false;
        }
      }
    }

    if (tp === 'c') {
      if ((("Produção | Interrompida | Baixada ").indexOf(aRow.SITUACAO) > -1)) {
        if ((('Administrador | Apontador | Conferente-Apontador').indexOf(this.arrUserLogado.perfil) > -1)) {
          return false;
        }
      }
    }
    return true
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

  filterSituacao(filterValue) {
    if(filterValue != undefined){
      console.log(this.arrOpresumoTab);
      const arrayFiltrado = this.arrOpresumoTab.filter(q => q.SITUACAO == this.situacoes[filterValue/10]);
      this.dataSource = new MatTableDataSource(arrayFiltrado);
    } else {
      this.dataSource = new MatTableDataSource(this.arrOpresumoTab);
    }
  }


  atuResumos() {
    window.location.reload();
  }


  buscatblOutInteg() {

    if (('Administrador') == this.arrUserLogado.perfil) {
      let arrTab = []

      this.aOpAnalitica = this.fj.buscaPrt('opsAnaliticas', {});

      this.aOpAnalitica.subscribe(cada => {
        cada.forEach(xy => {
          arrTab.push({
            filial: xy.filial,
            op: xy.op,
            recurso: xy.recurso,
            operacao: xy.operacao,
            integrado: xy.integrado,
            produto: xy.produto,
            producao: xy.producao,
            retrabalho: xy.retrabalho,
            segundos: xy.segundos,
            situacao: xy.situacao,
            situDesc: xy.situDesc,
            criacao: xy.criacao,
            aponta: xy.aponta,
          })
        });

        this.dataExcel = new MatTableDataSource(arrTab)
        this.expExcel('tblOutInteg', 'ops')
      });
    } else {
      alert('sem acesso')
    }
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

}
