import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Courrier, CourrierCreateRequest, TypeCourrier, NatureCourrier } from '../../../models/courrier.model';
import { CourrierService } from '../../../services/courrier.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-courrier-form',
  templateUrl: './courrier-form.component.html',
  styleUrl: './courrier-form.component.scss'
})
export class CourrierFormComponent implements OnInit {
  courrierForm: FormGroup;
  isEditMode = false;
  courrierId: number | null = null;
  loading = false;
  submitting = false;
  selectedFile: File | null = null;

  // Enum references for template
  TypeCourrier = TypeCourrier;
  NatureCourrier = NatureCourrier;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private courrierService: CourrierService,
    private notificationService: NotificationService
  ) {
    this.courrierForm = this.createForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.courrierId = +params['id'];
        this.loadCourrier();
      }
    });
  }

  createForm(): FormGroup {
    return this.fb.group({
      numCourrier: ['', [Validators.required, Validators.minLength(3)]],
      objet: ['', [Validators.required, Validators.minLength(5)]],
      type: ['', Validators.required],
      nature: ['', Validators.required],
      expediteur: ['', [Validators.required, Validators.minLength(2)]],
      destinataire: ['', [Validators.required, Validators.minLength(2)]],
      date: [new Date().toISOString().split('T')[0], Validators.required]
    });
  }

  loadCourrier(): void {
    if (!this.courrierId) return;

    this.loading = true;
    this.courrierService.getCourrierById(this.courrierId).subscribe({
      next: (courrier) => {
        this.courrierForm.patchValue({
          numCourrier: courrier.numCourrier,
          objet: courrier.objet,
          type: courrier.type,
          nature: courrier.nature,
          expediteur: courrier.expediteur,
          destinataire: courrier.destinataire,
          date: courrier.date.split('T')[0] // Convert to date input format
        });
        this.loading = false;
      },
      error: (error) => {
        this.notificationService.showError('Erreur lors du chargement du courrier: ' + error.message);
        this.loading = false;
        this.router.navigate(['/courriers']);
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (file.type !== 'application/pdf') {
        this.notificationService.showError('Seuls les fichiers PDF sont acceptés');
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        this.notificationService.showError('Le fichier ne doit pas dépasser 10MB');
        return;
      }

      this.selectedFile = file;
      this.notificationService.showInfo(`Fichier sélectionné: ${file.name}`);
    }
  }

  onSubmit(): void {
    if (this.courrierForm.invalid) {
      this.markFormGroupTouched();
      this.notificationService.showError('Veuillez corriger les erreurs dans le formulaire');
      return;
    }

    this.submitting = true;
    const formData: CourrierCreateRequest = this.courrierForm.value;

    if (this.isEditMode && this.courrierId) {
      this.updateCourrier(formData);
    } else {
      this.createCourrier(formData);
    }
  }

  createCourrier(data: CourrierCreateRequest): void {
    this.courrierService.createCourrier(data).subscribe({
      next: (courrier) => {
        this.notificationService.showSuccess('Courrier créé avec succès');
        
        // Upload PDF if selected
        if (this.selectedFile && courrier.id) {
          this.uploadPdfFile(courrier.id);
        } else {
          this.submitting = false;
          this.router.navigate(['/courriers']);
        }
      },
      error: (error) => {
        this.notificationService.showError('Erreur lors de la création: ' + error.message);
        this.submitting = false;
      }
    });
  }

  updateCourrier(data: CourrierCreateRequest): void {
    if (!this.courrierId) return;

    this.courrierService.updateCourrier(this.courrierId, data).subscribe({
      next: (courrier) => {
        this.notificationService.showSuccess('Courrier modifié avec succès');
        
        // Upload PDF if selected
        if (this.selectedFile && courrier.id) {
          this.uploadPdfFile(courrier.id);
        } else {
          this.submitting = false;
          this.router.navigate(['/courriers']);
        }
      },
      error: (error) => {
        this.notificationService.showError('Erreur lors de la modification: ' + error.message);
        this.submitting = false;
      }
    });
  }

  uploadPdfFile(courrierId: number): void {
    if (!this.selectedFile) {
      this.submitting = false;
      this.router.navigate(['/courriers']);
      return;
    }

    this.courrierService.uploadPdfFile(courrierId, this.selectedFile).subscribe({
      next: () => {
        this.notificationService.showSuccess('Fichier PDF téléchargé avec succès');
        this.submitting = false;
        this.router.navigate(['/courriers']);
      },
      error: (error) => {
        this.notificationService.showWarning('Courrier sauvegardé mais erreur lors du téléchargement du PDF: ' + error.message);
        this.submitting = false;
        this.router.navigate(['/courriers']);
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/courriers']);
  }

  markFormGroupTouched(): void {
    Object.keys(this.courrierForm.controls).forEach(key => {
      const control = this.courrierForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.courrierForm.get(fieldName);
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
      numCourrier: 'Le numéro de courrier',
      objet: 'L\'objet',
      type: 'Le type',
      nature: 'La nature',
      expediteur: 'L\'expéditeur',
      destinataire: 'Le destinataire',
      date: 'La date'
    };
    return labels[fieldName] || fieldName;
  }

  getTypeLabel(type: TypeCourrier): string {
    return type === TypeCourrier.INTERNE ? 'Interne' : 'Externe';
  }

  getNatureLabel(nature: NatureCourrier): string {
    return nature === NatureCourrier.ARRIVE ? 'Arrivé' : 'Départ';
  }
}
