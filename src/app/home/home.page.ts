import { Component } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SelectLangService } from '../service/select-lang.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  creditCard = 'en';
  constructor(private router: Router, private translate: TranslateService, public selectLangService: SelectLangService) {

    if (!localStorage.getItem('language')) {
      this.selectLangService.setLang('en');
    }
    this.selectLangService.currentLang.subscribe(lang => {
      this.translate.setDefaultLang(lang);
      this.translate.use(lang);
    });
  }

  goToQuestionnairePage(forWhome) {
    this.router.navigate(['questionnaire']);
  }

}
