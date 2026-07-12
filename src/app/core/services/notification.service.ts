import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Notification {
  id: number;
  reservationId: number;
  tipo: string;
  destinatario: string;
  asunto: string;
  mensaje: string;
  estadoEnvio: string;
  fechaEnvio?: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private apiUrl = `${environment.apiUrl}/notificaciones`;

  constructor(private http: HttpClient) {}

  findByReservation(reservaId: number): Observable<Notification[]> {
    let params = new HttpParams().set('reservaId', reservaId.toString());
    return this.http.get<Notification[]>(this.apiUrl, { params });
  }

  sendEmail(reservaId: number): Observable<Notification> {
    let params = new HttpParams().set('reservaId', reservaId.toString());
    return this.http.post<Notification>(`${this.apiUrl}/enviar-email`, null, { params });
  }

  sendWhatsApp(reservaId: number): Observable<Notification> {
    let params = new HttpParams().set('reservaId', reservaId.toString());
    return this.http.post<Notification>(`${this.apiUrl}/enviar-whatsapp`, null, { params });
  }
}
