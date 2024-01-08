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
  arrUserLogado = JSON.parse(localStorage.getItem('user'))[0];
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
  justificativa1: string = '';
  justificativa2: string = '';
  justificativa3: string = '';
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
            'situacao': xy.situacao.charAt(0).toUpperCase() + xy.situacao.slice(1).toLowerCase(),
            'result': xy.result,
            'resultxt': xy.resultxt,
            'op': xy.op
          })
          if (ord === 1) {
            console.log(this.aProd)
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
            this.op = xy.op
            this.justificativa1 = this.aProd.justificativa1,
              this.justificativa2 = this.aProd.justificativa2,
              this.justificativa3 = this.aProd.justificativa3
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
    var tipoAprovn1 = this.aProd.tipoAprova1;
    var tipoAprovn2 = this.aProd.tipoAprova2;
    var tipoAprovn3 = this.aProd.tipoAprova3;
    var dtAprovn1 = this.aProd.dtAprovn1;
    var dtAprovn2 = this.aProd.dtAprovn2;
    var dtAprovn3 = this.aProd.dtAprovn3;   //Valores anteriores / valores padrão
    var usrAprovn1 = this.aProd.usrAprovn1;
    var usrAprovn2 = this.aProd.usrAprovn2;
    var usrAprovn3 = this.aProd.usrAprovn3;
    var justificativa1 = this.justificativa1;
    var justificativa2 = this.justificativa2;
    var justificativa3 = this.justificativa3;
    var loteAprov;

    var rejeitaTodos = false;
    var aprovaN3 = false;
    var aprovaN2 = false;
    const DataAtual = new Date().toISOString().split('T')[0]; //A data de hoje

    if (!this.nivel.includes('N3')) aprovaN3 = true;
    if (!this.nivel.includes('N2')) aprovaN2 = true;

    if (this.justificativa == "") {
      console.log(this.justificativa)
      return alert("Justificativa é obrigatória");
    } // Checa se tem justificativa

    if (!(this.fj.acessoUsuario(this.aUsr, this.nivel)))
      return alert("Você não tem a permissão necessária para aprovar esse item"); //Checa se o usuário tem o perfil
    //que coincide com a alcada do lote

    if (tipo != 'A') {
      rejeitaTodos = true; //Se o N1 aprova, aprova todos os níveis
      loteAprov = 'REPROVADO' //Altera o status do lote para aprovado
    }

    if (this.aProd.loteAprov == 'SEGREGADO' || rejeitaTodos) { //Se a alcada conter N1 e for momento de
      usrAprovn1 = this.aUsr.codUser;                                       //de aprovar o N1 (lote Segregado)      
      dtAprovn1 = DataAtual;
      tipoAprovn1 = tipo;
      loteAprov = tipo == 'A' ? 'REAVALIACAO N2' : 'REPROVADO' //passa para o N2 Reavaliar ou rejeita
      nivAprov = 'N1';
      justificativa1 = this.justificativa;
    }

    if (this.aProd.loteAprov == 'REAVALIACAON2' || rejeitaTodos || aprovaN2) { //Se é possível aprovar
      usrAprovn2 = this.aUsr.codUser;                             //N2 ou se tudo será
      dtAprovn2 = DataAtual;                                      //aprovado
      tipoAprovn2 = tipo;
      if (tipo == 'A')
        loteAprov = aprovaN3 ? 'REAVALIACAO' : 'REAVALIACAO N3'; //passa para o N3 reavaliar ou finaliza
      nivAprov = 'N2';
      justificativa2 = this.justificativa;
    }

    if (this.aProd.loteAprov == 'REAVALIACAON3' || rejeitaTodos || aprovaN3) { //Se é possível aprovar
      usrAprovn3 = this.aUsr.codUser;                                         //N3 ou se tudo será
      dtAprovn3 = DataAtual;                                                  //aprovado
      tipoAprovn3 = tipo;
      if (tipo = 'A')
        loteAprov = aprovaN3 ? loteAprov : 'REAVALIACAO' //O que ocorre após o N3 aprovar? ¯\_(ツ)_/¯
      nivAprov = 'N3';
      justificativa3 = this.justificativa;
    }

    if (tipoAprovn1 == 'A' && tipoAprovn2 == 'A' && tipoAprovn3 == 'A')
      loteAprov = 'APROVADO'; //Se todos aprovarem, muda para aprovado

    if (nivAprov != '') {
      txtAprov = tipo === 'A' ? 'Confirma Aprovação?' : 'Confirma Rejeição'

      const obj = {
        produto: this.produto,
        usrAprovn1: usrAprovn1,
        usrAprovn2: usrAprovn2,
        usrAprovn3: usrAprovn3, //Cria um objeto com todas os campos que serão alterados
        dtAprovn1: dtAprovn1,
        dtAprovn2: dtAprovn2,
        dtAprovn3: dtAprovn3,
        tipoAprovn1: tipoAprovn1,
        tipoAprovn2: tipoAprovn2,
        tipoAprovn3: tipoAprovn3,
        justificativa1: justificativa1,
        justificativa2: justificativa2,
        justificativa3: justificativa3,
        lote: this.lote,
        op: this.op,
        analise: this.analise,
        filial: this.filial,
        loteAprov: loteAprov,
      }

      this.fj.confirmDialog(txtAprov).subscribe(q => {
        if (q) {
          this.fj.buscaPrt('aprovalote', obj).subscribe(q => console.log(q));
          this.nivelAprovado(2);
          this.router.navigate(['loteReg']);
        }
      });
    } else alert("USUÁRIO NÃO TEM NÍVEL PARA APROVAÇÃO");
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
      'iteTxt': ' ',
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

  reclassifica(mesmaOp: string) {
    const lote = this.aProd;
    lote.loteAprov = "RECLASSIFICA " + mesmaOp;
    console.log(lote);

    this.fj.enviarLoteProteus(lote, true);
  }

}
