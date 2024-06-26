import { Component, OnInit } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { ClienteService } from "src/app/services/cliente.service";
import { Cliente } from "src/app/models/cliente";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-cliente-update",
  templateUrl: "./cliente-update.component.html",
  styleUrls: ["./cliente-update.component.css"],
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
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.cliente.id = this.route.snapshot.paramMap.get("id")!;
    this.findById();
  }

  findById(): void {
    this.service.findById(this.cliente.id).subscribe(
      (response) => {
        response.perfis = [];
        this.cliente = response;
      },
      (error) => {
        this.toast.error("Erro ao carregar cliente", "Erro");
      }
    );
  }

  validaCampos(): boolean {
    return (
      this.nome.valid && this.cpf.valid && this.email.valid && this.senha.valid
    );
  }

  update(): void {
    if (this.validaCampos()) {
      // Convertendo os perfis para números
      this.cliente.perfis = this.cliente.perfis.map((perfil) => Number(perfil));

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
    } else {
      this.toast.error("Preencha todos os campos corretamente", "Erro");
    }
  }

  addPerfil(perfil: any): void {
    if (this.cliente.perfis.includes(perfil)) {
      this.cliente.perfis.splice(this.cliente.perfis.indexOf(perfil), 1);
    } else {
      this.cliente.perfis.push(perfil);
    }
  }
}
