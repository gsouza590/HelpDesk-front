import { Component, OnInit } from "@angular/core";
import { DashboardService } from "src/app/services/dashboard.service";
import { Color, ScaleType } from "@swimlane/ngx-charts";
import { Pessoa } from "src/app/models/pessoa";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit {
  // Dados para os gráficos
  chamadosPorStatus: Array<{ name: string; value: number }> = [];
  chamadosPorPrioridade: Array<{ name: string; value: number }> = [];
  chamadosPorMes: Array<{ name: string; series: any[] }> = [];
  chamadosPorTecnico: Array<{ name: string; value: number }> = [];
  chamadosPorCliente: Array<{ name: string; value: number }> = [];
  totalUsuarios: { totalClientes: number; totalTecnicos: number } = {
    totalClientes: 0,
    totalTecnicos: 0,
  };

  perfis: string[] = [];
  usuarioLogado!: Pessoa;

  // Configuração dos gráficos
  view: [number, number] = [700, 400];
  colorScheme: Color = {
    name: "customScheme",
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ["#ff8c00", "#4682b4", "#32cd32"],
  };

  // Controle de período para filtragem de chamados por mês
  periodoSelecionado: string = "1ano"; // Padrão: últimos 12 meses
  periodosDisponiveis = [
    { label: "Último Mês", value: "1mes" },
    { label: "Últimos 6 Meses", value: "6meses" },
    { label: "Último Ano", value: "1ano" },
    { label: "Últimos 5 Anos", value: "5anos" }
  ];

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.getProfile().subscribe(
      (pessoa: Pessoa) => {
        console.log("Usuário autenticado:", pessoa);
        this.usuarioLogado = pessoa;
        this.perfis = pessoa.perfis;
      },
      (error) => console.error("Erro ao obter perfis do usuário", error)
    );

    this.carregarDados();
  }

  carregarDados(): void {
    this.dashboardService.getChamadosPorStatus().subscribe(data => {
      this.chamadosPorStatus = this.formatarDadosParaGrafico(data);
    });

    this.dashboardService.getChamadosPorPrioridade().subscribe(data => {
      this.chamadosPorPrioridade = this.formatarDadosParaGrafico(data);
    });

    this.dashboardService.getChamadosPorMes().subscribe(data => {
      console.log("Chamados por Mês (API):", data);
      this.chamadosPorMes = this.formatarDadosPorPeriodo(data);
      console.log("Chamados por Mês (Filtrado):", this.chamadosPorMes);
    });

    this.dashboardService.getChamadosPorTecnico().subscribe(data => {
      this.chamadosPorTecnico = this.formatarDadosParaGrafico(data);
    });

    this.dashboardService.getChamadosPorCliente().subscribe(data => {
      this.chamadosPorCliente = this.formatarDadosParaGrafico(data);
    });

    this.dashboardService.getTotalUsuarios().subscribe(data => {
      this.totalUsuarios = data || { totalClientes: 0, totalTecnicos: 0 };
    });
  }

  formatarDadosParaGrafico(data: any): Array<{ name: string; value: number }> {
    if (!data) return [];
    const formattedData = Object.keys(data).map((key) => ({
      name: key,
      value: data[key] || 0,
    }));
    console.log("Dados Formatados para Gráfico:", formattedData);
    return formattedData;
  }

  formatarDadosPorPeriodo(data: any): Array<{ name: string; series: any[] }> {
    if (!data) return [];
  
    const parsedData = Object.keys(data).map(key => {
      const [month, year] = key.split('/').map(Number);
      return { 
        name: `${month}/${year}`, 
        month, 
        year, 
        value: data[key] 
      };
    });
  
    // Ordena corretamente os meses e anos
    parsedData.sort((a, b) => (a.year !== b.year ? a.year - b.year : a.month - b.month));
  
    // Ajusta o período de exibição
    const dataAtual = new Date();
    let anoMinimo = dataAtual.getFullYear();
    let mesMinimo = dataAtual.getMonth() + 1;
  
    switch (this.periodoSelecionado) {
      case "1mes":
        mesMinimo -= 1;
        if (mesMinimo === 0) {
          mesMinimo = 12;
          anoMinimo -= 1;
        }
        break;
      case "6meses":
        mesMinimo -= 6;
        if (mesMinimo <= 0) {
          mesMinimo += 12;
          anoMinimo -= 1;
        }
        break;
      case "1ano":
        anoMinimo -= 1;
        break;
      case "5anos":
        anoMinimo -= 5;
        break;
    }
  
    // Filtra os meses no intervalo desejado
    const filteredData = parsedData.filter(item => 
      (item.year > anoMinimo) || (item.year === anoMinimo && item.month >= mesMinimo)
    );
  
    // Reorganiza os dados para o ngx-charts no formato correto
    const groupedData: { [key: string]: any[] } = {};
    filteredData.forEach(item => {
      const yearLabel = `Ano ${item.year}`;
      if (!groupedData[yearLabel]) {
        groupedData[yearLabel] = [];
      }
      groupedData[yearLabel].push({ name: `${item.month}/${item.year}`, value: item.value });
    });
  
    const formattedData = Object.keys(groupedData).map(year => ({
      name: year,
      series: groupedData[year]
    }));
  
    console.log("Chamados por Mês (Filtrado e Organizado):", formattedData);
    return formattedData;
  }
  

  onPeriodoChange(): void {
    console.log(`Período selecionado: ${this.periodoSelecionado}`);
    this.carregarDados();
  }

  hasPerfil(perfil: string): boolean {
    return this.perfis.includes(perfil);
  }
}
