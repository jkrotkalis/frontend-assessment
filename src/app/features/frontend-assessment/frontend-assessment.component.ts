import { Component, inject } from "@angular/core";
import { StructuredList } from "../../shared/ui/structured-selectable-list.component";
import { AssessmentDataService } from "../../shared/services/assessment-data.service";
import { Observable } from "rxjs";
import { AssessmentData } from "../../shared/domain/assessment-data.type";
import { AsyncPipe } from "@angular/common";

/**
 * Main feature component for the assessment
 */
@Component({
  selector: 'frontend-assessment',
  standalone: true,
  imports: [StructuredList, AsyncPipe],
  template: `
    @if (assessmentData$ | async; as assessmentData) {
      <structured-list [folders]="assessmentData.folders" [items]="assessmentData.items" />
    }
  `,
})
export class FrontendAssessment {
  assessmentData$!: Observable<AssessmentData>;

  private assessmentDataService: AssessmentDataService = inject(AssessmentDataService);

  constructor() {
    this.assessmentData$ = this.assessmentDataService.getAssessmentData()
  }
}