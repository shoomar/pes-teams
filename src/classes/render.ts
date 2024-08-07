import { Teams, Stars, Player } from './index';
import * as dom from '../dom-elements';
import { NameFormat, Status } from '../types';

export class Render {
	constructor(teams: Teams, stars: Stars) {
		// main
		for (const btn of dom.numberButtonList) {
			btn.addEventListener('click', (e) => {
				const target = e.target as HTMLButtonElement;
				teams.teamSize = parseInt(target.value);
			});
		}

		dom.starBtn.addEventListener('click', () => {
			stars.roll();
		});

		dom.optBtn.addEventListener('click', () => {
			dom.optionsDiv.classList.add('open');
		});

		dom.addBtn.addEventListener('click', () => {
			dom.allContainerDiv.classList.add('open');
		});

		dom.splitBtn.addEventListener('click', () => teams.roll());

		// all players
		dom.addGuestDiv.addEventListener('transitionend', () => {
			dom.guestNameInput.focus();
		});

		dom.guestBtn.addEventListener('click', () => {
			dom.addGuestDiv.classList.add('open');
		});

		dom.backAllPlyBtn.addEventListener('click', () => {
			dom.allContainerDiv.classList.remove('open');
		});

		// guest
		dom.backGuestBtn.addEventListener('click', () => {
			dom.addGuestDiv.classList.remove('open');
		});

		dom.addGuestForm.onsubmit = () => {
			const formData = new FormData(dom.addGuestForm);
			const name = formData.get('name') as string;
			const surname = formData.get('surname') as string;
			const nickname = formData.get('nickname') as string;
			teams.add([ name, surname, nickname ]);
			dom.addGuestForm.reset();
			dom.addGuestDiv.classList.remove('open');
			return false;
		};

		// options
		dom.nameFormatInputs.forEach((input) => {
			if (input.value === teams.nameFormat) {
				input.checked = true;
			}
			input.addEventListener('change', () => teams.nameFormat =  input.value as NameFormat);
		});

		dom.protectLosersCheckbox.checked = teams.protectLosers;
		dom.protectLosersCheckbox.addEventListener('change', (e) => {
			const check = e.target as HTMLInputElement;
			teams.protectLosers = check.checked;
		});

		dom.midSessionCheckbox.checked = teams.midSession;
		dom.midSessionCheckbox.addEventListener('change', (e) => {
			const check = e.target as HTMLInputElement;
			teams.midSession = check.checked;
		});

		dom.minSelect.addEventListener('change', (e) => {
			const opt = e.target as HTMLOptionElement;
			stars.min = parseFloat(opt.value);
			dom.maxSelectOpt.forEach((opt) => {
				if (parseFloat(opt.value) <= stars.min) {
					opt.disabled = true;
				}
				else opt.disabled = false;
			});
		});

		dom.minSelectOpt.forEach((opt) => {
			if (parseFloat(opt.value) === stars.min) opt.selected = true;
		});

		dom.maxSelect.addEventListener('change', (e) => {
			const opt = e.target as HTMLOptionElement;
			stars.max = parseFloat(opt.value);
			dom.minSelectOpt.forEach((opt) => {
				if (parseFloat(opt.value) >= stars.max) {
					opt.disabled = true;
				}
				else opt.disabled = false;
			});
		});

		dom.maxSelectOpt.forEach((opt) => {
			if (parseFloat(opt.value) === stars.max) opt.selected = true;
		});

		dom.resetBtn.addEventListener('click', () => {
			localStorage.clear();
			sessionStorage.clear();
			window.location.reload();
		});

		dom.backOptBtn.addEventListener('click', () => {
			dom.optionsDiv.classList.remove('open');
		});
	}


	static allPlayersDiv(teams: Teams) {
		while (dom.allPlayersDiv.lastChild) {
			dom.allPlayersDiv.lastChild.remove();
		}
		teams.pool.forEach((player: Player) => {
			const playerDiv = document.createElement('div');
			playerDiv.id = player.idx.toString();
			playerDiv.classList.add('player');
			playerDiv.innerText = player[teams.nameFormat];
			playerDiv.addEventListener('click', (e) => {
				const target = e.target as HTMLDivElement;
				target.classList.add(Status.off);
				teams.pool[parseInt(target.id)].status = Status.available;
				teams.pool[parseInt(target.id)].roll(42);
				teams.setAvailable();
				teams.setTeamSize();
				this.availablePlayersDiv(teams);
				this.numberButtonList(teams);
				teams.savePool();
			});
			switch (player.status) {
				case Status.off:
					playerDiv.classList.remove(Status.off);
					break;
				default:
					playerDiv.classList.add(Status.off);
					break;
			}
			dom.allPlayersDiv.appendChild(playerDiv);
		});
	}


	static availablePlayersDiv(teams: Teams) {
		while (dom.availablePlayersDiv.lastChild) {
			dom.availablePlayersDiv.lastChild.remove();
		}
		teams.availablePool.sort((a, b) => {
			if (a.status === Status.blue && b.status === Status.red) return -1;
			else if (a.status === Status.red && b.status === Status.blue) return 1;
			else if (a.status === Status.blue && b.status === Status.defeated) return -1;
			else if (a.status === Status.defeated && b.status === Status.blue) return 1;
			else if (a.status === Status.red && b.status === Status.defeated) return 1;
			else if (a.status === Status.defeated && b.status === Status.red) return -1;
			else return a.rollValue - b.rollValue;
		});
		teams.availablePool.forEach((player, idx) => {
			const availableDiv = document.createElement('div');
			availableDiv.id = player.idx.toString();
			availableDiv.classList.add('player');
			availableDiv.classList.add('available');
			availableDiv.innerText = player[teams.nameFormat];
			switch (player.status) {
				case Status.blue:
					if (teams.midSession) availableDiv.classList.add('midSession');
					availableDiv.classList.add(player.status);
					this.positionInTeamCssClass(teams.availablePool, idx, player.status, availableDiv);
					break;
				case Status.red:
					if (teams.midSession) availableDiv.classList.add('midSession');
					availableDiv.classList.add(player.status);
					this.positionInTeamCssClass(teams.availablePool, idx, player.status, availableDiv);
					break;
				case Status.defeated:
					availableDiv.classList.add(player.status);
					this.positionInTeamCssClass(teams.availablePool, idx, player.status, availableDiv);
					break;
				default:
					break;
			}
			if (!teams.midSession) {
				let clickTimer: number | null = null;
				availableDiv.addEventListener('click', (e) => {
					const target = e.target as HTMLDivElement;
					if (clickTimer === null) {
						clickTimer = window.setTimeout(() => {
							const status = teams.pool[parseInt(target.id)].status;
							if (status === Status.blue || status === Status.red) {
								if (
									teams.availablePool.some((player) => player.status === Status.defeated)
								) {
									return;
								}
								teams.availablePool.forEach((player) => {
									if (status === player.status) {
										player.status = Status.defeated;
									}
								});
							}
							if (status === Status.defeated) {
								const blueWon = teams.availablePool.some((player) => player.status === Status.blue);
								teams.availablePool.forEach((player) => {
									if (player.status === status ) {
										player.status = blueWon ? Status.red : Status.blue;
									}
								});
							}
							this.availablePlayersDiv(teams);
							teams.savePool();
						}, 250);
					}
					// dblclick
					else {
						clearTimeout(clickTimer);
						clickTimer = null;
						const player = teams.pool[parseInt(target.id)];
						player.status = Status.off;
						player.roll(42);
						teams.setAvailable();
						teams.setTeamSize();
						this.availablePlayersDiv(teams);
						dom.allPlayersDiv.childNodes.forEach((node) => {
							const nodeElement = node as HTMLDivElement;
							if (nodeElement.id === target.id) {
								nodeElement.classList.remove(Status.off);
							}
						});
						this.numberButtonList(teams);
						teams.savePool();
					}
				});
			}
			dom.availablePlayersDiv.appendChild(availableDiv);
		});
	}


	static midSessionCheckbox(checked: boolean) {
		dom.midSessionCheckbox.checked = checked;
	}


	static numberButtonList(teams: Teams) {
		for (const btn of dom.numberButtonList) {
			btn.classList.remove('selected-number');
			btn.disabled = true;

			if (parseInt(btn.value) <= teams.availablePool.length) {
				btn.disabled = false;
				if (parseInt(btn.value) === teams.teamSize) {
					btn.classList.add('selected-number');
				}
			}
		}
	}


	static	positionInTeamCssClass(availablePool: Player[], idx: number, status: Status, element: HTMLDivElement ) {
		let first: number | null = null;
		let last: number | null = null;

		for (let i = 0; i < availablePool.length; i++) {
			const player = availablePool[i];
			if (player.status === status) {
				first = first ?? i;
				last = i;
			}
		}

		if (first === last && first === idx) {
			return;
		}
		else if (idx === first) {
			element.classList.add('first');
		}
		else if (idx === last) {
			element.classList.add('last');
		}
		else element.classList.add('middle');
	}


	static protectLosersCheckbox(checked: boolean) {
		dom.protectLosersCheckbox.checked = checked;
	}
}