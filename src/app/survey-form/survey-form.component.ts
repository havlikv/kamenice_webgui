import { Component, OnDestroy, AfterViewInit, QueryList, ViewChildren } from '@angular/core';
import { ControlValueAccessor, NG_VALIDATORS, Validator, NG_VALUE_ACCESSOR, FormGroup, FormControl, Validators, FormControlName, AbstractControl, ValidationErrors } from '@angular/forms';
import { Survey } from "../domain/survey";
import { NgbTimepicker, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, from } from 'rxjs';
import { Utils } from "../utils/utils";



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
export class SurveyFormComponent implements AfterViewInit, OnDestroy, ControlValueAccessor, Validator
{

	formGroup: FormGroup;

	@ViewChildren(FormControlName) fcns: QueryList<FormControlName>;

	private changeFns = new Array< (survey: Survey) => {} >();
	private touchFns = new Array< () => {} >();

	private subscribtions: Subscription[] = [];



	constructor()
	{
		this.formGroup = new FormGroup({
			"id": new FormControl(""),
			"name": new FormControl("", Validators.required),
			"description": new FormControl("", Validators.required),
			"fromDate": new FormControl("", Validators.required),
			"fromTime": new FormControl("", Validators.required),
			"untilDate": new FormControl("", Validators.required),
			"untilTime": new FormControl("", Validators.required)
		}, SurveyFormComponent.timestampsSame);
	}



	ngAfterViewInit()
	{
		let comp = this;

		this.fcns.forEach( (x) => {
			x.valueAccessor.registerOnTouched( function() {
				comp.touched.apply(comp);
			 } );
		});
	}



	ngOnDestroy(): void
	{
		this.subscribtions.forEach( (s) => s.unsubscribe() );
	}


	writeValue(survey: Survey): void
	{
		if(survey)
		{
			this.formGroup.setValue(survey);

			return;
		}

		this.formGroup.reset();
	}



	registerOnChange(fn: any): void
	{
		let s = this.formGroup.valueChanges.subscribe(function(args) {
			fn(args);
		});
		this.subscribtions.push(s);
	}



	registerOnTouched(fn: any): void
	{
		this.touchFns.push(fn);
	}



	private touched(): void
	{
		console.log("Touched.");
		this.touchFns.forEach( f => f() );
	}



	validate(control: AbstractControl): ValidationErrors | null
	{
		if(this.formGroup.invalid)
		{
			return { err: "XXX"};
		}

		return null;
	}



	static timestampsSame(control: AbstractControl): ValidationErrors | null
	{
		let x = control as FormGroup;

		const fromDateFc = x.get("fromDate");
		const untilDateFc = x.get("untilDate");

		const fromDate: NgbDateStruct = fromDateFc.value;
		const untilDate: NgbDateStruct = untilDateFc.value;

		if(!!fromDate && !!untilDate)
		{
			fromDateFc.setErrors(null);
			untilDateFc.setErrors(null);

			const x = Utils.compareNgbStructs(fromDate, untilDate);
			if(x >= 0)
			{
				const errors = { err: "XXX"};

				fromDateFc.setErrors(errors);
				untilDateFc.setErrors(errors);

				return errors;
			}
		}

		return null;
	}
}

