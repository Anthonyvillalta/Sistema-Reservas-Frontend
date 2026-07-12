import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Disponibilidad, Reservation } from '../../models/reservation.model';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  private apiUrl = `${environment.apiUrl}/reservas`;

  constructor(private http: HttpClient) {}

  findAll(params?: {
    estado?: string;
    ambienteId?: number;
    clienteId?: number;
    fechaInicio?: string;
    fechaFin?: string;
  }): Observable<Reservation[]> {
    let httpParams = new HttpParams();
    if (params?.estado) httpParams = httpParams.set('estado', params.estado);
    if (params?.ambienteId) httpParams = httpParams.set('ambienteId', params.ambienteId);
    if (params?.clienteId) httpParams = httpParams.set('clienteId', params.clienteId);
    if (params?.fechaInicio) httpParams = httpParams.set('fechaInicio', params.fechaInicio);
    if (params?.fechaFin) httpParams = httpParams.set('fechaFin', params.fechaFin);
    return this.http.get<Reservation[]>(this.apiUrl, { params: httpParams });
  }

  findById(id: number): Observable<Reservation> {
    return this.http.get<Reservation>(`${this.apiUrl}/${id}`);
  }

  create(data: Reservation): Observable<Reservation> {
    return this.http.post<Reservation>(this.apiUrl, data);
  }

  update(id: number, data: Reservation): Observable<Reservation> {
    return this.http.put<Reservation>(`${this.apiUrl}/${id}`, data);
  }

  updateStatus(id: number, estado: string): Observable<Reservation> {
    return this.http.patch<Reservation>(`${this.apiUrl}/${id}/estado`, estado);
  }

  cancel(id: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/cancelar`, {});
  }

  checkDisponibilidad(ambienteId: number, fecha: string): Observable<Disponibilidad> {
    let params = new HttpParams()
      .set('ambienteId', ambienteId.toString())
      .set('fecha', fecha);
    return this.http.get<Disponibilidad>(`${this.apiUrl}/disponibilidad`, { params });
  }
}
