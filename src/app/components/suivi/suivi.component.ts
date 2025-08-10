import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Courrier, Suivi, SuiviCreateRequest } from '../../models/courrier.model';
import { SuiviService } from '../../services/suivi.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-suivi',
  templateUrl: './suivi.component.html',
  styleUrl: './suivi.component.scss'
})
export class SuiviComponent implements OnInit {
  @Input() courrier!: Courrier;
  @Input() readonly: boolean = false;

  suivis: Suivi[] = [];
  suiviForm: FormGroup;
  loading = false;
  submitting = false;
  showAddForm = false;

  constructor(
    private fb: FormBuilder,
    private suiviService: SuiviService,
    private notificationService: NotificationService
  ) {
    this.suiviForm = this.createForm();
  }

  ngOnInit(): void {
    if (this.courrier?.id) {
      this.loadSuivis();
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      instruction: ['', [Validators.required, Validators.minLength(5)]],
      description: [''],
      date: [new Date().toISOString().split('T')[0], Validators.required]
    });
  }

  loadSuivis(): void {
    if (!this.courrier?.id) return;

    this.loading = true;
    this.suiviService.getSuivisByCourrierId(this.courrier.id).subscribe({
      next: (suivis) => {
        this.suivis = suivis.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        this.loading = false;
      },
      error: (error) => {
        this.notificationService.showError('Erreur lors du chargement des suivis: ' + error.message);
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.suiviForm.invalid || !this.courrier?.id) {
      this.markFormGroupTouched();
      this.notificationService.showError('Veuillez corriger les erreurs dans le formulaire');
      return;
    }

    this.submitting = true;
    const formData: SuiviCreateRequest = this.suiviForm.value;

    this.suiviService.createSuivi(this.courrier.id, formData).subscribe({
      next: (suivi) => {
        this.notificationService.showSuccess('Suivi ajouté avec succès');
        this.suiviForm.reset();
        this.suiviForm.patchValue({
          date: new Date().toISOString().split('T')[0]
        });
        this.showAddForm = false;
        this.loadSuivis();
        this.submitting = false;
      },
      error: (error) => {
        this.notificationService.showError('Erreur lors de l\'ajout du suivi: ' + error.message);
        this.submitting = false;
      }
    });
  }

  deleteSuivi(suivi: Suivi): void {
    if (!suivi.id) return;

    if (confirm(`Êtes-vous sûr de vouloir supprimer ce suivi ?`)) {
      this.suiviService.deleteSuivi(suivi.id).subscribe({
        next: () => {
          this.notificationService.showSuccess('Suivi supprimé avec succès');
          this.loadSuivis();
        },
        error: (error) => {
          this.notificationService.showError('Erreur lors de la suppression: ' + error.message);
        }
      });
    }
  }

  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
    if (!this.showAddForm) {
      this.suiviForm.reset();
      this.suiviForm.patchValue({
        date: new Date().toISOString().split('T')[0]
      });
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.suiviForm.controls).forEach(key => {
      const control = this.suiviForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.suiviForm.get(fieldName);
    if (control?.hasError('required')) {
      return `${this.getFieldLabel(fieldName)} est requis`;
    }
    if (control?.hasError('minlength')) {
      const minLength = control.errors?.['minlength'].requiredLength;
      return `${this.getFieldLabel(fieldName)} doit contenir au moins ${minLength} caractères`;
    }
    return '';
  }

  getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      instruction: 'L\'instruction',
      description: 'La description',
      date: 'La date'
    };
    return labels[fieldName] || fieldName;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR');
  }

  formatDateTime(dateString: string): string {
    return new Date(dateString).toLocaleString('fr-FR');
  }

  getTimelineIcon(index: number): string {
    if (index === 0) return 'radio_button_checked';
    return 'radio_button_unchecked';
  }

  getTimelineColor(index: number): string {
    if (index === 0) return 'primary';
    return 'accent';
  }
}
