import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  const cloned = req.clone({
    setHeaders: token
      ? { Authorization: `Bearer ${token}` }
      : {}
  });

  return next(cloned).pipe(
    catchError((error) => {

      console.error('HTTP Error:', error);

      // 🔥 só desloga se for realmente 401
      if (error.status === 401) {
        authService.logout();
      }

      return throwError(() => error);
    })
  );
};
