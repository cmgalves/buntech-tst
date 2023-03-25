import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { funcsService } from 'app/funcs/funcs.service';
import { funcGeral } from 'app/funcs/funcGeral';

export interface cadLote {
  seq: string;
  codigo: string;
  descricao: string;
  tipo: string;
  unidade: string;
  grupo: string;
  ncm: string;
  situacao: string;
  revisao: string;
  ativo: string;
}

@Component({
  selector: 'app-loteAnalisa',
  templateUrl: './loteAnalisa.component.html',
  styleUrls: ['./loteAnalisa.component.css']
})

export class LoteAnalisaComponent implements OnInit {
  aUsr = JSON.parse(localStorage.getItem('user'))[0];
  aProd = JSON.parse(localStorage.getItem('loteAnalisa'));
  arrBusca: any = [];
  arrDados: any = [];
  Dados: any = [];
  filial: string = '';
  op: string = '';
  produto: string = '';
  descricao: string = '';
  revisao: string = '';
  seq: string = '';
  nivel: string = '';
  validade: any = 0;
  quebra: string = '';
  qtdeQuebra: string = '';
  lote: string = '';
  qtde: any = 0;
  qtdeTot: any = 0;
  usrAprov: any = '';
  usrAnalise: any = '';
  dtProd: any = '';
  hrProd: any = '';
  carac: any = '';
  itemin: any = '';
  itemax: any = '';
  itemeio: any = '';
  itetxt: any = '';
  result: any = '';
  situacao: any = '';
  dtVenc: any = '';
  obs: any = '';
  cTipo: any = 0;
  lAnalise: boolean = false;
  lEdit: boolean = false;
  editInd = null;
  tpQuebra: string[] = ['Dia', 'Peso'];
  tpativo: string[] = ['Sim', 'Não'];
  lotes: Observable<any>;
  displayedColumns: string[] = ['op', 'codCarac', 'descCarac', 'qtdeProd', 'itemin', 'itemax', 'itemeio', 'itetxt', 'result', 'situacao', 'editResult'];
  dataSource: MatTableDataSource<cadLote>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  class: string = '';

  constructor(
    public router: Router,
    private fj: funcsService,
    private fg: funcGeral,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.buscaLoteDetalhes();
  }

  // busca a relação de produtos com as loteções
  buscaLoteDetalhes() {
    let ord = 0;
    let cNivel = '';
    this.lAnalise = false
    this.lEdit = false

    const obj = {
      'filial': this.aProd.filial,
      'produto': this.aProd.produto,
      'lote': this.aProd.lote
    };
    this.arrBusca = this.fj.buscaPrt('relacaoLoteAnalisa', obj);
    this.arrBusca.subscribe(cada => {
      cada.forEach(xy => {
        ord++
        this.arrDados.push({
          'filial': xy.filial,
          'op': xy.op,
          'produto': xy.produto,
          'descricao': xy.descricao,
          'lote': xy.lote,
          'dtAprov': xy.dtAprov,
          'usrAprov': xy.usrAprov,
          'dtVenc': xy.dtVenc,
          'qtdeProd': xy.qtdeProd,
          'qtdeTot': xy.qtdeTot,
          'revisao': xy.revisao,
          'codCarac': xy.codCarac,
          'descCarac': xy.descCarac,
          'itemin': xy.itemin.toFixed(3),
          'itemax': xy.itemax.toFixed(3),
          'itemeio': xy.itemeio,
          'itetxt': xy.itetxt,
          'result': xy.result.toFixed(3),
          'situacao': xy.situacao,
          'sitFim': xy.sitFim,
        })
        if (cNivel == '') {
          if (xy.nivel == 'N1') {
            cNivel = 'Nivel 01'
          }
          if (xy.nivel == 'N2') {
            cNivel = 'Nivel 02'
          }
          if (xy.nivel == 'N3') {
            cNivel = 'Nivel 03'
          }
        }
        if (xy.orig != 'analise' || xy.situacao != 'Aprovado' || xy.sitFim == 'Aprovado') {
          this.lAnalise = true
        }
        if (xy.sitFim == 'Aprovado') {
          this.lEdit = true
        }
        this.filial = xy.filial
        this.produto = xy.produto
        this.descricao = xy.descricao
        this.revisao = xy.revisao
        this.lote = xy.lote
        this.nivel = cNivel
        this.qtdeTot = xy.qtdeTot
        this.dtVenc = this.fg.dtob(xy.dtVenc)
      });

      this.dataSource = new MatTableDataSource(this.arrDados)
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  aprovaLote(tipo: string) {
    let nivAprov = '';

    const obj = {
      'filial': this.filial,
      'op': ' ',
      'produto': this.produto,
      'descricao': this.descricao,
      'lote': this.lote,
      'usrAprov': this.aUsr.codUser,
      'usrPerfil': nivAprov,
      'dtVenc': this.fg.btod(this.dtVenc),
      'qtde': this.qtdeTot,
      'revisao': this.revisao,
      'codCarac': ' ',
      'itemin': 0,
      'itemax': 0,
      'itemeio': ' ',
      'itetxt': ' ',
      'result': 0,
      'resultxt': ' ',
      'situacao': 'Aprovado',
      'just': 'Aprovação automática pela análise',
      'tipo': tipo,
    }
    this.fj.execProd('analisaAprovaLote', obj);
    this.atuLoteAprov()
  }

  atuLoteAprov() {
    this.arrBusca = {};
    let aProt = [];
    const obj = {
      'filial': this.aProd.filial,
      'produto': this.aProd.produto,
      'lote': this.aProd.lote
    }
    this.arrBusca = this.fj.buscaPrt('relacaoLoteProtheus', obj);
    this.arrBusca.subscribe(cada => {
      cada.forEach(xy => {
        const item = xy.itemin
        aProt.push({ "cLFilial": xy.filial, "cProduto": xy.produto, "cArmazem": '01', "cOP": xy.op, "cLote": xy.lote, "nQuantidade": xy.qtdeProd, "dValidade": xy.dtVenc, "dFabricacao": xy.dtProd, "cCaracteristica": xy.descCarac, "cValMin": xy.itemin.toString(), "cValMax": xy.itemax.toString(), "cResultado": xy.obtido.toString(), "cStatus": xy.sitLote })
      });
      const retProdParcial = this.fj.prodLote(aProt);
      retProdParcial.subscribe(ret => {
        if (ret.status) {
          if (confirm(ret.msg) == true) {
            window.location.reload();
          } else {
            window.location.reload();
          }
        } else {
          alert(ret.msg)
        }
      });
    });
  }



  editLinha(e, i) {
    this.editInd = i;
  }

  editResult(xcRow) {
    let sit: string = 'Aprovado';
    let vResultxt: string = '';
    let vResult = (<HTMLInputElement>(document.getElementById("idResult"))).value;

    if (xcRow.itemin * 1 > 0 || xcRow.itemax * 1 > 0) {
      if (vResult < xcRow.itemin || vResult > xcRow.itemax) {
        sit = 'Reprovado'
      }
    } else {
      if (vResult == 'SIM' || vResult == 'NAO') {
        if (vResult == 'SIM') {
          sit = 'Aprovado'
        }
        if (vResult == 'NAO') {
          sit = 'Reprovado'
        }
      }else{
        alert('Favor digitar SIM ou NAO')
      }
      
    }


    const obj = {
      'filial': this.filial,
      'op': xcRow.op,
      'produto': this.produto,
      'descricao': this.descricao,
      'lote': this.lote,
      'usrAprov': this.aUsr.codUser,
      'usrPerfil': this.aUsr.perfil,
      'dtVenc': this.fg.btod(this.dtVenc),
      'qtde': this.qtdeTot,
      'revisao': this.revisao,
      'codCarac': xcRow.codCarac,
      'itemin': xcRow.itemin,
      'itemax': xcRow.itemax,
      'itemeio': xcRow.itemeio,
      'itetxt': xcRow.itetxt,
      'result': vResult,
      'resultxt': vResultxt,
      'situacao': sit,
      'just': '',
      'tipo': 'E',
    }
    this.fj.execProd('analisaAprovaLote', obj);
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

  // tecla para retorno de tela
  voltaLote() {
    this.router.navigate(['loteReg']);
  }

}
