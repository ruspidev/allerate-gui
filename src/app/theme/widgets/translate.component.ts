import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SettingsService } from '@core/bootstrap/settings.service';

@Component({
  selector: 'app-translate',
  template: `
    <button mat-icon-button class="matero-toolbar-button" [matMenuTriggerFor]="menu">
      <mat-icon>translate</mat-icon>
    </button>

    <mat-menu #menu="matMenu">
      <button mat-menu-item *ngFor="let lang of langs | keyvalue" (click)="useLanguage(lang.key)">
        <span>{{ lang.value }}</span>
      </button>
    </mat-menu>
  `,
  styles: [],
})
export class TranslateComponent {
  langs = {
    'de-CH': 'Deutsch',
    'fr-CH': 'Französisch',
  };

  constructor(private translate: TranslateService, private settings: SettingsService) {
    translate.addLangs(['de-ch', 'fr-CH']);
  }

  useLanguage(language: string): void {
    this.translate.use(language);
    this.settings.setLanguage(language);
  }
}
