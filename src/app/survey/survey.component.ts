import { Component, OnInit } from '@angular/core';
import { ControlValueAccessor, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SurveyService } from '../services/survey.service';
import { Survey } from "../domain/survey";
import { Observable, throwError } from 'rxjs';
import { Router } from "@angular/router";
import { Option } from '../domain/Option';
import { switchMap } from 'rxjs/operators';


@Component({
	selector: 'app-survey',
	templateUrl: './survey.component.html',
	styleUrls: ['./survey.component.css']
})
export class SurveyComponent implements OnInit
{
	errorMessage: string = null;

	surveyFormGroup: FormGroup;

	surveyId: number;

	newOption: Option = {
		id: null,
		name: "Option1",
		description: "Descr.",
		imageUrl: null,
		file: null,
	};


	optionFormGroup: FormGroup;


	optionFormGroups: FormGroup[] = [];


	constructor(private route: ActivatedRoute, private surveyService: SurveyService, private router: Router)
	{
	}



	ngOnInit()
	{
		this.surveyFormGroup = new FormGroup({
			survey: new FormControl("")
		});


		this.optionFormGroup = new FormGroup({
			option: new FormControl("")
		});

		this.optionFormGroup.get("option").setValue(this.newOption);


		this.route.url.pipe(switchMap(
			(urlSegments) =>
			{
				this.errorMessage = null;

				if (urlSegments.length == 0)
				{
					return throwError("Bad URL.");
				}
				else
				{
					this.surveyId = +urlSegments[urlSegments.length - 1].path;

					return this.surveyService.getSurveyById(this.surveyId);
				}
			}
		),
			switchMap(
				(survey: Survey) =>
				{
					this.surveyFormGroup.setValue({
						"survey": survey
					});
					return this.surveyService.getOptions(this.surveyId);
				}
			))
			.subscribe(
				(options: Option[]) =>
				{
					this.setupOptions(options);
				},
				(x) =>  {
					this.errorMessage = x;
				}
			);
	}



	private loadSurvey(id: number): void
	{
		this.surveyService.getSurveyById(id).subscribe(
			(survey) =>
			{
				this.surveyFormGroup.setValue({
					"survey": survey
				});

				this.surveyFormGroup.markAsPristine();
			},
			(x) =>
			{
				this.errorMessage = "Cannot resolve.";
			}

		);
	}



	updateSurvey(): void
	{
		const survey: Survey = this.surveyFormGroup.get("survey").value;
		this.surveyService.updateSurvey(survey).subscribe(null, null,
			() =>
			{
				this.loadSurvey(survey.id);
			}
		)
	}



	createOption(): void
	{
		let option = this.optionFormGroup.value.option;
		option.imageUrl = window.URL.createObjectURL(option.file);

		this.surveyService.createOption(this.surveyId, this.optionFormGroup.value.option).subscribe(
			null, null,
			() => {
				this.optionFormGroup.reset();

				this.loadOptions(this.surveyId);
			}
		);

	}



	updateOption(i: number): void
	{
		let option: Option = this.optionFormGroups[i].value.option;
		option.imageUrl = window.URL.createObjectURL(option.file);

		this.surveyService.updateOption(this.surveyId, this.optionFormGroups[i].value.option).subscribe(
			null, null,
			() => {
				this.loadOptions(this.surveyId);
			}
		);
	}



	deleteOption(i: number): void
	{
		this.surveyService.deleteOption(this.surveyId, i).subscribe(
			null, null,
			() => {
				this.loadOptions(this.surveyId);
			}
		);
	}


	loadOptions(surveyId: number)
	{
		this.surveyService.getOptions(surveyId).subscribe(
			(options: Option[]) => {
				this.setupOptions(options);
			}
		)
	}



	setupOptions(options: Option[])
	{
		this.optionFormGroups = [];

		for (const option of options)
		{
			let x = new FormGroup({
				option: new FormControl("")
			});
			x.get("option").setValue(option);
			this.optionFormGroups.push(x);
		}
	}

}
