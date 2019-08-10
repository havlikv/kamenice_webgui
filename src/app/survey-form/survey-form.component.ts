import { Component, OnInit, OnDestroy, Input, ViewChild, ViewChildren, ElementRef, AfterViewInit } from '@angular/core';
import { ControlValueAccessor, NG_VALIDATORS, Validator, NG_VALUE_ACCESSOR, AbstractControl, ValidationErrors, NgModel } from '@angular/forms';
import { Survey } from "../domain/survey";
import { NgbTimepicker } from '@ng-bootstrap/ng-bootstrap';



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
export class SurveyFormComponent implements OnInit, AfterViewInit, OnDestroy, ControlValueAccessor, Validator
{

	@Input("survey") survey: Survey;
	private changeFn = null;
	private touchFn = (x) => {};

	@ViewChild("fromTimePicker", {read: ElementRef}) fromTimePicker: ElementRef;
	@ViewChild("untilTimePicker", {read: ElementRef}) untilTimePicker: ElementRef;

	@ViewChild("fromTimePickerNgModel") fromTimePickerNgModel: NgModel;

	constructor() {
	}

	ngOnInit()
	{
	}


	private makeListener(subject)
	{
		return function()
		{
			subject.touch.apply(subject);
		}
	}



	ngAfterViewInit()
	{
		const inp = this.fromTimePicker.nativeElement.children[0].children[0].children[0].children[0];

		const f = this.makeListener(this);

		inp.addEventListener("blur", f);
	}



	ngOnDestroy(): void
	{

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
		this.touchFn = fn;
	}



	change(): void
	{
		this.changeFn(this.survey);
	}


	touch(): void
	{
		console.log("TOUCHED.");

		this.touchFn(this.survey);
	}


	validate(control: AbstractControl): ValidationErrors | null
	{
		console.log("Validating ..");

		if(this.survey)
		{
			if(! this.survey.name)
			{
				return { err: "XXX"} ;
			}

			if(! this.survey.description)
			{
				return { err: "XXX2"} ;
			}

			if( ! this.fromTimePickerNgModel.valid)
			{
				return { err: "Prdel"};
			}

		}


		return null;
	}
}
