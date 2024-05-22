import { Component, OnInit } from "@angular/core";
import { ClienteService } from "src/app/services/cliente.service";
import { Cliente } from "src/app/models/cliente";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-cliente-delete",
  templateUrl: "./cliente-delete.component.html",
  styleUrls: ["./cliente-delete.component.css"],
})
export class ClienteDeleteComponent implements OnInit {
  cliente: Cliente = {
    id: "",
    nome: "",
    cpf: "",
    email: "",
    senha: "",
    perfis: [],
    dataCriacao: "",
  };

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
        this.cliente = response;
      },
      (ex) => {
        this.toast.error("Erro ao carregar cliente: " + ex.error.message);
      }
    );
  }

  delete(): void {
    this.cliente.perfis = this.cliente.perfis.map((perfil) => Number(perfil));

    if (confirm("Tem certeza que deseja deletar este cliente?")) {
      this.service.delete(this.cliente.id).subscribe(
        () => {
          this.toast.success("Cliente deletado com sucesso", "Deletado");
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
            this.toast.error("Erro ao deletar cliente: " + ex.error.message);
          }
        }
      );
    }
  }
}
