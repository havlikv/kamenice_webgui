import { Component, OnInit, OnDestroy, QueryList, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors, ControlValueAccessor, Validator, FormControlName, NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
import { Image } from '../domain/image';
import { Subscription } from 'rxjs';
import { OverlayService } from '../services/overlay.service';



function isTruthy(control: FormControl): any
{
	if(!!control.value)
	{
		return null;
	}

	return {
		err: "XXX"
	}
}


@Component({
	selector: 'app-image-form',
	templateUrl: './image-form.component.html',
	styleUrls: ['./image-form.component.css'],

	providers: [
		{ provide: NG_VALUE_ACCESSOR, useExisting: ImageFormComponent, multi: true},
		{ provide: NG_VALIDATORS, useExisting: ImageFormComponent, multi: true}
	]
})
export class ImageFormComponent implements AfterViewInit, OnDestroy, ControlValueAccessor, Validator
{
	formGroup: FormGroup;

	@ViewChild(FormControlName) fileFcn: FormControlName;

	private touchedFns = new Array<() => void>();

	private subscribtions: Subscription[] = [];


	constructor(private overlayService: OverlayService)
	{
		this.formGroup = new FormGroup({
			file: new FormControl("", isTruthy),
			imageUrl: new FormControl("")
		});
	}



	get imageUrl(): string
	{
		return this.formGroup.get("imageUrl").value;
	}



	ngAfterViewInit()
	{
		let comp = this;

		this.fileFcn.valueAccessor.registerOnTouched(function() {
				comp.touched.apply(comp);
		});

		this.fileFcn.valueAccessor.registerOnChange(function() {
			let x: FormGroup = comp.formGroup;
			let file: File = x.get("file").value;
			let imageUrl = window.URL.createObjectURL(file);
			x.get("imageUrl").setValue(imageUrl);
		});
	}



	ngOnDestroy(): void
	{
		this.subscribtions.forEach( (s) => { s.unsubscribe(); });
	}



	writeValue(image: Image): void
	{
		let x = this.formGroup;
		if(image)
		{
			x.setValue(image);

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
