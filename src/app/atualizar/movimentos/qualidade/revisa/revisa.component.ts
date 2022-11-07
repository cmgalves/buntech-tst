import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { funcsService } from 'app/funcs/funcs.service';
import { funcGeral } from 'app/funcs/funcGeral';

export interface cadRevisa {
  seq: string;
  iteCarac: string;
  iteMin: string;
  iteMax: string;
  descCarac: string;
}

@Component({
  selector: 'app-revisa',
  templateUrl: './revisa.component.html',
  styleUrls: ['./revisa.component.css']
})

export class RevisaComponent implements OnInit {
  arrUserLogado = JSON.parse(localStorage.getItem('user'))[0];
  arrCarac = JSON.parse(localStorage.getItem('cadCarac'));
  arrDb: any = [];
  aDb: any = [];
  arrRev: any = [];
  arrCar: any = [];
  cabProduto: string = ''
  descrProd: string = '';
  cabRevisao: string = '';
  vigenciaDe: string = '';
  vigenciaAte: string = '';
  cabSituacao: string = '';
  qualObsGeral: string = '';
  qualObsRevisao: string = '';
  aplicacao: string = '';
  embalagem: string = '';
  prazoValid: string = '';
  feitoPor: string = '';
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
  revisas: Observable<any>;
  especSit: string[] = ['Andamento', 'Finalizada', 'Encerrada'];
  displayedColumns: string[] = ['seq', 'iteCarac', 'descCarac', 'iteMin', 'iteMax'];
  dataSource: MatTableDataSource<cadRevisa>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  class: string = '';

  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;


  constructor(
    public router: Router,
    private fj: funcsService,
    private fg: funcGeral,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.buscaRevisas();
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  especificar() {
    const obj = {
      'iteProduto': this.cabProduto,
      'iteRevisao': this.cabRevisao,
      'iteCarac': this.novoCarCod,
      'iteMin': this.novoCarMin,
      'iteMax': this.novoCarMax
    }

    this.fj.execProd('incluiEspecItens', obj);
    window.location.reload();
  }

  alterar(cTipo) {
    const obj = {
      'cabProduto': this.cabProduto,
      'descrProd': this.descrProd,
      'cabRevisao': this.cabRevisao,
      'vigenciaDe': this.vigenciaDe,
      'vigenciaAte': this.vigenciaAte,
      'situacao': this.cabSituacao,
      'qualObsGeral': this.qualObsGeral,
      'qualObsRevisao': this.qualObsRevisao,
      'aplicacao': this.aplicacao,
      'embalagem': this.embalagem,
      'feitoPor': this.feitoPor,
      'aprovPor': this.aprovPor,
      'cTipo': cTipo,
    }
    this.fj.execProd('incluiEspec', obj);
    window.location.reload();
  }


  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.arrCarac.filter(option => option.descCarac.toLowerCase().indexOf(filterValue) === 0);
  }

  // valida a inclusão dos novos itens na OP
  aposSelec(event) {
    const desCar = event.option.value
    const filProd = this.arrCarac.filter(x => (x.descCarac === desCar))[0];

    if (filProd.length === 0) {
      alert(desCar + ' não encontrado no cadastro de produtos');
    } else {
      this.novoCarCod = filProd.codCarac
      this.novoCarDesc = filProd.descCarac
      this.novoCarMin = '0'
      this.novoCarMax = '0'
    }
  }



  buscaRevisas() {
    let seq = 0;
    let mxRev = '000'
    let aProd: any = JSON.parse(localStorage.getItem('especProd'));
    this.cabProduto = aProd.codigo;
    this.descrProd = aProd.descricao;
    this.cabRevisao = '000';
    this.cabSituacao = 'Andamento';
    const obj = {
      'cabProduto': this.cabProduto
    };
    this.arrDb = this.fj.busca884('relacaoRevisaoEspec', obj);
    
    this.arrDb.subscribe(cada => {
      cada.forEach(xy => {
        if (mxRev <= xy.cabRevisao ) {
          if (xy.situacao != 'Encerrada') {
            mxRev = xy.cabRevisao
          }
        }
      });
    });


    this.arrDb.subscribe(cada => {
      cada.forEach(xy => {
        if (xy.cabRevisao == mxRev) {
          seq++
          this.arrRev.push({
            'seq': seq,
            'cabProduto': xy.cabProduto,
            'descrProd': xy.descrProd,
            'cabRevisao': xy.cabRevisao,
            'vigenciaDe': xy.vigenciaDe,
            'vigenciaAte': xy.vigenciaAte,
            'situacao': xy.situacao,
            'qualObsGeral': xy.qualObsGeral,
            'qualObsRevisao': xy.qualObsRevisao,
            'aplicacao': xy.aplicacao,
            'embalagem': xy.embalagem,
            'prazoValid': xy.prazoValid,
            'feitoPor': xy.feitoPor,
            'aprovPor': xy.aprovPor,
            'iteProduto': xy.iteProduto,
            'iteRevisao': xy.iteRevisao,
            'iteCarac': xy.iteCarac,
            'iteMin': xy.iteMin,
            'iteMax': xy.iteMax,
            'descCarac': xy.descCarac,
          })
          if (seq === 1) {
            this.cabRevisao = xy.cabRevisao;
            this.vigenciaDe = xy.vigenciaDe;
            this.vigenciaAte = xy.vigenciaAte;
            this.cabSituacao = xy.situacao;
            this.aplicacao = xy.aplicacao;
            this.embalagem = xy.embalagem;
            this.qualObsRevisao = xy.qualObsRevisao;
            this.qualObsGeral = xy.qualObsGeral;
          }
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
  voltaEspec() {
    this.router.navigate(['espec']);
  }

  incCarac() {

  }

}
