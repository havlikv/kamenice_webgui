import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SortableDirective } from './sortable.directive';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SurveyService } from './services/survey.service';
import { SurveyComponent } from './survey/survey.component';
import { SurveyFormComponent } from './survey-form/survey-form.component';

import { SurveysComponent } from './surveys/surveys.component';
import { SafePipe } from './safe.pipe';
import { NgbTimePickerValidator } from './survey-form/survey-validators';
import { OptionComponent } from './option/option.component';
import { OptionFormComponent } from './option-form/option-form.component';
import { OptionsFormComponent } from './options-form/options-form.component';
import { OverlayComponent } from './overlay/overlay.component';
import { OverlayService } from "./services/overlay.service";
import { FileValueAccessor } from './option-form/file-value-accessor';



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
	OverlayComponent,
	FileValueAccessor
  ],
  imports: [
	BrowserModule,
    AppRoutingModule,
    NgbModule,
	FormsModule,
	ReactiveFormsModule
  ],
  providers: [
	SurveyService,
	OverlayService

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
