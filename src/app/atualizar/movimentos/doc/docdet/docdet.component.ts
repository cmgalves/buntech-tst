import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { funcsService } from 'app/shared/funcs/funcs.service';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { MatDialog } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';

// tslint:disable-next-line:class-name
export interface opDocdet {
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
  selector: 'app-docdet',
  templateUrl: './docdet.component.html',
  styleUrls: ['./docdet.component.css']
})

export class DocdetComponent implements OnInit {
  arrUserLogado = JSON.parse(localStorage.getItem('user'))[0];
  arrOpAnd: any = []; //JSON.parse(localStorage.getItem('user'))[0];
  arrOpPcf: any = []; //JSON.parse(localStorage.getItem('user'))[0];
  xcFilial: any = this.arrUserLogado.empresa
  xcPerfil: any = this.arrUserLogado.perfil
  dadosDoc = JSON.parse(localStorage.getItem('dadosDoc'));

  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;
  opFilial: string = '';
  opItemNovo: string = '';
  opDescItemNovo: string = '';
  opQtdeItemNovo: string = '';

  opCodigo: string = '';
  opEmissao: string = '';
  opDataDoc: string = '';
  opFinal: string = '';
  opProduto: string = '';
  opDescricao: string = '';
  opCodant: string = '';
  opQtde: string = '';
  opEntregue: string = '';
  opQtdePcf: string = '';
  opRetrabalho: string = '';
  opHoras: string = '';
  opFilter: any = ''
  arrRecA: any = [];
  arrRecB: any = [];
  arrProdA: any = [];
  arrProdB: any = [];
  arrOpAndA: any = [];
  arrOpAndB: any = [];
  arrDocdet886: any = [];
  arrDocdet887: any = [];
  arrDocdet888: any = [];
  arrDocdetTab: any = [];
  arrFilial: any = ['101', '107', '117', '402', '108', '206']
  optProcesso: string[] = this.retArrayProcesso()
  optLider: string[] = this.retArrayLider()
  valclotea: string = ' ';
  valcloteb: string = ' ';
  valclotec: string = ' ';
  valcloted: string = ' ';
  valclotee: string = ' ';
  valclotef: string = ' ';
  valcloteg: string = ' ';
  valcloteh: string = ' ';
  valclotei: string = ' ';
  valclotej: string = ' ';
  valclotek: string = ' ';
  valclotel: string = ' ';
  valnlotea: string = '0';
  valnloteb: string = '0';
  valnlotec: string = '0';
  valnloted: string = '0';
  valnlotee: string = '0';
  valnlotef: string = '0';
  valnloteg: string = '0';
  valnloteh: string = '0';
  valnlotei: string = '0';
  valnlotej: string = '0';
  valnlotek: string = '0';
  valnlotel: string = '0';
  valTurno1: string = 'N';
  valTurno2: string = 'N';
  valTurno3: string = 'N';
  valProcesso: string = '';
  valLider: string = '';
  valobserv: string = ' ';

  mostraInc: boolean = false;
  enableEdit: boolean = false;
  enableEditIndex = null;
  editQtd: number = 0;


  // Campina Grande - 888
  // Servidor de HML:10.3.0.92
  // Filiais:101,107,117,402

  // Boa vista - 886
  // Servidor de HML:10.1.0.250
  // Filiais:108


  // Indaiatuba - 887
  // Servidor de HML: 10.3.0.204
  // Filiais:206


  docdets: Observable<any>;
  displayedColumns: string[] = ['SEQ', 'CODPROD', 'DESCRICAO', 'QTDE', 'QTDECAL', 'LOTEOP', 'EDICAO', 'APONTA', 'ATIVO', 'APT'];
  dataSource: MatTableDataSource<opDocdet>;
  dataExcel: MatTableDataSource<opDocdet>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    public router: Router,
    private funcJson: funcsService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.buscaDocsOps();
  }

  // busca os produtos no cadastro para utilizar os dados necessários
  buscaDocsOps() {
    const codPro = this.dadosDoc.CODPROD;
    const dt = this.dadosDoc.DATADOC.split('/');
    const datadoc = dt[2] + dt[1] + dt[0];
    let seq = 0;

    const obj = {
      'filial': this.dadosDoc.FILIAL,
      'op': this.dadosDoc.OP,
      'datadoc': datadoc
    };
    this.arrOpAndA = this.funcJson.busca883('documentosOpLista', obj);

    this.arrOpAndA.subscribe(cada => {
      this.arrOpAndB = [];
      cada.forEach(xy => {
        seq++
        this.arrOpAndB.push({
          'SEQ': seq,
          'FILIAL': xy.itfilial,
          'OP': xy.itop,
          'CODPROD': xy.itcomp,
          'DESCRICAO': xy.itdesc,
          'QTDE': xy.itqtdeorig,
          'QTDECAL': xy.itqtdeinfo,
          'EMISSAO': xy.emissao,
          'DATADOC': xy.itdatadoc,
          'LOTEOP': xy.lotenotaop,
          'APONTA': xy.itaponta === 'N' ? 'Não' : 'Sim',
          'ATIVO': xy.itdel === 'N' ? 'Não' : 'Sim',
        })
        if (seq === 1) {
          this.opFilial = this.dadosDoc.FILIAL;
          this.opCodigo = this.dadosDoc.OP;
          this.opDataDoc = this.dadosDoc.DATADOC
          this.opFinal = this.dadosDoc.FINAL;
          this.opProduto = codPro;
          this.opDescricao = this.dadosDoc.DESCRICAO;
          this.opQtde = this.dadosDoc.QTDE;
          this.valclotea = xy.clotea;
          this.valcloteb = xy.cloteb;
          this.valclotec = xy.clotec;
          this.valcloted = xy.cloted;
          this.valclotee = xy.clotee;
          this.valclotef = xy.clotef;
          this.valcloteg = xy.cloteg;
          this.valcloteh = xy.cloteh;
          this.valclotei = xy.clotei;
          this.valclotej = xy.clotej;
          this.valclotek = xy.clotek;
          this.valclotel = xy.clotel;
          this.valnlotea = xy.nlotea;
          this.valnloteb = xy.nloteb;
          this.valnlotec = xy.nlotec;
          this.valnloted = xy.nloted;
          this.valnlotee = xy.nlotee;
          this.valnlotef = xy.nlotef;
          this.valnloteg = xy.nloteg;
          this.valnloteh = xy.nloteh;
          this.valnlotei = xy.nlotei;
          this.valnlotej = xy.nlotej;
          this.valnlotek = xy.nlotek;
          this.valnlotel = xy.nlotel;
          this.valLider = xy.lider;
          this.valProcesso = xy.processo;
          this.valobserv = xy.observ;
          this.valTurno1 = xy.turno1;
          this.valTurno2 = xy.turno2;
          this.valTurno3 = xy.turno3;
        }

      });

      this.dataSource = new MatTableDataSource(this.arrOpAndB)

    });

  }


  enableEditUser(e, i) {
    this.enableEditIndex = i;
    // (<HTMLInputElement>(document.getElementById("editQtd"))).focus()
    console.log(i, e)
  }

  // edita a quantidade do empenho da OP
  altLinha(xaRow) {
    let xnQtde = (<HTMLInputElement>(document.getElementById("editQtd"))).value.replace(',', '.')
    let xcLote = (<HTMLInputElement>(document.getElementById("editLote"))).value.replace(',', '.')
    const arrData = this.opDataDoc.split('/')

    const obj = {
      'tipo': 2,
      'filial': this.opFilial,
      'op': this.opCodigo,
      'datadoc': arrData[2] + arrData[1] + arrData[0],
      'qtdeinfo': xnQtde,
      'itComp': xaRow.CODPROD,
      'itlote': xcLote,
    }
    this.funcJson.execProd('atualizaDoc', obj);

    this.enableEdit = false;
    this.enableEditIndex = null;
    this.buscaDocsOps();
    // window.location.reload();
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

  voltaDoclista() {
    this.router.navigate(['doclista']);
  }



  criaDocumento(xnTipo) {
    const arrData = this.opDataDoc.split('/')
    if (this.funcJson.validDataFormat(this.opDataDoc)) {
      if (xnTipo === 1) {
        let obj = {
          'tipo': xnTipo,
          'filial': this.opFilial,
          'op': this.opCodigo,
          'datadoc': arrData[2] + arrData[1] + arrData[0],
          'qtdeinfo': 0,
          'itComp': ' ',
          'itlote': ' ',
        }
        this.funcJson.execProd('atualizaDoc', obj);
        this.buscaDocsOps();
        // window.location.reload();
      } else {
        let obj = {
          'tipo': xnTipo,
          'filial': this.opFilial,
          'op': this.opCodigo,
          'datadoc': arrData[2] + arrData[1] + arrData[0],
          'qtdeinfo': 0,
          'itComp': ' ',
          'itlote': ' ',
        }
        this.funcJson.execProd('atualizaDoc', obj);
        this.buscaDocsOps();
        // window.location.reload();
      }
    }

  }


  // valida a inclusão dos novos itens na OP
  aposSelec(event) {
    const codProd = event.option.value
    const filProd = this.arrProdB.filter(x => (x.codigo === codProd))[0];

    if (filProd.length === 0) {
      alert(codProd + ' não encontrado no cadastro de produtos');
    } else {
      this.opItemNovo = filProd.codigo
      this.opDescItemNovo = filProd.descricao
      // this.tstTrue = true
    }
  }

  mostraInclusao() {
    this.mostraInc = !this.mostraInc
    if (this.mostraInc) {
      this.buscaProdutos();
    }
  }


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
          })
        }
      });
      this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value))
      );
      // this.buscaOpsAndamentoProtheus();
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.arrProdB.filter(option => option.codigo.toLowerCase().indexOf(filterValue) === 0);
  }

  // inclusão de novos itens na OP
  incProd() {
    const arrData = this.opDataDoc.split('/')
    let xcQtde = 0
    if (this.opItemNovo === '' || this.opDescItemNovo === '') {
      alert('Dados incompletos');
      return true;
    }
    if (this.opQtdeItemNovo === '') {
      xcQtde = 0
    } else {
      xcQtde = parseFloat(this.opQtdeItemNovo)
    }
    const obj = {
      'tipo': 3,
      'filial': this.opFilial,
      'op': this.opCodigo,
      'datadoc': arrData[2] + arrData[1] + arrData[0],
      'qtdeinfo': xcQtde,
      'itComp': this.opItemNovo,
      'itlote': ' ',
    }
    this.funcJson.execProd('atualizaDoc', obj);
    this.buscaDocsOps();
    // window.location.reload();
}

  // Altera se deseja fazer apontamento ou não
  aptLinha(xaRow) {
    const arrData = this.opDataDoc.split('/')
    const obj = {
      'tipo': 4,
      'filial': this.opFilial,
      'op': this.opCodigo,
      'datadoc': arrData[2] + arrData[1] + arrData[0],
      'qtdeinfo': 0,
      'itComp': xaRow.CODPROD,
      'itlote': ' ',
    }
    this.funcJson.execProd('atualizaDoc', obj);
    this.buscaDocsOps();
    // window.location.reload();
}

  // Altera se deseja fazer apontamento ou não
  delLinha(xaRow) {
    const arrData = this.opDataDoc.split('/')
    const obj = {
      'tipo': 5,
      'filial': this.opFilial,
      'op': this.opCodigo,
      'datadoc': arrData[2] + arrData[1] + arrData[0],
      'qtdeinfo': 0,
      'itComp': xaRow.CODPROD,
      'itlote': ' ',
    }
    this.funcJson.execProd('atualizaDoc', obj);
    this.buscaDocsOps();
    // window.location.reload();
}


  retArrayLider() {
    return ['ADEMIO MENDES',
      'ALANO JONHSON',
      'ALOISIO JOSÉ',
      'ANGELO ELIEZE',
      'ANTONIO VERASMO',
      'CLAUDINEI MARQUES',
      'DANILO FLAVIO',
      'EDELZO ARAUJO',
      'EDNALDO MOTA',
      'ELDER ROGERIO',
      'ELTON APARECIDO',
      'FELIPE APARECIDO',
      'FRANCISCO AGENOR',
      'FRANCISCO EVILMAR',
      'GERSON MARQUES',
      'GILSON VIEIRA',
      'HAILTON ANTUNES',
      'IVANILDO ZANATTE',
      'JOAO ANDERSON',
      'JOAO UEZIVAN',
      'JOSE ALCIMAR',
      'JOSE DE OLIVEIRA',
      'JOSE FEITOSA',
      'JOSE MARIA',
      'LUIS HENRIQUE',
      'LUIZ ANTONIO',
      'LUIZ GUSTAVO',
      'MANOEL RODRIGUES',
      'NEANDRO COSTA',
      'PALMO JEORGE',
      'PAULO ROBERTO',
      'RAIMUNDO INACIO',
      'SERGIO RICARDO',
      'TIAGO SANTANA',
      'VANDERLEI RODRIGUES',
      'WEVERTON APARECIDO'];
  }

  retArrayProcesso() {
    return ['Betoneira',
      'Moagem',
      'Mistura em tanque',
      'Granulação',
      'Reembalamento manual',
      'Reembalamento automático'];
  }

  // Altera se deseja fazer apontamento ou não
  altCabec() {
    const arrData = this.opDataDoc.split('/')
    const obj = {
      'filial': this.opFilial,
      'op': this.opCodigo,
      'datadoc': arrData[2] + arrData[1] + arrData[0],
      'clotea': this.valclotea,
      'cloteb': this.valcloteb,
      'clotec': this.valclotec,
      'cloted': this.valcloted,
      'clotee': this.valclotee,
      'clotef': this.valclotef,
      'cloteg': this.valcloteg,
      'cloteh': this.valcloteh,
      'clotei': this.valclotei,
      'clotej': this.valclotej,
      'clotek': this.valclotek,
      'clotel': this.valclotel,
      'nlotea': this.valnlotea,
      'nloteb': this.valnloteb,
      'nlotec': this.valnlotec,
      'nloted': this.valnloted,
      'nlotee': this.valnlotee,
      'nlotef': this.valnlotef,
      'nloteg': this.valnloteg,
      'nloteh': this.valnloteh,
      'nlotei': this.valnlotei,
      'nlotej': this.valnlotej,
      'nlotek': this.valnlotek,
      'nlotel': this.valnlotel,
      'lider': this.valLider,
      'processo': this.valProcesso,
      'observ': this.valobserv,
      'turno1': this.valTurno1,
      'turno2': this.valTurno2,
      'turno3': this.valTurno3,
    }
    this.funcJson.execProd('atualizaCabecDoc', obj);
    this.buscaDocsOps();
    // window.location.reload();
}

}

