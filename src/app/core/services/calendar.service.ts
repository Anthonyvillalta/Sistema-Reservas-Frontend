import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CalendarEvent {
  id: number;
  titulo: string;
  tipo: 'RESERVA' | 'MANTENIMIENTO';
  inicio: string;
  fin: string;
  color: string;
  estado: string;
  codigoReserva?: string;
  ambienteNombre: string;
  clienteNombre?: string;
  editable: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  private apiUrl = `${environment.apiUrl}/calendario`;

  constructor(private http: HttpClient) {}

  getEvents(
    fechaInicio: string,
    fechaFin: string,
    ambienteId?: number
  ): Observable<CalendarEvent[]> {
    let params = new HttpParams()
      .set('fechaInicio', fechaInicio)
      .set('fechaFin', fechaFin);
    if (ambienteId) params = params.set('ambienteId', ambienteId);
    return this.http.get<CalendarEvent[]>(this.apiUrl, { params });
  }

  getMonth(anio: number, mes: number, ambienteId?: number): Observable<CalendarEvent[]> {
    let params = new HttpParams()
      .set('anio', anio.toString())
      .set('mes', mes.toString());
    if (ambienteId) params = params.set('ambienteId', ambienteId);
    return this.http.get<CalendarEvent[]>(`${this.apiUrl}/mes`, { params });
  }
}
