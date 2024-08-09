import { Teams, Stars, Player } from './index';
import * as dom from '../dom-elements';
import { NameFormat, Status } from '../types';

export class Render extends Teams {

	constructor(
		playerList: ConstructorParameters<typeof Player>[],
		language: string,
		stars: Stars
	) {
		super(playerList, language);
		// main
		for (const btn of dom.numberButtonList) {
			btn.addEventListener('click', (e) => {
				const target = e.target as HTMLButtonElement;
				this.teamSize = parseInt(target.value);
				this.numberButtonList();
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

		dom.splitBtn.addEventListener('click', () => {
			this.roll();
			this.availablePlayersDiv();
			dom.midSessionCheckbox.checked = this.midSession;
		});

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
			this.add([ name, surname, nickname ]);
			this.allPlayersDiv();
			this.availablePlayersDiv();
			this.numberButtonList();
			dom.addGuestForm.reset();
			dom.addGuestDiv.classList.remove('open');
			return false;
		};

		// options
		dom.nameFormatInputs.forEach((input) => {
			if (input.value === this.nameFormat) {
				input.checked = true;
			}
			input.addEventListener('change', () => {
				this.nameFormat =  input.value as NameFormat;
				this.allPlayersDiv();
				this.availablePlayersDiv();
			});
		});

		if (this.teamSize < 3) dom.midSessionCheckbox.disabled = true;
		dom.midSessionCheckbox.checked = this.midSession;
		dom.midSessionCheckbox.addEventListener('change', (e) => {
			const check = e.target as HTMLInputElement;
			this.midSession = check.checked;
			this.availablePlayersDiv();
		});

		dom.protectLosersCheckbox.checked = this.protectLosers;
		dom.protectLosersCheckbox.addEventListener('change', (e) => {
			const check = e.target as HTMLInputElement;
			this.protectLosers = check.checked;
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

		// render from teams
		this.allPlayersDiv();
		this.availablePlayersDiv();
		this.numberButtonList();
	}


	allPlayersDiv() {
		while (dom.allPlayersDiv.lastChild) {
			dom.allPlayersDiv.lastChild.remove();
		}
		this.pool.forEach((player: Player) => {
			const playerDiv = document.createElement('div');
			playerDiv.id = player.idx.toString();
			playerDiv.classList.add('player');
			playerDiv.innerText = player[this.nameFormat];
			playerDiv.addEventListener('click', (e) => {
				const target = e.target as HTMLDivElement;
				target.classList.add(Status.off);
				this.pool[parseInt(target.id)].status = Status.available;
				this.pool[parseInt(target.id)].rollValue = 42;
				this.setAvailable();
				this.setTeamSize();
				this.availablePlayersDiv();
				this.numberButtonList();
				this.savePool();
				if (this.teamSize >= 3) dom.midSessionCheckbox.disabled = false;
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


	availablePlayersDiv() {
		while (dom.availablePlayersDiv.lastChild) {
			dom.availablePlayersDiv.lastChild.remove();
		}
		this.availablePool.sort((a, b) => {
			if (a.status === Status.blue && b.status === Status.red) return -1;
			else if (a.status === Status.red && b.status === Status.blue) return 1;
			else if (a.status === Status.blue && b.status === Status.defeated) return -1;
			else if (a.status === Status.defeated && b.status === Status.blue) return 1;
			else if (a.status === Status.red && b.status === Status.defeated) return 1;
			else if (a.status === Status.defeated && b.status === Status.red) return -1;
			else return a.rollValue - b.rollValue;
		});
		this.availablePool.forEach((player, idx) => {
			const availableDiv = document.createElement('div');
			availableDiv.id = player.idx.toString();
			availableDiv.classList.add('player');
			availableDiv.classList.add('available');
			availableDiv.innerText = player[this.nameFormat];
			switch (player.status) {
				case Status.blue:
					if (this.midSession) availableDiv.classList.add('midSession');
					availableDiv.classList.add(player.status);
					this.positionInTeamCssClass(this.availablePool, idx, player.status, availableDiv);
					break;
				case Status.red:
					if (this.midSession) availableDiv.classList.add('midSession');
					availableDiv.classList.add(player.status);
					this.positionInTeamCssClass(this.availablePool, idx, player.status, availableDiv);
					break;
				case Status.defeated:
					availableDiv.classList.add(player.status);
					this.positionInTeamCssClass(this.availablePool, idx, player.status, availableDiv);
					break;
				default:
					break;
			}
			if (!this.midSession) {
				let clickTimer: number | null = null;
				availableDiv.addEventListener('click', (e) => {
					const target = e.target as HTMLDivElement;
					if (clickTimer === null) {
						clickTimer = window.setTimeout(() => {
							const status = this.pool[parseInt(target.id)].status;
							if (status === Status.blue || status === Status.red) {
								if (
									this.availablePool.some((player) => player.status === Status.defeated)
								) {
									return;
								}
								this.availablePool.forEach((player) => {
									if (status === player.status) {
										player.status = Status.defeated;
									}
								});
							}
							if (status === Status.defeated) {
								const blueWon = this.availablePool.some((player) => player.status === Status.blue);
								this.availablePool.forEach((player) => {
									if (player.status === status ) {
										player.status = blueWon ? Status.red : Status.blue;
									}
								});
							}
							this.availablePlayersDiv();
							this.savePool();
						}, 250);
					}
					// dblclick
					else {
						clearTimeout(clickTimer);
						clickTimer = null;
						const player = this.pool[parseInt(target.id)];
						player.status = Status.off;
						player.rollValue = 42;
						this.setAvailable();
						this.setTeamSize();
						this.availablePlayersDiv();
						dom.allPlayersDiv.childNodes.forEach((node) => {
							const nodeElement = node as HTMLDivElement;
							if (nodeElement.id === target.id) {
								nodeElement.classList.remove(Status.off);
							}
						});
						this.numberButtonList();
						this.savePool();
						if (this.teamSize < 3) dom.midSessionCheckbox.disabled = true;
					}
				});
			}
			dom.availablePlayersDiv.appendChild(availableDiv);
		});
	}


	numberButtonList() {
		for (const btn of dom.numberButtonList) {
			btn.classList.remove('selected-number');
			btn.disabled = true;

			if (parseInt(btn.value) <= this.availablePool.length) {
				btn.disabled = false;
				if (parseInt(btn.value) === this.teamSize) {
					btn.classList.add('selected-number');
				}
			}
		}
	}


	positionInTeamCssClass(availablePool: Player[], idx: number, status: Status, element: HTMLDivElement ) {
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
}