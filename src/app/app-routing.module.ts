import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SurveyComponent } from "./survey/survey.component";
import { SurveysComponent } from "./surveys/surveys.component";
import { OptionsFormComponent } from './options-form/options-form.component';



const routes: Routes = [
	{ path: "", component: SurveysComponent },
//	{ path: "", component: OptionsFormComponent },
	{ path: 'survey/:id', component: SurveyComponent }

];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
exports: [RouterModule]
})
export class AppRoutingModule { }
