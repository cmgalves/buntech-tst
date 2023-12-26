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
  arrDados: any = [];
  arrCarac = [];
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
  loteAtual: string = '';
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
  btnLaudo: string = 'remove_done';
  laddCarac: boolean = true
  lForm: boolean = false;
  lespecSequencia: boolean = false;
  editInd = null;
  revisas: Observable<any>;
  imprimeLaudo: string = null;

  sEspecAlcada: string[] = ['Sem alçada', 'N1', 'N1-N2', 'N1-N2-N3', 'N1-N3', 'N2-N3'];
  sEspecAnalise: string[] = ['SIM', 'NAO'];
  sEspecSequencia: string[] = ['1', '2', '3', '4', '6', '8', '12', '24'];
  sEspecQuebra: string[] = ['HORA', 'QTDE'];



  especSit: string[] = ['Andamento', 'Concluida', 'Encerrada'];
  especNum: string[] = ['ITES-PA-BV', 'ITES-PA-CG', 'ITES-PA-CG-GCL', 'ITES-PA-IN', 'ITES-PA-PL', 'ITES-PA-STP'];

  displayedColumns: string[] = ['idEspecItens', 'iteCarac', 'descCarac', 'iteMin', 'iteMax', 'itetxt', 'iteMeio', 'iteLaudo', 'iteEdit'];
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

  // carregamento inicial da tela de revisões
  ngOnInit(): void {
    this.buscaRevisas();
    this.buscaCaracs();
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  // avalia os valores recebidos da análise.
  analiseProc(cVal, cTipo) {
    let anTipo = cVal.value
    let vlTipo = 0
    let vlQtde = 0

    if (cTipo === 'analise') {
      if (anTipo === 'SIM') {
        this.especQuebra = 'HORA';
        this.especSequencia = '6'
        this.cabQtdeQuebra = '4'
      }
      if (anTipo === 'NAO') {
        this.especQuebra = 'QTDE';
        this.especSequencia = '0'
        this.cabQtdeQuebra = '0'
      }
    }
    if (cTipo === 'qtde') {
      vlTipo = parseInt(anTipo);
      vlQtde = 24 / vlTipo;
      this.cabQtdeQuebra = vlQtde.toString()
    }

  }

  // monta um array via localstorage
  buscaCaracs() {
    this.arrCarac = [];
    this.arrDados = this.fj.buscaPrt('relacaoCarac', {});
    this.arrDados.subscribe(cada => {
      cada.forEach(xy => {
        this.arrCarac.push({
          'codCarac': xy.codCarac,
          'descCarac': xy.descCarac,
        })
      });
      localStorage.setItem('cadCarac', JSON.stringify(this.arrCarac));
    });
  }


  especificar(xInc, aRow) {
    let obj = {}
    if (xInc === 'I') {

      obj = {
        'idEspecItens': '0',
        'iteProduto': this.cabProduto,
        'iteRevisao': this.cabRevisao,
        'iteCarac': this.novoCarCod,
        'iteMin': this.novoCarMin,
        'iteMax': this.novoCarMax,
        'iteMeio': this.novoCarMeio,
        'itetxt': this.novoCarTxt,
        'iteLaudo': 'SIM',
        'iteTp': 'I'
      }
    }
    if (xInc === 'A') {
      let vMin = (<HTMLInputElement>(document.getElementById("idMin"))).value.replace(',', '.')
      let vMax = (<HTMLInputElement>(document.getElementById("idMax"))).value.replace(',', '.')
      let cMeio = (<HTMLInputElement>(document.getElementById("idMeio"))).value.replace(',', '.')
      let ctxt = (<HTMLInputElement>(document.getElementById("idtxt"))).value

      obj = {
        'idEspecItens': aRow.idEspecItens,
        'iteProduto': aRow.cabProduto,
        'iteRevisao': aRow.cabRevisao,
        'iteCarac': aRow.iteCarac,
        'iteMin': vMin,
        'iteMax': vMax,
        'iteMeio': cMeio,
        'itetxt': ctxt,
        'iteLaudo': aRow.iteCarac,
        'iteTp': 'A'
      }
    }

    if (xInc === 'E') {
      obj = {
        'idEspecItens': aRow.idEspecItens,
        'iteProduto': aRow.cabProduto,
        'iteRevisao': aRow.cabRevisao,
        'iteCarac': aRow.iteCarac,
        'iteMin': 0,
        'iteMax': 0,
        'iteMeio': '',
        'itetxt': '',
        'iteLaudo': '',
        'iteTp': 'E'
      }
    }

    if (xInc === 'L') {
      obj = {
        'idEspecItens': aRow.idEspecItens,
        'iteProduto': aRow.cabProduto,
        'iteRevisao': aRow.cabRevisao,
        'iteCarac': aRow.iteCarac,
        'iteMin': aRow.iteCarac,
        'iteMax': aRow.iteCarac,
        'iteMeio': aRow.iteCarac,
        'itetxt': aRow.iteCarac,
        'iteLaudo': aRow.iteLaudo == 'SIM' ? 'NAO' : 'SIM',
        'iteTp': 'L'
      }
    }

    this.fj.execProd('incluiEspecItens', obj); //PCP..sp_incluiEspecItens
    window.location.reload();
  }

  alterar(cTipo) {

    if (this.validarHoras()) return
    if (this.validarTipos(cTipo)) return

    if (cTipo === 'I') {
      if (this.cabRevisaoTemp == '') {
        this.cabRevisao = this.cabRevisao
      } else {
        this.cabRevisao = this.cabRevisaoTemp
      }
    }

    const obj = {
      'cabProduto': this.cabProduto,
      'descrProd': this.descrProd,
      'cabRevisao': this.cabRevisao,
      'numEspec': this.numEspec,
      'situacao': this.cabSituacao,
      'qualObsGeral': this.qualObsGeral,
      'qualObsRevisao': this.qualObsRevisao,
      'aplicacao': this.aplicacao,
      'loteAtual': this.loteAtual,
      'embalagem': this.embalagem,
      'feitoPor': this.arrUserLogado.codUser,
      'aprovPor': this.arrUserLogado.codUser,
      'especAlcada': this.especAlcada,
      'especAnalise': this.especAnalise.substring(0, 1),
      'especSequencia': this.especSequencia,
      'especQuebra': this.especQuebra,
      'cTipo': cTipo,
      'cabQtdeQuebra': this.cabQtdeQuebra,
      'imprimeLaudo': this.imprimeLaudo.substring(0, 1),
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
    this.loteAtual = '000000000';
    this.cabSituacao = 'Andamento';
    const obj = {
      'cabProduto': this.cabProduto
    };
    this.arrDb = this.fj.buscaPrt('relacaoRevisaoEspec', obj); //PCP..View_Relacao_Espec

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
          'loteAtual': xy.loteAtual,
          'embalagem': xy.embalagem,
          'feitoPor': xy.feitoPor,
          'aprovPor': xy.aprovPor,
          'iteProduto': xy.iteProduto,
          'iteRevisao': xy.iteRevisao,
          'iteCarac': xy.iteCarac,
          'iteMin': xy.iteMin.toFixed(3),
          'iteMax': xy.iteMax.toFixed(3),
          'itetxt': xy.itetxt,
          'iteLaudo': xy.iteLaudo,
          'iteMeio': xy.iteMeio,
          'descCarac': xy.descCarac,
          'especAlcada': xy.especAlcada,
          'especAnalise': xy.especAnalise,
          'especSequencia': xy.especSequencia,
          'especQuebra': xy.especQuebra,
          'cabQtdeQuebra': xy.cabQtdeQuebra,
          'imprimeLaudo': xy.imprimeLaudo,
        })
        if (seq === 1) {
          this.iteProduto = xy.iteProduto;
          this.cabRevisao = xy.cabRevisao;
          this.dataAprov = xy.dataAprov;
          this.numEspec = xy.numEspec;
          this.cabSituacao = xy.situacao;
          this.aplicacao = xy.aplicacao;
          this.loteAtual = xy.loteAtual;
          this.embalagem = xy.embalagem;
          this.qualObsRevisao = xy.qualObsRevisao;
          this.qualObsGeral = xy.qualObsGeral;
          this.especAlcada = xy.especAlcada;
          this.especAnalise = xy.especAnalise == 'S' ? 'SIM' : 'NAO';
          this.especSequencia = xy.especSequencia;
          this.especQuebra = xy.especQuebra;
          this.cabQtdeQuebra = xy.cabQtdeQuebra;
          this.imprimeLaudo = xy.imprimeLaudo;
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

  // validação das horas digitadas na quebra dos lotes
  validarHoras() {
    let tpQuebra = this.especQuebra
    let qtdeQubra = parseFloat(this.cabQtdeQuebra)
    if (tpQuebra == 'HORA') {
      if (qtdeQubra == 0) {
        alert('A quebra por HORA está ZERO. Horas possíveis: (1,2,4,6,8,12)');
        this.cabQtdeQuebra = '0'
        return true;
      };
      if (qtdeQubra > 24) {
        alert('A quebra por HORA deve ser de, no máximo, 24 horas. Horas possíveis: (1,2,4,6,8,12)');
        this.cabQtdeQuebra = '0'
        return true;
      };
      if (24 % qtdeQubra > 0) {
        alert('A quebra por HORA deve ser múltiplo de 24. Horas possíveis: (1,2,4,6,8,12)');
        this.cabQtdeQuebra = '0'
        return true;
      };
    }
    if (tpQuebra == 'QTDE') {
      if (qtdeQubra == 0) {
        alert('A quebra por QTDE está ZERO.');
        this.cabQtdeQuebra = '0'
        return true;
      };

    }
    return false
  }

  // validação dos tipos de cada alteração das especificações
  validarTipos(tipoAltera) {
    if (tipoAltera === 'I' && this.cabRevisao !== '000' && this.cabRevisaoTemp == '') {
      alert('Já existe Revisão, Precisa Alterar ou incluir Um Numero de Revisão nova!');
      return true;
    }

    if (tipoAltera === 'R' && this.iteProduto === '' && this.cabRevisao !== '000') {
      alert('Esta REVISÃO não tem Especificação!');
      return true;
    }
    if (tipoAltera === 'A' && this.cabRevisao === '000') {
      alert('Não é possível ALTERAR Especificações em Revisão igual a 000!');
      return true;
    }
    return false
  }
}
