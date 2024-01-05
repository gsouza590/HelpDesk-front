import { Component, OnInit } from "@angular/core";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule } from "@angular/material/button";
import { FormControl, FormsModule, Validators } from "@angular/forms";
import { ReactiveFormsModule } from "@angular/forms";
import { NgxMaskDirective } from "ngx-mask";
import { ClienteService } from "src/app/services/cliente.service";
import { Cliente } from "src/app/models/cliente";
import { ToastrModule, ToastrService } from "ngx-toastr";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";

@Component({
  selector: "app-cliente-update",
  templateUrl: "./cliente-update.component.html",
  styleUrl: "./cliente-update.component.css",
})
export class ClienteUpdateComponent implements OnInit {
  cliente: Cliente = {
    id: "",
    nome: "",
    cpf: "",
    email: "",
    senha: "",
    perfis: [],
    dataCriacao: "",
  };
  nome: FormControl = new FormControl(null, Validators.minLength(3));
  cpf: FormControl = new FormControl(null, Validators.required);
  email: FormControl = new FormControl(null, Validators.email);
  senha: FormControl = new FormControl(null, Validators.minLength(3));

  constructor(
    private service: ClienteService,
    private toast: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.cliente.id=this.route.snapshot.paramMap.get('id');
    this.findById();
  }

  findById():void{
    this.service.findById(this.cliente.id).subscribe(response=>{
      this.cliente=response;
    });
  }
  validaCampos(): boolean {
    return (
      this.nome.valid && this.cpf.valid && this.email.valid && this.senha.valid
    );
  }

  update(): void {
    // Convertendo os perfis para números
    this.cliente.perfis = this.cliente.perfis.map(perfil => Number(perfil));
  
    this.service.update(this.cliente).subscribe(
      () => {
        this.toast.success("Cliente atualizado com sucesso", "Atualizar");
        this.router.navigate(["clientes"]);
      },
      (ex) => {
        if (ex.error.errors) {
          ex.error.errors.forEach(
            (element: { message: string | undefined }) => {
              this.toast.error(element.message || "Erro desconhecido");
            }
          );
        } else {
          this.toast.error(ex.error.message);
        }
      }
    );
  }
  

  addPerfil(perfil: number): void {
    const index = this.cliente.perfis.indexOf(perfil);
  
    if (index !== -1) {
      // Se o perfil já existe, remove
      this.cliente.perfis.splice(index, 1);
    } else {
      // Se o perfil não existe, adiciona
      this.cliente.perfis.push(perfil);
    }
  }
  
  
}
