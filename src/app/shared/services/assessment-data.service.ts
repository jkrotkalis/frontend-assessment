import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AssessmentData } from '../domain/assessment-data.type';
import { AssessmentRawData } from '../domain/assessment-raw-data.type';
import { Folder } from '../domain/folder.type';
import { Item } from '../domain/item.type';

@Injectable({
  providedIn: 'root',
})
export class AssessmentDataService {
  private http = inject(HttpClient);
  
  getAssessmentData(): Observable<AssessmentData> {
    return this.http.get<AssessmentRawData>('/response.json').pipe(
      // Map the data so we can work with objects instead of raw arrays
      map(data => {
        let mappedData = <AssessmentData>{};

        mappedData.folders = data.folders.data.map(folder =>  ({ id: folder[0], title: folder[1], parent_id: folder[2]} as Folder))
        mappedData.items = data.items.data.map(item => ({ id: item[0], title: item[1], folder_id: item[2]} as Item)) 

        return mappedData
      }
    ))
  }
}