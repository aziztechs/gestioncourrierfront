import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Courrier, TypeCourrier, NatureCourrier } from '../../../models/courrier.model';
import { CourrierService } from '../../../services/courrier.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-courrier-detail',
  templateUrl: './courrier-detail.component.html',
  styleUrl: './courrier-detail.component.scss'
})
export class CourrierDetailComponent implements OnInit {
  courrier: Courrier | null = null;
  loading = false;
  courrierId: number | null = null;

  // Enum references for template
  TypeCourrier = TypeCourrier;
  NatureCourrier = NatureCourrier;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courrierService: CourrierService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.courrierId = +params['id'];
        this.loadCourrier();
      }
    });
  }

  loadCourrier(): void {
    if (!this.courrierId) return;

    this.loading = true;
    this.courrierService.getCourrierById(this.courrierId).subscribe({
      next: (courrier) => {
        this.courrier = courrier;
        this.loading = false;
      },
      error: (error) => {
        this.notificationService.showError('Erreur lors du chargement du courrier: ' + error.message);
        this.loading = false;
        this.router.navigate(['/courriers']);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/courriers']);
  }

  editCourrier(): void {
    if (this.courrier?.id) {
      this.router.navigate(['/courriers/modifier', this.courrier.id]);
    }
  }

  deleteCourrier(): void {
    if (!this.courrier?.id) return;

    if (confirm(`Êtes-vous sûr de vouloir supprimer le courrier ${this.courrier.numCourrier} ?`)) {
      this.courrierService.deleteCourrier(this.courrier.id).subscribe({
        next: () => {
          this.notificationService.showSuccess('Courrier supprimé avec succès');
          this.router.navigate(['/courriers']);
        },
        error: (error) => {
          this.notificationService.showError('Erreur lors de la suppression: ' + error.message);
        }
      });
    }
  }

  getTypeLabel(type: TypeCourrier): string {
    return type === TypeCourrier.INTERNE ? 'Interne' : 'Externe';
  }

  getNatureLabel(nature: NatureCourrier): string {
    return nature === NatureCourrier.ARRIVE ? 'Arrivé' : 'Départ';
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR');
  }

  formatDateTime(dateString: string): string {
    return new Date(dateString).toLocaleString('fr-FR');
  }

  downloadPdf(): void {
    if (this.courrier?.pdfFile) {
      // Implementation for PDF download
      this.notificationService.showInfo('Téléchargement du PDF...');
      // Here you would typically call a service method to download the PDF
    } else {
      this.notificationService.showWarning('Aucun fichier PDF disponible pour ce courrier');
    }
  }
}
