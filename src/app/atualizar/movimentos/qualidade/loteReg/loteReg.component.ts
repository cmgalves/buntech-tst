import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import * as XLSX from 'xlsx';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { funcsService } from '../../../../funcs/funcs.service';
import { funcGeral } from 'app/funcs/funcGeral';

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
  selector: 'app-loteReg',
  templateUrl: './loteReg.component.html',
  styleUrls: ['./loteReg.component.css']
})

export class LoteRegComponent implements OnInit {
  arrUserLogado = JSON.parse(localStorage.getItem('user'))[0];
  arrBusca: any = [];
  arrDados: any = [];
  arrCarac: any = [];
  filLoteReg: string = '';
  filterLoteReg: any = ['Todos', 'Aberto', 'Fechado', 'Aprovado', 'Rejeitado'];

  loteRegs: Observable<any>;
  displayedColumns: string[] = ['filial', 'op', 'produto', 'descricao', 'lote', 'loteAprov', 'dtAprov', 'dtProd', 'dtVenc', 'qtdeProd', 'quebra', 'qtdeQuebra', 'situacao', 'analiseStatus', 'loteReg'];
  dataSource: MatTableDataSource<cadLoteReg>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  class: string = '';

  constructor(
    public router: Router,
    private fg: funcGeral,
    private fj: funcsService,
  ) { }

  ngOnInit(): void {

    if (('Administrador, Qualidade N1, Qualidade N2, Qualidade N3').indexOf(this.arrUserLogado.perfil) >= 0) {
      this.buscaLoteRegs('Todos');
    } else {
      alert('Sem Acesso')
      this.router.navigate(['opResumo']);
    }
  }

  // busca a relação de produtos com as loteRegções
  buscaLoteRegs(xcFil) {
    let ord = 0;
    this.arrDados = [];

    this.arrBusca = this.fj.buscaPrt('relacaoLoteRegistro', { 'xcFil': xcFil });
    this.arrBusca.subscribe(cada => {
      cada.forEach(xy => {
        ord++
        this.arrDados.push({
          'id_loteRegProd': xy.id_loteRegProd,
          'filial': xy.filial,
          'op': xy.op,
          'produto': xy.produto,
          'descricao': xy.descricao,
          'lote': xy.lote,
          'loteAprov': xy.loteAprov,
          'dtAprov': xy.dtAprov,
          'usrAprov': xy.usrAprov,
          'usrProd': xy.usrProd,
          'dtProd': this.fg.dtob(xy.dtProd),
          'hrProd': xy.hrProd,
          'dtVenc': this.fg.dtob(xy.dtVenc),
          'qtdeProd': xy.qtdeProd,
          'qtdeQuebra': xy.qtdeQuebra,
          // 'qtdeTot': xy.qtdeTot,
          'seqProd': xy.seqProd,
          'quebra': xy.quebra,
          'revisao': xy.revisao,
          'situacao': xy.situacao,
          // 'obs': xy.obs,
          'analiseStatus': xy.analiseStatus,
          // 'dtAnaliseStatus': xy.dtAnaliseStatus,
        })
      });
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

  acessoLoteReg(xcRow) {
    const _aProd = this.arrDados.filter(x => (x.produto === xcRow.produto))[0];
    localStorage.removeItem('loteRegProd');
    localStorage.setItem('loteRegProd', JSON.stringify(_aProd));
    this.router.navigate(['loteRegGestao']);
  }

  altFilter(xcEvento) {
    this.buscaLoteRegs(xcEvento.value)
  }
  // habilita e desabilita os dados os botões na tela da OP
  btnDisable(aRow, tp) {
    if (tp=='aprova') {
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

}