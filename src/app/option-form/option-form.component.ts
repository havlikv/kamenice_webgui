import { Component, AfterViewInit, ViewChildren, QueryList, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, ControlValueAccessor, FormControlName, NG_VALUE_ACCESSOR, NG_VALIDATORS, Validator, FormArray } from "@angular/forms";
import { AbstractControl, ValidationErrors } from "@angular/forms";
import { Option } from '../domain/option';
import { Subscription } from "rxjs";
import { OverlayService } from '../services/overlay.service';
import { Utils } from '../utils/utils';
import { Image } from "../domain/image";



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

	private xDeletedImagesIds: number[] = [];



	constructor(private overlayService: OverlayService)
	{
		this.formGroup = new FormGroup({
			id: new FormControl(""),
			name: new FormControl("", Validators.required),
			description: new FormControl("", Validators.required),
			images: new FormArray([])
		})
	}



	reset(): void
	{
		let images: FormArray = (this.formGroup.get("images") as FormArray);
		Utils.clearFormArray(images);
		this.formGroup.reset();
	}



	get ximages(): AbstractControl[]
	{
		return (this.formGroup.get("images") as FormArray).controls;
	}



	addImage(): void
	{
		let images: FormArray = this.formGroup.get("images") as FormArray;

		let x = new FormControl({
			id:null,
			file: null,
			imageUrl: null
		});

		images.push(x);
	}



	deleteImage(i: number): void
	{
		let images: FormArray = this.formGroup.get("images") as FormArray;

		const imageValue: Image = images.at(i).value;
		if(imageValue.id)
		{
			this.xDeletedImagesIds.push(imageValue.id);
		}

		images.removeAt(i);
	}



	shiftImage(imageIndex: number, shift: number): void
	{
		// XXX shift is either 1 or -1.
		let newImageIndex = imageIndex + shift;

		let images = (this.formGroup.get("images") as FormArray);
		if(newImageIndex < 0 || newImageIndex >= images.length)
		{
			return;
		}

		let tmpFcs: AbstractControl[] = [];

		for(let i = 0; i < images.controls.length; i++)
		{
			tmpFcs.push(images.controls[i]);
		}
		let tmpFc = tmpFcs[newImageIndex];
		tmpFcs[newImageIndex] = tmpFcs[imageIndex];
		tmpFcs[imageIndex] = tmpFc;

		Utils.clearFormArray(images);
		for(let i = 0; i < tmpFcs.length; i++)
		{
			images.push(tmpFcs[i]);
		}
	}



	ngAfterViewInit()
	{
		let comp = this;

		this.fcns.forEach((x) => {
			x.valueAccessor.registerOnTouched( function() {
				comp.touched.apply(comp);
			 });
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
			let imagesFormArray = x.get("images") as FormArray;
			if(option.images)
			{
				for(let image of option.images)
				{
					let imageFormControl = new FormControl(image);
					imagesFormArray.push(imageFormControl);
				}
			}
			x.get("id").setValue(option.id);
			x.get("name").setValue(option.name);
			x.get("description").setValue(option.description);

			//x.setValue(option);

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

	

	get deletedImagesIds(): number[]
	{
		return this.xDeletedImagesIds;
	}
}
