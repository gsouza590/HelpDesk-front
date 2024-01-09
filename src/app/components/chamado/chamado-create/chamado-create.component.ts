import { Component, OnInit } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { Route, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Chamado } from "src/app/models/chamado";
import { Cliente } from "src/app/models/cliente";
import { Tecnico } from "src/app/models/tecnico";
import { ChamadoService } from "src/app/services/chamado.service";
import { ClienteService } from "src/app/services/cliente.service";
import { TecnicoService } from "src/app/services/tecnico.service";

@Component({
  selector: "app-chamado-create",
  templateUrl: "./chamado-create.component.html",
  styleUrl: "./chamado-create.component.css",
})
export class ChamadoCreateComponent implements OnInit {
  clientes: Cliente[] = [];
  tecnicos: Tecnico[] = [];

  chamado:Chamado={
    prioridade: '',
    status: '',
    titulo: '',
    observacoes: '',
    tecnico: '',
    cliente: '',
    nomeCliente: '',
    nomeTecnico: '',
  }

  prioridade: FormControl = new FormControl(null, [Validators.required]);
  status: FormControl = new FormControl(null, [Validators.required]);
  titulo: FormControl = new FormControl(null, [Validators.required]);
  descricao: FormControl = new FormControl(null, [Validators.required]);
  tecnico: FormControl = new FormControl(null, [Validators.required]);
  cliente: FormControl = new FormControl(null, [Validators.required]);

  constructor(
    private chamadoService: ChamadoService,
    private clienteService: ClienteService,
    private tecnicoService: TecnicoService,
    private toastService: ToastrService,
    private router:Router,
  ) {}

  ngOnInit(): void {
    this.findAllClientes();
    this.findAllTecnicos();
  }



  create():void{
    this.chamadoService.create(this.chamado).subscribe(resp=>{
      this.toastService.success('Chamado criado com sucesso','Novo Chamado');
      this.router.navigate(['chamados']);
    }, ex=>{
      this.toastService.error(ex.error.error);
    })
  }
  findAllClientes(): void {
    this.clienteService.findAll().subscribe((resp) => {
      this.clientes = resp;
    });
  }

  
  findAllTecnicos(): void {
    this.tecnicoService.findAll().subscribe((resp) => {
      this.tecnicos = resp;
    });
  }
  validaCampos(): boolean {
    return (
      this.prioridade.valid &&
      this.status.valid &&
      this.status.valid &&
      this.titulo.valid &&
      this.descricao.valid &&
      this.tecnico.valid &&
      this.cliente.valid
    );
  }
}
