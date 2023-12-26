import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { UntypedFormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { funcsService } from 'app/funcs/funcs.service';

export interface cadHistrevisa {
  seq: string;
  iteCarac: string;
  iteMin: string;
  iteMax: string;
  descCarac: string;
}

@Component({
  selector: 'app-histrevisa',
  templateUrl: './histrevisa.component.html',
  styleUrls: ['./histrevisa.component.css']
})

export class HistrevisaComponent implements OnInit {
  arrUserLogado = JSON.parse(localStorage.getItem('user'))[0];
  arrCarac = JSON.parse(localStorage.getItem('cadCarac'));
  arrDb: any = [];
  aDb: any = [];
  arrRev: any = [];
  arrCar: any = [];
  cabProduto: string = ''
  descrProd: string = '';
  cabRevisao: string = '';
  dataAprov: string = '';
  feitoPor: string = '';
  numEspec: string = '';
  cabSituacao: string = '';
  qualObsGeral: string = '';
  qualObsRevisao: string = '';
  aplicacao: string = '';
  embalagem: string = '';
  aprovPor: string = '';
  iteProduto: string = '';
  iteRevisao: string = '';
  iteCarac: string = '';
  iteMin: string = '';
  iteMax: string = '';
  descCarac: string = '';
  novoCarCod: string = '';
  novoCarDesc: string = '';
  novoCarMin: string = '';
  novoCarMax: string = '';
  laddCarac: boolean = true
  lForm: boolean = false;
  editInd = null;
  histrevisas: Observable<any>;
  displayedColumns: string[] = ['idEspecItens', 'iteCarac', 'descCarac', 'iteMin', 'iteMax', 'itetxt', 'iteMeio', 'iteLaudo'];
  dataSource: MatTableDataSource<cadHistrevisa>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  class: string = '';

  myControl = new UntypedFormControl();
  options: string[] = [];
  filteredOptions: Observable<string[]>;


  constructor(
    public router: Router,
    private fj: funcsService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.buscaHistrevisas();
  }

  buscaHistrevisas() {
    let seq = 0;
    let aProd: any = JSON.parse(localStorage.getItem('histRev'));
    const obj = {
      'cabProduto': aProd.cabProduto,
      'cabRevisao': aProd.cabRevisao
    };
    this.arrDb = this.fj.buscaPrt('relacaoHistoricoEspec', obj); //View_Relacao_Espec_Hist
 
    this.arrDb.subscribe(cada => {
      cada.forEach(xy => {
        seq++
        this.arrRev.push({
          'idEspecItens': xy.idEspecItens,
          'cabProduto': xy.cabProduto,
          'descrProd': xy.descrProd,
          'cabRevisao': xy.cabRevisao,
          'dataAprov': xy.dataAprov,
          'numEspec': xy.numEspec,
          'situacao': xy.situacao,
          'qualObsGeral': xy.qualObsGeral,
          'qualObsRevisao': xy.qualObsRevisao,
          'aplicacao': xy.aplicacao,
          'embalagem': xy.embalagem,
          'feitoPor': xy.feitoPor,
          'iteProduto': xy.iteProduto,
          'iteRevisao': xy.iteRevisao,
          'iteCarac': xy.iteCarac,
          'iteMin': xy.iteMin,
          'iteMax': xy.iteMax,
          'descCarac': xy.descCarac,
        })
        if (seq === 1) {
          this.descrProd = xy.descrProd;
          this.cabProduto = xy.cabProduto;
          this.cabRevisao = xy.cabRevisao;
          this.dataAprov = xy.dataAprov;
          this.feitoPor = xy.feitoPor;
          this.numEspec = xy.numEspec;
          this.cabSituacao = xy.situacao;
          this.aplicacao = xy.aplicacao;
          this.embalagem = xy.embalagem;
          this.qualObsRevisao = xy.qualObsRevisao;
          this.qualObsGeral = xy.qualObsGeral;
        }
      });

      this.dataSource = new MatTableDataSource(this.arrRev)
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
  voltaHist() {
    this.router.navigate(['histor']);
  }
}
