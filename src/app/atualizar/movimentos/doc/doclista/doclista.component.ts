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
export interface opDoclista {
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
  selector: 'app-doclista',
  templateUrl: './doclista.component.html',
  styleUrls: ['./doclista.component.css']
})

export class DoclistaComponent implements OnInit {
  arrUserLogado = JSON.parse(localStorage.getItem('user'))[0];
  arrOpAnd: any = []; //JSON.parse(localStorage.getItem('user'))[0];
  arrOpPcf: any = []; //JSON.parse(localStorage.getItem('user'))[0];
  xcFilial: any = this.arrUserLogado.empresa
  xcPerfil: any = this.arrUserLogado.perfil
  numOP = JSON.parse(localStorage.getItem('op'));
  opFilial: string = '';
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
  arrDoclista886: any = [];
  arrDoclista887: any = [];
  arrDoclista888: any = [];
  arrDoclistaTab: any = [];
  arrFilial: any = ['101', '107', '117', '402', '108', '206']


  doclistas: Observable<any>;
  displayedColumns: string[] = ['SEQ', 'FILIAL', 'OP', 'CODPROD', 'DESCRICAO', 'QTDE', 'EMISSAO', 'DATADOC', 'EDICAO'];
  dataSource: MatTableDataSource<opDoclista>;
  dataExcel: MatTableDataSource<opDoclista>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    public router: Router,
    private funcJson: funcsService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.buscaProdutos();
    // this.buscaOpsAndamentoProtheus();
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
            'unidade': xy.unidade,
            'retrabalho': xy.retrabalho,
            'mdo': xy.mdo,
          })
        }
      });
      localStorage.setItem('cadProd', JSON.stringify(this.arrProdB));
      this.buscaOpsAndamentoProtheus();
    });
  }

  // busca os produtos no cadastro para utilizar os dados necessários
  buscaOpsAndamentoProtheus() {
    const codPro = this.numOP[0].CODPROD;
    let aCadProd = JSON.parse(localStorage.getItem('cadProd'));
    let seq = 0;

    const obj = {
      'filial': this.numOP[0].FILIAL,
      'op': this.numOP[0].OP
    };
    this.arrOpAndA = this.funcJson.busca883('documentosOpCabec', obj);

    this.arrOpAndA.subscribe(cada => {
      cada.forEach(xy => {
        seq++
        this.arrOpAndB.push({
          'SEQ': seq,
          'FILIAL': xy.FILIAL,
          'OP': xy.OP,
          'CODPROD': xy.CODPROD,
          'DESCRICAO': xy.DESCRICAO,
          'QTDE': xy.QTDE,
          'EMISSAO': xy.EMISSAO,
          'DATADOC': xy.DATADOC,
        })

      });

      this.dataSource = new MatTableDataSource(this.arrOpAndB)
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      
      aCadProd = aCadProd.filter(x => (x.codigo === codPro))[0];

      this.opFilial = this.numOP[0].FILIAL;
      this.opCodigo = this.numOP[0].OP;
      this.opDataDoc = this.funcJson.datadehoje('brasuca')
      this.opFinal = this.numOP[0].FINAL;
      this.opProduto = codPro;
      this.opDescricao = aCadProd.descricao;
      this.opQtde = this.numOP[0].QTDEPRT;
      this.opEntregue = this.numOP[0].ENTREGUE;
    });



  }



  acessoDetdoc(xcRow) {
    alert('Aguardando!')
    // const filOP = this.arrDoclistaTab.filter(x => x.OP == xcRow.OP);
    // localStorage.setItem('op', JSON.stringify(filOP));
    this.router.navigate(['docdet']);
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

  voltaDocumento() {
    this.router.navigate(['document']);
  }



  criaDocumento(xnTipo) {
    const arrData = this.opDataDoc.split('/')


    if (this.funcJson.validDataFormat(this.opDataDoc)) {
      if (xnTipo === 1) {
        let obj = {
          'tipo': xnTipo,
          'filial': this.opFilial,
          'op': this.opCodigo,
          'datadoc': arrData[2] + arrData[1] + arrData[0]
        }
        this.funcJson.execProd('atualizaDoc', obj);
        window.location.reload();
      } else {
        let obj = {
          'tipo': xnTipo,
          'filial': this.opFilial,
          'op': this.opCodigo,
          'datadoc': arrData[2] + arrData[1] + arrData[0]
        }
        this.funcJson.execProd('atualizaDoc', obj);
        window.location.reload();
      }
    }

  }
}
