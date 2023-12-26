import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { funcsService } from 'app/funcs/funcs.service';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';

// tslint:disable-next-line:class-name
export interface opConfirma {
  COMPONENTE: string;
  DESCRIC: string;
  QTDEORI: string;
  SALDO: string;
  ROTEIRO: string;
  OPERACAO: string;
}

@Component({
  selector: 'app-opconfirma',
  templateUrl: './opconfirma.component.html',
  styleUrls: ['./opconfirma.component.css']
})

export class OpconfirmaComponent implements OnInit {
  aUsr = JSON.parse(localStorage.getItem('user'))[0];
  arrUserLogado = JSON.parse(localStorage.getItem('user'))[0];
  numOP = JSON.parse(localStorage.getItem('op'));
  opPcf = JSON.parse(localStorage.getItem('opPcf'));
  parcialAtivo: boolean = ('Interrompida | Produção').indexOf(this.numOP[0].SITUACAO) > -1;
  arrOpAndA: any = [];
  arrOpAndB: any = [];
  a01: any = [];
  a02: any = [];
  a03: any = [];
  arrOpconfirma: any = [];
  arrOpconfirmaTab: any = [];
  arrEstrutura: any = [];
  arrEstruturaTab: any = [];
  objParcial: any = [];
  objLote: any = [];
  objTotal: any = [];
  arrLote: any = [];
  arrLoteTab: any = [];
  temLote: boolean = true;
  opFilial: string = '';
  opCodigo: string = '';
  opEmissao: string = '';
  opFinal: string = '';
  opProduto: string = '';
  opDescricao: string = '';
  opOperacao: string = '';
  opRecurso: string = '';
  opCodant: string = '';
  opQtde: string = '';
  opEntregue: string = '';
  opQtdeEntregue: string = '';
  opQtdePcf: string = '';
  opQtdeParcial: number = 0;
  opMaxQtd: number = 0;
  opRetrabalho: string = '';
  opHoras: string = '';
  ltcrevisao: string = '';
  ltclote: string = '';
  ltcvalidade: string = '';
  ltcquebra: string = '';
  ltcnivel: string = '';
  ltcqtLote: string = '';
  ltcobs: string = '';
  enableEdit: boolean = false;
  enableEditIndex = null;
  editQtd: any = 0;
  btnParcial: boolean = true;

  opconfirmas: Observable<any>;
  displayedColumns: string[] = ['COMPONENTE', 'DESCRIC', 'UNIDADE', 'QTDEORI', 'QTDCALCULADA', 'SITUACA', 'EDICAO', 'SALDO', 'TIPO'];
  dataSource: MatTableDataSource<opConfirma>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    public router: Router,
    private fj: funcsService,
  ) { }

  ngOnInit(): void {
    if (('Administrador | Conferente | Conferente-Apontador').indexOf(this.aUsr.perfil) > -1) {
      this.buscaOpsAndamentoProtheus();
      this.confirmaLote();
    } else {
      alert('Sem Acesso');
      this.router.navigate(['opResumo']);
    }

  }

  voltaResumo() {
    this.router.navigate(['opResumo']);
  }

  reabrOp() {
    const objConf = {
      'FILIAL': this.opFilial,
      'OP': this.opCodigo,
      'PRODUTO': 'this.opProduto',
      'DESCPROD': 'this.opDescricao',
      'CODANT': 'this.opCodant',
      'COMPONENTE': 'xy.COMPONENTE',
      'DESCCOMP': 'xy.DESCRIC',
      'TIPO': 'tudo',
      'SITUACA': 'V',
      'UNIDADE': 'xy.UNIDADE',
      'QTDEPCF': 0,
      'QTDEINF': 0,
    }
    this.fj.execProd('calcOP', objConf);
    window.location.reload();
  }


  buscaOpsAndamentoProtheus() {

    this.arrOpAndA = this.fj.buscaPrt('ordemProducaoAndamento', {});

    this.arrOpAndA.subscribe(x => {
      x.forEach(xy => {
        this.arrOpAndB.push({
          'filial': xy.FILIAL,
          'op': xy.OP,
          'emissao': xy.EMISSAO,
          'qtde': xy.QTDE,
          'entregue': xy.ENTREGUE,
          'final': xy.FINAL,
        })
      });
      this.buscaOpconfirma();

    });
  }

  buscaOpconfirma() {
    let conta = 0;
    let secs = 0;
    let retr = 0;
    let oper = '00';
    let grupo = '';
    let xcFilial = this.numOP[0].FILIAL;
    let xcOp = this.numOP[0].OP;

    const obj = {
      filial: xcFilial,
      op: xcOp,
      tipo: 'tudo',
    };

    this.arrOpconfirma = this.fj.buscaPrt('opAndamento', obj);

    const filOP = this.arrOpAndB.filter(x => (x.filial === xcFilial && x.op === xcOp))[0];


    this.arrOpconfirma.subscribe(x => {
      x.forEach(xy => {
        this.arrOpconfirmaTab.push({
          'COMPONENTE': xy.COMPONENTE,
          'DESCRIC': xy.DESCRIC,
          'UNIDADE': xy.UNIDADE,
          'QTDEORI': xy.QTDEORI,
          'QTDECALC': xy.QTDECAL,
          'SALDO': xy.SALDO,
          'SITUACA': xy.SITUDESC,
          'TIPO': xy.TIPO,
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
          this.opOperacao = this.numOP[0].OPERACAO;
          this.opRecurso = this.numOP[0].RECURSO;
          this.opQtde = filOP.qtde;
          this.opQtdeEntregue = filOP.entregue;

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
          if (parseFloat(this.opQtdePcf) > 0) {
            this.opQtdeParcial = Math.round((parseFloat(this.opQtdePcf) - parseFloat(this.opQtdeEntregue)) * 10000) / 10000
            // this.opQtdeParcial = parseFloat(this.opQtdePcf) - parseFloat(this.opQtdeEntregue);
            this.opMaxQtd = parseFloat(this.opQtdePcf) - parseFloat(this.opQtdeEntregue);
          }
          this.opRetrabalho = String(retr)
          this.opHoras = this.fj.toHHMMSS(secs)
          oper = '00'
        }
      });
      this.dataSource = new MatTableDataSource(this.arrOpconfirmaTab)
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

  }

  enableEditUser(e, i) {
    this.enableEditIndex = i;
  }

  altQtde() {
    let qdt = (<HTMLInputElement>(document.getElementById("editQtd"))).value
    this.arrOpconfirmaTab[this.enableEditIndex].QTDECALC = qdt
    this.enableEdit = false;
    this.enableEditIndex = null;
  }

  // verifica se tem lote para o produto selecionado
  confirmaLote() {
    this.arrLote = this.fj.buscaPrt('relacaoProdLote', { 'produto': this.numOP[0].CODPROD });
    this.arrLoteTab = []
    this.temLote = false

    this.arrLote.subscribe(x => {
      x.forEach(xy => {
        if (xy.ativo == 'SIM') {
          this.ltcrevisao = xy.revisao;
          this.ltclote = xy.lote;
          this.ltcvalidade = xy.validade;
          this.ltcquebra = xy.quebra;
          this.ltcnivel = xy.nivel;
          this.ltcqtLote = xy.qtde;
          this.ltcobs = xy.obs;
          this.temLote = true;
        }
      });
    });
  }


  prodParcialOp() {
    const nQtdeLen = this.numOP.length - 1
    let cLoc: string = this.opFilial === '108' ? '99' : '01';
    const datApt = this.opPcf.filter(x => (x.FILIAL === this.opFilial && x.OP === this.opCodigo));
    this.parcialAtivo = false;
    if (this.temLote) {
      if (this.opQtdeParcial > 0) {
        if (Math.round(this.opMaxQtd * 10000) / 10000 > this.opQtdeParcial) {
          const obj = {
            cFilialOp: this.opFilial,
            cNumOp: this.opCodigo,
            cC2Prod: this.opProduto,
            cC2Local: cLoc,
            cDocAjst: 'DOCPARCI',
            nC2QtdOri: this.opQtde,
            nC2QtdAjst: this.opQtdePcf,
            cTipoProd: 'P',
            nQtdEntrg: this.opQtdeParcial,
            cOperacao: this.numOP[nQtdeLen].OPERACAO,
            cRecurso: this.numOP[nQtdeLen].RECURSO,
            dDataApt: datApt[0].APT,
            ItensD4: []
          };

          this.objParcial = {
            filial: this.opFilial,
            op: this.opCodigo,
            qtde: this.opQtdeParcial,
            tipo: 'P',
            usrProd: this.aUsr.codUser,
            fechamento: 'automatico',
          };

          this.objLote = {
            'filial': this.opFilial,
            'op': this.opCodigo,
            'produto': this.opProduto,
            'descricao': this.opDescricao,
            'revisao': this.ltcrevisao,
            'lote': this.ltclote,
            'validade': this.ltcvalidade,
            'quebra': this.ltcquebra,
            'nivel': this.ltcnivel,
            'qtde': this.opQtdeParcial,
            'obs': this.ltcobs,
            'caracGeral': this.aUsr.codUser,
            'cTipo': 'P',
          }
          const retProd = this.fj.prodOP(obj);
          retProd.subscribe(x => {
            alert(x.Sucesso.substring(2, 60))
            if (x.Sucesso === "T/Apontamento parcial efetuado com Sucesso!") {
              this.fj.execProd('produzOP', this.objParcial);
              if (this.opFilial == '108') {
                this.fj.execProd('manuLote', this.objLote);
              }
              this.parcialAtivo = true;
            }

            window.location.reload();
          });
        } else {
          if (Math.round(this.opMaxQtd * 10000) / 10000 == this.opQtdeParcial) {
            if (Math.round(this.opMaxQtd * 10000) / 10000 > 0.1) {
              this.opQtdeParcial = this.opMaxQtd - 0.1;
            }
            alert('Não pode zerar a OP no apontamento Parcial!!!')
            this.parcialAtivo = true;
          } else {
            alert('Quantidade maior que a produzida!!!')
            this.opQtdeParcial = Math.round((parseFloat(this.opQtdePcf) - parseFloat(this.opQtdeEntregue)) * 10000) / 10000;
            this.parcialAtivo = true;
          }
        }
      } else {
        alert('Quantidade igual a zero!!!');
        this.parcialAtivo = true;
      }
    } else {
      alert('Não existe Lote atribuído para este produto')
      window.location.reload();
    }



  }

  prodTotalOp() {
    let temSaldo = true
    let ajustado = true
    let arrItens = []
    const nQtdeLen = this.numOP.length - 1
    let cLoc: string = this.opFilial === '108' ? '99' : '01';;
    this.arrOpconfirmaTab.forEach(xl => {
      if (('M3 | H | ').indexOf(xl.UNIDADE) === -1 && xl.SALDO < xl.QTDECALC && xl.TIPO !== 'R') {
        temSaldo = false
      }
      if (xl.SITUACA !== 'Ajustada') {
        ajustado = false
      }
      if ((xl.QTDEORI == 0 && xl.QTDECALC > 0) || (xl.QTDEORI > 0 && xl.QTDECALC == 0) || (xl.QTDEORI != 0 && xl.QTDECALC != 0)) {
        arrItens.push({
          'cD4CodPrd': xl.COMPONENTE,
          'cD4Local': cLoc,
          'nD4QtdOri': xl.QTDEORI,
          'nD4QtdAjst': xl.QTDECALC,
          'cTpComp': xl.TIPO,
          'cRoteiro': "01"
        })
      }
    });

    if (this.temLote) {
      if (ajustado) {
        if (temSaldo) {
          const datApt = this.opPcf.filter(x => (x.FILIAL === this.opFilial && x.OP === this.opCodigo));

          const obj = {
            cFilialOp: this.opFilial,
            cNumOp: this.opCodigo,
            cC2Prod: this.opProduto,
            cC2Local: cLoc,
            cDocAjst: 'DOCTOTAL',
            nC2QtdOri: this.opQtde,
            nC2QtdAjst: this.opQtdePcf,
            cTipoProd: 'T',
            nQtdEntrg: Math.round((parseFloat(this.opQtdePcf) - parseFloat(this.opQtdeEntregue)) * 10000) / 10000,
            cOperacao: this.numOP[nQtdeLen].OPERACAO,
            cRecurso: this.numOP[nQtdeLen].RECURSO,
            dDataApt: datApt[0].APT,
            ItensD4: arrItens
          };

          this.objLote = {
            'filial': this.opFilial,
            'op': this.opCodigo,
            'produto': this.opProduto,
            'descricao': this.opDescricao,
            'revisao': this.ltcrevisao,
            'lote': this.ltclote,
            'validade': this.ltcvalidade,
            'quebra': this.ltcquebra,
            'nivel': this.ltcnivel,
            'qtde': this.opQtdeParcial,
            'obs': this.ltcobs,
            'usuario': this.aUsr.codUser,
            'cTipo': 'T',
          }

          this.objTotal = {
            filial: this.opFilial,
            op: this.opCodigo,
            qtde: this.opQtdeParcial,
            tipo: 'T',
            usrProd: this.aUsr.codUser,
            fechamento: 'automatico',
          };
          const retProd = this.fj.prodOP(obj);
          retProd.subscribe(x => {
            alert(x.Sucesso.substring(2, 60))
            if (x.Sucesso === "T/Documento ajustado e apontado com Sucesso!") {
              this.fj.execProd('produzOP', this.objTotal)
              if (this.opFilial == '108') {
                this.fj.execProd('manuLote', this.objLote);
              }
            }
            
            window.location.reload();
          });
        } else {
          alert('Itens com saldo insuficiente!')
        }
      } else {
        alert('Itens sem ajuste pelo apontado!')
      }
      alert('Não existe Lote atribuído para este produto')
    }
  }


  // aplicar o filtro ao digitar na tela dos itens
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // função para exportar todos os registros para o excel
  exportExcel(fileName, sheetName) {
    const fn = fileName + '.xlsx';
    const sn = sheetName;
    const workSheet = XLSX.utils.json_to_sheet(this.dataSource.data, { header: [] });
    const workBook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, sn);
    XLSX.writeFile(workBook, fn);
  }

}
