import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Maintenance } from '../../models/maintenance.model';

@Injectable({
  providedIn: 'root',
})
export class MaintenanceService {
  private apiUrl = `${environment.apiUrl}/mantenimientos`;

  constructor(private http: HttpClient) {}

  findAll(ambienteId?: number, estado?: string): Observable<Maintenance[]> {
    let params = new HttpParams();
    if (ambienteId) params = params.set('ambienteId', ambienteId);
    if (estado) params = params.set('estado', estado);
    return this.http.get<Maintenance[]>(this.apiUrl, { params });
  }

  create(data: Maintenance): Observable<Maintenance> {
    return this.http.post<Maintenance>(this.apiUrl, data);
  }

  update(id: number, data: Maintenance): Observable<Maintenance> {
    return this.http.put<Maintenance>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
