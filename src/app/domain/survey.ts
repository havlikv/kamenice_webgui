import { NgbDateStruct, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { FromBeOption } from './FromBeOption';



export interface Survey
{
	id: number;
    name: string;
    description: string;
	fromDate: NgbDateStruct;
    fromTime: NgbTimeStruct;
    untilDate: NgbDateStruct;
	untilTime: NgbTimeStruct;

	options: FromBeOption[];
}
