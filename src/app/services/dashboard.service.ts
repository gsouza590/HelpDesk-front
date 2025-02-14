import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private API_URL = 'http://localhost:8080/dashboard'; // Ajuste conforme necessário

  constructor(private http: HttpClient) { }

  getChamadosPorStatus(): Observable<any> {
    return this.http.get(`${this.API_URL}/chamados-por-status`);
  }

  getChamadosPorPrioridade(): Observable<any> {
    return this.http.get(`${this.API_URL}/chamados-por-prioridade`);
  }

  getChamadosPorMes(): Observable<any> {
    return this.http.get(`${this.API_URL}/chamados-por-mes`);
  }

  getChamadosPorTecnico(): Observable<any> {
    return this.http.get(`${this.API_URL}/chamados-por-tecnico`);
  }

  getChamadosPorCliente(): Observable<any> {
    return this.http.get(`${this.API_URL}/chamados-por-cliente`);
  }

  getTotalUsuarios(): Observable<any> {
    return this.http.get(`${this.API_URL}/total-usuarios`);
  }
}
