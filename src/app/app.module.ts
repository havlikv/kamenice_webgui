import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID, TRANSLATIONS, TRANSLATIONS_FORMAT } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SortableDirective } from './sortable.directive';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { SurveyService } from './services/survey.service';
import { SurveyComponent } from './survey/survey.component';
import { SurveyFormComponent } from './survey-form/survey-form.component';

import localeCs from '@angular/common/locales/cs';
import { registerLocaleData } from '@angular/common';
import { SurveysComponent } from './surveys/surveys.component';
import { SafePipe } from './safe.pipe';
import { NgbTimePickerValidator } from './survey-form/survey-validators';
import { OptionComponent } from './option/option.component';
import { OptionFormComponent } from './option-form/option-form.component';
import { OptionsFormComponent } from './options-form/options-form.component';
import { OverlayComponent } from './overlay/overlay.component';
import { OverlayService } from "./services/overlay.service";


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
	SafePipe,
	NgbTimePickerValidator,
	OptionComponent,
	OptionFormComponent,
	OptionsFormComponent,
	OverlayComponent
  ],
  imports: [
	BrowserModule,
    AppRoutingModule,
    NgbModule,
	FormsModule,
	ReactiveFormsModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'cs' },
    { provide: TRANSLATIONS, useValue: translations },
    { provide: TRANSLATIONS_FORMAT, useValue: 'xlf' },
    I18n,
	SurveyService,
	OverlayService

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
