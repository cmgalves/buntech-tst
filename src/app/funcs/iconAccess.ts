import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';


@Injectable({
    providedIn: 'root'
})

export class IconsAccess {
    iconeAcesso: any[] = [
        { path: '/saude', title: 'Gestão de Saúde',     icon1: 'airline_seat_recline_extra',     sist: 'Saude',  descr: 'Acesso à Saúde'},
        // { path: '/contas_a_receber', title: 'Contas a Receber',     icon1: 'view_in_ar',     sist: 'Financeiro',  descr: 'Acesso ao contas a receber' },
        // { path: '/contas_a_pagar',   title: 'Contas a Pagar',       icon1: 'assignment_ind', sist: 'Financeiro',  descr: 'Acesso ao contas a pagar' },
        // { path: '/extrato_banco',    title: 'Extrato',              icon1: 'hourglass_full', sist: 'Financeiro',  descr: 'Acesso ao Extrato' },
        // { path: '/cliente',          title: 'Cadastro de Clientes', icon1: 'assignment_ind', sist: 'Cadastros',   descr: 'Controle de Clientes' },
        // { path: '/task',             title: 'Tarefas e Atividades', icon1: 'all_out',        sist: 'Compromissos',descr: 'Controle de Tarefas' },
    ];
    iconeSaude: any[] = [
        { path: '/consulta',title: 'Consutas Médicas',icon1: 'developer_board', sist: 'Saude', descr: 'Acesso às Consultas', cor: 'bg-success' },
        { path: '/medico',title: 'Profissionais da Saúde',icon1: 'view_in_ar', sist: 'Médicos', descr: 'Acesso ao Cadastro de Profissionais', cor: 'bg-warning' },
        { path: '/especialidade',title: 'Áreas Médicas',icon1: 'view_in_ar', sist: 'Especialidades', descr: 'Acesso às Especialidades', cor: 'bg-info' },
        { path: '/paciente',title: 'Pacientes',icon1: 'view_in_ar', sist: 'Pacientes', descr: 'Acesso aos Pacientes', cor: 'bg-danger' },
        { path: '/endereco',title: 'Unidade de Atendimento',icon1: 'view_in_ar', sist: 'Unidades', descr: 'Acesso aos locais de Atendimento', cor: 'bg-secondary' },
    ];
    constructor() { }



}
