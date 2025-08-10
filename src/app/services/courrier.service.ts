import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { ApiService } from './api.service';
import {
  Courrier,
  CourrierCreateRequest,
  TypeCourrier,
  NatureCourrier
} from '../models/courrier.model';

@Injectable({
  providedIn: 'root'
})
export class CourrierService {
  private readonly endpoint = '/courriers';

  constructor(private apiService: ApiService) {}

  // Create a new courrier
  createCourrier(courrier: CourrierCreateRequest): Observable<Courrier> {
    return this.apiService.post<Courrier>(this.endpoint, courrier);
  }

  // Update an existing courrier
  updateCourrier(id: number, courrier: CourrierCreateRequest): Observable<Courrier> {
    return this.apiService.put<Courrier>(`${this.endpoint}/${id}`, courrier);
  }

  // Get courrier by ID
  getCourrierById(id: number): Observable<Courrier> {
    return this.apiService.get<Courrier>(`${this.endpoint}/${id}`);
  }

  // Get courrier by number
  getCourrierByNumCourrier(numCourrier: string): Observable<Courrier> {
    return this.apiService.get<Courrier>(`${this.endpoint}/numero/${numCourrier}`);
  }

  // Get all courriers
  getAllCourriers(): Observable<Courrier[]> {
    return this.apiService.get<Courrier[]>(this.endpoint);
  }

  // Get courriers by type
  getCourriersByType(type: TypeCourrier): Observable<Courrier[]> {
    return this.apiService.get<Courrier[]>(`${this.endpoint}/type/${type}`);
  }

  // Get courriers by nature
  getCourriersByNature(nature: NatureCourrier): Observable<Courrier[]> {
    return this.apiService.get<Courrier[]>(`${this.endpoint}/nature/${nature}`);
  }

  // Get courriers by date
  getCourriersByDate(date: string): Observable<Courrier[]> {
    return this.apiService.get<Courrier[]>(`${this.endpoint}/date/${date}`);
  }

  // Get courriers between dates
  getCourriersBetweenDates(startDate: string, endDate: string): Observable<Courrier[]> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    return this.apiService.get<Courrier[]>(`${this.endpoint}/date-between`, params);
  }

  // Get courriers by destinataire
  getCourriersByDestinataire(destinataire: string): Observable<Courrier[]> {
    return this.apiService.get<Courrier[]>(`${this.endpoint}/destinataire/${destinataire}`);
  }

  // Get courriers by expediteur
  getCourriersByExpediteur(expediteur: string): Observable<Courrier[]> {
    return this.apiService.get<Courrier[]>(`${this.endpoint}/expediteur/${expediteur}`);
  }

  // Get courriers by objet containing
  getCourriersByObjetContaining(objet: string): Observable<Courrier[]> {
    return this.apiService.get<Courrier[]>(`${this.endpoint}/objet/${objet}`);
  }

  // Delete courrier
  deleteCourrier(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }

  // Check if courrier number exists
  existsByNumCourrier(numCourrier: string): Observable<boolean> {
    return this.apiService.get<boolean>(`${this.endpoint}/check/numero/${numCourrier}`);
  }

  // Upload PDF file for courrier
  uploadPdfFile(id: number, file: File): Observable<Courrier> {
    return this.apiService.uploadFile<Courrier>(`${this.endpoint}/${id}/upload-pdf`, file);
  }

  // Search courriers with multiple filters
  searchCourriers(filters: {
    type?: TypeCourrier;
    nature?: NatureCourrier;
    startDate?: string;
    endDate?: string;
    destinataire?: string;
    expediteur?: string;
    objet?: string;
  }): Observable<Courrier[]> {
    // This method combines multiple search criteria
    // For now, we'll use the most specific filter available
    if (filters.startDate && filters.endDate) {
      return this.getCourriersBetweenDates(filters.startDate, filters.endDate);
    } else if (filters.type) {
      return this.getCourriersByType(filters.type);
    } else if (filters.nature) {
      return this.getCourriersByNature(filters.nature);
    } else if (filters.destinataire) {
      return this.getCourriersByDestinataire(filters.destinataire);
    } else if (filters.expediteur) {
      return this.getCourriersByExpediteur(filters.expediteur);
    } else if (filters.objet) {
      return this.getCourriersByObjetContaining(filters.objet);
    } else {
      return this.getAllCourriers();
    }
  }
}

