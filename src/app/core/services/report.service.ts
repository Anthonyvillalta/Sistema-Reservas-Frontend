import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Report {
  tipo: string;
  datos: Record<string, unknown>;
}

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private apiUrl = `${environment.apiUrl}/reportes`;

  constructor(private http: HttpClient) {}

  ingresosMensuales(anio: number, mes: number): Observable<Report> {
    let params = new HttpParams()
      .set('anio', anio.toString())
      .set('mes', mes.toString());
    return this.http.get<Report>(`${this.apiUrl}/ingresos-mensuales`, { params });
  }

  ocupacion(fechaInicio: string, fechaFin: string): Observable<Report> {
    let params = new HttpParams()
      .set('fechaInicio', fechaInicio)
      .set('fechaFin', fechaFin);
    return this.http.get<Report>(`${this.apiUrl}/ocupacion`, { params });
  }

  reservasPorRango(fechaInicio: string, fechaFin: string): Observable<Report> {
    let params = new HttpParams()
      .set('fechaInicio', fechaInicio)
      .set('fechaFin', fechaFin);
    return this.http.get<Report>(`${this.apiUrl}/reservas`, { params });
  }

  clientesFrecuentes(limite: number = 10): Observable<Report> {
    let params = new HttpParams().set('limite', limite.toString());
    return this.http.get<Report>(`${this.apiUrl}/clientes-frecuentes`, { params });
  }

  pagosParcialesVsCompletos(fechaInicio: string, fechaFin: string): Observable<Report> {
    let params = new HttpParams()
      .set('fechaInicio', fechaInicio)
      .set('fechaFin', fechaFin);
    return this.http.get<Report>(`${this.apiUrl}/pagos-parciales-vs-completos`, { params });
  }
}
