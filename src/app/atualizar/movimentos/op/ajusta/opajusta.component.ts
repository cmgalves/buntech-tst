import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { UntypedFormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { funcsService } from 'app/funcs/funcs.service';
import { funcGeral } from 'app/funcs/funcGeral';
// tslint:disable-next-line:class-name
export interface opAjusta {
  COMPONENTE: string;
  DESCRIC: string;
  QTDEORI: string;
  SALDO: string;
  ROTEIRO: string;
  OPERACAO: string;
}
 
@Component({
  selector: 'app-opajusta',
  templateUrl: './opajusta.component.html',
  styleUrls: ['./opajusta.component.css']
})

export class OpajustaComponent implements OnInit {
  aUsr = JSON.parse(localStorage.getItem('user'))[0];
  aOp = JSON.parse(localStorage.getItem('op'));
  arrRecurso = JSON.parse(localStorage.getItem('recurso'));
  arrProd = JSON.parse(localStorage.getItem('cadProd'));

  myControl = new UntypedFormControl();
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;


  arrOpAndA: any = [];
  arrOpAndB: any = [];
  a01: any = [];
  a02: any = [];
  a03: any = [];
  arrOp: any = [];
  arrOpEmpenho: any = [];
  arrOpajusta: any = [];
  arrOpajustaTab: any = [];
  arrEstrutura: any = [];
  arrEstruturaTab: any = [];
  arrProduto: any = [];
  arrProdutoTab: any = [];
  arrCalcOP: any = [];
  arrCalcOPTab: any = [];
  arrMod: any = [];
  calculaMod: string = '';
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
  opQtdeEnv: string = '';
  opQtdeSaldo: string = '';
  opQtdeProd: string = '';
  opQtdeProduz: string = '0';
  opSaldoProd: string = '';
  opRetrabalho: any = 0;
  opHoras: string = '';
  // itens novos
  opItemNovo: string = '';
  opDescItemNovo: string = '';
  opUnidadeItemNovo: string = '';
  opQtdeItemNovo: string = '';
  // arrColor: {'saldoL': sld.SALDO >= sld.QTDEORI ,'saldoB' : sld.QTDEORI > sld.SALDO}

  mostraInc: boolean = false;
  enableEdit: boolean = false;
  enableEditIndex = null;
  editQtd: any = 0;

  opajustas: Observable<any>;
  displayedColumns: string[] = ['componente', 'descEmp', 'unidade', 'qtdeEmp', 'qtdeEmpCalc', 'qtdeInformada', 'qtdeConsumida', 'sitDesc', 'edicao'];
  // displayedColumns: string[] = ['componente', 'descEmp', 'unidade', 'qtdeEmp', 'qtdeEmpCalc', 'situaca', 'edicao'];
  dataSource: MatTableDataSource<opAjusta>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    public router: Router,
    private fg: funcGeral,
    private fj: funcsService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.mostraInc = false
    if (('Administrador | Apontador | Conferente-Apontador').indexOf(this.aUsr.perfil) > -1) {
      this.buscaOp();
      this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value))
      );
    } else {
      alert('Sem Acesso')
      this.router.navigate(['opResumo']);
    }

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
          this.opQtdeSaldo = this.fg.formatarNumero(y.qtdeSaldo);
          this.opQtdeProd = y.qtdeProd
          this.opSaldoProd = this.fg.formatarNumero(y.saldoProd)
          this.opEmissao = this.fj.converterParaDDMMYY(y.dtcria); 
          this.opHoras = this.fj.toHHMMSS(y.opSegundos)
      })
      this.buscaOpEmpenho();
    })
  }


  // Busca todos os dados para ajustar as OPs - vw_pcp_relacao_lote_op_empenho
  buscaOpEmpenho() {
    let x = 0;
    let xcFilial = this.aOp.filial;
    let xcOp = this.aOp.op;
    const obj = {
      filial: xcFilial,
      op: xcOp,
    };
    this.arrOpajusta = [];
    this.arrOpajusta = this.fj.buscaPrt('pcpRelacaoLoteOpEmpenho', obj); //vw_pcp_relacao_lote_op_empenho

    this.arrOpajusta.subscribe(cada => {
      cada.forEach(xy => {
        x = x + 1
        this.arrOpajustaTab.push({
          componente: xy.componente,
          descEmp: xy.descEmp,
          unidade: xy.unidade,
          emissao: xy.emissao,
          qtdeEmp: xy.qtdeEmp,
          qtdeEmpCalc: xy.qtdeEmpCalc,
          qtdeInformada: xy.qtdeInformada,
          qtdeConsumida: xy.qtdeConsumida,
          saldo: xy.saldo,
          tipo: xy.tipo,
          situacao: xy.situacao,
          sitDesc: xy.sitDesc,
        })
        
      });

      this.dataSource = new MatTableDataSource(this.arrOpajustaTab)
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.arrProd.filter(option => option.codigo.toLowerCase().indexOf(filterValue) === 0);
  }

  // valida a inclusão dos novos itens na OP
  aposSelec(event) {
    const codProd = event.option.value
    const filProd = this.arrProd.filter(x => (x.codigo === codProd))[0];

    if (filProd.length === 0) {
      alert(codProd + ' não encontrado no cadastro de produtos');
    } else {
      this.opItemNovo = filProd.codigo
      this.opDescItemNovo = filProd.descricao
      this.opUnidadeItemNovo = filProd.unidade
    }
  }

produzir(){
  alert('em desenv')
}

  // confirma o ajuste feito na op para enviar para o conferente
  confirmarEmpenho() {
    const objConf = {
      'filial': this.opFilial,
      'op': this.opCodigo,
      'produto': this.opProduto,
    }
    this.fj.execProd('spcp_confirma_qtde_informada', objConf);
    window.location.reload();
  }

  // cálculo da op utilizando a nova quantidade produzida
  calculaOP() {
    const obj = {
      filial: this.opFilial,
      op: this.opCodigo,
      produto: this.opProduto,
    };
    
    this.fj.execProd('spcp_calcula_op', obj);
    window.location.reload();
    
  }



  mostraInclusao() {
    this.mostraInc = !this.mostraInc
  }

  // inclusão de novos itens na OP
  incProd() {
    let xcQtde = parseFloat(this.opQtdeItemNovo)
    let Tipo = 'N'

    if (xcQtde < 0) {
      xcQtde = xcQtde * -1
      Tipo = 'R'
    }
    if (this.opItemNovo === '' || this.opDescItemNovo === '' || this.opUnidadeItemNovo === '' || this.opQtdeItemNovo === '') {
      alert('Dados incompletos');
      return true;
    }
    const objInc = {
      'filial': this.opFilial,
      'op': this.opCodigo,
      'componente': this.opItemNovo,
      'qtde': xcQtde,
    }
    this.fj.execProd('spcp_inclui_empenho', objInc);
    window.location.reload();
  }



  enableEditUser(e, i) {
    this.enableEditIndex = i;
    // (<HTMLInputElement>(document.getElementById("editQtd"))).focus()
  }

  // edita a quantidade do empenho da OP
  altQtde(xaRow) {
    let qdt = (<HTMLInputElement>(document.getElementById("editQtd"))).value.replace(',', '.')
    const objAlt = {
      'filial': this.opFilial,
      'op': this.opCodigo,
      'produto': this.opProduto,
      'componente': xaRow.componente,
      'qtde': parseFloat(qdt),
    }
    this.fj.execProd('spcp_altera_qtde_informada', objAlt);

    this.enableEdit = false;
    this.enableEditIndex = null;
    window.location.reload();
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

  btnDisable(aRow, tp) {
    let lRet = true


    // lRet = aRow.SITUACAO === "Baixada";
    if (tp != 'd') {
      lRet = ("Baixada ").indexOf(aRow.SITUACAO) > -1;
    }
    if (tp === 'a') {
      lRet = lRet === false ? lRet : (('Administrador | Apontador | Conferente-Apontador').indexOf(this.aUsr.perfil) > -1);
    }
    if (tp === 'c') {
      lRet = lRet === false ? lRet : (('Administrador | Conferente | Conferente-Apontador').indexOf(this.aUsr.perfil) > -1);
    }
    if (tp === 'd') {
      lRet = ("Liberada ").indexOf(aRow.SITUACAO) > -1;
      lRet = lRet === false ? lRet : (('Administrador | Conferente | Conferente-Apontador').indexOf(this.aUsr.perfil) > -1);
    }
    return !lRet
  }

  btnEditDisable(aRow) {
    return aRow.SITUACA === 'A'
  }


  // tecla para retorno de tela
  voltaResumo() {
    this.router.navigate(['opResumo']);
  }

}
