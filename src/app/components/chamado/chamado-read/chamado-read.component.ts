import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Chamado } from "src/app/models/chamado";
import { ChamadoService } from "src/app/services/chamado.service";

@Component({
  selector: "app-chamado-read",
  templateUrl: "./chamado-read.component.html",
  styleUrls: ["./chamado-read.component.css"],
})
export class ChamadoReadComponent implements OnInit {
  chamado: Chamado = {
    id: '',
    prioridade: "",
    status: "",
    titulo: "",
    observacoes: "",
    tecnico: "",
    cliente: "",
    nomeCliente: "",
    nomeTecnico: "",
  };

  constructor(
    private chamadoService: ChamadoService,
    private toastService: ToastrService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.chamado.id = this.route.snapshot.paramMap.get('id')!;
    this.findById();
  }

  findById(): void {
    this.chamadoService.findById(this.chamado.id).subscribe(resposta => {
      this.chamado = resposta;
    }, ex => {
      this.toastService.error('Erro ao carregar chamado: ' + ex.error.error);
    });
  }

  retornaStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      '0': 'ABERTO',
      '1': 'EM ANDAMENTO',
      '2': 'ENCERRADO'
    };
    return statusMap[status] || 'DESCONHECIDO';
  }

  retornaPrioridade(prioridade: string): string {
    const prioridadeMap: { [key: string]: string } = {
      '0': 'BAIXA',
      '1': 'MÉDIA',
      '2': 'ALTA'
    };
    return prioridadeMap[prioridade] || 'DESCONHECIDA';
  }
}
