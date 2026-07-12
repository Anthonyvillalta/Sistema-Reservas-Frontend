import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Payment } from '../../models/payment.model';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private apiUrl = `${environment.apiUrl}/pagos`;

  constructor(private http: HttpClient) {}

  findByReservation(reservaId: number): Observable<Payment[]> {
    let params = new HttpParams().set('reservaId', reservaId.toString());
    return this.http.get<Payment[]>(this.apiUrl, { params });
  }

  create(data: Payment): Observable<Payment> {
    return this.http.post<Payment>(this.apiUrl, data);
  }
}
