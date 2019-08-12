import { Component, OnInit } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SurveyService } from '../services/survey.service';
import { Survey } from "../domain/survey";
import { Observable } from 'rxjs';
import { Router } from "@angular/router";
import { Option } from '../domain/Option';



@Component({
	selector: 'app-survey',
	templateUrl: './survey.component.html',
	styleUrls: ['./survey.component.css']
})
export class SurveyComponent implements OnInit
{
	errorMessage: string = null;
	survey: Survey;



	constructor(private route: ActivatedRoute, private surveyService: SurveyService, private router: Router)
	{
	}



	ngOnInit()
	{

		this.route.url.subscribe(
			(urlSegments) => {
				this.errorMessage = null;

				if(urlSegments.length == 0)
				{
					this.errorMessage = "Bad URL.";
				}
				else
				{
					let surveyId = +urlSegments[urlSegments.length - 1].path;

					this.loadSurvey(surveyId);
				}
			}
		)
	}



	private loadSurvey(id: number): void
	{
		this.surveyService.getSurveyById(id).subscribe(
			(survey) => {
				this.survey = survey;
			},
			(x) => {
				this.errorMessage = "Cannot resolve.";
			}

		);
	}



	updateSurvey(survey: Survey): void
	{
		this.surveyService.updateSurvey(survey).subscribe(null, null,
			() => {
				this.loadSurvey(this.survey.id);
			}
		)
	}



	addOption(option: Option): void
	{
		this.surveyService.addOption(this.survey.id, option).subscribe(null, null,
			() => {
				this.loadSurvey(this.survey.id);
			}
		)
	}



	deleteOption(optionId: number): void
	{
		this.surveyService.deleteOption(this.survey.id, optionId).subscribe(null, null,
			() => {
				this.loadSurvey(this.survey.id);
			}
		)
	}
}