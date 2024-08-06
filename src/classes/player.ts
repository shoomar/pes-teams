import { NamingConventions, Status } from '../types';


export class Player implements NamingConventions {

	idx = -1;
	readonly fullName: string;
	readonly camelCase: string;
	#status: Status = Status.off;
	#rollValue = 42;
	#bonus: number = 0;

	constructor(
		readonly name: string,
		readonly surname: string,
		readonly nickname: string,
	) {
		this.fullName = `${name} ${surname}`;
		this.camelCase = name[0].toLowerCase() + surname;
	}

	get bonus(): number {
		return this.#bonus;
	}

	get rollValue(): number {
		return this.#rollValue;
	}

	get status(): Status {
		return this.#status;
	}

	set status(status: Status) {
		this.#status = status;
	}

	roll(plusMinus = 0) {
		this.#rollValue = Math.random() + plusMinus;
	}
}