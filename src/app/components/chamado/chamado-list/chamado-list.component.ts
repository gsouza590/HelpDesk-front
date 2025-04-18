import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Chamado } from "src/app/models/chamado";
import { ChamadoService } from "src/app/services/chamado.service";
import { AuthService } from "src/app/services/auth.service";
import { RelatorioService } from "src/app/services/relatorio.service"; // 🚀 Novo Serviço Importado

@Component({
  selector: "app-chamado-list",
  templateUrl: "./chamado-list.component.html",
  styleUrls: ["./chamado-list.component.css"],
})
export class ChamadoListComponent implements OnInit, AfterViewInit {
  ELEMENT_DATA: Chamado[] = [];
  FILTERED_DATA: Chamado[] = [];

  displayedColumns: string[] = [
    "id",
    "titulo",
    "cliente",
    "tecnico",
    "dataAbertura",
    "prioridade",
    "status",
    "acoes",
  ];

  dataSource = new MatTableDataSource<Chamado>(this.ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  perfis: string[] = [];

  constructor(
    private service: ChamadoService,
    private authService: AuthService,
    private relatorioService: RelatorioService

  ) {}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.authService.getProfile().subscribe(
      (pessoa) => {
        this.perfis = pessoa.perfis;
        this.findAll();
      },
      (error) => {
        console.error('Erro ao obter perfis do usuário', error);
      }
    );
  }

  hasPerfil(perfil: string): boolean {
    return this.perfis.includes(perfil);
  }

  findAll(): void {
    if (this.hasPerfil("ADMIN")) {
      this.service.findAll().subscribe((resp) => {
        this.ELEMENT_DATA = this.formatDates(resp);
        this.dataSource.data = this.ELEMENT_DATA;
        this.dataSource.paginator = this.paginator;
      });
    } else {
      this.service.findByLoggedUser().subscribe((resp) => {
        this.ELEMENT_DATA = this.formatDates(resp);
        this.dataSource.data = this.ELEMENT_DATA;
        this.dataSource.paginator = this.paginator;
      });
    }
  }

  formatDates(chamados: Chamado[]): Chamado[] {
    return chamados.map((chamado) => {
      if (chamado.dataAbertura) {
        chamado.dataAbertura = this.convertToDate(chamado.dataAbertura);
      }
      return chamado;
    });
  }

  convertToDate(dateString: string): string {
    const parts = dateString.split("/");
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateString;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  retornaPrioridade(prioridade: any): string {
    if (prioridade == "0") {
      return "BAIXA";
    } else if (prioridade == "1") {
      return "MÉDIA";
    } else {
      return "ALTA";
    }
  }

  retornaStatus(status: any): string {
    if (status == "0") {
      return "ABERTO";
    } else if (status == "1") {
      return "EM ANDAMENTO";
    } else {
      return "ENCERRADO";
    }
  }

  orderByStatus(status: any): void {
    let list: Chamado[] = [];
    this.ELEMENT_DATA.forEach((element) => {
      if (element.status == status) list.push(element);
    });
    this.FILTERED_DATA = list;
    this.dataSource = new MatTableDataSource<Chamado>(this.FILTERED_DATA);
    this.dataSource.paginator = this.paginator;
  }

  baixarRelatorio(chamadoId: number): void {
    // Passo 2: Baixa o relatório gerado
    this.relatorioService.baixarRelatorio(chamadoId).subscribe({
      next: (response: Blob) => {
        const blob = new Blob([response], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `chamado_${chamadoId}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error("❌ Erro ao baixar o relatório:", err);
      }
    });
  } gerarRelatorio(chamadoId: number): void {
    this.relatorioService.solicitarGeracaoRelatorio(chamadoId).subscribe({
      next: (res) => {
        console.log("✅ Relatório solicitado com sucesso:", res);
        setTimeout(() => this.relatorioService.baixarRelatorio(chamadoId).subscribe({
          next: (response: Blob) => {
            const blob = new Blob([response], { type: "application/pdf" });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `chamado_${chamadoId}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
          },
          error: (err) => {
            console.error("❌ Erro ao baixar o relatório:", err);
          }
        }), 5000); // Aguarda 5 segundos antes de tentar baixar o relatório
      },
      error: (err) => {
        console.error("❌ Erro ao solicitar relatório:", err);
      }
    });
  }
}
