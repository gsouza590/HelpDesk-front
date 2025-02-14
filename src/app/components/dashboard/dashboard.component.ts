import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard.service';
import { Color, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  // Dados para os gráficos (garantimos que os arrays são inicializados como vazios)
  chamadosPorStatus: Array<{ name: string; value: number }> = [];
  chamadosPorPrioridade: Array<{ name: string; value: number }> = [];
  chamadosPorMes: Array<{ name: string; value: number }> = [];
  chamadosPorTecnico: Array<{ name: string; value: number }> = [];
  chamadosPorCliente: Array<{ name: string; value: number }> = [];
  totalUsuarios: { totalClientes: number; totalTecnicos: number } = { totalClientes: 0, totalTecnicos: 0 };


  // Configuração dos gráficos ngx-charts
  view: [number, number] = [700, 400]; // Tamanho dos gráficos

  colorScheme: Color = {
    name: 'customScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#ff8c00', '#4682b4', '#32cd32']
  };
  
  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    console.log('Dashboard iniciado!');
    this.carregarDados();
  }

  carregarDados(): void {
    this.dashboardService.getChamadosPorStatus().subscribe(data => {
      console.log('Chamados por Status (API):', data);
      this.chamadosPorStatus = this.formatarDadosParaGrafico(data);
      console.log('Chamados por Status (Formatado):', this.chamadosPorStatus);
    });

    this.dashboardService.getChamadosPorPrioridade().subscribe(data => {
      console.log('Chamados por Prioridade (API):', data);
      this.chamadosPorPrioridade = this.formatarDadosParaGrafico(data);
      console.log('Chamados por Prioridade (Formatado):', this.chamadosPorPrioridade);
    });

    this.dashboardService.getChamadosPorMes().subscribe(data => {
      console.log('Chamados por Mês (API):', data);
      this.chamadosPorMes = this.formatarDadosParaGrafico(data);
      console.log('Chamados por Mês (Formatado):', this.chamadosPorMes);
    });

    this.dashboardService.getChamadosPorTecnico().subscribe(data => {
      console.log('Chamados por Técnico (API):', data);
      this.chamadosPorTecnico = this.formatarDadosParaGrafico(data);
      console.log('Chamados por Técnico (Formatado):', this.chamadosPorTecnico);
    });

    this.dashboardService.getChamadosPorCliente().subscribe(data => {
      console.log('Chamados por Cliente (API):', data);
      this.chamadosPorCliente = this.formatarDadosParaGrafico(data);
      console.log('Chamados por Cliente (Formatado):', this.chamadosPorCliente);
    });

    this.dashboardService.getTotalUsuarios().subscribe(data => {
      console.log('Total de Usuários (API):', data);
      this.totalUsuarios = data || { totalClientes: 0, totalTecnicos: 0 };
      console.log('Total de Usuários (Formatado):', this.totalUsuarios);
    });
  }

  formatarDadosParaGrafico(data: any): Array<{ name: string; value: number }> {
    if (!data) return [];
    const formattedData = Object.keys(data).map(key => ({
      name: key,
      value: data[key] || 0
    }));
    console.log('Dados Formatados para Gráfico:', formattedData);
    return formattedData;
  }
}
