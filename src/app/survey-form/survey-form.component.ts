import { Component, OnInit, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALIDATORS, Validator, NG_VALUE_ACCESSOR, AbstractControl, ValidationErrors } from '@angular/forms';
import { Survey } from "../domain/survey";



@Component({
	selector: 'app-survey-form',
	templateUrl: './survey-form.component.html',
	styleUrls: ['./survey-form.component.css'],

	providers: [{
		provide: NG_VALUE_ACCESSOR,
		useExisting: SurveyFormComponent,
		multi: true
	},
	{
		provide: NG_VALIDATORS,
		useExisting: SurveyFormComponent,
		multi: true
	}]
})
export class SurveyFormComponent implements OnInit, ControlValueAccessor, Validator
{

	@Input("survey") survey: Survey;
	private changeFn = null;


	constructor() { }


	ngOnInit()
	{
		//console.log(this.survey.fromDate.year);
	}


	writeValue(survey: Survey): void
	{
		this.survey = survey;
	}



	registerOnChange(fn: any): void
	{
		this.changeFn = fn;
	}



	registerOnTouched(fn: any): void
	{
	}



	change(): void
	{
		this.changeFn(this.survey);
	}



	validate(control: AbstractControl): ValidationErrors | null
	{
		if(this.survey && ! this.survey.name)
		{
			return { err: "XXX"} ;
		}

		return null;
	}
}
