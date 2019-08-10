import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Survey } from '../domain/survey';
import { SurveyService } from '../services/survey.service';
import { Option } from '../domain/Option';



@Component({
	selector: 'app-surveys',
	templateUrl: './surveys.component.html',
	styleUrls: ['./surveys.component.css']
})
export class SurveysComponent implements OnInit
{
	newSurveyVisible = false;
	survey: Survey;
	surveys: Survey[] = [];


	constructor(private surveyService: SurveyService, private router: Router)
	{
		console.log("Constructing surveys");
		this.presetNewSurvey();
	}



	ngOnInit(): void
	{
		this.loadSurveys();
	}


	private presetNewSurvey()
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
			untilTime: { hour: 23, minute: 59, second: 59 },

			options: []
		}
	}



	toggleNewSurvey(): void
	{
		this.newSurveyVisible = !this.newSurveyVisible;
	}



	addSurvey(survey: Survey): void
	{
		console.log(survey);
		this.surveyService.addSurvey(survey).subscribe(
			(id) =>  {
				this.router.navigate([ `/survey/${id}` ]);
			}
		);

	}



	get hasSurveys(): boolean
	{
		return this.surveys.length > 0;
	}



	deleteSurvey(id: number)
	{
		this.surveyService.deleteSurvey(id).subscribe(null, null,
			() => {
				this.loadSurveys();
			}
		);
	}



	private loadSurveys()
	{
		this.surveyService.getSurveys().subscribe(
			(surveys) => {
				this.surveys = surveys;
			}
		)
	}
}
