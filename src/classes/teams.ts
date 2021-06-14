import { NameFormat, Status } from '../types';
import { Player } from './player';


export class Teams {

	private inSessionStoragePlayerPool = 'playerPool';
	private inSessionStorageTeamSize = 'teamSize';
	private inLocalStorageNameFormat = 'nameFormat';

	#nameFormat: NameFormat;
	private pool: Player[] = [];
	private availablePool: Player[];

	#teamSize: number;

	constructor(
		private playerList: ConstructorParameters<typeof Player>[],
		private language: string,
		private availablesElement: HTMLDivElement,
		private numberButtonsList: NodeListOf<HTMLButtonElement>,
		private allElement: HTMLDivElement
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
		this.renderPlayers();
		this.renderAvailable();
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

	private positionInTeamCssClass(idx: number) {
		const endOfBlueIdx = Math.ceil(this.#teamSize / 2) - 1;
		if (idx === 0 || idx === endOfBlueIdx + 1) {
			return 'first';
		}
		else if (idx === endOfBlueIdx || idx === this.#teamSize - 1) {
			return 'last';
		}
		else return 'middle';
	}

	roll(): void {
		if (this.availablePool.length < 3) return;
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

	private renderAvailable(): void {
		while (this.availablesElement.lastChild) {
			this.availablesElement.lastChild.remove();
		}

		this.availablePool.sort((a, b) => a.roll - b.roll);

		this.availablePool.forEach((player, idx) => {
			const availableDiv = document.createElement('div');

			availableDiv.id = player.idx.toString();
			availableDiv.classList.add('player');
			availableDiv.classList.add('available');
			availableDiv.innerText = player[this.#nameFormat];

			switch (player.status) {
				case Status.blue:
					availableDiv.classList.add(Status.blue);
					availableDiv.classList.add(this.positionInTeamCssClass(idx));
					break;
				case Status.red:
					availableDiv.classList.add(Status.red);
					availableDiv.classList.add(this.positionInTeamCssClass(idx));
					break;
				case Status.defeated:
					availableDiv.classList.add(Status.defeated);
					availableDiv.classList.add(this.positionInTeamCssClass(idx));
					break;
				default:
					break;
			}

			availableDiv.addEventListener('click', (e) => {
				const target = e.target as HTMLDivElement;
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
			});

			availableDiv.addEventListener('dblclick', (e) => {
				const target = e.target as HTMLDivElement;
				const player = this.pool[parseInt(target.id)];
				player.status = Status.off;
				player.roll = Infinity;
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
			});


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
				this.pool[parseInt(target.id)].roll = Infinity;
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