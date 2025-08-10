import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Courrier, TypeCourrier, NatureCourrier } from '../../../models/courrier.model';
import { CourrierService } from '../../../services/courrier.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-courrier-list',
  templateUrl: './courrier-list.component.html',
  styleUrl: './courrier-list.component.scss'
})
export class CourrierListComponent implements OnInit {
  displayedColumns: string[] = ['numCourrier', 'objet', 'type', 'nature', 'expediteur', 'destinataire', 'date', 'actions'];
  dataSource = new MatTableDataSource<Courrier>();
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Filter properties
  filterType: TypeCourrier | '' = '';
  filterNature: NatureCourrier | '' = '';
  filterDateStart: string = '';
  filterDateEnd: string = '';
  searchText: string = '';

  // Enum references for template
  TypeCourrier = TypeCourrier;
  NatureCourrier = NatureCourrier;

  loading = false;

  constructor(
    private courrierService: CourrierService,
    private notificationService: NotificationService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadCourriers();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    
    // Custom filter predicate
    this.dataSource.filterPredicate = (data: Courrier, filter: string) => {
      const searchStr = filter.toLowerCase();
      return data.numCourrier.toLowerCase().includes(searchStr) ||
             data.objet.toLowerCase().includes(searchStr) ||
             data.expediteur.toLowerCase().includes(searchStr) ||
             data.destinataire.toLowerCase().includes(searchStr);
    };
  }

  loadCourriers(): void {
    this.loading = true;
    this.courrierService.getAllCourriers().subscribe({
      next: (courriers) => {
        this.dataSource.data = courriers;
        this.loading = false;
      },
      error: (error) => {
        this.notificationService.showError('Erreur lors du chargement des courriers: ' + error.message);
        this.loading = false;
      }
    });
  }

  applyFilter(): void {
    if (this.searchText.trim()) {
      this.dataSource.filter = this.searchText.trim().toLowerCase();
    } else {
      this.dataSource.filter = '';
    }
  }

  applyAdvancedFilters(): void {
    this.loading = true;
    
    const filters: any = {};
    if (this.filterType) filters.type = this.filterType;
    if (this.filterNature) filters.nature = this.filterNature;
    if (this.filterDateStart) filters.startDate = this.filterDateStart;
    if (this.filterDateEnd) filters.endDate = this.filterDateEnd;
    if (this.searchText) filters.objet = this.searchText;

    this.courrierService.searchCourriers(filters).subscribe({
      next: (courriers) => {
        this.dataSource.data = courriers;
        this.loading = false;
        this.notificationService.showInfo(`${courriers.length} courrier(s) trouvé(s)`);
      },
      error: (error) => {
        this.notificationService.showError('Erreur lors de la recherche: ' + error.message);
        this.loading = false;
      }
    });
  }

  clearFilters(): void {
    this.filterType = '';
    this.filterNature = '';
    this.filterDateStart = '';
    this.filterDateEnd = '';
    this.searchText = '';
    this.dataSource.filter = '';
    this.loadCourriers();
  }

  viewCourrier(courrier: Courrier): void {
    // Navigate to courrier detail view (to be implemented)
    this.router.navigate(['/courriers', courrier.id]);
  }

  editCourrier(courrier: Courrier): void {
    this.router.navigate(['/courriers/modifier', courrier.id]);
  }

  deleteCourrier(courrier: Courrier): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le courrier ${courrier.numCourrier} ?`)) {
      this.courrierService.deleteCourrier(courrier.id!).subscribe({
        next: () => {
          this.notificationService.showSuccess('Courrier supprimé avec succès');
          this.loadCourriers();
        },
        error: (error) => {
          this.notificationService.showError('Erreur lors de la suppression: ' + error.message);
        }
      });
    }
  }

  addNewCourrier(): void {
    this.router.navigate(['/courriers/nouveau']);
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
}
