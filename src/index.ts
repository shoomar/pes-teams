import './styles/index.scss';
import { PlayerPool, Stars } from './classes';
import { locale, pesCrew } from './customizable';
import { addBtn, allContainerDiv, allPlayersDiv, availablePlayersDiv, backAllPlyBtn, backOptBtn, nameFormatInputs, optBtn, optionsDiv, resetBtn, splitBtn, starsDiv } from './dom-elements';
import { NameFormat } from './types';
// import { NameFormat, Player } from './Player';
// import { starBtn, optBtn, addBtn, optionsDiv, nameFormatInputs, resetBtn, backOptBtn, allContainerDiv, backPlyBtn } from './dom-elements';
// import { getPlayerPool, renderPlayerPool, sortAndSavePlayerPool, savePlayerPool } from './functions/player-pool';
// export { getPlayerPool, savePlayerPool };
// import { renderAvailablePool } from './functions/available-pool';
// import { changeNameFormat, getNameFormat } from './functions/name-format';
// import { pesCrew } from './customizable';


const playerPool = new PlayerPool(
	pesCrew, locale, availablePlayersDiv, allPlayersDiv
);

playerPool.render();

const star = new Stars(starsDiv);
star.render();


// const roll = () => {
// 	availablePool.forEach((player) => {
// 		player.roll = Math.random();
// 	});
// 	renderAvailablePool(getNameFormat());
// 	savePlayerPool();
// };

// initial
// console.log(getPlayerPool().length);
// if (!getPlayerPool().length) {
// 	pesCrew.forEach((crewMember) => {
// 		const player = new Player(...crewMember);
// 		getPlayerPool().push(player);
// 	});
// 	sortAndSavePlayerPool();
// 	renderPlayerPool(getNameFormat());
// }
// else {
// 	renderPlayerPool(getNameFormat());
// 	renderAvailablePool(getNameFormat());
// }

// starBtn.addEventListener('click', () => renderAvailablePool(getNameFormat()));
optBtn.addEventListener('click', () => {
	optionsDiv.classList.add('open');
});

addBtn.addEventListener('click', () => {
	allContainerDiv.classList.add('open');
});

splitBtn.addEventListener('click', () => playerPool.roll());


// options
nameFormatInputs.forEach((input) => {
	if (input.value === playerPool.nameFormat) {
		input.checked = true;
	}
});

nameFormatInputs.forEach((input) => {
	input.addEventListener('change', () => playerPool.nameFormat =  input.value as NameFormat);
});

resetBtn.addEventListener('click', () => {
	localStorage.clear();
	sessionStorage.clear();
	window.location.reload();
});

backOptBtn.addEventListener('click', () => {
	optionsDiv.classList.remove('open');
});


// all players
backAllPlyBtn.addEventListener('click', () => {
	allContainerDiv.classList.remove('open');
});

// let halfStar: string;
// fetch('star.svg')
// 	.then((r) => r.text())
// 	.then((text) => {
// 		halfStar = text;
// 		console.log(halfStar);
// 	})
// 	.catch((err) => console.error(err));