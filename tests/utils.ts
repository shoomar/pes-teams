import { NameFormat, storageNames } from '../src/types';


export function readFromStorage(
	name: (typeof storageNames.local)[keyof typeof storageNames.local]
		| (typeof storageNames.session)[keyof typeof storageNames.session]
) {
	let fromStorage = null;
	let data = null;

	const isLocalStorageName = (s: string): boolean => {
		for (const n of Object.values(storageNames.local)) {
			if (s === n) return true;
		}
		return false;
	};
	const isSessionStorageName = (s: string): boolean => {
		for (const n of Object.values(storageNames.session)) {
			if (s === n) return true;
		}
		return false;
	};

	if (isLocalStorageName(name)) fromStorage = localStorage.getItem(name);
	if (isSessionStorageName(name)) fromStorage = sessionStorage.getItem(name);


	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	if (fromStorage !== null) data = JSON.parse(fromStorage);
	else throw new Error('No such item in storage.');

	switch (name) {
		case storageNames.local.nameFormat:
			return data as NameFormat;
		case storageNames.local.protectLosers:
		case storageNames.session.midSession:
			return data as boolean;
		case storageNames.session.teamSize:
			return data as number;
		case storageNames.session.bluePrev:
		case storageNames.session.redPrev:
		case storageNames.session.stars:
			return data as number[];
	}
}