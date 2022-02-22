export enum NameFormat {
	fullName = 'fullName',
	camelCase = 'camelCase',
	name = 'name',
	surname = 'surname',
	nickname = 'nickname'
}

export type NamingConventions = {[key in NameFormat]: string};

export enum Status {
    available = 'available',
	blue = 'blue',
	red = 'red',
	defeated = 'defeated',
	off = 'off'
}


export type StarLevels =  [ 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5 ];

export type StarMinimum = 0.5 |  1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 4.5;

export type StarMaximum = 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 4.5 | 5;

export enum RollType {
	every,
	random
}

export enum ResultOffset {
	none,
	small,
	medium,
	large
}

export type StarSettings = [
	min: StarMinimum,
	max: StarMaximum,
	rollType : RollType,
	resultOffset: ResultOffset
];