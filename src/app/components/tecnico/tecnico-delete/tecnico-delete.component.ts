import { Component } from "@angular/core";
import { TecnicoService } from "src/app/services/tecnico.service";
import { Tecnico } from "src/app/models/tecnico";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-tecnico-delete",
  templateUrl: "./tecnico-delete.component.html",
  styleUrl: "./tecnico-delete.component.css",
})
export class TecnicoDeleteComponent {
  tecnico: Tecnico = {
    id: "",
    nome: "",
    cpf: "",
    email: "",
    senha: "",
    perfis: [],
    dataCriacao: "",
  };

  constructor(
    private service: TecnicoService,
    private toast: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.tecnico.id = this.route.snapshot.paramMap.get("id");
    this.findById();
  }

  findById(): void {
    this.service.findById(this.tecnico.id).subscribe((response) => {
      this.tecnico = response;
    });
  }

  delete(): void {
    // Convertendo os perfis para números
    this.tecnico.perfis = this.tecnico.perfis.map((perfil) => Number(perfil));

    if (confirm("Tem certeza que deseja deletar este cliente?")) {
      this.service.delete(this.tecnico.id).subscribe(
        () => {
          this.toast.success("Técnico deletado com sucesso", "Deletado");
          this.router.navigate(["tecnicos"]);
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
  }
}
