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
  aOp = JSON.parse(localStorage.getItem('op'));
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
  opQtdePcf: string = '';
  opQtdeEnv: string = '';
  opQtdeSaldo: string = '';
  opEntregue: string = '';
  opQtdeProd: string = '';
  opSaldoProd: string = '';
  opRetrabalho: string = '';
  opHoras: string = '';

  opvisualizas: Observable<any>;
  displayedColumns: string[] = ['componente', 'descEmp', 'unidade', 'qtdeEmp', 'qtdeEmpCalc', 'qtdeInformada', 'qtdeConsumida'];
  dataSource: MatTableDataSource<opVisualiza>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    public router: Router,
    private fg: funcGeral,
    private fj: funcsService,
  ) { }

  ngOnInit(): void {
    this.buscaOp();
  }

  
  // Busca OP com os dados agrupados - vw_pcp_relacao_lote_op_empenho
  buscaOp(){
    let xcFilial = this.aOp.filial;
    let xcOp = this.aOp.op;
    const obj = {
      filial: xcFilial,
      op: xcOp,
    };

    this.fj.buscaPrt('pcpRelacaoOp', obj).subscribe(x =>{
      x.forEach(y =>{
          this.opFilial = y.filial
          this.opCodigo = y.op
          this.opProduto = y.produto
          this.opDescricao = y.descricao
          this.opQtdePcf = y.qtdeLote
          this.opQtdeEnv = y.qtdeEnv  
          this.opQtdeSaldo = y.qtdeSaldo
          this.opQtdeProd = y.qtdeProd
          this.opSaldoProd = y.saldoProd
          this.opEmissao = y.dtcria 
          this.opHoras = this.fj.toHHMMSS(y.opSegundos)
      })
      this.buscaOpvisualiza();

    })

  }

  buscaOpvisualiza() { //View_Portal_OP
    let xcFilial = this.aOp.filial;
    let xcOp = this.aOp.op;
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
          qtdeInformada: xy.qtdeInformada === '0' ? 0 : xy.qtdeInformada,
          qtdeConsumida: xy.qtdeConsumida === '0' ? 0 : xy.qtdeConsumida,
          saldo: xy.saldo,
          tipo: xy.tipo,
          situacao: xy.situacao,
        })
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
