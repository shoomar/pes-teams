import { NamingConventions, Status } from '../types';


export class Player implements NamingConventions {

	idx = -1;
	readonly fullName: string;
	readonly camelCase: string;
	status = Status.off;
	roll = 42;


	constructor(
		readonly name: string,
		readonly surname: string,
		readonly nickname: string,
	) {
		this.fullName = `${name} ${surname}`;
		this.camelCase = name[0].toLowerCase() + surname;
	}

}