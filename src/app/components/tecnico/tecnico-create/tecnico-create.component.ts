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
import { Router, RouterModule } from "@angular/router";
@Component({
  selector: "app-tecnico-create",
  standalone: true,
  imports: [
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule, // Adicionado FormsModule
    ToastrModule,
    NgxMaskDirective,
    RouterModule,
  ],
  templateUrl: "./tecnico-create.component.html",
  styleUrl: "./tecnico-create.component.css",
})
export class TecnicoCreateComponent implements OnInit {
  tecnico: Tecnico = {
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
    private service: TecnicoService,
    private toast: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  validaCampos(): boolean {
    return (
      this.nome.valid && this.cpf.valid && this.email.valid && this.senha.valid
    );
  }

  create(): void {
    this.service.create(this.tecnico).subscribe(
      () => {
        this.toast.success("Técnico cadastrado com sucesso", "Cadastro");
        this.router.navigate(["tecnicos"]);
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
  }

  addPerfil(perfil: number): void {
    if (this.tecnico.perfis.includes(perfil)) {
      this.tecnico.perfis.splice(this.tecnico.perfis.indexOf(perfil), 1);
    } else {
      this.tecnico.perfis.push(perfil);
    }
  }
  
}
