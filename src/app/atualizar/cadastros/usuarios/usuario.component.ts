import { Component, OnInit, ViewChild } from '@angular/core';
import { funcsService } from '../../../shared/funcs/funcs.service';
import { Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';

// tslint:disable-next-line:class-name
export interface cadUsuario {
  empresa: string;
  nome: string;
  email: string;
  senha: string;
  perfil: string;
  telefone: string;
  depto: string;
}

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})

export class UsuarioComponent implements OnInit {
  arrUserLogado = JSON.parse(localStorage.getItem('user'))[0];
  arrUsuario: any = [];
  arrUsuarioTab: any = [];
  arrEmpresa: any = [];
  arrEmpresaTab: any = [];
  valEmpresa: string = '';
  valPerfil: string = '';
  usuarioCodigo: string = '';
  usuarioEmpresas: string = '';
  usuarioNome: string = '';
  usuarioEmail: string = '';
  usuarioSenha: string = '';
  usuarioFone: string = '';
  usuarioDepto: string = '';
  altIncuser: string = '';
  optPerfil: string[] = ['Apontador', 'Conferente', 'Conferente-Apontador', 'Administrador'];
  arrFilial: any = ['101', '107', '117', '402', '108', '206']
  usuarios: Observable<any>;
  displayedColumns: string[] = ['nome', 'email', 'empresa', 'perfil', 'telefone', 'depto', 'edicao'];
  dataSource: MatTableDataSource<cadUsuario>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;


  // Campina Grande - 888
  // Servidor de HML:10.3.0.92
  // Filiais:101,107,117,402
  
  // Boa vista - 886
  // Servidor de HML:10.1.0.250
  // Filiais:108
  
  
  // Indaiatuba - 887
  // Servidor de HML: 10.3.0.204
  // Filiais:206


  constructor(
    public router: Router,
    private funcJson: funcsService,
  ) { }

  ngOnInit(): void {
    if (this.arrUserLogado.perfil === 'Administrador') {
      this.buscaEmpresas();
      this.buscaUsuarios();
    } else {
      alert('Sem Acesso')
      this.router.navigate(['opResumo']);
    }
    this.altIncuser = 'i';
  }

  buscaEmpresas() {
    const obj = {};
    this.arrEmpresa = this.funcJson.buscaPost('empresasBuntech', obj);

    this.arrEmpresa.subscribe(cada => {
      cada.forEach(xy => {
        if (this.arrFilial.indexOf(xy.codFil) > -1) {
          this.arrEmpresaTab.push({
            'codFil': xy.codFil,
            'nomeFil': xy.codFil + ' - ' + xy.nomeFil,
            'nomeComercial': xy.nomeComercial,
          })
        }

      });

    });
  }

  buscaUsuarios() {
    const obj = {};
    this.arrUsuario = this.funcJson.busca883('cadUsuarios', obj);

    this.arrUsuario.subscribe(cada => {
      cada.forEach(xy => {
        this.arrUsuarioTab.push({
          'codUser': xy.codigo,
          'empresa': xy.empresa,
          'nome': xy.nome,
          'email': xy.email,
          'senha': xy.senha,
          'perfil': xy.perfil,
          'depto': xy.depto,
          'telefone': xy.telefone,
        })

      });
      this.dataSource = new MatTableDataSource(this.arrUsuarioTab)
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }


  atuEmpresa() {
    if (this.usuarioEmpresas === '') {
      this.usuarioEmpresas = this.valEmpresa
    } else {

      if (this.usuarioEmpresas.indexOf(this.valEmpresa) < 0) {
        this.usuarioEmpresas = this.usuarioEmpresas + ' - ' + this.valEmpresa
      } else {
        if (this.usuarioEmpresas.indexOf(' - ' + this.valEmpresa) > -1) {
          this.usuarioEmpresas = this.usuarioEmpresas.replace(' - ' + this.valEmpresa, '')
        } else {
          this.usuarioEmpresas = this.usuarioEmpresas.replace(this.valEmpresa, '')
        }
      }
    }
    if (this.usuarioEmpresas.substring(0, 1) === ' ') {
      this.usuarioEmpresas = this.usuarioEmpresas.substring(3, 101)
    }
  }

  incUser() {
    let conta = 0;
    if (this.altIncuser === 'i') {
      this.arrUsuarioTab.forEach(xy => {
        if (this.usuarioEmail == xy.email) {
          conta++
        }
      });
    }


    if (conta === 0) {
      let obj = {
        'codUser': this.usuarioCodigo == '' ? 0 : this.usuarioCodigo,
        'empresa': this.usuarioEmpresas,
        'nome': this.usuarioNome,
        'email': this.usuarioEmail,
        'senha': this.usuarioSenha,
        'perfil': this.valPerfil,
        'depto': this.usuarioDepto,
        'telefone': this.usuarioFone,
      }

      if (this.usuarioNome === '' || this.usuarioEmail === '') {
        alert('Usu??rio ou Email em branco')
        return true
      } else {
        this.funcJson.execProd('incluiAlteraUsuario', obj);

        window.location.reload();

      }
    } else {
      alert('Email j?? em Uso')
    }
  }

  editUser(xcObl) {
    this.usuarioCodigo = xcObl.codUser
    this.usuarioEmpresas = xcObl.empresa
    this.usuarioNome = xcObl.nome
    this.usuarioEmail = xcObl.email
    this.usuarioSenha = xcObl.senha
    this.valPerfil = xcObl.perfil
    this.usuarioDepto = xcObl.depto
    this.usuarioFone = xcObl.telefone
    this.altIncuser = 'e';
  }



  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


}
