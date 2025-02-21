import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpErrorResponse } from "@angular/common/http";
import { API_CONFIG } from "src/app/config/api.config";
import { AuthService } from "./auth.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class RelatorioService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  gerarRelatorioChamado(chamadoId: number): Observable<Blob> {
    const url = `${API_CONFIG.baseUrl}/api/relatorio/chamado/${chamadoId}`;

    const token = localStorage.getItem("token");

    if (!token) {
      console.error("Erro: Usuário não autenticado");
      return new Observable<Blob>(); // Retorna um Observable vazio para evitar erro
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    });

    return this.http.get(url, { headers: headers, responseType: "blob" });
  }
}
