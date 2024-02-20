import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { funcsService } from 'app/funcs/funcs.service';
import { AuthService } from "../shared/services/auth.service";

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})

export class SignInComponent implements OnInit {
  xlAcessa: boolean = true;
  xlTroca: boolean = false;
  userName: string = '';
  userPassword: string = '';
  usuarioCodigo: string = '';
  userNameTroca: string = '';
  senhaAntiga: string = '';
  senhaNova: string = '';
  xcPerfil: string = '';
  arrUsuario: any = [];
  arrUsuarioTab: any = [];
  arrUsr: any = [];


  constructor(
    public router: Router,
    public authService: AuthService,
    private fj: funcsService,
  ) { }

  ngOnInit() {
    this.buscaUsuarios();
  }

  trocaSenha() {
    this.xlAcessa = false;
    this.xlTroca = true;
  }
  voltaSenha() {
    this.xlAcessa = true;
    this.xlTroca = false;
  }

  // Sign in with email/password
  SignIn() {
    let conta = 5;
    let xcPerfil = '';
    this.arrUsr = [];

    this.arrUsuarioTab.forEach(xy => {
      if (this.userName === xy.email && this.userPassword === xy.senha) {
        conta = 1
        this.arrUsr.push({
          'codUser': xy.codUser,
          'empresa': xy.empresa,
          'nome': xy.nome,
          'email': xy.email,
          'senha': xy.senha,
          'perfil': xy.perfil,
          'depto': xy.depto,
          'telefone': xy.telefone,
          'dataLogin': new Date(),
          'linha': xy.linha
        })
      }
    });

    if (conta === 5) {
      alert('Senha ou Usuário Inválido')
    } else {
      if (conta === 1) {
        localStorage.setItem('user', JSON.stringify(this.arrUsr));
        xcPerfil = this.arrUsr[0].perfil
        if (xcPerfil === 'Administrador') {
          this.router.navigate(['opResumo']);
          // this.router.navigate(['dashboard']);
        } else {
          this.router.navigate(['opResumo']);
        }
      }
    }
  }



  buscaUsuarios() {
    this.arrUsuario = this.fj.buscaPrt('cadUsuarios', {});
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
          'linha': xy.linha
        })

      });
    });
  }


  ConfirmaSenha() {
    let entra = 10
    this.arrUsuarioTab.forEach(xy => {
      if (this.userNameTroca == xy.email && this.senhaAntiga == xy.senha) {
        let obj = {
          'codUser': xy.codUser,
          'senhaNew': this.senhaNova,
        }
        entra = 5;
        this.fj.execProd('alteraSenhaUsuario', obj);
        window.location.reload();
      }
    });
    if (entra === 10) {
      alert('Email ou Senha Incorreta!')
      return true;
    }
  }


}