"use strict";
const contentDiv = document.getElementById('content');
const availablePlayersDiv = document.getElementById('available-players');
const optBtn = document.getElementById('optBtn');
const addBtn = document.getElementById('addBtn');
// options
const optionsDiv = document.getElementById('options');
const nameFormatInputs = document.getElementsByName('nameFormat');
const resetBtn = document.getElementById('resetBtn');
const backOptBtn = document.getElementById('backOptBtn');
// all
const allContainerDiv = document.getElementById('all-container');
const allPlayersDiv = document.getElementById('all-players');
const backPlyBtn = document.getElementById('backPlyBtn');
var NameFormat;
(function (NameFormat) {
    NameFormat["fullName"] = "fullName";
    NameFormat["camelCase"] = "camelCase";
    NameFormat["name"] = "name";
    NameFormat["surname"] = "surname";
    NameFormat["nickname"] = "nickname";
})(NameFormat || (NameFormat = {}));
var Status;
(function (Status) {
    Status["available"] = "available";
    Status["blue"] = "blue";
    Status["red"] = "red";
    Status["defeated"] = "defeated";
    Status["off"] = "off";
})(Status || (Status = {}));
class Player {
    constructor(name, surname, nickname) {
        this.name = name;
        this.surname = surname;
        this.nickname = nickname;
        this.idx_ = -1;
        this.fullName = `${name} ${surname}`;
        this.camelCase = name[0].toLowerCase() + surname;
        this.status = Status.off;
    }
    get idx() {
        return this.idx_;
    }
    setIdx(id) {
        this.idx_ = id;
    }
}
function savePlayerPool() {
    sessionStorage.setItem('playerPool', JSON.stringify(playerPool));
}
function initializePlayerPool() {
    const playerPool = sessionStorage.getItem('playerPool');
    if (playerPool) {
        return JSON.parse(playerPool);
    }
    return [];
}
function initializeNameFormat() {
    const nameFormat = localStorage.getItem('nameFormat');
    if (nameFormat) {
        return nameFormat;
    }
    localStorage.setItem('nameFormat', NameFormat.fullName);
    return NameFormat.fullName;
}
function changeNameFormat(format) {
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
function addRemoveAvailablePlayers(e, ele, status) {
    const target = e.target;
    target.classList.add('none');
    ele.childNodes.forEach((node) => {
        const apd = node;
        if (apd.id === target.id) {
            apd.classList.remove('none');
        }
    });
    playerPool[parseInt(target.id)].status = status;
    savePlayerPool();
}
function renderPlayers(nameFormat = NameFormat.fullName) {
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
else
    renderPlayers(nameFormat);
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
    input.addEventListener('change', () => changeNameFormat(input.value));
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
backPlyBtn === null || backPlyBtn === void 0 ? void 0 : backPlyBtn.addEventListener('click', () => {
    allContainerDiv.classList.remove('open');
});
