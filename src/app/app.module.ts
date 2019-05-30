import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID, TRANSLATIONS, TRANSLATIONS_FORMAT } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SortableDirective } from './sortable.directive';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule } from '@angular/forms';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { SurveyService } from './services/survey.service';
import { SurveyComponent } from './survey/survey.component';
import { SurveyFormComponent } from './survey-form/survey-form.component';

import localeCs from '@angular/common/locales/cs';
import { registerLocaleData } from '@angular/common';
import { SurveysComponent } from './surveys/surveys.component';
import { SafePipe } from './safe.pipe';


registerLocaleData(localeCs, 'cs');



declare const require;

export const translations = require(`raw-loader!../locale/messages.cs.xlf`);

@NgModule({
  declarations: [
    AppComponent,
    SortableDirective,
    SurveyComponent,
    SurveyFormComponent,
    SurveysComponent,
    SafePipe
  ],
  imports: [
  BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'cs' },
    { provide: TRANSLATIONS, useValue: translations },
    { provide: TRANSLATIONS_FORMAT, useValue: 'xlf' },
    I18n,
    SurveyService

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
