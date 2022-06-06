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
import { jsPDF } from 'jspdf'
import { DOCUMENT } from '@angular/common';

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
  // optLider: string[] = this.retArrayLider()
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
  valProcesso: string = ' ';
  // valLider: string = ' ';
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
  displayedColumns: string[] = ['SEQ', 'CODPROD', 'DESCRICAO', 'QTDE', 'QTDECAL', 'LOTEOP', 'EDICAO', 'ATIVO', 'APONTA', 'APT'];
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
          'UNIDADE': xy.ituni,
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
          // this.valLider = xy.lider;
          this.valProcesso = xy.processo;
          this.valobserv = xy.observ;
          this.valTurno1 = xy.turno1;
          this.valTurno2 = xy.turno2;
          this.valTurno3 = xy.turno3;
        }

      });

      localStorage.setItem('listaComponentes', JSON.stringify(this.arrOpAndB));
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
    let xcTipo = 0
    if (xaRow.APONTA == 'Sim' && xaRow.ATIVO == 'Não') {
      if (confirm('Confirma a Exclusão do Item ' + xaRow.CODPROD + '?')) {
        xcTipo = 7
      }
    } else {
      xcTipo = 4
    }

    const obj = {
      'tipo': xcTipo,
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
    let xcTipo = 0
    if (xaRow.APONTA == 'Não' && xaRow.ATIVO == 'Sim') {
      if (confirm('Confirma a Exclusão do Item ' + xaRow.CODPROD + '?')) {
        xcTipo = 7
      }
    } else {
      xcTipo = 5
    }
    const obj = {
      'tipo': xcTipo,
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
      'clotea': this.valclotea === null ? ' ' : this.valclotea,
      'cloteb': this.valcloteb === null ? ' ' : this.valcloteb,
      'clotec': this.valclotec === null ? ' ' : this.valclotec,
      'cloted': this.valcloted === null ? ' ' : this.valcloted,
      'clotee': this.valclotee === null ? ' ' : this.valclotee,
      'clotef': this.valclotef === null ? ' ' : this.valclotef,
      'cloteg': this.valcloteg === null ? ' ' : this.valcloteg,
      'cloteh': this.valcloteh === null ? ' ' : this.valcloteh,
      'clotei': this.valclotei === null ? ' ' : this.valclotei,
      'clotej': this.valclotej === null ? ' ' : this.valclotej,
      'clotek': this.valclotek === null ? ' ' : this.valclotek,
      'clotel': this.valclotel === null ? ' ' : this.valclotel,
      'nlotea': this.valnlotea === null ? 0 : this.valnlotea,
      'nloteb': this.valnloteb === null ? 0 : this.valnloteb,
      'nlotec': this.valnlotec === null ? 0 : this.valnlotec,
      'nloted': this.valnloted === null ? 0 : this.valnloted,
      'nlotee': this.valnlotee === null ? 0 : this.valnlotee,
      'nlotef': this.valnlotef === null ? 0 : this.valnlotef,
      'nloteg': this.valnloteg === null ? 0 : this.valnloteg,
      'nloteh': this.valnloteh === null ? 0 : this.valnloteh,
      'nlotei': this.valnlotei === null ? 0 : this.valnlotei,
      'nlotej': this.valnlotej === null ? 0 : this.valnlotej,
      'nlotek': this.valnlotek === null ? 0 : this.valnlotek,
      'nlotel': this.valnlotel === null ? 0 : this.valnlotel,
      'lider': ' ',
      'processo': this.valProcesso === null ? ' ' : this.valProcesso,
      'observ': this.valobserv === null ? ' ' : this.valobserv,
      'turno1': this.valTurno1 === null ? 'N' : this.valTurno1,
      'turno2': this.valTurno2 === null ? 'N' : this.valTurno2,
      'turno3': this.valTurno3 === null ? 'N' : this.valTurno3,
    }
    this.funcJson.execProd('atualizaCabecDoc', obj);
    this.buscaDocsOps();
    // window.location.reload();
  }

  imprimeDocumento() {
    let doc = new jsPDF();
    const dadosDoc = JSON.parse(localStorage.getItem('listaComponentes'));
    const arrData = this.opDataDoc.split('/');
    const datadoc = arrData[2] + arrData[1] + arrData[0];
    var img = new Image()
    let xlEntrou = true
    const cOp = (this.opCodigo).substring(0,6);
    const Lin = 7;
    let nL = 3;
    let nL2 = 0;
    let xnTmProd = 72;
    let xnTmLote = 50;
    let xcDescLote = '';
    let xcDescUnit = '';

    const xnQtdeTota = this.valnlotea + this.valnloteb + this.valnlotec + this.valnloted + this.valnlotee + this.valnlotef + this.valnloteg + this.valnloteh + this.valnlotei + this.valnlotej + this.valnlotek + this.valnlotel
    const xnQtdeTotal = xnQtdeTota.toLocaleString()
    const aF = [8, 10, 12, 14, 16, 20];
    img.src = 'assets/img/logo.png'

    doc.setFontSize(aF[5]);

    doc.addImage(img, 'png', 140, nL, 55, 17)

    nL += 12; //15

    doc.text('ORDEM DE PRODUÇÃO', 40, nL);

    nL += 7; //22

    doc.setLineWidth(1.5)
    doc.line(10, nL, 200, nL)

    nL += Lin //29

    doc.setFontSize(aF[1]);

    doc.text('OP: ' + cOp + ' - ' + this.opProduto + ' - ' + this.opDescricao, 10, nL);

    doc.setLineWidth(0.7)

    doc.setFontSize(aF[1]);
    nL += Lin; //36
    doc.text('Data: ' + this.opDataDoc, 10, nL);
    doc.text('Processo: ' + this.valProcesso, 46, nL);
    // doc.text('Lider: ' + this.valLider, 120, nL);
    nL += 1
    doc.setLineWidth(0.3)
    doc.line(160, nL, 200, nL)
    doc.line(160, nL + 6, 200, nL + 6)
    doc.line(160, nL + 17, 200, nL + 17)
    doc.line(160, nL, 160, nL + 17)
    doc.line(200, nL, 200, nL + 17)

    nL += 4; //43

    doc.text('Quantidade Total (TN)', 161, nL);

    nL += 2; //43

    doc.setFontSize(aF[2]);
    doc.text('TURNO ', 10, nL);
    doc.text('1 - ', 30, nL);
    if (this.valTurno1 === 'S') {
      doc.rect(36, nL - 4, 5, 5, 'F')
    } else {
      doc.rect(36, nL - 4, 5, 5)
    }
    doc.text('2 - ', 50, nL);
    if (this.valTurno2 === 'S') {
      doc.rect(56, nL - 4, 5, 5, 'F')
    } else {
      doc.rect(56, nL - 4, 5, 5)
    }
    doc.text('3 - ', 70, nL);
    if (this.valTurno3 === 'S') {
      doc.rect(76, nL - 4, 5, 5, 'F')
    } else {
      doc.rect(76, nL - 4, 5, 5)
    }



    nL += Lin; //52

    doc.setFontSize(aF[3]);
    doc.text(xnQtdeTotal.toString(), 172, nL);

    doc.setFontSize(aF[4]);
    doc.text('QUANTIDADE PRODUZIDA (TN) ', 62, nL);

    nL += 6; //56

    doc.setFontSize(aF[1]);

    doc.setLineWidth(0.7)
    doc.line(10, nL, 200, nL)
    doc.line(10, nL + 37, 200, nL + 37)
    doc.line(10, nL, 10, nL + 37)
    doc.line(200, nL, 200, nL + 37)

    doc.setLineWidth(0.2)
    doc.line(27, nL, 27, nL + 37)
    doc.line(57, nL, 57, nL + 37)
    doc.line(75, nL, 75, nL + 37)
    doc.line(105, nL, 105, nL + 37)
    doc.line(122, nL, 122, nL + 37)
    doc.line(152, nL, 152, nL + 37)
    doc.line(169, nL, 169, nL + 37)

    nL += Lin //63
    doc.line(10, nL, 200, nL)
    nL += -1; //62

    doc.text('01 Lote ', 11, nL);
    doc.text('02 Lote ', 58, nL);
    doc.text('03 Lote ', 106, nL);
    doc.text('04 Lote ', 153, nL);
    doc.text(this.valclotea, 30, nL);
    doc.text(this.valcloteb, 77, nL);
    doc.text(this.valclotec, 125, nL);
    doc.text(this.valcloted, 172, nL);

    nL += Lin //69
    doc.line(10, nL, 200, nL)
    nL += -1; //68
    doc.text('01 Qtde', 11, nL);
    doc.text('02 Qtde', 58, nL);
    doc.text('03 Qtde', 106, nL);
    doc.text('04 Qtde', 153, nL);
    if (this.valnlotea == '0') {
      doc.text(' ', 30, nL);
    } else {
      doc.text(this.valnlotea.toString(), 30, nL);
    }
    if (this.valnloteb == '0') {
      doc.text(' ', 30, nL);
    } else {
      doc.text(this.valnloteb.toString(), 77, nL);
    }
    if (this.valnlotec == '0') {
      doc.text(' ', 30, nL);
    } else {
      doc.text(this.valnlotec.toString(), 125, nL);
    }
    if (this.valnloted == '0') {
      doc.text(' ', 30, nL);
    } else {
      doc.text(this.valnloted.toString(), 172, nL);
    }

    // doc.text(this.valnlotea.toString(), 30, nL);
    // doc.text(this.valnloteb.toString(), 77, nL);
    // doc.text(this.valnlotec.toString(), 125, nL);
    // doc.text(this.valnloted.toString(), 172, nL);

    nL += Lin //75
    doc.line(10, nL, 200, nL)
    nL += -1; //74

    doc.text('05 Lote ', 11, nL);
    doc.text('06 Lote ', 58, nL);
    doc.text('07 Lote ', 106, nL);
    doc.text('08 Lote ', 153, nL);
    doc.text(this.valclotee, 30, nL);
    doc.text(this.valclotef, 77, nL);
    doc.text(this.valcloteg, 125, nL);
    doc.text(this.valcloteh, 172, nL);

    nL += Lin //81
    doc.line(10, nL, 200, nL)
    nL += -1; //80

    doc.text('05 Qtde', 11, nL);
    doc.text('06 Qtde', 58, nL);
    doc.text('07 Qtde', 106, nL);
    doc.text('08 Qtde', 153, nL);

    if (this.valnlotee == '0') {
      doc.text(' ', 30, nL);
    } else {
      doc.text(this.valnlotee.toString(), 30, nL);
    }
    if (this.valnlotef == '0') {
      doc.text(' ', 30, nL);
    } else {
      doc.text(this.valnlotef.toString(), 77, nL);
    }
    if (this.valnloteg == '0') {
      doc.text(' ', 30, nL);
    } else {
      doc.text(this.valnloteg.toString(), 125, nL);
    }
    if (this.valnloteh == '0') {
      doc.text(' ', 30, nL);
    } else {
      doc.text(this.valnloteh.toString(), 172, nL);
    }

    // doc.text(this.valnlotee.toString(), 30, nL);
    // doc.text(this.valnlotef.toString(), 77, nL);
    // doc.text(this.valnloteg.toString(), 125, nL);
    // doc.text(this.valnloteh.toString(), 172, nL);

    nL += Lin //87
    doc.line(10, nL, 200, nL)
    nL += -1; //86

    doc.text('09 Lote ', 11, nL);
    doc.text('10 Lote ', 58, nL);
    doc.text('11 Lote ', 106, nL);
    doc.text('12 Lote ', 153, nL);
    doc.text(this.valclotei, 30, nL);
    doc.text(this.valclotej, 77, nL);
    doc.text(this.valclotek, 125, nL);
    doc.text(this.valclotel, 172, nL);

    nL += Lin //93
    doc.line(10, nL, 200, nL)
    nL += -1; //92


    doc.text('09 Qtde', 11, nL);
    doc.text('10 Qtde', 58, nL);
    doc.text('11 Qtde', 106, nL);
    doc.text('12 Qtde', 153, nL);

    if (this.valnlotei == '0') {
      doc.text(' ', 30, nL);
    } else {
      doc.text(this.valnlotei.toString(), 30, nL);
    }
    if (this.valnlotej == '0') {
      doc.text(' ', 30, nL);
    } else {
      doc.text(this.valnlotej.toString(), 77, nL);
    }
    if (this.valnlotek == '0') {
      doc.text(' ', 30, nL);
    } else {
      doc.text(this.valnlotek.toString(), 125, nL);
    }
    if (this.valnlotel == '0') {
      doc.text(' ', 30, nL);
    } else {
      doc.text(this.valnlotel.toString(), 172, nL);
    }
    //     doc.text(this.valnlotei.toString(), 30, nL);
    // doc.text(this.valnlotej.toString(), 77, nL);
    // doc.text(this.valnlotek.toString(), 125, nL);
    // doc.text(this.valnlotel.toString(), 172, nL);

    nL += 9; //101

    doc.setFontSize(aF[4]);
    doc.text('COMPONENTES DA ORDEM DE PRODUÇÃO', 38, nL);

    nL += 5; //106
    nL2 = nL
    doc.setFontSize(aF[1]);


    doc.setLineWidth(0.7)
    doc.line(10, nL, 200, nL)
    nL += Lin; //113
    doc.line(10, nL, 200, nL)

    nL += -1; //112

    doc.text('CÓDIGO', 12, nL);
    doc.text('DESCRIÇÃO', 55, nL);
    doc.text('UN', 122, nL);
    doc.text('QTDE', 136, nL);
    doc.text('LOTE / NF / OP', 155, nL);


    nL += Lin;
    doc.setFontSize(aF[0]);

    doc.setLineWidth(0.2)

    xlEntrou = true;

    dadosDoc.forEach(xy => {
      if (xy.ATIVO !== 'Não') {
        xcDescLote = xy.LOTEOP === null ? ' ' : xy.LOTEOP
        xcDescUnit = xy.UNIDADE === null ? ' ' : xy.UNIDADE
        if (xlEntrou) {
          doc.text(xy.CODPROD, 12, nL);
          doc.text(xy.DESCRICAO, 38, nL, { align: 'justify', lineHeightFactor: 1, maxWidth: xnTmProd });
          doc.text(xcDescUnit, 122, nL);
          doc.text((xy.QTDECAL.toString()), 138, nL);
          doc.text(xcDescLote, 149, nL, { align: 'justify', lineHeightFactor: 1, maxWidth: xnTmLote });
          // doc.text(xy.LOTEOP === null ? ' ' : xy.LOTEOP, 137, nL);
          nL += Lin;
          xlEntrou = false;
        } else {
          nL += -4
          doc.text(xy.CODPROD, 12, nL);
          doc.text(xy.DESCRICAO, 38, nL, { align: 'justify', lineHeightFactor: 1, maxWidth: xnTmProd });
          doc.text(xcDescUnit, 122, nL);
          doc.text((xy.QTDECAL.toString()), 138, nL);
          doc.text(xcDescLote, 149, nL, { align: 'justify', lineHeightFactor: 1, maxWidth: xnTmLote });
          nL += 4
        }
        doc.line(10, nL + 1, 200, nL + 1)
        nL += Lin * 2;
      }
    });


    doc.setLineWidth(0.7)

    nL += -13

    doc.line(10, nL, 200, nL)
    doc.line(10, nL2, 10, nL)
    doc.line(200, nL2, 200, nL)

    doc.setLineWidth(0.2)

    doc.line(37, nL2, 37, nL)
    doc.line(120, nL2, 120, nL)
    doc.line(135, nL2, 135, nL)
    doc.line(148, nL2, 148, nL)

    // nL += 9

    // nL += Lin;

    // nL = 270;

    // doc.setFontSize(aF[4]);
    // doc.text('OBSERVAÇÕES', 12, nL);
    // nL += Lin + 5;
    // doc.setFontSize(aF[2]);


    // doc.text(this.valobserv, 12, nL, { align: 'justify', lineHeightFactor: 1, maxWidth: 178 });


    // COMEÇA A OUTRA PÁGINA

    doc.addPage();
    nL = 3;
    img.src = 'assets/img/logo.png'

    doc.setFontSize(aF[5]);

    doc.addImage(img, 'png', 140, nL, 55, 17)

    nL += 12; //15

    doc.text('ORDEM DE PRODUÇÃO', 40, nL);

    nL += 7; //22

    doc.setLineWidth(1.5)
    doc.line(10, nL, 200, nL)

    nL += Lin //29

    doc.setFontSize(aF[1]);

    doc.text('OP: ' + cOp + ' - ' + this.opProduto + ' - ' + this.opDescricao, 10, nL);

    doc.setLineWidth(0.7)

    doc.setFontSize(aF[1]);
    nL += Lin; //36
    doc.text('Data: ' + this.opDataDoc, 10, nL);
    doc.text('Processo: ' + this.valProcesso, 46, nL);
    // doc.text('Lider: ' + this.valLider, 120, nL);

    nL += 9; //101

    doc.setFontSize(aF[4]);
    doc.text('COMPONENTES PARA APONTAMENTO', 42, nL);

    nL += Lin;
    nL2 = nL
    doc.setFontSize(aF[1]);

    doc.setLineWidth(0.7)
    doc.line(10, nL2, 200, nL2)
    nL += Lin;
    doc.line(10, nL2 + 8, 200, nL2 + 8)


    doc.text('CÓDIGO', 12, nL);
    doc.text('DESCRIÇÃO', 55, nL);
    // doc.text('UN', 122, nL);
    // doc.text('QTDE', 136, nL);
    doc.text('APONTAMENTO', 122, nL);

    nL += 9;

    doc.setFontSize(aF[0]);

    doc.setLineWidth(0.2)

    xlEntrou = true;

    dadosDoc.forEach(xy => {
      if (xy.APONTA !== 'Não') {
        xcDescUnit = xy.UNIDADE === null ? ' ' : xy.UNIDADE

        if (xlEntrou) {
          doc.text(xy.CODPROD, 12, nL);
          doc.text(xy.DESCRICAO, 38, nL, { align: 'justify', lineHeightFactor: 1, maxWidth: xnTmProd });
          // doc.text(xcDescUnit, 122, nL);
          // doc.text((xy.QTDECAL.toString()), 138, nL);
          nL += Lin;
          xlEntrou = false;
        } else {
          nL += -4
          doc.text(xy.CODPROD, 12, nL);
          doc.text(xy.DESCRICAO, 38, nL, { align: 'justify', lineHeightFactor: 1, maxWidth: xnTmProd });
          // doc.text(xcDescUnit, 122, nL);
          // doc.text((xy.QTDECAL.toString()), 138, nL);
          nL += 4
        }
        doc.line(10, nL + 1, 200, nL + 1)

        nL += Lin * 2;
      }
    });

    doc.setLineWidth(0.7)

    nL += -13

    doc.line(10, nL, 200, nL)
    doc.line(10, nL2, 10, nL)
    doc.line(200, nL2, 200, nL)

    doc.setLineWidth(0.2)

    doc.line(37, nL2, 37, nL)
    doc.line(120, nL2, 120, nL)
    // doc.line(135, nL2, 135, nL)
    // doc.line(148, nL2, 148, nL)

    nL += Lin;

    nL = 260;


    doc.setFontSize(aF[4]);
    doc.text('OBSERVAÇÕES', 12, nL);
    nL += Lin + 5;
    doc.setFontSize(aF[2]);

    doc.text(this.valobserv, 12, nL, { align: 'justify', lineHeightFactor: 1, maxWidth: 178 });

    doc.save(cOp + ' - ' + datadoc);
  }

}

