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
  { path: '/configura', title: 'Configurações', icon: 'build', class: '' },
];

const CadastroRoutes: RouteInfo[] = [
  { path: '/carac', title: 'Características', icon: 'blur_circular', class: '' },
  { path: '/usuario', title: 'Usuários', icon: 'account_circle', class: '' },
  { path: '/grupoRecurso', title: 'Grupo de Recursos', icon: 'aspect_ratio', class: '' },
]

const RelatRoutes: RouteInfo[] = [
  { path: '/produto', title: 'Produtos', icon: 'view_in_ar', class: '' },
  { path: '/estrutura', title: 'Estrutura', icon: 'view_headline', class: '' },
  { path: '/saldo', title: 'Estoque', icon: 'hourglass_full', class: '' },
  { path: '/recurso', title: 'Recursos', icon: 'open_with', class: '' },
]

const QualidadeRoutes: RouteInfo[] = [
  { path: '/espec', title: 'Especificar Lotes', icon: 'center_focus_strong', class: '' },
  { path: '/loteReg', title: 'Relação Lotes', icon: 'border_inner', class: '' },
  { path: '/produtoAndamento', title: 'Produtos em Andamento', icon: 'border_inner', class: '' },
  { path: '/histor', title: 'Hist Revisões', icon: 'album', class: '' },
]

const AtividadeRoutes: RouteInfo[] = [
  { path: '/opResumo', title: 'Ordem de Produção', icon: 'visibility', class: '' },
  { path: '/document', title: 'Documentos', icon: 'pending', class: '' },
]


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  relatItems: any[];
  cadastroItems: any[];
  qualidadeItens: any[];
  atividadeItems: any[];
  xcPerfil = JSON.parse(localStorage.getItem('user'));
  id: string = 'navigation';
  colapsed: boolean = false;

  constructor(
    public authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.relatItems = RelatRoutes.filter(relatItems => relatItems);
    this.cadastroItems = CadastroRoutes.filter(cadastroItems => cadastroItems);
    this.atividadeItems = AtividadeRoutes.filter(atividadeItems => atividadeItems);
    this.qualidadeItens = QualidadeRoutes.filter(qualidadeItens => qualidadeItens);

  }
  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  };
}
