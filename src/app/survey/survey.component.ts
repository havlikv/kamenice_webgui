import { Component, OnInit } from '@angular/core';
import { ControlValueAccessor, FormGroup, FormControl } from '@angular/forms';
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

	formGroup: FormGroup;

	surveyId: number;

	constructor(private route: ActivatedRoute, private surveyService: SurveyService, private router: Router)
	{
	}



	ngOnInit()
	{
		this.formGroup = new FormGroup({
			survey: new FormControl("survey")
		})


		this.route.url.subscribe(
			(urlSegments) => {
				this.errorMessage = null;

				if(urlSegments.length == 0)
				{
					this.errorMessage = "Bad URL.";
				}
				else
				{
					this.surveyId = +urlSegments[urlSegments.length - 1].path;

					this.loadSurvey(this.surveyId);
				}
			}
		)
	}



	private loadSurvey(id: number): void
	{
		this.surveyService.getSurveyById(id).subscribe(
			(survey) => {
				this.formGroup.setValue({
					"survey": survey
					});
			},
			(x) => {
				this.errorMessage = "Cannot resolve.";
			}

		);
	}



	updateSurvey(): void
	{
		const survey: Survey = this.formGroup.get("survey").value;
		this.surveyService.updateSurvey(survey).subscribe(null, null,
			() => {
				this.loadSurvey(survey.id);
			}
		)
	}


/*
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


	*/
}
