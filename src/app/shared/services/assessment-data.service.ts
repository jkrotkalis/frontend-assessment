import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AssessmentData } from '../domain/assessment-data.type';

@Injectable({
  providedIn: 'root',
})
export class AssessmentDataService {
  private http = inject(HttpClient);
  
  getAssessmentData(): Observable<AssessmentData> {
    return this.http.get<AssessmentData>('/response.json')
  }
}