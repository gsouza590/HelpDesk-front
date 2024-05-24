import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Pessoa } from 'src/app/models/pessoa';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  pessoa: Pessoa = {
    id: "",
    nome: "",
    cpf: "",
    email: "",
    senha: "",
    perfis: [],
    dataCriacao: "",
  };

  nome: FormControl = new FormControl(null, [Validators.required, Validators.minLength(3)]);
  cpf: FormControl = new FormControl(null, [Validators.required, Validators.pattern(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/)]);
  email: FormControl = new FormControl(null, [Validators.required, Validators.email]);
  senha: FormControl = new FormControl(null, [Validators.required, Validators.minLength(3)]);

  constructor(
    private service: AuthService,
    private toast: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.service.getProfile().subscribe((response) => {
      this.pessoa = response;
    });
  }

  update(): void {
    if (this.validaCampos()) {
      this.pessoa.nome = this.nome.value;
      this.pessoa.cpf = this.cpf.value;
      this.pessoa.email = this.email.value;
      this.pessoa.senha = this.senha.value;

      this.service.updateProfile(this.pessoa).subscribe({
        next: () => {
          this.toast.success('Perfil atualizado com sucesso', 'Sucesso');
          this.router.navigate(['/']);
        },
        error: () => {
          this.toast.error('Erro ao atualizar perfil', 'Erro');
        }
      });
    }
  }


  validaCampos(): boolean {
    return this.nome.valid && this.cpf.valid && this.email.valid && this.senha.valid;
  }
}
