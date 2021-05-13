class Player {
	fullName: string;
	camelCase: string;

	constructor(
		public name: string,
		public surname: string,
		public nickname: string,
	) {
		this.fullName = `${name} ${surname}`;
		this.camelCase = name[0].toLowerCase() + surname;
	}
}

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

const playerPool: Player[] = [];
pesCrew.forEach((crewMember) => {
	playerPool.push(new Player(...crewMember));
});



function setNameFormat(format: keyof Player) {
	localStorage.setItem('nameFormat', format);
}

function getNameFormat() {
	return localStorage.getItem('nameFormat');
}

if (!getNameFormat()) setNameFormat('camelCase');



const allPlayersDiv = document.getElementById('all-players') as HTMLDivElement;
const availablePlayersDiv = document.getElementById('available-players') as HTMLDivElement;



function renderPlayers(
	playerPool: Player[],
	nameFormat: keyof Player,
	nodeAll: HTMLDivElement,
	nodeAvailable: HTMLDivElement
) {
	playerPool.forEach((player) => {
		const playerDiv = document.createElement('div');
		playerDiv.id = player.camelCase;
		playerDiv.classList.add('player');
		playerDiv.innerText = player[nameFormat];
		nodeAll.appendChild(playerDiv);
		const availableDiv = document.createElement('div');
		availableDiv.id = `x${player.camelCase}`;
		availableDiv.classList.add('available');
		availableDiv.innerText = player[nameFormat];
		nodeAvailable.appendChild(availableDiv);
	});

}

function clearPlayers(node: HTMLDivElement) {
	while (node.lastChild) {
		node.lastChild.remove();

	}
}

renderPlayers(playerPool, localStorage.getItem('nameFormat') as keyof Player, allPlayersDiv, availablePlayersDiv);


const removveButton = document.getElementById('remove');
console.log(removveButton, 'dudu');
removveButton?.addEventListener('click', () => {
	clearPlayers(availablePlayersDiv);
	clearPlayers(allPlayersDiv);
	renderPlayers(playerPool, 'fullName', allPlayersDiv, availablePlayersDiv);
});
