import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Survey } from '../domain/survey';
import { SurveyService } from '../services/survey.service';
import { Option } from '../domain/option';
import { FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';



@Component({
	selector: 'app-surveys',
	templateUrl: './surveys.component.html',
	styleUrls: ['./surveys.component.css']
})
export class SurveysComponent implements OnInit
{
	newSurveyVisible = false;

	formGroup: FormGroup;

	surveys: Survey[] = [];

	constructor(private surveyService: SurveyService, private router: Router)
	{
	}



	ngOnInit(): void
	{
		this.formGroup = new FormGroup({
			survey: new FormControl("")
		});
		this.presetNewSurvey();

		this.loadSurveys();
	}



	private presetNewSurvey()
	{
		const now = new Date().getTime();

		const start = new Date(now);
		start.setDate( start.getDate() + 7 );

		const end = new Date( start.getTime() );
		end.setMonth( end.getMonth() + 2);

		this.formGroup.get("survey").setValue( {
			id: null,
			name: "Name1",
			description: "Descr.1",
			fromDate: { year: start.getFullYear(), month: start.getMonth() + 1, day: start.getDate() },
			fromTime: { hour: 0, minute: 0, second: 0 },
			untilDate: { year: end.getFullYear(), month: end.getMonth() + 1, day: end.getDate() },
			untilTime: { hour: 23, minute: 59, second: 59 }
		});
	}



	toggleNewSurvey(): void
	{
		this.newSurveyVisible = !this.newSurveyVisible;
	}



	createSurvey(): void
	{
		this.surveyService.createSurvey(this.formGroup.value.survey).subscribe(
			(id) =>  {
				this.router.navigate([ `/survey/${id}` ]);
			}
		);

	}



	get hasSurveys(): boolean
	{
		return this.surveyService.hasSurveys();
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
		this.surveys = [];

		this.surveyService.getSurveys().subscribe(
			(surveys) => {
				surveys.forEach( (survey) => {
					this.surveys.push(survey);
				});
			}
		)
	}
}
