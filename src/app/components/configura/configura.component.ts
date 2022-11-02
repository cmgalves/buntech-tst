import { Component, OnInit, ViewChild } from '@angular/core';
import { funcsService } from '../../funcs/funcs.service';
import { Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';


@Component({
  selector: 'app-configura',
  templateUrl: './configura.component.html',
  styleUrls: ['./configura.component.css']
})

export class ConfiguraComponent implements OnInit {
  arrUserLogado = JSON.parse(localStorage.getItem('user'))[0];
  cRest: string = '';
  aRest: any = [];
  dbCodPar: any = [];
  cconect: string = '';
  cusur: string = '';
  cpass: string = '';
  cserv: string = '';
  cdb: string = '';
  ctipo: string = '';
  chost: string = '';
  cprt: string = '';
  cencrypt: string = '';
  cenableArithAbort: string = '';
  cdialect: string = '';
  cinstanceName: string = '';
  constructor(
    public router: Router,
    private fj: funcsService,
  ) { }

  ngOnInit(): void {
    if (this.arrUserLogado.perfil === 'Administrador') {
      this.buscaConfig('_ini_');
    } else {
      alert('Sem Acesso')
      this.router.navigate(['opResumo']);
    }
  }


  buscaConfig(xn) {
    let strPesq = '';
    this.aRest = this.fj.buscaPar('config');
    this.aRest.subscribe(dx => {
      this.dbCodPar = [];
      dx.forEach((xy, ix) => {
        strPesq = (xy.serv + xy.db + xy.instanceName).toUpperCase();
        if (xn === '_ini_') {
          this.dbCodPar.push([ix, xy.conect, xy.usur, xy.pass, xy.serv, xy.db, xy.tipo, xy.host, xy.prt, xy.encrypt, xy.enableArithAbort, xy.dialect, xy.instanceName]);
        } else {
          if (strPesq.includes(xn.toUpperCase())) {
            this.dbCodPar.push([ix, xy.conect, xy.usur, xy.pass, xy.serv, xy.db, xy.tipo, xy.host, xy.prt, xy.encrypt, xy.enableArithAbort, xy.dialect, xy.instanceName]);
          }
        }
      });
    });
  }

  altPar(xi) {
    this.cconect = xi[1];
    this.cusur = xi[2];
    this.cpass = xi[3];
    this.cserv = xi[4];
    this.cdb = xi[5];
    this.ctipo = xi[6];
    this.chost = xi[7];
    this.cprt = xi[8];
    this.cencrypt = xi[9];
    this.cenableArithAbort = xi[10];
    this.cdialect = xi[11];
    this.cinstanceName = xi[12];

    // let obj = {
    //   'codUser': xi.xpto,
    //   'empresa': xi.xpto,
    //   'nome': xi.xpto,
    //   'email': xi.xpto,
    //   'senha': xi.xpto,
    //   'perfil': xi.xpto,
    //   'depto': xi.xpto,
    //   'telefone': xi.xpto,
    // }

    // this.fj.execPar('altParametros', obj);

    // window.location.reload();

  }


  alterCommit() {
    if (this.cconect === '') {
      alert('Tudo vazio')
      return
    }
    let obj = {
      'conect': this.cconect,
      'usur': this.cusur,
      'pass': this.cpass,
      'serv': this.cserv,
      'db': this.cdb,
      'tipo': this.ctipo,
      'host': this.chost,
      'prt': this.cprt,
      'encrypt': this.cencrypt,
      'enableArithAbort': this.cenableArithAbort,
      'dialect': this.cdialect,
      'instanceName': this.cinstanceName,
    }

    this.fj.execPar('altParametros', obj);

    window.location.reload();

  }

}
