import { Component, OnInit } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { ClienteService } from "src/app/services/cliente.service";
import { Cliente } from "src/app/models/cliente";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";

@Component({
  selector: "app-cliente-create",
  templateUrl: "./cliente-create.component.html",
  styleUrls: ["./cliente-create.component.css"],
})
export class ClienteCreateComponent implements OnInit {
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
    private router: Router
  ) {}

  ngOnInit(): void {}

  validaCampos(): boolean {
    return this.nome.valid && this.cpf.valid && this.email.valid && this.senha.valid;
  }

  create(): void {
    if (this.validaCampos()) {
      this.service.create(this.cliente).subscribe(
        () => {
          this.toast.success("Cliente cadastrado com sucesso", "Cadastro");
          this.router.navigate(["clientes"]);
        },
        (ex) => {
          if (ex.error.errors) {
            ex.error.errors.forEach((element: { message: string | undefined }) => {
              this.toast.error(element.message || 'Erro desconhecido');
            });
          } else {
            this.toast.error(ex.error.message);
          }
        }
      );
    } else {
      this.toast.error('Preencha todos os campos corretamente');
    }
  }

  addPerfil(perfil: number): void {
    if (this.cliente.perfis.includes(perfil)) {
      this.cliente.perfis.splice(this.cliente.perfis.indexOf(perfil), 1);
    } else {
      this.cliente.perfis.push(perfil);
    }
  }
}