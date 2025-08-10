import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private snackBar: MatSnackBar) {}

  // Show success message
  showSuccess(message: string, duration: number = 3000): void {
    this.snackBar.open(message, 'Fermer', {
      duration,
      panelClass: ['success-snackbar'],
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

  // Show error message
  showError(message: string, duration: number = 5000): void {
    this.snackBar.open(message, 'Fermer', {
      duration,
      panelClass: ['error-snackbar'],
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

  // Show info message
  showInfo(message: string, duration: number = 3000): void {
    this.snackBar.open(message, 'Fermer', {
      duration,
      panelClass: ['info-snackbar'],
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

  // Show warning message
  showWarning(message: string, duration: number = 4000): void {
    this.snackBar.open(message, 'Fermer', {
      duration,
      panelClass: ['warning-snackbar'],
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

  // Show confirmation dialog
  showConfirmation(message: string, action: string = 'Confirmer'): void {
    this.snackBar.open(message, action, {
      duration: 0, // No auto-dismiss for confirmations
      panelClass: ['confirmation-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }
}
