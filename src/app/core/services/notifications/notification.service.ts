import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private snackBar = inject(MatSnackBar);

  private defaultConfig = {
    duration: 3000,
    horizontalPosition: 'right' as const,
    verticalPosition: 'top' as const
  };

  success(message: string) {
    this.open(message, 'snackbar-success');
  }

  error(message: string) {
    this.open(message, 'snackbar-error', 4000);
  }

  info(message: string) {
    this.open(message, 'snackbar-info');
  }

  warning(message: string) {
    this.open(message, 'snackbar-warning');
  }

  private open(message: string, panelClass: string, duration?: number) {
    this.snackBar.open(message, 'Fechar', {
      ...this.defaultConfig,
      duration: duration || this.defaultConfig.duration,
      panelClass: [panelClass]
    });
  }
}
