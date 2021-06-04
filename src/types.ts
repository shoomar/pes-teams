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