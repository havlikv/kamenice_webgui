import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';



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


}
