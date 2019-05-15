import { NgbDateStruct, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';



export interface Survey
{
	id: number;
    name: string,
    description: string,
	fromDate: NgbDateStruct,
    fromTime: NgbTimeStruct,
    untilDate: NgbDateStruct,
	untilTime: NgbTimeStruct
}
