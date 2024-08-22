import { NameFormat, Status, storageNames } from '../types';
import { Player } from './index';


export class Teams {

	private inSessionStoragePlayerPool = storageNames.session.playerPool;
	private inSessionStorageTeamSize  = storageNames.session.teamSize;
	private inSessionStorageMidSession  = storageNames.session.midSession;
	private inSessionStorageBluePreviousRoster  = storageNames.session.bluePrev;
	private inSessionStorageRedPreviousRoster  = storageNames.session.redPrev;
	private inLocalStorageNameFormat  = storageNames.local.nameFormat;
	private inLocalStorageProtectLosers  = storageNames.local.protectLosers;

	#nameFormat                : NameFormat;
	readonly pool              : Player[] = [];
	availablePool              : Player[];
	private blue               : number[] = [];
	private red                : number[] = [];
	private bluePreviousRoster : number[];
	private redPreviousRoster  : number[];
	#teamSize                  : number;
	#midSession                : boolean;
	#protectLosers             : boolean;

	constructor(
		private playerList: ConstructorParameters<typeof Player>[],
		private language: string
	) {
		const fromStorageNameFormat = localStorage.getItem(this.inLocalStorageNameFormat);
		if (fromStorageNameFormat) {
			this.#nameFormat = fromStorageNameFormat as NameFormat;
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
			});
			this.pool.sort((a, b) => a[this.#nameFormat].localeCompare(b[this.#nameFormat], this.language));
			this.pool.forEach((player, idx) => {
				player.idx = idx;
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

		const fromStorageProtectLosers = localStorage.getItem(this.inLocalStorageProtectLosers);
		if (fromStorageProtectLosers) {
			this.#protectLosers = JSON.parse(fromStorageProtectLosers) as boolean;
		}
		else this.#protectLosers = true;

		const fromSessionPrevBlue = sessionStorage.getItem(this.inSessionStorageBluePreviousRoster);
		if (fromSessionPrevBlue) {
			this.bluePreviousRoster = JSON.parse(fromSessionPrevBlue) as number[];
		}
		else this.bluePreviousRoster = [];
		const fromSessionPrevRed = sessionStorage.getItem(this.inSessionStorageRedPreviousRoster);
		if (fromSessionPrevRed) {
			this.redPreviousRoster = JSON.parse(fromSessionPrevRed) as number[];
		}
		else this.redPreviousRoster = [];

		for (const { status, idx } of this.availablePool) {
			switch (status) {
				case Status.blue:
					this.blue.push(idx);
					break;
				case Status.red:
					this.red.push(idx);
					break;
				default:
					break;
			}
		}
	}


	get nameFormat(): NameFormat {
		return this.#nameFormat;
	}

	set nameFormat(format: NameFormat) {
		this.#nameFormat = format;
		this.sortPool();
		this.setAvailable();
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
	}


	get protectLosers(): boolean {
		return this.#protectLosers;
	}

	set protectLosers(checked: HTMLInputElement['checked']) {
		if (checked) {
			this.#protectLosers = true;
		}
		else {
			this.#protectLosers = false;
		}
		localStorage.setItem(this.inLocalStorageProtectLosers, JSON.stringify(this.#protectLosers));
	}

	get teamSize(): number {
		return this.#teamSize;
	}

	set teamSize(x: number) {
		if (x > 8 || x < 3) {
			throw new Error('team size must be between 3 and 8');
		}
		this.#teamSize = x;
		sessionStorage.setItem(this.inSessionStorageTeamSize, `${this.#teamSize}`);
	}


	add(newPlayer: ConstructorParameters<typeof Player>): void {
		const player = new Player(...newPlayer);
		player.status = Status.available;
		this.pool.push(player);
		this.sortPool();
		this.setAvailable();
		this.setTeamSize();
	}


	private checkRoster(): boolean {
		const blue: number[] = [];
		const red: number[] = [];
		this.availablePool.forEach(({ status, idx }) => {
			switch (status) {
				case Status.blue:
					blue.push(idx);
					break;
				case Status.red:
					red.push(idx);
					break;
				default:
					break;
			}
		});
		if (
			blue.every((idx) => this.bluePreviousRoster.includes(idx))
			|| blue.every((idx) => this.redPreviousRoster.includes(idx))
			|| red.every((idx) => this.bluePreviousRoster.includes(idx))
			|| red.every((idx) => this.redPreviousRoster.includes(idx))
		) {
			return false;
		}
		return true;
	}


	roll(): void {
		if (this.availablePool.length < 3) return;

		if (this.blue.length && this.red.length) {
			this.bluePreviousRoster = [];
			this.redPreviousRoster = [];
			for (const e of this.blue) {
				this.bluePreviousRoster.push(e);
			}
			for (const e of this.red) {
				this.redPreviousRoster.push(e);
			}
		}
		sessionStorage.setItem(this.inSessionStorageBluePreviousRoster, JSON.stringify(this.bluePreviousRoster));
		sessionStorage.setItem(this.inSessionStorageRedPreviousRoster, JSON.stringify(this.redPreviousRoster));

		if (this.#midSession) {
			if (
				this.bluePreviousRoster.length + this.redPreviousRoster.length >= this.#teamSize
			) return;

			const toAdd = this.availablePool.filter(
				(p) => p.status === Status.available || p.status === Status.defeated
			);
			if (toAdd.length === 0) {
				this.midSession = false;
				this.roll();
			}

			toAdd.forEach((player) => {
				player.rollValue = Math.random() + 3;
			});
			toAdd.sort((a, b) => a.rollValue - b.rollValue);

			while (
				this.bluePreviousRoster.length + this.redPreviousRoster.length < this.#teamSize &&
				toAdd.length > 0
			) {
				const newPlayer = toAdd.shift() as Player;
				if (this.redPreviousRoster.length < this.bluePreviousRoster.length) {
					newPlayer.status = Status.red;
					this.redPreviousRoster.push(newPlayer.idx);
				}
				else if (this.redPreviousRoster.length > this.bluePreviousRoster.length) {
					newPlayer.status = Status.blue;
					this.bluePreviousRoster.push(newPlayer.idx);
				}
				else {
					const choice = [ Status.blue, Status.red ][Math.round(Math.random())];
					newPlayer.status = choice;
					if (choice === Status.blue) {
						this.bluePreviousRoster.push(newPlayer.idx);
					}
					else {
						this.redPreviousRoster.push(newPlayer.idx);
					}
				}
			}
		}
		else {
			this.availablePool.forEach((player) => {
				if (player.status === Status.defeated) {
					player.rollValue = Math.random() + 3;
				}
				else if (player.status === Status.red || player.status === Status.blue) {
					player.rollValue = Math.random() + 2;
				}
				else player.rollValue = Math.random() + 1;
			});
			if (this.#protectLosers) {
				this.availablePool.sort((a, b) => {
					if (a.status === Status.defeated && b.status === Status.defeated && a.bonus !== b.bonus) {
						return b.bonus - a.bonus;
					}
					else return a.rollValue - b.rollValue;
				});
			}
			else {
				this.availablePool.sort((a, b) => a.rollValue - b.rollValue);
			}
			for (let i = 0; i < this.#teamSize; i++) {
				const player = this.availablePool[i];
				player.rollValue = Math.random();
			}
			this.availablePool.sort((a, b) => a.rollValue - b.rollValue);

			this.availablePool.forEach((player, idx) => {
				if (idx < Math.ceil(this.#teamSize / 2)) {
					player.status = Status.blue;
				}
				else if (idx < this.#teamSize) {
					player.status = Status.red;
				}
				else {
					player.status = Status.available;
					player.bonus++;
				}
			});

			if (this.#teamSize > 3) { // inf loop if 3
				while (!this.checkRoster()) {
					for (let i = 0; i < this.#teamSize; i++) {
						const player = this.availablePool[i];
						player.rollValue = Math.random();
					}
					this.availablePool.sort((a, b) => a.rollValue - b.rollValue);
					this.availablePool.forEach((player, idx) => {
						if (idx < Math.ceil(this.#teamSize / 2)) {
							player.status = Status.blue;
						}
						else if (idx < this.#teamSize) {
							player.status = Status.red;
						}
					});
				}
			}
		}

		this.blue = [];
		this.red = [];
		this.availablePool.forEach(({ status, idx }) => {
			switch (status) {
				case Status.blue:
					this.blue.push(idx);
					break;
				case Status.red:
					this.red.push(idx);
					break;
				default:
					break;
			}
		});

		this.midSession = false;
		this.savePool();
	}


	savePool(): void {
		sessionStorage.setItem(this.inSessionStoragePlayerPool, JSON.stringify(this.pool));
	}


	setAvailable(): void {
		this.availablePool = this.pool.filter((player) => player.status !== Status.off);
	}


	setTeamSize() {
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