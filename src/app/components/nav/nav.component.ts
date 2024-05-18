import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Pessoa } from 'src/app/models/pessoa';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  perfis: string[] = [];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.getProfile().subscribe(
      (pessoa: Pessoa) => {
        console.log('Informações do usuário autenticado:', pessoa);
        // Trabalhe diretamente com os perfis recebidos
        this.perfis = pessoa.perfis;
        console.log('Perfis:', this.perfis);
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
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
