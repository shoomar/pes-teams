"use strict";
class Player {
    constructor(name, surname, nickname) {
        this.name = name;
        this.surname = surname;
        this.nickname = nickname;
        this.fullName = `${name} ${surname}`;
        this.camelCase = name[0].toLowerCase() + surname;
    }
}
const pesCrew = [
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
const playerPool = [];
pesCrew.forEach((crewMember) => {
    playerPool.push(new Player(...crewMember));
});
function setNameFormat(format) {
    localStorage.setItem('nameFormat', format);
}
function getNameFormat() {
    return localStorage.getItem('nameFormat');
}
if (!getNameFormat())
    setNameFormat('camelCase');
const allPlayersDiv = document.getElementById('all-players');
const availablePlayersDiv = document.getElementById('available-players');
function renderPlayers(playerPool, nameFormat, nodeAll, nodeAvailable) {
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
function clearPlayers(node) {
    while (node.lastChild) {
        node.lastChild.remove();
    }
}
renderPlayers(playerPool, localStorage.getItem('nameFormat'), allPlayersDiv, availablePlayersDiv);
const removveButton = document.getElementById('remove');
console.log(removveButton, 'dudu');
removveButton === null || removveButton === void 0 ? void 0 : removveButton.addEventListener('click', () => {
    clearPlayers(availablePlayersDiv);
    clearPlayers(allPlayersDiv);
    renderPlayers(playerPool, 'fullName', allPlayersDiv, availablePlayersDiv);
});
