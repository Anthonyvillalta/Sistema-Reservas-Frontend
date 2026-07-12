import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Environment } from '../../models/environment.model';

@Injectable({
  providedIn: 'root',
})
export class EnvironmentService {
  private apiUrl = `${environment.apiUrl}/ambientes`;

  constructor(private http: HttpClient) {}

  findAll(tipo?: string, estado?: string): Observable<Environment[]> {
    let params = new HttpParams();
    if (tipo) params = params.set('tipo', tipo);
    if (estado) params = params.set('estado', estado);
    return this.http.get<Environment[]>(this.apiUrl, { params });
  }

  findById(id: number): Observable<Environment> {
    return this.http.get<Environment>(`${this.apiUrl}/${id}`);
  }

  create(data: Environment): Observable<Environment> {
    return this.http.post<Environment>(this.apiUrl, data);
  }

  update(id: number, data: Environment): Observable<Environment> {
    return this.http.put<Environment>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateStatus(id: number, estado: string): Observable<Environment> {
    return this.http.patch<Environment>(`${this.apiUrl}/${id}/estado`, estado);
  }
}
