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
  selector: "app-tecnico-update",
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
  templateUrl: "./tecnico-update.component.html",
  styleUrl: "./tecnico-update.component.css",
})
export class TecnicoUpdateComponent implements OnInit {
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
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.tecnico.id=this.route.snapshot.paramMap.get('id');
    this.findById();
  }

  findById():void{
    this.service.findById(this.tecnico.id).subscribe(response=>{
      this.tecnico=response;
    });
  }
  validaCampos(): boolean {
    return (
      this.nome.valid && this.cpf.valid && this.email.valid && this.senha.valid
    );
  }

  update(): void {
    // Convertendo os perfis para números
    this.tecnico.perfis = this.tecnico.perfis.map(perfil => Number(perfil));
  
    this.service.update(this.tecnico).subscribe(
      () => {
        this.toast.success("Técnico atualizado com sucesso", "Atualizar");
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
  

  addPerfil(perfil: number): void {
    const index = this.tecnico.perfis.indexOf(perfil);
  
    if (index !== -1) {
      // Se o perfil já existe, remove
      this.tecnico.perfis.splice(index, 1);
    } else {
      // Se o perfil não existe, adiciona
      this.tecnico.perfis.push(perfil);
    }
  }
  
  
}
