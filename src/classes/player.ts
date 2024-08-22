import { NamingConventions, Status } from '../types';


export class Player implements NamingConventions {

	bonus              : number = 0;
	readonly camelCase : string;
	readonly fullName  : string;
	idx                : number = -1;
	rollValue = 42;
	status             : Status = Status.off;

	constructor(
		readonly name : string,
		readonly surname : string,
		readonly nickname : string,
	) {
		this.camelCase = name[0].toLowerCase() + surname;
		this.fullName = `${name} ${surname}`;
	}
}