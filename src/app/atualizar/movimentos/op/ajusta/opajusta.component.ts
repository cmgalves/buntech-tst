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
  arrUserLogado = JSON.parse(localStorage.getItem('user'))[0];
  aOP = JSON.parse(localStorage.getItem('op'));
  numOP = JSON.parse(localStorage.getItem('op'));
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
  displayedColumns: string[] = ['componente', 'descEmp', 'unidade', 'qtdeEmp', 'qtdeEmpCalc', 'qtdeInformada', 'qtdeConsumida', 'situaca', 'edicao'];
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
    if (('Administrador | Apontador | Conferente-Apontador').indexOf(this.arrUserLogado.perfil) > -1) {
      this.buscaOpajusta();
      // this.buscaOpsAndamentoProtheus();
      this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value))
      );
    } else {
      alert('Sem Acesso')
      this.router.navigate(['opResumo']);
    }

  }

  buscaOpajusta() { //View_Portal_OP
    let x = 0;
    let xcFilial = this.aOP.filial;
    let xcOp = this.aOP.op;
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
          vencimento: xy.vencimento,
          qtdeEmp: xy.qtdeEmp,
          qtdeEmpCalc: xy.qtdeEmpCalc,
          qtdeInformada: xy.qtdeEmpCalc,
          qtdeConsumida: xy.qtdeConsumida,
          saldo: xy.saldo,
          tipo: xy.tipo,
          situacao: xy.situacao,
        })
        if (x === 1) {
          this.opFilial = this.aOP.filial;
          this.opCodigo = this.aOP.op;
          this.opProduto = this.aOP.produto;
          this.opDescricao = this.aOP.descricao;
          this.opQtdePcf = this.fg.formatarNumero(this.aOP.qtdeLote);
          this.opEmissao = xy.emissao;
          this.opFinal = xy.vencimento;
        }
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

  // confirma o ajuste feito na op para enviar para o conferente
  confirmar() {
    const objConf = {
      'FILIAL': this.opFilial,
      'OP': this.opCodigo,
      'PRODUTO': 'this.opProduto',
      'DESCPROD': 'this.opDescricao',
      'CODANT': 'this.opCodant',
      'COMPONENTE': 'xy.COMPONENTE',
      'DESCCOMP': 'xy.DESCRIC',
      'TIPO': 'tudo',
      'SITUACA': 'A',
      'UNIDADE': 'xy.UNIDADE',
      'QTDEPCF': 0,
      'QTDEINF': 0,
    }
    this.fj.execProd('calcOP', objConf);
    window.location.reload();
  }

  // cálculo da op utilizando a nova quantidade produzida
  calcOp() {
    const obj = {
      filial: this.numOP[0].FILIAL,
      op: this.numOP[0].OP,
      tipo: 'tudo',
    };
    this.arrCalcOP = this.fj.buscaPrt('opAndamento', obj);
    this.arrCalcOP.subscribe(cada => {
      cada.forEach(xy => {
        this.calculaMod = xy.XMOD
        if (xy.SITUACA === 'W' || xy.SITUACA === 'V' || xy.SITUACA === 'P') {
          const objProc = {
            'FILIAL': this.opFilial,
            'OP': this.opCodigo,
            'PRODUTO': this.opProduto,
            'DESCPROD': this.opDescricao,
            'CODANT': this.opCodant,
            'COMPONENTE': xy.COMPONENTE,
            'DESCCOMP': xy.DESCRIC,
            'TIPO': xy.TIPO,
            'SITUACA': 'C',
            'UNIDADE': xy.UNIDADE,
            'QTDEPCF': this.opQtdePcf,
            'QTDEINF': 0,
          }
          this.fj.execProd('calcOP', objProc);
        }
      });
      if (this.opRetrabalho > 0) {
        this.calcRet();
      }
      if (this.calculaMod !== '0') {
        this.calcMod();
      } else {
        window.location.reload();
      }
    });

    // this.buscaProduto()
  }

  // calcula o item de retrabalho na op
  calcRet() {
    const filProd = this.arrProd.filter(x => x.codigo == this.opProduto)[0];
    if (filProd.retrabalho !== '') {
      const filRet = this.arrProd.filter(x => x.codigo == filProd.retrabalho)[0]
      const objRet = {
        'FILIAL': this.opFilial,
        'OP': this.opCodigo,
        'PRODUTO': this.opProduto,
        'DESCPROD': this.opDescricao,
        'CODANT': this.opCodant,
        'COMPONENTE': filRet.codigo,
        'DESCCOMP': filRet.descricao,
        'TIPO': 'R',
        'SITUACA': 'C',
        'UNIDADE': filRet.unidade,
        'QTDEPCF': this.opQtdePcf,
        'QTDEINF': this.opRetrabalho,
      }
      this.fj.execProd('calcOP', objRet);
    } else {
      alert('o produto: ' + filProd.codigo + ' não tem cadastro de Retrabalho')
    }
  }

  // calcula a mão de obra e o ggf na OP
  calcMod() {
    let completaCusto = '';
    // let idxMod = 0;
    this.arrMod = [];
    this.numOP.forEach(ax => {
      const y = this.arrRecurso.filter(x => x.filial === ax.FILIAL && x.codigo === ax.RECURSO);

      if (completaCusto.indexOf(y[0].custo) === -1) {
        completaCusto += '--' + y[0].custo
        this.arrMod.push({
          "filial": ax.FILIAL,
          "op": ax.OP,
          "cc": y[0].custo,
          "segundos": ax.SEGUNDOS
        })

      } else {
        this.arrMod.forEach((kk, ik) => {
          if (kk.cc === y[0].custo) {
            this.arrMod[ik].segundos += ax.SEGUNDOS
          }
        });
      }

    });

    this.arrMod.forEach(ay => {
      const filProd = this.arrProd.filter(x => (x.codigo.substring(3, 10) == ay.cc && x.codigo.substring(0, 3) !== 'GAS') || (x.mdo.substring(3, 10) == ay.cc));
      filProd.forEach(yy => {
        const objMod = {
          'FILIAL': this.opFilial,
          'OP': this.opCodigo,
          'PRODUTO': this.opProduto,
          'DESCPROD': this.opDescricao,
          'CODANT': this.opCodant,
          'COMPONENTE': yy.codigo,
          'DESCCOMP': yy.descricao,
          'TIPO': 'M',
          'SITUACA': 'C',
          'UNIDADE': yy.unidade,
          'QTDEPCF': this.opQtdePcf,
          'QTDEINF': (ay.segundos / 3600),
        }
        this.fj.execProd('calcOP', objMod);
      });

    });
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
      'FILIAL': this.opFilial,
      'OP': this.opCodigo,
      'PRODUTO': this.opProduto,
      'DESCPROD': this.opDescricao,
      'CODANT': this.opCodant,
      'COMPONENTE': this.opItemNovo,
      'DESCCOMP': this.opDescItemNovo,
      'TIPO': Tipo,
      'SITUACA': 'C',
      'UNIDADE': this.opUnidadeItemNovo,
      'QTDEPCF': this.opQtdePcf,
      'QTDEINF': String(xcQtde),
    }
    this.fj.execProd('calcOP', objInc);
    window.location.reload();
  }



  buscaOpsAndamentoProtheus() {
    this.arrOpAndA = this.fj.buscaPrt('ordemProducaoAndamento', {});
    this.arrOpAndA.subscribe(cada => {
      cada.forEach(xy => {
        this.arrOpAndB.push({
          'filial': xy.FILIAL,
          'op': xy.OP,
          'emissao': xy.EMISSAO,
          'qtde': xy.QTDE,
          'entregue': xy.ENTREGUE,
          'final': xy.FINAL,
        })
      });
    });
  }

  buscaOpajustas() { //View_Portal_OP
    let xcFilial = this.aOP.filial;
    let xcOp = this.aOP.op;
    const obj = {
      filial: xcFilial,
      op: xcOp,
    };
    this.arrOpajusta = [];
    this.arrOpajusta = this.fj.buscaPrt('pcpRelacaoLoteOpEmpenho', obj); //vw_pcp_relacao_lote_op_empenho

    this.arrOpajusta.subscribe(cada => {
      cada.forEach(xy => {
        this.arrOpajustaTab.push({
          componente: xy.componente,
          descEmp: xy.descEmp,
          unidade: xy.unidade,
          qtdeEmp: xy.qtdeEmp,
          qtdeEmpCalc: xy.qtdeEmpCalc,
          saldo: xy.saldo,
          tipo: xy.tipo,
          situacao: xy.situacao,
        })
      });
      this.opFilial = this.aOP.filial;
      this.opCodigo = this.aOP.op;
      this.opProduto = this.aOP.produto;
      this.opDescricao = this.aOP.descricao;
      this.opQtde = this.aOP.qtdeLote

      this.dataSource = new MatTableDataSource(this.arrOpajustaTab)
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

  }
  buscaOpajustasxx() {
    let conta = 0
    let secs = 0;
    let retr = 0;
    let grupo = '';
    let oper = '00';
    let xcFilial = this.numOP[0].FILIAL;
    let xcOp = this.numOP[0].OP;
    const obj = {
      filial: xcFilial,
      op: xcOp,
    };

    const filOP = this.arrOpAndB.filter(x => (x.filial === xcFilial && x.op === xcOp))[0];

    this.arrOpajusta = this.fj.buscaPrt('opAndamento', obj);

    this.arrOpajusta.subscribe(cada => {
      cada.forEach(xy => {
        this.arrOpajustaTab.push({
          'COMPONENTE': xy.COMPONENTE,
          'DESCRIC': xy.DESCRIC,
          'UNIDADE': xy.UNIDADE,
          'QTDEORI': xy.QTDEORI,
          'QTDECALC': xy.QTDECAL,
          'SALDO': xy.SALDO,
          'SITUACA': xy.SITUDESC,
          'OPERACAO': xy.OPERACAO,

        })
        if (conta === 0) {
          conta++
          this.opFilial = xy.FILIAL;
          this.opCodigo = xy.OP;
          this.opEmissao = filOP.emissao;
          this.opFinal = filOP.final;
          this.opProduto = xy.PRODUTO;
          this.opDescricao = xy.DESCRICAO;
          this.opQtde = filOP.qtde;
          this.opEntregue = filOP.entregue;
          this.numOP.forEach(ax => {
            if (ax.OPERACAO >= oper) {
              if (ax.GRUPO === '') {
                this.opQtdePcf = ax.QTDEPCF
              } else {
                if (grupo === '') {
                  this.opQtdePcf = ax.QTDEPCF
                } else {
                  if (grupo === ax.GRUPO) {
                    this.opQtdePcf += ax.QTDEPCF
                  } else {
                    this.opQtdePcf = ax.QTDEPCF
                  }
                }
              }
              oper = ax.OPERACAO
              grupo = ax.GRUPO
            }
            secs += ax.SEGUNDOS
            retr = ax.RETRABALHO
          });
          this.opRetrabalho = String(retr)
          let horas = this.fj.toHHMMSS(secs)
          this.opHoras = horas.length === 2 ? '00:00:' + horas : horas.length === 5 ? '00:' + horas : horas //          ('00:00:00' + horas)
          oper = '00'
        }
      });
      this.dataSource = new MatTableDataSource(this.arrOpajustaTab)
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

  }

  enableEditUser(e, i) {
    this.enableEditIndex = i;
    // (<HTMLInputElement>(document.getElementById("editQtd"))).focus()
  }

  // edita a quantidade do empenho da OP
  altQtde(xaRow) {
    let qdt = (<HTMLInputElement>(document.getElementById("editQtd"))).value.replace(',', '.')
    this.arrOpajustaTab[this.enableEditIndex].QTDECALC = qdt
    const objAlt = {
      'FILIAL': this.opFilial,
      'OP': this.opCodigo,
      'PRODUTO': this.opProduto,
      'DESCPROD': this.opDescricao,
      'CODANT': this.opCodant,
      'COMPONENTE': xaRow.COMPONENTE,
      'DESCCOMP': xaRow.DESCRIC,
      'TIPO': 'M',
      'SITUACA': 'K',
      'UNIDADE': xaRow.UNIDADE,
      'QTDEPCF': this.opQtdePcf,
      'QTDEINF': parseFloat(qdt),
    }
    this.fj.execProd('calcOP', objAlt);

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
      lRet = lRet === false ? lRet : (('Administrador | Apontador | Conferente-Apontador').indexOf(this.arrUserLogado.perfil) > -1);
    }
    if (tp === 'c') {
      lRet = lRet === false ? lRet : (('Administrador | Conferente | Conferente-Apontador').indexOf(this.arrUserLogado.perfil) > -1);
    }
    if (tp === 'd') {
      lRet = ("Liberada ").indexOf(aRow.SITUACAO) > -1;
      lRet = lRet === false ? lRet : (('Administrador | Conferente | Conferente-Apontador').indexOf(this.arrUserLogado.perfil) > -1);
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
