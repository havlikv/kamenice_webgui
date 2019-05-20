import { ValidatorFn, AbstractControl } from "@angular/forms";
import { Survey } from "../domain/survey";



export function surveyFormValidator(control: AbstractControl): { [key: string]: any } | null
{
	const survey = control.value as Survey;

	if(! survey.name )
	{
		return { err: "survey.name" };
	}

	return null;
}
