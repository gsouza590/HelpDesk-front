import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { JwtHelperService } from "@auth0/angular-jwt";
import { API_CONFIG } from "src/app/config/api.config";
import { Observable } from "rxjs";
import { Pessoa } from "../models/pessoa";
import { Credenciais } from "../models/credenciais";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  jwtService: JwtHelperService = new JwtHelperService();

  constructor(private http: HttpClient) {}

  authenticate(creds: Credenciais): Observable<any> {
    return this.http.post(`${API_CONFIG.baseUrl}/login`, creds, {
      observe: "response",
      responseType: "text",

    });
  }

  successfulLogin(authToken: string): void {
    localStorage.setItem("token", authToken);
  }

  isAuthenticated(): boolean {
    let token = localStorage.getItem("token");
    return token != null && !this.jwtService.isTokenExpired(token);
  }

  logout(): void {
    localStorage.clear();
  }

  getProfile(): Observable<Pessoa> {
    return this.http.get<Pessoa>(`${API_CONFIG.baseUrl}/auth/profile`);
  }
  updateProfile(pessoa: Pessoa): Observable<any> {
    return this.http.put(`${API_CONFIG.baseUrl}/auth/profile`, pessoa);
  }

  hasPerfil(perfil: string): boolean {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.jwtService.decodeToken(token);
      return decodedToken && decodedToken.roles && decodedToken.roles.includes(perfil);
    }
    return false;
  }
}
