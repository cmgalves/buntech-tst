import { Component, OnInit, ViewChild } from '@angular/core';
import { funcsService } from '../../funcs/funcs.service';
// import * as XLSX from 'xlsx';



// tslint:disable-next-line:class-name

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  arrProduto: any = [];
  prdTotal = 0;
  prdAtivo = 0;
  prdBloq = 0;

  constructor(
    private funcJson: funcsService,
  ) { }

  ngOnInit() {
    this.buscaProdutos();
  }

  buscaProdutos() {
    const obj = {
      'produto': ''
    };

    this.arrProduto = this.funcJson.buscaPrt('cadastroProdutos', obj);

    this.arrProduto.subscribe(cada => {
      cada.forEach(xy => {
        this.prdTotal++;
        if (xy.situacao === 'Bloqueado') {
          this.prdBloq++
        } else {
          this.prdAtivo++
        }
      });
    })
  }
}
