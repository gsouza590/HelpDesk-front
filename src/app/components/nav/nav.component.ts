import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Pessoa } from 'src/app/models/pessoa';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  perfis: string[] = [];

  constructor(private authService: AuthService, private router: Router,private toast:ToastrService) {}

  ngOnInit(): void {
    this.router.navigate(['home'])

    this.authService.getProfile().subscribe(
      
      (pessoa: Pessoa) => {
        this.perfis = pessoa.perfis;
      },
      (error) => {
        console.error('Erro ao obter perfis do usuário', error);
      }
    );
  }

  hasPerfil(perfil: string): boolean {
    return this.perfis.includes(perfil);
  }

  logout(): void {
    this.router.navigate(['login'])
    this.authService.logout();
    this.toast.info('Logout realizado com sucesso', 'Logout')
  }
}
