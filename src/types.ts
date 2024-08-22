export enum NameFormat {
	fullName = 'fullName',
	camelCase = 'camelCase',
	name = 'name',
	surname = 'surname',
	nickname = 'nickname'
}


export type NamingConventions = { [key in NameFormat]: string };


export enum Status {
	available = 'available',
	blue = 'blue',
	red = 'red',
	defeated = 'defeated',
	off = 'off'
}


export const storageNames = {
	local : {
		nameFormat    : 'nameFormat',
		protectLosers : 'protectLosers'
	},
	session : {
		bluePrev   : 'bluePrev',
		midSession : 'midSession',
		playerPool : 'playerPool',
		redPrev    : 'redPrev',
		stars      : 'stars',
		teamSize   : 'teamSize',
	}
} as const;