import { Component, OnInit } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Chamado } from "src/app/models/chamado";
import { Cliente } from "src/app/models/cliente";
import { Tecnico } from "src/app/models/tecnico";
import { ChamadoService } from "src/app/services/chamado.service";
import { ClienteService } from "src/app/services/cliente.service";
import { TecnicoService } from "src/app/services/tecnico.service";

@Component({
  selector: "app-chamado-update",
  templateUrl: "./chamado-update.component.html",
  styleUrls: ["./chamado-update.component.css"],
})
export class ChamadoUpdateComponent implements OnInit {
  clientes: Cliente[] = [];
  tecnicos: Tecnico[] = [];

  chamado: Chamado = {
    id: '',
    prioridade: '',
    status: '',
    titulo: '',
    observacoes: '',
    tecnico: '',
    cliente: '',
    nomeCliente: '',
    nomeTecnico: '',
  };

  prioridade: FormControl = new FormControl(null, [Validators.required]);
  status: FormControl = new FormControl(null, [Validators.required]);
  titulo: FormControl = new FormControl(null, [Validators.required]);
  observacoes: FormControl = new FormControl(null, [Validators.required]);
  tecnico: FormControl = new FormControl(null, [Validators.required]);
  cliente: FormControl = new FormControl(null, [Validators.required]);

  constructor(
    private chamadoService: ChamadoService,
    private clienteService: ClienteService,
    private tecnicoService: TecnicoService,
    private toastService: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.chamado.id = this.route.snapshot.paramMap.get('id')!;
    this.findById();
    this.findAllClientes();
    this.findAllTecnicos();
  }

  findAllClientes(): void {
    this.clienteService.findAll().subscribe((resp) => {
      this.clientes = resp;
    }, ex => {
      this.toastService.error('Erro ao carregar clientes');
    });
  }

  findAllTecnicos(): void {
    this.tecnicoService.findAll().subscribe((resp) => {
      this.tecnicos = resp;
    }, ex => {
      this.toastService.error('Erro ao carregar técnicos');
    });
  }

  findById(): void {
    this.chamadoService.findById(this.chamado.id).subscribe((resp) => {
      this.chamado = resp;
    }, ex => {
      this.toastService.error('Erro ao carregar chamado');
    });
  }

  update(): void {
    if (this.validaCampos()) {
      this.chamadoService.update(this.chamado).subscribe((resp) => {
        this.toastService.success('Chamado atualizado com sucesso', 'Atualizar chamado');
        this.router.navigate(['chamados']);
      }, ex => {
        this.toastService.error('Erro ao atualizar chamado');
      });
    } else {
      this.toastService.error('Preencha todos os campos corretamente');
    }
  }

  validaCampos(): boolean {
    return (
      this.prioridade.valid &&
      this.status.valid &&
      this.titulo.valid &&
      this.observacoes.valid &&
      this.tecnico.valid &&
      this.cliente.valid
    );
  }

  retornaPrioridade(prioridade: string): string {
    const prioridadeMap: { [key: string]: string } = {
      "0": "BAIXA",
      "1": "MÉDIA",
      "2": "ALTA"
    };
    return prioridadeMap[prioridade] || "DESCONHECIDA";
  }

  retornaStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      "0": "ABERTO",
      "1": "EM ANDAMENTO",
      "2": "ENCERRADO"
    };
    return statusMap[status] || "DESCONHECIDO";
  }
}
