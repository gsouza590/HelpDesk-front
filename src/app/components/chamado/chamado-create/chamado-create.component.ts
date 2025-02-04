import { Component, OnInit } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { AuthService } from 'src/app/services/auth.service';
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Chamado } from "src/app/models/chamado";
import { Cliente } from "src/app/models/cliente";
import { Tecnico } from "src/app/models/tecnico";
import { ChamadoService } from "src/app/services/chamado.service";
import { ClienteService } from "src/app/services/cliente.service";
import { TecnicoService } from "src/app/services/tecnico.service";
import { Pessoa } from "src/app/models/pessoa";

@Component({
  selector: "app-chamado-create",
  templateUrl: "./chamado-create.component.html",
  styleUrls: ["./chamado-create.component.css"],
})
export class ChamadoCreateComponent implements OnInit {
  perfis: string[] = [];
  clientes: Cliente[] = [];
  tecnicos: Tecnico[] = [];
  usuarioLogado!: Pessoa;
  chamado: Chamado = {
    prioridade: "",
    status: "",
    titulo: "",
    observacoes: "",
    tecnico: "",
    cliente: "",
    nomeCliente: "",
    nomeTecnico: "",
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
    private authService: AuthService,
    private toastService: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
   this.authService.getProfile().subscribe(
         
         (pessoa: Pessoa) => {
           console.log('Informações do usuário autenticado:', pessoa);
           this.usuarioLogado = pessoa;           
           this.perfis = pessoa.perfis;
         },
         (error) => {
           console.error('Erro ao obter perfis do usuário', error);
         }
       );
    this.loadInitialData();
  }

  loadInitialData(): void {
    this.findAllClientes();
    this.findAllTecnicos();
  }

  create(): void {
    if (this.hasPerfil('CLIENTE')) {
      // Para usuários CLIENTE, seta os parâmetros padrão:
      this.chamado.status = "0";       // "0" representa ABERTO
      this.chamado.prioridade = "2";    // "2" representa ALTA
      this.chamado.cliente = this.usuarioLogado.id;
      this.chamado.tecnico = "1";    }
    if (this.validaCampos()) {
      this.chamadoService.create(this.chamado).subscribe(
        () => {
          this.toastService.success(
            "Chamado criado com sucesso",
            "Novo Chamado"
          );
          this.router.navigate(["chamados"]);
        },
        (error) => {
          this.toastService.error(error.error.error);
        }
      );
    } else {
      this.toastService.error("Preencha todos os campos corretamente");
    }
  }

  findAllClientes(): void {
    this.clienteService.findAll().subscribe(
      (clientes) => {
        this.clientes = clientes;
      },
      (error) => {
        this.toastService.error("Erro ao carregar clientes");
      }
    );
  }

  findAllTecnicos(): void {
    this.tecnicoService.findAll().subscribe(
      (tecnicos) => {
        this.tecnicos = tecnicos;
      },
      (error) => {
        this.toastService.error("Erro ao carregar técnicos");
      }
    );
  }

  validaCampos(): boolean {
    if (this.hasPerfil('CLIENTE')) {
      return this.titulo.valid && this.observacoes.valid;
    } else {
      
      return (
        this.prioridade.valid &&
        this.status.valid &&
        this.titulo.valid &&
        this.observacoes.valid &&
        this.tecnico.valid &&
        this.cliente.valid
      );
    }
  }
  
  hasPerfil(perfil: string): boolean {
    return this.perfis.includes(perfil);
  }
}
