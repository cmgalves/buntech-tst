import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  arrUserLogado = JSON.parse(localStorage.getItem('user'))[0];

  constructor(
    public router: Router,
  ) { }

  ngOnInit(): void {
    if (this.arrUserLogado.perfil.indexOf('Administrador') < 0) {
      alert('Sem Acesso')
      this.router.navigate(['opResumo']);
    }
  }
}
