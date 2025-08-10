import { Component, OnInit } from '@angular/core';
import { CourrierService } from '../../services/courrier.service';
import { Courrier, NatureCourrier } from "../../models/courrier.model";

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  totalCourriers = 0;
  courriersArrives = 0;
  courriersDeparts = 0;
  courriersEnSuivi = 0;
  recentCourriers: Courrier[] = [];
  isLoading = true;

  constructor(private courrierService: CourrierService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.isLoading = true;

    // Charger tous les courriers pour calculer les statistiques
    this.courrierService.getAllCourriers().subscribe({
      next: (courriers) => {
        this.totalCourriers = courriers.length;

        // Calculer les statistiques du mois en cours
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        const courriersThisMonth = courriers.filter(courrier => {
          const courrierDate = new Date(courrier.date);
          return courrierDate.getMonth() === currentMonth &&
            courrierDate.getFullYear() === currentYear;
        });

        this.courriersArrives = courriersThisMonth.filter(c => c.nature === NatureCourrier.ARRIVE).length;
        this.courriersDeparts = courriersThisMonth.filter(c => c.nature === NatureCourrier.DEPART).length;

        // Courriers en suivi (ceux qui ont des suivis)
        this.courriersEnSuivi = courriers.filter(c => c.suivis && c.suivis.length > 0).length;

        // Les 5 courriers les plus récents
        this.recentCourriers = courriers
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 5);

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des données du dashboard:', error);
        this.isLoading = false;
      }
    });
  }
}
