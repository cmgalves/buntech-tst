import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { funcsService } from 'app/funcs/funcs.service';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { funcGeral } from 'app/funcs/funcGeral';

// tslint:disable-next-line:class-name
export interface opVisualiza {
  componente: string;
  descricao: string;
  unidade: string;
  qtdeEmp: string;

}

@Component({
  selector: 'app-opvisualiza',
  templateUrl: './opvisualiza.component.html',
  styleUrls: ['./opvisualiza.component.css']
})

export class OpvisualizaComponent implements OnInit {
  a01: any = [];
  a02: any = [];
  a03: any = [];
  arrOpvisualiza: any = [];
  arrOpvisualizaTab: any = [];
  arrOpAndA: any = [];
  arrOpAndB: any = [];
  aOP = JSON.parse(localStorage.getItem('op'));
  arrUserLogado = JSON.parse(localStorage.getItem('user'))[0];
  opFilial: string = '';
  opCodigo: string = '';
  opEmissao: string = '';
  opFinal: string = '';
  opProduto: string = '';
  opDescricao: string = '';
  opLote: string = '';
  opAnalise: string = '';
  opCodant: string = '';
  opQtde: string = '';
  opEntregue: string = '';
  opQtdePcf: string = '';
  opRetrabalho: string = '';
  opHoras: string = '';

  opvisualizas: Observable<any>;
  displayedColumns: string[] = ['componente', 'descEmp', 'unidade', 'qtdeEmp', 'qtdeEmpCalc', 'qtdeInformada'];
  dataSource: MatTableDataSource<opVisualiza>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    public router: Router,
    private fg: funcGeral,
    private fj: funcsService,
  ) { }

  ngOnInit(): void {
    this.buscaOpvisualiza();
  }

  buscaOpvisualiza() { //View_Portal_OP
    let xcFilial = this.aOP.filial;
    let xcOp = this.aOP.op;
    const obj = {
      filial: xcFilial,
      op: xcOp,
    };
    this.arrOpvisualiza = [];
    this.arrOpvisualiza = this.fj.buscaPrt('pcpRelacaoLoteOpEmpenho', obj); //vw_pcp_relacao_lote_op_empenho

    this.arrOpvisualiza.subscribe(cada => {
      cada.forEach(xy => {
        this.arrOpvisualizaTab.push({
          componente: xy.componente,
          descEmp: xy.descEmp,
          unidade: xy.unidade,
          qtdeEmp: xy.qtdeEmp,
          qtdeEmpCalc: xy.qtdeEmpCalc === '0' ? 0 : xy.qtdeEmpCalc,
          qtdeInformada: xy.qtdeInformada === '0' ? 0 : xy.qtdeEmpCalc,
          saldo: xy.saldo,
          tipo: xy.tipo,
          situacao: xy.situacao,
        })
      });
      this.opFilial = this.aOP.filial;
      this.opCodigo = this.aOP.op;
      this.opProduto = this.aOP.produto;
      this.opDescricao = this.aOP.descricao;
      this.opLote = this.aOP.lote;
      this.opAnalise = this.aOP.analise;
      this.opQtde = this.aOP.qtdeLote

      this.dataSource = new MatTableDataSource(this.arrOpvisualizaTab)
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

  }

  // exporta a tela de dados para o excel
  exportExcel(fileName, sheetName) {
    const fn = fileName + '.xlsx';
    const sn = sheetName;
    const workSheet = XLSX.utils.json_to_sheet(this.dataSource.data, { header: [] });
    const workBook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, sn);
    XLSX.writeFile(workBook, fn);
  }


  // aplica o filtro informado pelo usuário
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // volta para tela anterior
  voltaResumo() {
    this.router.navigate(['opResumo']);
  }
}
