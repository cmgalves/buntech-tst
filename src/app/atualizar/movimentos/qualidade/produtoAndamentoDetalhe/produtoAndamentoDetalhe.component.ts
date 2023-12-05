import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import * as XLSX from 'xlsx';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { funcsService } from '../../../../funcs/funcs.service';
import { funcGeral } from 'app/funcs/funcGeral';
import {Location} from '@angular/common';

export interface cadLoteReg {
  seq: string;
  codigo: string;
  descricao: string;
  tipo: string;
  unidade: string;
  grupo: string;
  ncm: string;
  situacao: string;
  revisao: string;
}

@Component({
  selector: 'app-produtoAndamentoDetalhe',
  templateUrl: './produtoAndamentoDetalhe.component.html',
  styleUrls: ['./produtoAndamentoDetalhe.component.css']
})

export class ProdutoAndamentoDetalheComponent implements OnInit {
  arrUserLogado = JSON.parse(localStorage.getItem('user'))[0];
  arrBusca: any = [];
  arrDados: any = [];
  arrCarac: any = [];
  filLoteReg: string = '';
  filterLoteReg: any = ['Todos', 'Aberto', 'Fechado', 'Aprovado', 'Rejeitado'];
  filterPosAnalise: any = ['Todos', 'Andamento', 'Aguardando', 'Analisado'];
  filPosAnalise: string = 'Todos';
  showOverlay = false;
  finishLoading = () => {this.showOverlay = false; location.reload();
  }

  loteRegs: Observable<any>;
  displayedColumns: string[] = ['filial', 'op', 'produto', 'descrProd', 'qtde_lote', 'qtde'];
  dataSource: MatTableDataSource<cadLoteReg>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  class: string = '';

  produto = "";
  op = "";

  constructor(
    public router: Router,
    private fg: funcGeral,
    private fj: funcsService,
    private _location: Location
  ) { }

  ngOnInit(): void {
    if (('Administrador, Qualidade N1, Qualidade N2, Qualidade N3').indexOf(this.arrUserLogado.perfil) >= 0) {
      this.buscaProdutosAndamento('Todos');
    } else {
      alert('Sem Acesso')
      this.router.navigate(['opResumo']);
    }
  }

  // busca a relação de produtos com as loteRegções
  buscaProdutosAndamento(xcFil) {
    let ord = 0;
    this.arrDados = [];

    this.arrBusca = this.fj.buscaPrt('produtoAndamentoDetalhe', {produto: localStorage.getItem('produtoAndamentoDetalhe')});
    this.arrBusca.subscribe(cada => {
      cada.forEach(xy => {
        ord++
        this.arrDados.push({
          ...xy,
          qtde_lote: xy.qtde_lote==null?0:xy.qtde_lote
        })
      });
      console.log(this.arrDados);
      const resultado = this.arrDados.reduce((acc, elemento) => {
        const chave = `${elemento.filial}-${elemento.produto}-${elemento.op}`;
        const encontrado = acc.find(item => item.chave === chave);
        if (encontrado) {
          encontrado.qtde += elemento.qtde;
        } else {
          acc.push({ chave, ...elemento });
        }
        return acc;
      }, []);

      this.arrDados = resultado;


      this.filLoteReg = xcFil;
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

  checarAcesso(row) {
    const podeAcessar = (`Administrador, ${row.alcadaProd ? row.alcadaProd : ''}`).indexOf(this.arrUserLogado.perfil) >= 0
    return row.analiseStatus != 'analisado' || row.situacao != 'Fechado' || !podeAcessar
  }

  acessoLoteReg(xcRow) {
    const _aProd = this.arrDados.filter(x => (x.produto === xcRow.produto))[0];
    localStorage.removeItem('loteRegProd');
    localStorage.setItem('loteRegProd', JSON.stringify(_aProd));
    this.router.navigate(['loteRegGestao']);
  }

  altFilter(xcEvento) {
    let arrFiltrado = this.arrDados;
    if (this.filLoteReg != "Todos") {
      arrFiltrado = arrFiltrado.filter(x => x.situacao?.toUpperCase() == this.filLoteReg?.toUpperCase());
      this.dataSource = new MatTableDataSource(arrFiltrado);
      console.log(arrFiltrado);
    } if (this.filPosAnalise != "Todos") {
      arrFiltrado = arrFiltrado.filter(x => x.analiseStatus?.toUpperCase() == this.filPosAnalise?.toUpperCase());
      this.dataSource = new MatTableDataSource(arrFiltrado);
      console.log(arrFiltrado);
    }
    else if(this.filLoteReg == "Todos") {
      this.dataSource = new MatTableDataSource(this.arrDados);
    }
  }

  // habilita e desabilita os dados os botões na tela da OP
  btnDisable(aRow, tp) {
    if (tp == 'aprova') {
      if (aRow.analiseStatus != 'analisado') {
        return false
      }
    }

    if (tp === 'a') {
      if ((("Baixada ").indexOf(aRow.SITUACAO) > -1)) {
        if ((('Administrador | Apontador | Conferente-Apontador').indexOf(this.arrUserLogado.perfil) > -1)) {
          return false;
        }
      }
    }

    if (tp === 'c') {
      if ((("Produção | Interrompida | Baixada ").indexOf(aRow.SITUACAO) > -1)) {
        if ((('Administrador | Apontador | Conferente-Apontador').indexOf(this.arrUserLogado.perfil) > -1)) {
          return false;
        }
      }
    }
    return false
  }

  detalheLote(xcRow) {
    const _aProd = this.arrDados.filter(x => (x.produto === xcRow.produto && x.lote === xcRow.lote))[0];
    localStorage.removeItem('loteDetalhe');
    localStorage.setItem('loteDetalhe', JSON.stringify(_aProd));
    this.router.navigate(['loteDetalhe']);
  }

  adiantaLote(aRow) {
    const obj = {
      filial: aRow.filial,
      produto: aRow.produto,
      lote: aRow.lote,
      usrProd: this.arrUserLogado.codUser,
    };

    if (aRow.situacao === 'Fechado') {
      alert('Lote já está Fechado')
    } else {
      const _aProd = this.arrDados.filter(x => (x.produto === aRow.produto && x.lote === aRow.lote))[0];
      localStorage.removeItem('loteAdianta');
      localStorage.setItem('loteAdianta', JSON.stringify(_aProd));
      this.router.navigate(['loteAdianta']);
    }
  }


  analisaLote(xcRow) {
    const _aProd = this.arrDados.filter(x => (x.produto === xcRow.produto && x.lote === xcRow.lote))[0];
    localStorage.removeItem('loteAnalisa');
    localStorage.setItem('loteAnalisa', JSON.stringify(_aProd));
    this.router.navigate(['loteAnalisa']);
  }
  aprovaLote(xcRow) {
    const _aProd = this.arrDados.filter(x => (x.produto === xcRow.produto && x.lote === xcRow.lote))[0];
    localStorage.removeItem('loteAprv');
    localStorage.setItem('loteAprv', JSON.stringify(_aProd));
    this.router.navigate(['loteAprova']);
  }

  imprimeLote() {
    alert('Imprime Lote')
  }

  async processarLote() {
    this.showOverlay = true;
    this.produto = this.arrDados[0].produto;
    this.fj.gerarLote({op:this.op, produto:this.produto}, this.finishLoading);
  }

  comboboxOP(){
    let clone = [...this.arrDados]
    return [...new Set(clone.map(x => x.op))];
  }

  backClicked() {
    this._location.back();
  }

  formatarNumero(numero){
    return  numero.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

}
