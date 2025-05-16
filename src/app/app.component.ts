import { Component } from '@angular/core';
import { FrontendAssessment } from './features/frontend-assessment/frontend-assessment.component';

@Component({
  selector: 'app-root',
  imports: [FrontendAssessment],
  template: `
    <frontend-assessment />
  `
})
export class AppComponent {
  title = 'frontend-assessment';
}
