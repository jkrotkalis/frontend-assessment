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
      <structured-list [folders]="assessmentData.folders" [items]="assessmentData.items" [(selection)]="selection"/>
    }
    <span>Selected Item IDs: {{selection.toString()}}</span>
    <button (click)="clearSelection()">Clear selection</button>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      margin: 16px;
      width: 275px;
    }

    span {
      display: block;

      margin-top: 16px;

      font-family: sans-serif;
      font-weight: 400;
      font-size: 12px;
      line-height: 100%;
      letter-spacing: 0%;
    }

    button {
      display: block;
      background: #137CFB;
      color: white;
      border: none;

      padding: 8px 16px;
      margin-top: 16px;
      width: fit-content;
      border-radius: 3px;
      line-height: 15px;
      align-self: flex-end;

      cursor: pointer;
    }
  `
})
export class FrontendAssessment {
  selection = [];
  assessmentData$!: Observable<AssessmentData>;

  private assessmentDataService: AssessmentDataService = inject(AssessmentDataService);

  constructor() {
    this.assessmentData$ = this.assessmentDataService.getAssessmentData()
  }

  clearSelection = () => {
    this.selection = []
  }
}