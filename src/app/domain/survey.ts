import { NgbDateStruct, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { Option } from './Option';



export interface Survey
{
	id: number;
    name: string;
    description: string;
	fromDate: NgbDateStruct;
    fromTime: NgbTimeStruct;
    untilDate: NgbDateStruct;
	untilTime: NgbTimeStruct;

	options: Option[];
}
