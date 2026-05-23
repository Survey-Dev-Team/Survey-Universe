import { inject, Injectable } from '@angular/core';
import { LocalStorageService } from '../local-storage/local-storage';

const SUBMITTED_KEY = 'submittedSurveys';

@Injectable({ providedIn: 'root' })
export class SurveySubmitStateService {
  private ls = inject(LocalStorageService);

  markSubmitted(surveyId: string): void {
    const ids = this.getIds();
    if (!ids.includes(surveyId)) {
      this.ls.setItem(SUBMITTED_KEY, [...ids, surveyId]);
    }
  }

  hasSubmitted(surveyId: string): boolean {
    return this.getIds().includes(surveyId);
  }

  private getIds(): string[] {
    return this.ls.getItem<string[]>(SUBMITTED_KEY) ?? [];
  }
}
