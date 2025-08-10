import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { ApiService } from './api.service';
import { Suivi, SuiviCreateRequest } from '../models/courrier.model';

@Injectable({
  providedIn: 'root'
})
export class SuiviService {
  private readonly endpoint = '/suivis';

  constructor(private apiService: ApiService) {}

  // Create a new suivi for a courrier
  createSuivi(courrierId: number, suivi: SuiviCreateRequest): Observable<Suivi> {
    return this.apiService.post<Suivi>(`/courriers/${courrierId}/suivis`, suivi);
  }

  // Update an existing suivi
  updateSuivi(id: number, suivi: SuiviCreateRequest): Observable<Suivi> {
    return this.apiService.put<Suivi>(`${this.endpoint}/${id}`, suivi);
  }

  // Get suivi by ID
  getSuiviById(id: number): Observable<Suivi> {
    return this.apiService.get<Suivi>(`${this.endpoint}/${id}`);
  }

  // Get all suivis for a specific courrier
  getSuivisByCourrierId(courrierId: number): Observable<Suivi[]> {
    return this.apiService.get<Suivi[]>(`/courriers/${courrierId}/suivis`);
  }

  // Get all suivis
  getAllSuivis(): Observable<Suivi[]> {
    return this.apiService.get<Suivi[]>(this.endpoint);
  }

  // Get suivis by date
  getSuivisByDate(date: string): Observable<Suivi[]> {
    return this.apiService.get<Suivi[]>(`${this.endpoint}/date/${date}`);
  }

  // Get suivis between dates
  getSuivisBetweenDates(startDate: string, endDate: string): Observable<Suivi[]> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    return this.apiService.get<Suivi[]>(`${this.endpoint}/date-between`, params);
  }

  // Get suivis by instruction containing
  getSuivisByInstructionContaining(instruction: string): Observable<Suivi[]> {
    return this.apiService.get<Suivi[]>(`${this.endpoint}/instruction/${instruction}`);
  }

  // Delete suivi
  deleteSuivi(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }

  // Get latest suivi for a courrier
  getLatestSuiviByCourrierId(courrierId: number): Observable<Suivi> {
    return this.apiService.get<Suivi>(`/courriers/${courrierId}/suivis/latest`);
  }

  // Search suivis with multiple filters
  searchSuivis(filters: {
    courrierId?: number;
    startDate?: string;
    endDate?: string;
    instruction?: string;
  }): Observable<Suivi[]> {
    if (filters.courrierId) {
      return this.getSuivisByCourrierId(filters.courrierId);
    } else if (filters.startDate && filters.endDate) {
      return this.getSuivisBetweenDates(filters.startDate, filters.endDate);
    } else if (filters.instruction) {
      return this.getSuivisByInstructionContaining(filters.instruction);
    } else {
      return this.getAllSuivis();
    }
  }
}
