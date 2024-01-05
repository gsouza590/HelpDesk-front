import { Component, OnInit } from "@angular/core";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule } from "@angular/material/button";
import { FormControl, FormsModule, Validators } from "@angular/forms";
import { ReactiveFormsModule } from "@angular/forms";
import { NgxMaskDirective } from "ngx-mask";
import { TecnicoService } from "src/app/services/tecnico.service";
import { Tecnico } from "src/app/models/tecnico";
import { ToastrModule, ToastrService } from "ngx-toastr";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";

@Component({
  selector: "app-tecnico-delete",
  standalone: true,
  imports: [
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    ToastrModule,
    NgxMaskDirective,
    RouterModule,
  ],
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