import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'footer',
    template: `
      <ul class="menu">
        <li><a (click)="switchLanguage('en')" *ngIf="language !== 'en'">English</a></li>
        <li><a (click)="switchLanguage('fr')" *ngIf="language !== 'fr'">Français</a></li>
      </ul>
      <div class="copyright">Copyright &copy; 2018 - <a href="http://www.alexandreclement.com" target="_blank">Alexandre Clément</a></div>
    `,
    styleUrls: ['footer.component.scss'],
})

export class FooterComponent {
  constructor(
    private translate: TranslateService,
  ) {}

  get language(): string {
    return this.translate.currentLang;
  }

  switchLanguage(language: string) {
    this.translate.use(language);
    localStorage.setItem('basil-language', language);
  }
}
