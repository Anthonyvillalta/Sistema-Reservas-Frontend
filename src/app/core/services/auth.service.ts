import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, LoginRequest, User } from '../../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'campestre_token';
  private readonly USER_KEY = 'campestre_user';

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private currentUserSubject = new BehaviorSubject<User | null>(this.getStoredUser());
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, credentials).pipe(
      tap((response) => {
        localStorage.setItem(this.TOKEN_KEY, response.token);
        localStorage.setItem(
          this.USER_KEY,
          JSON.stringify({
            id: response.id,
            username: response.username,
            nombreCompleto: response.nombreCompleto,
            email: response.email,
            role: response.role,
            activo: true,
          })
        );
        this.isAuthenticatedSubject.next(true);
        this.currentUserSubject.next(this.getStoredUser());
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {

  if (typeof localStorage === 'undefined') {
    return null;
  }

  return localStorage.getItem(this.TOKEN_KEY);
}

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  hasRole(role: string): boolean {
    return this.getCurrentUser()?.role === role;
  }

  isAdmin(): boolean {
    return this.hasRole('ADMIN');
  }

  private hasToken(): boolean {
  if (typeof localStorage === 'undefined') {
    return false;
  }

  return !!localStorage.getItem(this.TOKEN_KEY);
}

  private getStoredUser(): User | null {

  if (typeof localStorage === 'undefined') {
    return null;
  }

  try {

    const stored = localStorage.getItem(this.USER_KEY);

    return stored 
      ? JSON.parse(stored)
      : null;

  } catch {

    localStorage.removeItem(this.USER_KEY);

    return null;
  }
}
}
