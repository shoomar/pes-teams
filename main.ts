const contentDiv = document.getElementById('content') as HTMLDivElement;
const availablePlayersDiv = document.getElementById('available-players') as HTMLDivElement;
const optBtn = document.getElementById('optBtn') as HTMLButtonElement;
const addBtn = document.getElementById('addBtn') as HTMLButtonElement;

// options
const optionsDiv = document.getElementById('options') as HTMLDivElement;
const nameFormatInputs = document.getElementsByName('nameFormat') as NodeListOf<HTMLInputElement>;
const resetBtn = document.getElementById('resetBtn') as HTMLButtonElement;
const backOptBtn = document.getElementById('backOptBtn') as HTMLButtonElement;

// all
const allContainerDiv = document.getElementById('all-container') as HTMLDivElement;
const allPlayersDiv = document.getElementById('all-players') as HTMLDivElement;
const backPlyBtn = document.getElementById('backPlyBtn');


enum NameFormat {
	fullName = 'fullName',
	camelCase = 'camelCase',
	name = 'name',
	surname = 'surname',
	nickname = 'nickname'
}
type NamingConventions = {[key in NameFormat]: string};
enum Status {
	available = 'available',
	blue = 'blue',
	red = 'red',
	defeated = 'defeated',
	off = 'off'
}

class Player implements NamingConventions {
	private idx_: number;
	readonly fullName: string;
	readonly camelCase: string;
	status: Status;

	constructor(
		readonly name: string,
		readonly surname: string,
		readonly nickname: string,
	) {
		this.idx_ = -1;
		this.fullName = `${name} ${surname}`;
		this.camelCase = name[0].toLowerCase() + surname;
		this.status = Status.off;
	}

	get idx() {
		return this.idx_;
	}

	setIdx(id: number) {
		this.idx_ = id;
	}
}


function savePlayerPool() {
	sessionStorage.setItem('playerPool', JSON.stringify(playerPool));
}

function initializePlayerPool(): Player[] {
	const playerPool = sessionStorage.getItem('playerPool');
	if (playerPool) {
		return JSON.parse(playerPool) as Player[];
	}
	return [];
}

function initializeNameFormat() {
	const nameFormat = localStorage.getItem('nameFormat') as NameFormat;
	if (nameFormat) {
		return nameFormat;
	}
	localStorage.setItem('nameFormat', NameFormat.fullName);
	return NameFormat.fullName;
}

function changeNameFormat(format: NameFormat) {
	sortAndSavePlayers(format);
	renderPlayers(format);
	localStorage.setItem('nameFormat', format);
}

function sortAndSavePlayers(format = NameFormat.fullName) {
	playerPool.sort((a, b) => a[format].localeCompare(b[format], locale));
	playerPool.forEach((player, idx) => {
		player.setIdx(idx);
	});
	savePlayerPool();
}

function addRemoveAvailablePlayers(e: MouseEvent, ele: HTMLDivElement, status: Status) {
	const target = e.target as HTMLDivElement;
	target.classList.add('none');
	ele.childNodes.forEach((node) => {
		const apd = node as HTMLDivElement;
		if (apd.id === target.id) {
			apd.classList.remove('none');
		}
	});
	playerPool[parseInt(target.id)].status = status;
	savePlayerPool();
}

function renderPlayers(
	nameFormat = NameFormat.fullName
) {
	while (allPlayersDiv.lastChild) {
		allPlayersDiv.lastChild.remove();
		if (availablePlayersDiv.lastChild) {
			availablePlayersDiv.lastChild.remove();
		}
	}
	playerPool.forEach((player) => {
		const playerDiv = document.createElement('div');
		const availableDiv = document.createElement('div');

		playerDiv.id = player.idx.toString();
		playerDiv.classList.add('player');
		playerDiv.innerText = player[nameFormat];
		playerDiv.addEventListener('click', (e) => addRemoveAvailablePlayers(e, availablePlayersDiv, Status.available));

		availableDiv.id = player.idx.toString();
		availableDiv.classList.add('player');
		availableDiv.classList.add('available');
		availableDiv.innerText = player[nameFormat];
		availableDiv.addEventListener('click', (e) => addRemoveAvailablePlayers(e, allPlayersDiv, Status.off));

		switch (player.status) {
			case Status.off:
				availableDiv.classList.add('none');
				playerDiv.classList.remove('none');
				break;
			case Status.available:
				availableDiv.classList.remove('none');
				playerDiv.classList.add('none');
				break;
			default:
				break;
		}

		allPlayersDiv.appendChild(playerDiv);
		availablePlayersDiv.appendChild(availableDiv);
	});

}


const locale = 'sr';
const pesCrew: ConstructorParameters<typeof Player>[] = [
	[
		'Aca',
		'Todorović',
		'Todor'
	],
	[
		'Boki',
		'Timotijević',
		'Boki-Đole'
	],
	[
		'Branko',
		'Tošković',
		'Shoomar'
	],
	[
		'Bojan',
		'Zlatković',
		'Boki'
	],
	[
		'Đorđe',
		'Babić',
		'Babić'
	],
	[
		'Dragoslav',
		'Banašević',
		'Gnjurac'
	],
	[
		'Dejan',
		'Ćurković',
		'Deki'
	],
	[
		'Dušan',
		'Radulaški',
		'Dući'
	],
	[
		'Filip',
		'Sabo Batanč',
		'Filip'
	],
	[
		'Ivan',
		'Nastić',
		'Nasti'
	],
	[
		'Igor',
		'Savin',
		'Zec'
	],
	[
		'Marko',
		'Stamenković',
		'Stameni'
	],
	[
		'Nemanja',
		'Nikolić',
		'Neksi'
	],
	[
		'Nebojša',
		'Petković',
		'Petko'
	],
	[
		'Nikola',
		'Rončević',
		'Ronča'
	],
	[
		'Nikola',
		'Vrhovac',
		'Vrle'
	],
	[
		'Predrag',
		'Novaković',
		'Đops'
	],
	[
		'Predrag',
		'Novković',
		'Peđa'
	],
	[
		'Vedran',
		'Marjanović',
		'Veki'
	],
	[
		'Vlada',
		'Popović',
		'Lima'
	],
	[
		'Vladimir',
		'Atlagić',
		'Smo'
	],
	[
		'Vuk',
		'Mandić',
		'Vuk'
	],
];



const playerPool = initializePlayerPool();
const nameFormat = initializeNameFormat();

if (!playerPool.length) {
	pesCrew.forEach((crewMember) => {
		const player = new Player(...crewMember);
		playerPool.push(player);
	});
	sortAndSavePlayers();
	renderPlayers();
}
else renderPlayers(nameFormat);


optBtn.addEventListener('click', () => {
	optionsDiv.classList.add('open');
});

addBtn.addEventListener('click', () => {
	allContainerDiv.classList.add('open');
});


// options
nameFormatInputs.forEach((input) => {
	if (input.id === nameFormat) {
		input.checked = true;
	}
});

nameFormatInputs.forEach((input) => {
	input.addEventListener('change', () => changeNameFormat(input.value as NameFormat));
});

resetBtn.addEventListener('click', () => {
	localStorage.clear();
	sessionStorage.clear();
	window.location.reload();
});

backOptBtn.addEventListener('click', () => {
	optionsDiv.classList.remove('open');
});

//all
backPlyBtn?.addEventListener('click', () => {
	allContainerDiv.classList.remove('open');
});