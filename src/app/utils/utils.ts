import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormArray } from '@angular/forms';



export abstract class Utils
{
	public static compareNgbStructs(fromDate: NgbDateStruct, untilDate: NgbDateStruct): number
	{
		if(fromDate.year < untilDate.year)
		{
			return -1;
		}
		else if(fromDate.year > untilDate.year)
		{
			return 1;
		}


		if(fromDate.month < untilDate.month)
		{
			return -1;
		}
		else if(fromDate.month > untilDate.month)
		{
			return 1;
		}


		if(fromDate.day < untilDate.day)
		{
			return -1;
		}
		else if(fromDate.day > untilDate.day)
		{
			return 1;
		}

		return 0;
	}


	public static clearFormArray(fa: FormArray): void
	{
		while (fa.length !== 0)
		{
			fa.removeAt(0)
		}
	}



	public static indexWithin(arr: any[],  index: number)
	{
		return Array.isArray(arr) && index < arr.length;
	}

}

