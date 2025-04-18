import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpErrorResponse } from "@angular/common/http";
import { API_CONFIG } from "src/app/config/api.config";
import { AuthService } from "./auth.service";
import { catchError, Observable, throwError } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class RelatorioService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  // ✅ PASSO 1: Solicita a geração do relatório no backend
  solicitarGeracaoRelatorio(chamadoId: number): Observable<string> {
    const url = `${API_CONFIG.baseUrl}/api/relatorio/chamado/${chamadoId}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    });

    return this.http.post<string>(url, {}, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // ✅ PASSO 2: Baixa o relatório gerado do backend
  baixarRelatorio(chamadoId: number): Observable<Blob> {
    const url = `${API_CONFIG.baseUrl}/api/relatorio/download/${chamadoId}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/pdf",
    });
  
    return this.http.get<Blob>(url, { headers, responseType: "arraybuffer" as 'json' }).pipe(
      catchError(this.handleError)
    );
  }
  

  // 🚨 Tratamento de erro
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error("🚨 Erro na requisição do relatório:", error);
    if (error.status === 401) {
      console.warn("🔒 Token expirado ou inválido. Redirecionando para login...");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return throwError(() => new Error("Erro ao gerar relatório. Tente novamente."));
  }
}
