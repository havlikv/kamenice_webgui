import { Component, OnInit } from '@angular/core';
import { Survey } from './domain/survey';
import { SurveyService } from './services/survey.service';



@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit
{
	newSurveyVisible = true;
	survey: Survey = null;


	constructor(private surveyService: SurveyService)
	{
	}



	ngOnInit(): void
	{
		const now = new Date().getTime();

		const start = new Date(now);
		start.setDate( start.getDate() + 7 );

		const end = new Date( start.getTime() );
		end.setMonth( end.getMonth() + 2);

		this.survey = {
			id: null,
			name: "Name1",
			description: "Descr.1",
			fromDate: { year: start.getFullYear(), month: start.getMonth() + 1, day: start.getDay() },
			fromTime: { hour: 0, minute: 0, second: 0 },
			untilDate: { year: end.getFullYear(), month: end.getMonth() + 1, day: end.getDay() },
			untilTime: { hour: 23, minute: 59, second: 59 }
		}
	}



	toggleNewSurvey(): void
	{
		this.newSurveyVisible = !this.newSurveyVisible;
	}



	addSurvey(survey: Survey): void
	{
		console.log(survey);
		this.surveyService.addSurvey(survey);
	}



	get surveys(): Survey[]
	{
		return this.surveyService.getSurveys();
	}



	get hasSurveys(): boolean
	{
		return this.surveyService.hasSurveys();
	}

}
