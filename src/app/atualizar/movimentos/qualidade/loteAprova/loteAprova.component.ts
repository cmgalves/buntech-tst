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
  selector: 'app-loteAprova',
  templateUrl: './loteAprova.component.html',
  styleUrls: ['./loteAprova.component.css']
})

export class LoteAprovaComponent implements OnInit {
  aUsr = JSON.parse(localStorage.getItem('user'))[0];
  aProd = JSON.parse(localStorage.getItem('loteAprv'));
  arrBusca: any = [];
  arrDados: any = [];
  aDados: any = [];
  Dados: any = [];
  filial: string = '';
  op: string = '';
  produto: string = '';
  descrProd: string = '';
  revisao: string = '';
  seq: string = '';
  validade: any = 0;
  especAlcada: string = '';
  analise: string = '';
  quebra: string = '';
  qtdeQuebra: string = '';
  lote: string = '';
  justificativa: string = '';
  nivel: string = '';
  n1: string = '';
  n2: string = '';
  n3: string = '';
  qtde: any = 0;
  qtdeTot: any = 0;
  dtProd: any = '';
  hrProd: any = '';
  dtVenc: any = '';
  obs: any = '';
  cTipo: any = 0;
  tpQuebra: string[] = ['Dia', 'Peso'];
  tpativo: string[] = ['Sim', 'Não'];
  lotes: Observable<any>;
  displayedColumns: string[] = ['op', 'descCarac', 'itemin', 'itemax', 'itemeio', 'result', 'situacao'];
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
    this.nivelAprovado(1);
  }

  nivelAprovado(nEnt) {
    this.arrBusca = {};
    this.aDados = [];
    const obj = {
      'filial': this.aProd.filial,
      'produto': this.aProd.produto,
      'lote': this.aProd.lote
    }
    this.arrBusca = this.fj.buscaPrt('relacaoNivelLoteAprova', obj);
    this.arrBusca.subscribe(cada => {
      cada.forEach(xy => {
        this.aDados.push({ nivel: xy.nivel, nivelAprov: xy.nivelAprov, situacao: xy.situacao })
        if (xy.nivelAprov == 'N1') {
          this.n1 = xy.situacao
        }
        if (xy.nivelAprov == 'N2') {
          this.n2 = xy.nivel == 'N1' ? 'Sem Aprovação' : xy.situacao
        }
        if (xy.nivelAprov == 'N3') {
          this.n3 = xy.nivel == 'N1' ? 'Sem Aprovação' : xy.nivel == 'N2' ? 'Sem Aprovação' : xy.situacao
        }
      });
      if (nEnt === 2) {
        this.confAprov()
      }
    });
  }

  buscaLoteDetalhes() {
    let ord = 0;
    let codCaracteristica = '';

    const obj = {
      'filial': this.aProd.filial,
      'produto': this.aProd.produto,
      'lote': this.aProd.lote,
      'analise': this.aProd.analise
    };
    this.arrBusca = this.fj.buscaPrt('relacaoLoteAnalisa', obj); //vw_pcp_relacao_lote_analisa

    this.arrBusca.subscribe(cada => {
      console.log(cada);
      cada.forEach(xy => {
        ord++
        if (codCaracteristica.indexOf(xy.codCarac) < 0) {
          codCaracteristica += xy.codCarac
          this.arrDados.push({
            'id_num': xy.id_num,
            'idEspecCab': xy.idEspecCab,
            'idEspecItens': xy.idEspecItens,
            'filial': xy.filial,
            'produto': xy.produto,
            'descrProd': xy.descrProd,
            'lote': xy.lote,
            'analise': xy.analise,
            'qtde': xy.qtde,
            'cabRevisao': xy.cabRevisao,
            'dtVenc': xy.dtVenc,
            'especAlcada': xy.especAlcada,
            'iteCarac': xy.iteCarac,
            'codCarac': xy.codCarac,
            'descCarac': xy.descCarac,
            'iteMin': xy.iteMin,
            'iteMax': xy.iteMax,
            'iteMeio': xy.iteMeio,
            'iteTxt': xy.iteTxt,
            'situacao': xy.situacao,
            'result': xy.result,
            'resultxt': xy.resultxt,
            'op': xy.op
          })
          if (ord === 1) {
            this.filial = xy.filial
            this.produto = xy.produto
            this.lote = xy.lote
            this.analise = xy.analise
            this.descrProd = xy.descrProd
            this.revisao = xy.cabRevisao
            this.nivel = xy.especAlcada
            this.n1 = xy.dtAprovn1
            this.n2 = xy.dtAprovn2
            this.n3 = xy.dtAprovn3
            this.dtVenc = xy.dtVenc
          }
        }
        this.qtdeTot = this.fg.formatarNumero(xy.qtde)

      })
      this.dataSource = new MatTableDataSource(this.arrDados)
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  aprovaLote(tipo: string) {
    let nivAprov = '';
    let sitAprov = '';
    let txtAprov = '';

    switch (this.aUsr.perfil) {
      case 'Qualidade N1':
        nivAprov = 'N1'
        break
      case 'Qualidade N2':
        nivAprov = 'N2'
        break
      case 'Qualidade N3':
        nivAprov = 'N3'
        break
      default:
        nivAprov = 'XX';
    }


    if (!(nivAprov == 'XX')) {
      if (nivAprov > this.nivel) {
        alert('Não precisa aprovar, até o Nível: ' + this.nivel)
      } else {
        if (this.temJustificativa()) {
          sitAprov = tipo === 'A' ? 'Aprovado' : 'Rejeitado'
          txtAprov = tipo === 'A' ? 'Confirma Aprovação?' : 'Confirma Rejeição'
          const obj = {
            'filial': this.filial,
            'op': ' ',
            'produto': this.produto,
            'descricao': this.descrProd,
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
            'situacao': sitAprov,
            'just': this.justificativa,
            'tipo': tipo,
          }

          if (confirm(txtAprov)) {
            this.fj.execProd('analisaAprovaLote', obj);
            this.nivelAprovado(2);
          }

        }
      }
    } else {
      alert('Usuário sem perfil de aprovação')
    }
  }

  confAprov() {
    let cResult: string = '';
    let nConta = 0;
    let cNiv = '';

    this.aDados.forEach(xy => {
      if (cNiv === '') {
        cNiv = xy.nivel

      }
      if (xy.nivel == 'N1') {
        nConta++;

        if (xy.situacao === 'Aprovado') {
          cResult = 'A'
        }
        if (xy.situacao === 'Rejeitado') {
          cResult = 'R'
        }
      }
      if (xy.nivel == 'N2') {
        if (xy.nivelAprov == 'N1' && (cResult == '' || cResult == 'A')) {
          nConta++;
          if (xy.situacao === 'Aprovado') {
            cResult = 'A'
          } else {
            cResult = 'R'
          }
        }
        if (xy.nivelAprov == 'N2' && (cResult == '' || cResult == 'A')) {
          nConta++;
          if (xy.situacao === 'Aprovado') {
            cResult = 'A'
          } else {
            cResult = 'R'
          }
        }
      }
      if (xy.nivel == 'N3') {
        if (xy.nivelAprov == 'N1' && (cResult == '' || cResult == 'A')) {
          nConta++;
          if (xy.situacao === 'Aprovado') {
            cResult = 'A'
          } else {
            cResult = 'R'
          }
        }
        if (xy.nivelAprov == 'N2' && (cResult == '' || cResult == 'A')) {
          nConta++;
          if (xy.situacao === 'Aprovado') {
            cResult = 'A'
          } else {
            cResult = 'R'
          }
        }
        if (xy.nivelAprov == 'N3' && (cResult == '' || cResult == 'A')) {
          nConta++;
          if (xy.situacao === 'Aprovado') {
            cResult = 'A'
          } else {
            cResult = 'R'
          }
        }
      }
    });
    if ((cNiv == 'N1' && nConta == 1) || (cNiv == 'N2' && nConta == 2) || (cNiv == 'N3' && nConta == 3)) {
      this.atuLoteProd(cResult)
    }
  }

  atuLoteProd(cSit: string) {
    let sitAprov = cSit === 'A' ? 'Aprovado' : 'Rejeitado'

    const obj = {
      'filial': this.filial,
      'op': ' ',
      'produto': this.produto,
      'descricao': this.descrProd,
      'lote': this.lote,
      'usrAprov': this.aUsr.codUser,
      'usrPerfil': '',
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
      'situacao': sitAprov,
      'just': this.justificativa,
      'tipo': 'L',
    }
    this.fj.execProd('analisaAprovaLote', obj);
    this.atuLoteAprov(cSit)
  }

  atuLoteAprov(cSit: string) {
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
          if (confirm('processado') == true) {
            window.location.reload();
          } else {
            window.location.reload();
          }
        } else {
          alert('aguardando')
        }
      });
    });
  }


  temJustificativa() {
    const tst = this.arrDados
    let cRet = ''

    tst.forEach(xx => {
      if (xx.situacao == 'Reprovado' && (this.justificativa).length < 10 && cRet == '') {
        cRet = 'Reprovado'
      }
    });
    if (cRet == '') {
      return true
    } else {
      alert('Justificativa Obrigatória')
      return false
    }
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
