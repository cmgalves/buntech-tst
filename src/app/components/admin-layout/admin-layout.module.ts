import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';

// material
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

// imports menu
import { UsuarioComponent } from '../../atualizar/cadastros/usuarios/usuario.component';
import { SignInComponent } from '../../components/login/sign-in/sign-in.component';
import { ForgotPasswordComponent } from '../../components/login/forgot-password/forgot-password.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { OpresumoComponent } from 'app/atualizar/movimentos/op/resumo/opresumo.component';
import { OpvisualizaComponent } from 'app/atualizar/movimentos/op/visualiza/opvisualiza.component';
import { OpajustaComponent } from 'app/atualizar/movimentos/op/ajusta/opajusta.component';
import { ProdutoComponent } from 'app/atualizar/cadastros/produto/produto.component';
import { EstruturaComponent } from 'app/atualizar/cadastros/estrutura/estrutura.component';
import { SaldoComponent } from 'app/atualizar/cadastros/saldo/saldo.component';
import { RecursoComponent } from 'app/atualizar/cadastros/recurso/recurso.component';
import { OpconfirmaComponent } from 'app/atualizar/movimentos/op/confirma/opconfirma.component';
import { OpdocumentoComponent } from 'app/atualizar/movimentos/doc/documento/opdocumento.component';
import { DoclistaComponent } from 'app/atualizar/movimentos/doc/doclista/doclista.component';
import { DocdetComponent } from 'app/atualizar/movimentos/doc/docdet/docdet.component';
import { ConfiguraComponent } from '../configura/configura.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { CaracteristicaComponent } from 'app/atualizar/movimentos/qualidade/caracteristica/caracteristica.component';
import { EspecificaComponent } from 'app/atualizar/movimentos/qualidade/especifica/especifica.component';
import { RevisaComponent } from 'app/atualizar/movimentos/qualidade/revisa/revisa.component';
import { HistoricoComponent } from 'app/atualizar/movimentos/qualidade/historico/historico.component';
import { HistrevisaComponent } from 'app/atualizar/movimentos/qualidade/histrevisa/histrevisa.component';
import { LoteComponent } from 'app/atualizar/movimentos/qualidade/lote/lote.component';
import { LoteGestaoComponent } from 'app/atualizar/movimentos/qualidade/loteGestao/loteGestao.component';
import { LoteRegComponent } from 'app/atualizar/movimentos/qualidade/loteReg/loteReg.component';
import { LoteDetalheComponent } from 'app/atualizar/movimentos/qualidade/loteDetalhe/loteDetalhe.component';
import { LoteAprovaComponent } from 'app/atualizar/movimentos/qualidade/loteAprova/loteAprova.component';
import { LoteAnalisaComponent } from 'app/atualizar/movimentos/qualidade/loteAnalisa/loteAnalisa.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatExpansionModule,
    MatTooltipModule,
    MatAutocompleteModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  declarations: [
    DashboardComponent,
    SignInComponent,
    ForgotPasswordComponent,
    UsuarioComponent,
    ConfiguraComponent,
    OpresumoComponent,
    OpdocumentoComponent,
    DoclistaComponent,
    DocdetComponent,
    OpvisualizaComponent,
    OpajustaComponent,
    OpconfirmaComponent,
    ProdutoComponent,
    EstruturaComponent,
    RecursoComponent,
    SaldoComponent,
    CaracteristicaComponent,
    EspecificaComponent,
    RevisaComponent,
    HistoricoComponent,
    HistrevisaComponent,
    LoteComponent,
    LoteGestaoComponent,
    LoteRegComponent,
    LoteDetalheComponent,
    LoteAprovaComponent,
    LoteAnalisaComponent,
  ]
})

export class AdminLayoutModule { }
