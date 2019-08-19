import { Component, AfterViewInit, ViewChild, Input, ViewChildren, QueryList, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, ControlValueAccessor, FormControlName, NG_VALUE_ACCESSOR, NG_VALIDATORS, Validator } from "@angular/forms";
import { AbstractControl, ValidationErrors } from "@angular/forms";
import { Option } from '../domain/Option';
import { Subscription } from "rxjs";
import { OverlayService } from '../services/overlay.service';



@Component({
	selector: 'app-option-form',
	templateUrl: './option-form.component.html',
	styleUrls: ['./option-form.component.css'],

	providers: [
		{ provide: NG_VALUE_ACCESSOR, useExisting: OptionFormComponent, multi: true},
		{ provide: NG_VALIDATORS, useExisting: OptionFormComponent, multi: true}
	]
})
export class OptionFormComponent implements AfterViewInit, OnDestroy, ControlValueAccessor, Validator
{

	formGroup: FormGroup;

	@ViewChildren(FormControlName) fcns: QueryList<FormControlName>;

	private changedFns = new Array<(value: Option) => void>();
	private touchedFns = new Array<() => void>();

	private subscribtions: Subscription[] = [];



	constructor(private overlayService: OverlayService)
	{
		this.formGroup = new FormGroup({
			id: new FormControl(""),
			name: new FormControl("", Validators.required),
			description: new FormControl("", Validators.required),
			file: new FormControl("", Validators.required),
			imageUrl: new FormControl("")
		})
	}



	get imageUrl(): string
	{
		return this.formGroup.get("imageUrl").value;
	}



	ngAfterViewInit()
	{
		let comp = this;

		this.fcns.forEach((x) => {
			x.valueAccessor.registerOnTouched( function() {
				comp.touched.apply(comp);
			 });


			if(x.name == "file")
			{
				x.valueAccessor.registerOnChange(function() {
					let x: FormGroup = comp.formGroup;
					let file: File = x.get("file").value;
					let imageUrl = window.URL.createObjectURL(file);
					x.get("imageUrl").setValue(imageUrl);
				})
			}
		} );
	}



	ngOnDestroy(): void
	{
		this.subscribtions.forEach( (s) => { s.unsubscribe(); });
	}



	writeValue(option: Option): void
	{
		let x = this.formGroup;
		if(option)
		{
			x.setValue(option);

			return;
		}

		x.reset();
	}



	registerOnChange(fn: any): void
	{
		let s = this.formGroup.valueChanges.subscribe(fn);
		this.subscribtions.push(s);
	}



	registerOnTouched(fn: any): void
	{
		this.touchedFns.push(fn);
	}



	private touched(): void
	{
		this.touchedFns.forEach(f => f());
	}



	validate(control: AbstractControl): ValidationErrors | null
	{
		let x = this.formGroup;

		if(x.invalid)
		{
			return { err: "XXX"};
		}

		return null;
	}



	doOverlay(): void
	{
		console.log(this.imageUrl);

		this.overlayService.showImage(this.imageUrl);
	}
}
