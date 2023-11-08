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
  especAlcada: string = '';
  especAnalise: string = '';
  especSequencia: string = '';
  especQuebra: string = '';
  cabQtdeQuebra: string = '';
  cabRevisaoTemp: string = '';
  dataAprov: string = '';
  numEspec: string = '';
  cabSituacao: string = '';
  qualObsGeral: string = '';
  qualObsRevisao: string = '';
  aplicacao: string = '';
  embalagem: string = '';
  feitoPor: string = '';
  aprovPor: string = '';
  iteProduto: string = '';
  iteRevisao: string = '';
  iteCarac: string = '';
  iteMin: string = '';
  iteMax: string = '';
  iteMeio: string = '';
  descCarac: string = '';
  novoCarCod: string = '';
  novoCarDesc: string = '';
  novoCarMin: string = '';
  novoCarMax: string = '';
  novoCarTxt: string = '';
  novoCarMeio: string = '';
  laddCarac: boolean = true
  lForm: boolean = false;
  editInd = null;
  revisas: Observable<any>;

  sEspecAlcada: string[] = ['Sem alçada', 'N1', 'N1-N2', 'N1-N2-N3', 'N1-N3', 'N2-N3'];
  sEspecAnalise: string[] = ['SIM', 'NÃO'];
  sEspecSequencia: string[] = ['1', '2'];
  sEspecQuebra: string[] = ['HORA', 'QTDE'];



  especSit: string[] = ['Andamento', 'Concluída', 'Encerrada'];
  especNum: string[] = ['ITES-PA-BV', 'ITES-PA-CG', 'ITES-PA-CG-GCL', 'ITES-PA-IN', 'ITES-PA-PL', 'ITES-PA-STP'];

  displayedColumns: string[] = ['seq', 'iteCarac', 'descCarac', 'iteMin', 'iteMax', 'itetxt', 'iteMeio', 'iteEdit', 'iteExc'];
  dataSource: MatTableDataSource<cadRevisa>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  class: string = '';

  myControl = new UntypedFormControl();
  options: string[] = [];
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

  especificar(xInc, aRow) {
    let obj = {}
    if (xInc === 'I') {

      obj = {
        'iteProduto': this.cabProduto,
        'iteRevisao': this.cabRevisao,
        'iteCarac': this.novoCarCod,
        'iteMin': this.novoCarMin,
        'iteMax': this.novoCarMax,
        'iteMeio': this.novoCarMeio,
        'itetxt': this.novoCarTxt,
        'iteTp': 'I'
      }
    }
    if (xInc === 'A') {
      let vMin = (<HTMLInputElement>(document.getElementById("idMin"))).value.replace(',', '.')
      let vMax = (<HTMLInputElement>(document.getElementById("idMax"))).value.replace(',', '.')
      let cMeio = (<HTMLInputElement>(document.getElementById("idMeio"))).value.replace(',', '.')
      let ctxt = (<HTMLInputElement>(document.getElementById("idtxt"))).value

      obj = {
        'iteProduto': aRow.cabProduto,
        'iteRevisao': aRow.cabRevisao,
        'iteCarac': aRow.iteCarac,
        'iteMin': vMin,
        'iteMax': vMax,
        'iteMeio': cMeio,
        'itetxt': ctxt,
        'iteTp': 'A'
      }
    }

    if (xInc === 'E') {
      obj = {
        'iteProduto': aRow.cabProduto,
        'iteRevisao': aRow.cabRevisao,
        'iteCarac': aRow.iteCarac,
        'iteMin': 0,
        'iteMax': 0,
        'iteMeio': '',
        'itetxt': '',
        'iteTp': 'E'
      }
    }

    this.fj.execProd('incluiEspecItens', obj);
    window.location.reload();
  }

  alterar(cTipo) {
    if (cTipo === 'I') {
      if (this.cabRevisao !== '000' && this.cabRevisaoTemp == '') {
        alert('Já existe Revisão, Precisa Alterar ou incluir Um Numero de Revisão nova!')
        return;
      }
      if (this.cabRevisaoTemp == '') {
        this.cabRevisao = this.cabRevisao
      } else {
        this.cabRevisao = this.cabRevisaoTemp
      }
    }

    if (cTipo === 'R' && this.iteProduto === '' && this.cabRevisao !== '000') {
      alert('Esta REVISÃO não tem Especificação!')
      return;
    }
    if (cTipo === 'A' && this.cabRevisao === '000') {
      alert('Não é possível ALTERAR Especificações em Revisão igual a 000!')
      return;
    }
    const obj = {
      'cabProduto': this.cabProduto,
      'descrProd': this.descrProd,
      'cabRevisao': this.cabRevisao,
      'dataAprov': this.dataAprov,
      'numEspec': this.numEspec,
      'situacao': this.cabSituacao,
      'qualObsGeral': this.qualObsGeral,
      'qualObsRevisao': this.qualObsRevisao,
      'aplicacao': this.aplicacao,
      'embalagem': this.embalagem,
      'feitoPor': this.feitoPor,
      'aprovPor': this.aprovPor,
      'especAlcada': this.especAlcada,
      'especAnalise': this.especAnalise,
      'especSequencia': this.especSequencia,
      'especQuebra': this.especQuebra,
      'cTipo': cTipo,
      'cabQtdeQuebra': this.cabQtdeQuebra,

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
      this.novoCarMeio = ' '
    }
  }

  buscaRevisas() {
    let seq = 0;
    let aProd: any = JSON.parse(localStorage.getItem('especProd'));
    this.cabProduto = aProd.codigo;
    this.descrProd = aProd.descricao;
    this.cabRevisao = '000';
    this.cabSituacao = 'Andamento';
    const obj = {
      'cabProduto': this.cabProduto
    };
    this.arrDb = this.fj.buscaPrt('relacaoRevisaoEspec', obj);

    this.arrDb.subscribe(cada => {
      cada.forEach(xy => {
        seq++
        this.arrRev.push({
          'seq': seq,
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
          'aprovPor': xy.aprovPor,
          'iteProduto': xy.iteProduto,
          'iteRevisao': xy.iteRevisao,
          'iteCarac': xy.iteCarac,
          'iteMin': xy.iteMin.toFixed(3),
          'iteMax': xy.iteMax.toFixed(3),
          'itetxt': xy.itetxt,
          'iteMeio': xy.iteMeio,
          'descCarac': xy.descCarac,
          'especAlcada': xy.especAlcada,
          'especAnalise': xy.especAnalise,
          'especSequencia': xy.especSequencia,
          'especQuebra': xy.especQuebra,
          'cabQtdeQuebra': xy.cabQtdeQuebra,
        })
        if (seq === 1) {
          this.iteProduto = xy.iteProduto;
          this.cabRevisao = xy.cabRevisao;
          this.dataAprov = xy.dataAprov;
          this.numEspec = xy.numEspec;
          this.cabSituacao = xy.situacao;
          this.aplicacao = xy.aplicacao;
          this.embalagem = xy.embalagem;
          this.qualObsRevisao = xy.qualObsRevisao;
          this.qualObsGeral = xy.qualObsGeral;
          this.especAlcada = xy.especAlcada;
          this.especAnalise = xy.especAnalise;
          this.especSequencia = xy.especSequencia;
          this.especQuebra = xy.especQuebra;
          this.cabQtdeQuebra = xy.cabQtdeQuebra;
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

  editLinha(e, i) {
    this.editInd = i;
  }

  incCarac() {
    this.lForm = !this.lForm;
  }

}
