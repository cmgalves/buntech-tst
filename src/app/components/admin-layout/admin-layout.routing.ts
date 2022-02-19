import { Routes } from '@angular/router';

import { SignInComponent } from '../../components/login/sign-in/sign-in.component';
import { ForgotPasswordComponent } from '../../components/login/forgot-password/forgot-password.component';
import { UsuarioComponent } from '../../atualizar/cadastros/usuarios/usuario.component';
import { AuthGuard } from '../../components/login/shared/guard/auth.guard';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { OpresumoComponent } from 'app/atualizar/movimentos/op/resumo/opresumo.component';
import { OpvisualizaComponent } from 'app/atualizar/movimentos/op/visualiza/opvisualiza.component';
import { OpajustaComponent } from 'app/atualizar/movimentos/op/ajusta/opajusta.component';
import { OpconfirmaComponent } from 'app/atualizar/movimentos/op/confirma/opconfirma.component';
import { EstruturaComponent } from 'app/atualizar/cadastros/estrutura/estrutura.component';
import { ProdutoComponent } from 'app/atualizar/cadastros/produto/produto.component';
import { SaldoComponent } from 'app/atualizar/cadastros/saldo/saldo.component';
import { RecursoComponent } from 'app/atualizar/cadastros/recurso/recurso.component';
import { OpdocumentoComponent } from 'app/atualizar/movimentos/doc/documento/opdocumento.component';
import { DoclistaComponent } from 'app/atualizar/movimentos/doc/doclista/doclista.component';
import { DocdetComponent } from 'app/atualizar/movimentos/doc/docdet/docdet.component';

export const AdminLayoutRoutes: Routes = [

    { path: 'sign-in', component: SignInComponent },
    { path: 'esqueci-Senha', component: ForgotPasswordComponent },
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]  },
    { path: 'usuario', component: UsuarioComponent, canActivate: [AuthGuard] },
    { path: 'opResumo', component: OpresumoComponent, canActivate: [AuthGuard] },
    { path: 'document', component: OpdocumentoComponent, canActivate: [AuthGuard] },
    { path: 'doclista', component: DoclistaComponent, canActivate: [AuthGuard] },
    { path: 'docdet', component: DocdetComponent, canActivate: [AuthGuard] },
    { path: 'opVisualiza', component: OpvisualizaComponent, canActivate: [AuthGuard] },
    { path: 'opAjusta', component: OpajustaComponent, canActivate: [AuthGuard] },
    { path: 'opConfirma', component: OpconfirmaComponent, canActivate: [AuthGuard] },
    { path: 'produto', component: ProdutoComponent, canActivate: [AuthGuard] },
    { path: 'estrutura', component: EstruturaComponent, canActivate: [AuthGuard] },
    { path: 'recurso', component: RecursoComponent, canActivate: [AuthGuard] },
    { path: 'saldo', component: SaldoComponent, canActivate: [AuthGuard] },

];


