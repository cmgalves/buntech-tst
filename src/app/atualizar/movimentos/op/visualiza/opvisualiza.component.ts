import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { funcsService } from 'app/funcs/funcs.service';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';

// tslint:disable-next-line:class-name
export interface opVisualiza {
  COMPONENTE: string;
  DESCRIC: string;
  QTDEORI: string;
  SALDO: string;
  ROTEIRO: string;
  OPERACAO: string;
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
  numOP = JSON.parse(localStorage.getItem('op'));
  opFilial: string = '';
  opCodigo: string = '';
  opEmissao: string = '';
  opFinal: string = '';
  opProduto: string = '';
  opDescricao: string = '';
  opCodant: string = '';
  opQtde: string = '';
  opEntregue: string = '';
  opQtdePcf: string = '';
  opRetrabalho: string = '';
  opHoras: string = '';

  opvisualizas: Observable<any>;
  displayedColumns: string[] = ['COMPONENTE', 'DESCRIC', 'UNIDADE', 'QTDEORI', 'QTDECALC'];
  dataSource: MatTableDataSource<opVisualiza>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    public router: Router,
    private fj: funcsService,
  ) { }

  ngOnInit(): void {
    this.buscaOpvisualiza();
  }


  buscaOpvisualiza() { //View_Portal_OP
    let conta = 0;
    let secs = 0;
    let retr = 0;
    let grupo = '';
    let oper = '00';
    let xcFilial = this.numOP.filial;
    let xcOp = this.numOP.op;
    const obj = {
      filial: xcFilial,
      op: xcOp,
      tipo: 'tudo',
    };
    this.arrOpvisualiza = [];
    // const filOP = this.arrOpAndB.filter(x => (x.filial === xcFilial && x.op === xcOp))[0];
    this.arrOpvisualiza = this.fj.buscaPrt('pcpRelacaoLoteOpEmpenho', obj); //vw_pcp_relacao_lote_op_empenho

    this.arrOpvisualiza.subscribe(cada => {
      cada.forEach(xy => {

        this.arrOpvisualizaTab.push({
          'COMPONENTE': xy.COMPONENTE,
          'DESCRIC': xy.DESCRIC,
          'QTDEORI': xy.QTDEORI,
          'SALDO': xy.SALDO,
          'ROTEIRO': xy.ROTEIRO,
          'OPERACAO': xy.OPERACAO,
          'UNIDADE': xy.UNIDADE,
          'QTDECALC': xy.QTDECAL,
          'SITUACA': xy.SITUDESC,
          'TIPO': xy.TIPO,
        })
        if (conta === 0) {
          conta++
          this.opFilial = xy.FILIAL;
          this.opCodigo = xy.OP;
          this.opProduto = xy.PRODUTO;
          this.opDescricao = xy.DESCRICAO;
          this.opQtde = xy.QTDE
          this.opRetrabalho = String(retr)
          this.opHoras = this.fj.toHHMMSS(secs)
          oper = '00'
        }
      });
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
