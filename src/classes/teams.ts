import { NameFormat, Status } from '../types';
import { Player } from './player';


export class Teams {

	private inSessionStoragePlayerPool = 'playerPool';
	private inSessionStorageTeamSize = 'teamSize';
	private inSessionStorageMidSession = 'midSession';
	private inLocalStorageNameFormat = 'nameFormat';

	#nameFormat: NameFormat;
	private pool: Player[] = [];
	private availablePool: Player[];

	#teamSize: number;
	private blueLastRoster: number[];
	private redLastRoster: number[];

	#midSession: boolean;

	constructor(
		private playerList: ConstructorParameters<typeof Player>[],
		private language: string,
		private availablesElement: HTMLDivElement,
		private numberButtonsList: NodeListOf<HTMLButtonElement>,
		private allElement: HTMLDivElement,
		private midSessionCheckbox: HTMLInputElement
	) {
		const fromStorage = localStorage.getItem(this.inLocalStorageNameFormat);
		if (fromStorage) {
			this.#nameFormat = fromStorage as NameFormat;
		}
		else {
			this.#nameFormat = NameFormat.fullName;
		}

		const fromSessionPlayerPool = sessionStorage.getItem(this.inSessionStoragePlayerPool);
		if (fromSessionPlayerPool) {
			this.pool = JSON.parse(fromSessionPlayerPool) as Player[];
		}
		else {
			this.playerList.forEach((member) => {
				const player = new Player(...member);
				this.pool.push(player);
				this.pool.sort((a, b) => a[this.#nameFormat].localeCompare(b[this.#nameFormat], this.language));
				this.pool.forEach((player, idx) => {
					player.idx = idx;
				});
			});
		}

		this.availablePool = this.pool.filter((player) => player.status !== Status.off);

		const fromSessionTeamSize = sessionStorage.getItem(this.inSessionStorageTeamSize);
		if (fromSessionTeamSize) {
			this.#teamSize = JSON.parse(fromSessionTeamSize) as number;
		}
		else {
			this.#teamSize = this.availablePool.length > 8 ? 8 : this.availablePool.length;
		}

		const fromSessionMidSession = sessionStorage.getItem(this.inSessionStorageMidSession);
		if (fromSessionMidSession) {
			this.#midSession = JSON.parse(fromSessionMidSession) as boolean;
		}
		else this.#midSession = false;

		this.blueLastRoster = [];
		this.redLastRoster = [];

		this.setNumberBtnList();
		this.renderPlayers();
		this.renderAvailable();

	}


	add(newPlayer: ConstructorParameters<typeof Player>): void {
		const player = new Player(...newPlayer);
		player.status = Status.available;
		this.pool.push(player);
		this.sortPool();
		this.setAvailable();
		this.setTeamSize();
		this.renderPlayers();
		this.renderAvailable();
		this.setNumberBtnList();
	}


	get nameFormat(): NameFormat {
		return this.#nameFormat;
	}

	set nameFormat(format: NameFormat) {
		this.#nameFormat = format;
		this.sortPool();
		this.setAvailable();
		this.renderPlayers();
		this.renderAvailable();
		localStorage.setItem(this.inLocalStorageNameFormat, this.#nameFormat);
	}


	get midSession(): boolean {
		return this.#midSession;
	}

	set midSession(checked: HTMLInputElement['checked']) {
		if (checked) {
			this.#midSession = true;
		}
		else {
			this.#midSession = false;
		}
		sessionStorage.setItem(this.inSessionStorageMidSession, JSON.stringify(this.#midSession));
		this.midSessionCheckbox.checked = this.#midSession;
		this.renderAvailable();
	}


	roll(): void {
		if (this.availablePool.length < 3) return;

		if (this.#midSession) {
			this.setRoster(); // if accidental page reload

			if (
				this.blueLastRoster.length + this.redLastRoster.length >= this.#teamSize
			) return;

			const toAdd = this.availablePool.filter(
				(p) => p.status === Status.available || p.status === Status.defeated
			);
			if (toAdd.length === 0) {
				this.midSession = false;
				this.roll();
			}

			toAdd.forEach((player) => {
				player.roll = Math.random() + 3;
			});
			toAdd.sort((a, b) => a.roll - b.roll);

			while (
				this.blueLastRoster.length + this.redLastRoster.length < this.#teamSize &&
				toAdd.length > 0
			) {
				const newPlayer = toAdd.shift() as Player;
				if (this.redLastRoster.length < this.blueLastRoster.length) {
					newPlayer.status = Status.red;
					this.redLastRoster.push(newPlayer.idx);
				}
				else if (this.redLastRoster.length > this.blueLastRoster.length) {
					newPlayer.status = Status.blue;
					this.blueLastRoster.push(newPlayer.idx);
				}
				else {
					const choice = [ Status.blue, Status.red ][Math.round(Math.random())];
					newPlayer.status = choice;
					if (choice === Status.blue) {
						this.blueLastRoster.push(newPlayer.idx);
					}
					else {
						this.redLastRoster.push(newPlayer.idx);
					}
				}
			}
		}
		else {
			this.availablePool.forEach((player) => {
				if (player.status === Status.defeated) {
					player.roll = Math.random() + 2;
				}
				else if (player.status === Status.red || player.status === Status.blue) {
					player.roll = Math.random() + 1;
				}
				else player.roll = Math.random();
			});
			this.availablePool.sort((a, b) => a.roll - b.roll);

			for (let i = 0; i < this.#teamSize; i++) {
				const player = this.availablePool[i];
				player.roll = Math.random();
			}
			this.availablePool.sort((a, b) => a.roll - b.roll);

			this.availablePool.forEach((player, idx) => {
				if (idx < Math.ceil(this.#teamSize / 2)) {
					player.status = Status.blue;
				}
				else if (idx < this.#teamSize) {
					player.status = Status.red;
				}
				else player.status = Status.available;
			});
			if (!this.checkRoster()) this.roll();
		}

		this.setRoster();
		this.midSession = false;
		this.renderAvailable();
		this.savePool();
	}


	set teamSize(x: number) {
		if (x > 8 || x < 3) {
			throw new Error('team size must be between 3 and 8');
		}
		this.#teamSize = x;
		sessionStorage.setItem(this.inSessionStorageTeamSize, `${this.#teamSize}`);
		this.setNumberBtnList();
	}


	private checkRoster(): boolean {
		const blue: number[] = [];
		const red: number[] = [];
		this.availablePool.forEach(({ status, idx }) => {
			switch (status) {
				case 'blue':
					blue.push(idx);
					break;
				case 'red':
					red.push(idx);
					break;
				default:
					break;
			}
		});

		if (
			blue.every((player) => this.blueLastRoster.includes(player))
			|| blue.every((player) => this.redLastRoster.includes(player))
			|| red.every((player) => this.blueLastRoster.includes(player))
			|| red.every((player) => this.redLastRoster.includes(player))
		) {
			return false;
		}
		return true;
	}


	private positionInTeamCssClass(idx: number, status: Status, element: HTMLDivElement ) {
		let first: number | null = null;
		let last: number | null = null;

		for (let i = 0; i < this.availablePool.length; i++) {
			const player = this.availablePool[i];
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


	private renderAvailable(): void {
		while (this.availablesElement.lastChild) {
			this.availablesElement.lastChild.remove();
		}

		this.availablePool.sort((a, b) => {
			if (a.status === Status.blue && b.status === Status.red) return -1;
			else if (a.status === Status.red && b.status === Status.blue) return 1;
			else if (a.status === Status.blue && b.status === Status.defeated) return -1;
			else if (a.status === Status.defeated && b.status === Status.blue) return 1;
			else if (a.status === Status.red && b.status === Status.defeated) return 1;
			else if (a.status === Status.defeated && b.status === Status.red) return -1;
			else return a.roll - b.roll;
		});

		this.availablePool.forEach((player, idx) => {
			const availableDiv = document.createElement('div');

			availableDiv.id = player.idx.toString();
			availableDiv.classList.add('player');
			availableDiv.classList.add('available');
			availableDiv.innerText = player[this.#nameFormat];

			switch (player.status) {
				case Status.blue:
					if (this.#midSession) availableDiv.classList.add('midSession');
					availableDiv.classList.add(player.status);
					this.positionInTeamCssClass(idx, player.status, availableDiv);
					break;
				case Status.red:
					if (this.#midSession) availableDiv.classList.add('midSession');
					availableDiv.classList.add(player.status);
					this.positionInTeamCssClass(idx, player.status, availableDiv);
					break;
				case Status.defeated:
					availableDiv.classList.add(player.status);
					this.positionInTeamCssClass(idx, player.status, availableDiv);
					break;
				default:
					break;
			}

			if (!this.#midSession) {
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

							this.renderAvailable();
							this.savePool();

						}, 250);
					}
					// dblclick
					else {
						clearTimeout(clickTimer);
						clickTimer = null;
						const player = this.pool[parseInt(target.id)];
						player.status = Status.off;
						player.roll = 42;
						this.setAvailable();
						this.setTeamSize();
						this.renderAvailable();
						this.allElement.childNodes.forEach((node) => {
							const nodeElement = node as HTMLDivElement;
							if (nodeElement.id === target.id) {
								nodeElement.classList.remove(Status.off);
							}
						});
						this.setNumberBtnList();
						this.savePool();
					}
				});
			}

			this.availablesElement.appendChild(availableDiv);
		});
	}


	private renderPlayers(): void {
		while (this.allElement.lastChild) {
			this.allElement.lastChild.remove();
		}

		this.pool.forEach((player) => {
			const playerDiv = document.createElement('div');

			playerDiv.id = player.idx.toString();
			playerDiv.classList.add('player');
			playerDiv.innerText = player[this.#nameFormat];

			playerDiv.addEventListener('click', (e) => {
				const target = e.target as HTMLDivElement;
				target.classList.add(Status.off);
				this.pool[parseInt(target.id)].status = Status.available;
				this.pool[parseInt(target.id)].roll = 42;
				this.setAvailable();
				this.setTeamSize();
				this.renderAvailable();
				this.setNumberBtnList();
				this.savePool();
			});

			switch (player.status) {
				case Status.off:
					playerDiv.classList.remove(Status.off);
					break;
				default:
					playerDiv.classList.add(Status.off);
					break;
			}

			this.allElement.appendChild(playerDiv);
		});
	}


	private savePool(): void {
		sessionStorage.setItem(this.inSessionStoragePlayerPool, JSON.stringify(this.pool));
	}


	private setAvailable(): void {
		this.availablePool = this.pool.filter((player) => player.status !== Status.off);
	}


	private setNumberBtnList(): void {
		this.numberButtonsList.forEach((btn) => {
			btn.classList.remove('selected-number');
			btn.disabled = true;

			if (parseInt(btn.value) <= this.availablePool.length) {
				btn.disabled = false;
				if (parseInt(btn.value) === this.#teamSize) {
					btn.classList.add('selected-number');
				}
			}
		});
	}


	private setRoster() {
		this.blueLastRoster = [];
		this.redLastRoster = [];
		this.availablePool.forEach(({ status, idx }) => {
			switch (status) {
				case 'blue':
					this.blueLastRoster.push(idx);
					break;
				case 'red':
					this.redLastRoster.push(idx);
					break;
				default:
					break;
			}
		});
	}


	private setTeamSize() {
		this.#teamSize = this.availablePool.length > 8 ? 8 : this.availablePool.length;
		sessionStorage.setItem(this.inSessionStorageTeamSize, `${this.#teamSize}`);
	}


	private sortPool(): void {
		this.pool.sort((a, b) => a[this.#nameFormat].localeCompare(b[this.#nameFormat], this.language));
		this.pool.forEach((player, idx) => {
			player.idx = idx;
		});
		this.savePool();
	}

}