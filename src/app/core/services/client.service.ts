import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Client } from '../../models/client.model';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private apiUrl = `${environment.apiUrl}/clientes`;

  constructor(private http: HttpClient) {}

  findAll(nombre?: string, email?: string, celular?: string): Observable<Client[]> {
    let params = new HttpParams();
    if (nombre) params = params.set('nombre', nombre);
    if (email) params = params.set('email', email);
    if (celular) params = params.set('celular', celular);
    return this.http.get<Client[]>(this.apiUrl, { params });
  }

  findById(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/${id}`);
  }

  create(data: Client): Observable<Client> {
    return this.http.post<Client>(this.apiUrl, data);
  }

  update(id: number, data: Client): Observable<Client> {
    return this.http.put<Client>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
