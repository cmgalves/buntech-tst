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
import { ConfiguraComponent } from '../configura/configura.component';
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

export const AdminLayoutRoutes: Routes = [

    { path: 'sign-in', component: SignInComponent },
    { path: 'esqueci-Senha', component: ForgotPasswordComponent },
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
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
    { path: 'configura', component: ConfiguraComponent, canActivate: [AuthGuard] },
    { path: 'carac', component: CaracteristicaComponent, canActivate: [AuthGuard] },
    { path: 'espec', component: EspecificaComponent, canActivate: [AuthGuard] },
    { path: 'revisa', component: RevisaComponent, canActivate: [AuthGuard] },
    { path: 'histor', component: HistoricoComponent, canActivate: [AuthGuard] },
    { path: 'histrevisa', component: HistrevisaComponent, canActivate: [AuthGuard] },
    { path: 'lote', component: LoteComponent, canActivate: [AuthGuard] },
    { path: 'loteGestao', component: LoteGestaoComponent, canActivate: [AuthGuard] },
    { path: 'loteReg', component: LoteRegComponent, canActivate: [AuthGuard] },
    { path: 'loteDetalhe', component: LoteDetalheComponent, canActivate: [AuthGuard] },
    { path: 'loteAprova', component: LoteAprovaComponent, canActivate: [AuthGuard] },
    { path: 'loteAnalisa', component: LoteAnalisaComponent, canActivate: [AuthGuard] },
];


