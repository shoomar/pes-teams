// export enum NameFormat {
// 	fullName = 'fullName',
// 	camelCase = 'camelCase',
// 	name = 'name',
// 	surname = 'surname',
// 	nickname = 'nickname'
// }

// export enum Status {
//     available = 'available',
// 	blue = 'blue',
// 	red = 'red',
// 	defeated = 'defeated',
// 	off = 'off'
// }

// type NamingConventions = {[key in NameFormat]: string};

// export class Player implements NamingConventions {
// 	idx: number;
// 	readonly fullName: string;
// 	readonly camelCase: string;
// 	status: Status;
// 	roll: number;

// 	constructor(
// 		readonly name: string,
// 		readonly surname: string,
// 		readonly nickname: string,
// 	) {
// 		this.idx = -1;
// 		this.fullName = `${name} ${surname}`;
// 		this.camelCase = name[0].toLowerCase() + surname;
// 		this.status = Status.off;
// 		this.roll = -1;
// 	}
// }