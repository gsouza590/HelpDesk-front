import { Component, OnInit } from "@angular/core";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule } from "@angular/material/button";
import { FormControl, Validators } from "@angular/forms";
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective } from "ngx-mask";
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
    NgxMaskDirective
  ],
  templateUrl: "./tecnico-create.component.html",
  styleUrl: "./tecnico-create.component.css",
})
export class TecnicoCreateComponent implements OnInit {
  nome: FormControl = new FormControl(null, Validators.minLength(3));
  cpf: FormControl = new FormControl(null, Validators.required);
  email: FormControl = new FormControl(null, Validators.email);
  senha: FormControl = new FormControl(null, Validators.minLength(3));

  constructor() {}

  ngOnInit(): void {}

  validaCampos(): boolean {
    return (
      this.nome.valid && this.cpf.valid && this.email.valid && this.senha.valid
    );
  }
}
