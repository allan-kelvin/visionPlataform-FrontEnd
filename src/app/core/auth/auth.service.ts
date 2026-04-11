import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environment/environment';
import { JwtPayload } from '../interface/JwtPayload.interface';
import { LoginRequest } from '../models/login-request.model';
import { LoginResponse } from '../models/login-response.model';
import { TokenStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private tokenStorage: TokenStorageService,
    private router: Router
  ) { }

  login(request: LoginRequest): Observable<LoginResponse> {

    return this.http.post<LoginResponse>(
      `${environment.apiUrl}/Auth/login`,
      request
    ).pipe(
      tap(response => {
        this.tokenStorage.setToken(response.token);
      })
    );

  }

  logout(): void {
    this.tokenStorage.clear();
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return this.tokenStorage.getToken();
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const isExpired = decoded.exp * 1000 < Date.now();
      return !isExpired;
    } catch {
      return false;
    }
  }

  getUserId(): string | null {

    const token = this.getToken();
    if (!token) return null;

    const decoded: any = jwtDecode(token);

    return decoded.nameid || decoded.sub || decoded.id || null;

  }
  getRole(): string | null {
    const token = this.getToken();
    if (!token) return null;

    const decoded = jwtDecode<JwtPayload>(token);
    return decoded.role;
  }

  getUser(): { id: string | null; name: string; email: string } | null {

    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded: any = jwtDecode(token);

      return {
        id:
          decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ||
          decoded.sub ||
          null,

        name:
          decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ||
          '',

        email:
          decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] ||
          ''
      };

    } catch (error) {
      console.error('Erro ao decodificar token', error);
      return null;
    }

  }

}
