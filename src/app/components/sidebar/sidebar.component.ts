import { Component, OnInit } from '@angular/core';
import { AuthService } from '../login/shared/services/auth.service';
import { Router } from '@angular/router';

declare const $: any;
declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
export const ROUTES: RouteInfo[] = [
  { path: '/opResumo', title: 'Ordem de Produção', icon: 'visibility', class: '' },
  { path: '/produto', title: 'Produtos', icon: 'view_in_ar', class: '' },
  { path: '/estrutura', title: 'Estrutura', icon: 'view_headline', class: '' },
  { path: '/saldo', title: 'Estoque', icon: 'hourglass_full', class: '' },
  { path: '/recurso', title: 'Recursos', icon: 'open_with', class: '' },
  { path: '/document', title: 'Documentos', icon: 'pending', class: '' },
  { path: '/usuario', title: 'Usuários', icon: 'account_circle', class: '' },
];

// <span class="material-icons-outlined">account_circle</span>


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  xcPerfil = JSON.parse(localStorage.getItem('user'));
  id: string = 'navigation';
  colapsed:boolean = false;

  constructor(
    public authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);

    // if(this.xcPerfil == null){
    //   this.router.navigate(['/sign-in'])
    // }
    // else{
    //   this.xcPerfil = this.xcPerfil[0];
    // }

    // if('Conferente' == this.xcPerfil.perfil)
    // {
    //   this.menuItems = this.menuItems.filter((element)=> element.title == 'Ordem de Produção' || element.title == 'Estoque');
    // }
    // else if ('Apontador' == this.xcPerfil.perfil)
    // {
    //   this.menuItems = this.menuItems.filter((element)=> element.title == 'Ordem de Produção');
    // }
  }
  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  };
}
