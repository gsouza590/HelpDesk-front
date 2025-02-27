import { Component, OnInit } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { TecnicoService } from "src/app/services/tecnico.service";
import { Tecnico } from "src/app/models/tecnico";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute, Router } from "@angular/router";
import { PerfilMapping, PerfilReversoMapping } from "src/app/models/perfis";

@Component({
  selector: "app-tecnico-update",
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
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.tecnico.id = this.route.snapshot.paramMap.get("id");
    this.findById();
  }


  findById(): void {
    this.service.findById(this.tecnico.id).subscribe((response) => {
       
        this.tecnico = response;
        const perfilReverso = new Map<string, number>(
            Object.entries(PerfilMapping).map(([key, value]) => [value, Number(key)])
        );
        this.tecnico.perfis = response.perfis
            .map(perfil => PerfilReversoMapping[perfil] ?? -1)
            .filter(perfil => perfil !== -1); // Remove valores inválidos


    });}
  validaCampos(): boolean {
    return (
      this.nome.valid && this.cpf.valid && this.email.valid && this.senha.valid
    );
  }

  update(): void {
    // Convertendo os perfis para números
    this.tecnico.perfis = this.tecnico.perfis.map((perfil) => Number(perfil));

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

  togglePerfil(perfil: number, isChecked: boolean): void {
    if (isChecked) {
        if (!this.tecnico.perfis.includes(perfil)) {
            this.tecnico.perfis.push(perfil);
        }
    } else {
        this.tecnico.perfis = this.tecnico.perfis.filter(p => p !== perfil);
    }
}
}
