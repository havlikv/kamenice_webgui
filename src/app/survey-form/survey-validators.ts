import { Validator, AbstractControl, ValidationErrors, NG_VALIDATORS } from '@angular/forms';
import { Directive } from '@angular/core';


@Directive({
	selector: "[appNgbTimePickerValidator]",
	providers: [
		{
			provide: NG_VALIDATORS,
			useExisting: NgbTimePickerValidator,
			multi: true
		}
	]
})
export class NgbTimePickerValidator implements Validator
{
	constructor()
	{
		console.log("Constructing validator.");
	}



	validate(control: AbstractControl): ValidationErrors | null
	{
		console.log("Validating NgbTimePicker ..");

		/*
		if(control.value == null)
		{
			console.log("NgbTimePicker error.");
			return { err: "XXX"};
		}
		*/

		return null;
	}
}
