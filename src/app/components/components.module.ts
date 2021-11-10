import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';

import { MatMenuModule } from '@angular/material/menu';
// import {AutocompleteLibModule} from 'angular-ng-autocomplete';




@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MatMenuModule,
    // AutocompleteLibModule,
  ],
  declarations: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent
  ],
  exports: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent
  ]
})
export class ComponentsModule { }
