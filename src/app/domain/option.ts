import { Image } from "./image";


export interface Option
{
	id?: number;
	name: string;
	description: string;
	images: Image[];
}
