import { Component, OnInit } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, Route, Router } from "@angular/router";
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
  styleUrl: "./chamado-update.component.css",
})
export class ChamadoUpdateComponent implements OnInit {
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
  observacoes: FormControl = new FormControl(null, [Validators.required]);
  tecnico: FormControl = new FormControl(null, [Validators.required]);
  cliente: FormControl = new FormControl(null, [Validators.required]);

  constructor(
    private chamadoService: ChamadoService,
    private clienteService: ClienteService,
    private tecnicoService: TecnicoService,
    private toastService: ToastrService,
    private router:Router,
    private route:ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.chamado.id= this.route.snapshot.paramMap.get('id');
    this.findById();
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

  findById():void{
    this.chamadoService.findById(this.chamado.id).subscribe(resp=>{
      this.chamado=resp;
    }, ex=>{
      this.toastService.error(ex.error.error);
    })
  }

  update(): void{
    this.chamadoService.update(this.chamado).subscribe(resp=>{
      this.toastService.success('Chamado atualizado com sucesso', 'Atualizar chamado');
      this.router.navigate(['chamados']);
    }, ex=>{
      console.log(ex);
      this.toastService.error(ex.error.error);
    })
  }

  validaCampos(): boolean {
    return (
      this.prioridade.valid &&
      this.status.valid &&
      this.status.valid &&
      this.titulo.valid &&
      this.observacoes.valid &&
      this.tecnico.valid &&
      this.cliente.valid
    );
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
    if(status == '0') {
      return 'ABERTO'
    } else if(status == '1') {
      return 'EM ANDAMENTO'
    } else {
      return 'ENCERRADO'
    }
  }
}
