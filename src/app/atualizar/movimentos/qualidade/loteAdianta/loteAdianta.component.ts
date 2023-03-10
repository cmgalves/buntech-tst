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
  selector: 'app-loteAdianta',
  templateUrl: './loteAdianta.component.html',
  styleUrls: ['./loteAdianta.component.css']
})

export class LoteAdiantaComponent implements OnInit {
  aUsr = JSON.parse(localStorage.getItem('user'))[0];
  aProd = JSON.parse(localStorage.getItem('loteAdianta'));
  arrBusca: any = [];
  arrDados: any = [];
  Dados: any = [];
  filial: string = '';
  produto: string = '';
  descricao: string = '';
  revisao: string = '';
  seq: string = '';
  validade: any = 0;
  quebra: string = '';
  qtdeQuebra: string = '';
  lote: string = '';
  qtde: any = 0;
  qtdeTot: any = 0;
  qtdeProd: any = 0;
  dtProd: any = '';
  hrProd: any = '';
  dtVenc: any = '';
  justificativa: any = '';
  obs: any = '';
  cTipo: any = 0;
  tpQuebra: string[] = ['DIA', 'PESO'];
  tpativo: string[] = ['SIM', 'NAO'];
  lotes: Observable<any>;
  displayedColumns: string[] = ['id_loteProd', 'op', 'produto', 'descricao', 'qtdeProd', 'situacao', 'fechamento'];
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
    this.buscaLoteAdiantas();
  }

  antecipaFecha() {
    const obj = {
      'filial': this.filial,
      'op': '',
      'produto': this.produto,
      'descricao': '',
      'revisao': '',
      'lote': this.lote,
      'validade': 0,
      'quebra': '',
      'nivel': '',
      'qtde': 0,
      'obs': this.justificativa,
      'usuario': this.aUsr.codUser,
      'cTipo': 'A',
    };

    if (confirm('Deseja antecipar o encerramento do Lote?')) {
      if (this.justificativa.length < 7) {
        alert('Favor detalhar mais!!')
      } else {
        this.fj.execProd('manuLote', obj);
        this.router.navigate(['loteReg']);
      }
    } else {
      alert('Cancelado Pelo Usuário')
    }
  }

  // busca a relação de produtos com as loteções
  buscaLoteAdiantas() {
    let ord = 0;

    const obj = {
      'produto': this.aProd.produto,
      'lote': this.aProd.lote
    };
    this.arrBusca = this.fj.buscaPrt('relacaoLoteAdianta', obj);
    this.arrBusca.subscribe(cada => {
      cada.forEach(xy => {
        ord++
        this.arrDados.push({
          'id_loteProd': xy.id_loteProd,
          'filial': xy.filial,
          'op': xy.op,
          'produto': xy.produto,
          'descricao': xy.descricao,
          'lote': xy.lote,
          'loteAprov': xy.loteAprov,
          'dtAprov': xy.dtAprov,
          'usrAprov': xy.usrAprov,
          'usrProd': xy.usrProd,
          'dtProd': xy.dtProd,
          'hrProd': xy.hrProd,
          'dtVenc': xy.dtVenc,
          'qtdeProd': xy.qtdeProd,
          'qtdeQuebra': xy.qtdeQuebra,
          'qtdeTot': xy.qtdeTot,
          'seqProd': xy.seqProd,
          'quebra': xy.quebra,
          'revisao': xy.revisao,
          'situacao': xy.situacao,
          'fechamento': xy.fechamento,
          'obs': xy.obs,
          'justificativa': xy.justificativa,
        })
        this.filial = xy.filial
        this.produto = xy.produto
        this.descricao = xy.descricao
        this.revisao = xy.revisao
        this.lote = xy.lote
        this.validade = xy.validade
        this.quebra = xy.quebra
        this.qtdeProd = xy.qtdeProd
        this.qtdeTot = xy.qtdeTot
        this.dtProd = this.fg.dtob(xy.dtProd)
        this.dtVenc = this.fg.dtob(xy.dtVenc)
        this.hrProd = xy.hrProd
        this.quebra = xy.quebra
        this.qtdeQuebra = xy.qtdeQuebra
        this.obs = xy.obs
      });

      this.dataSource = new MatTableDataSource(this.arrDados)
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
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
