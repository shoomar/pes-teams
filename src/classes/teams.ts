import { NameFormat, Status } from '../types';
import { Player } from './index';


export class Teams {

	private inSessionStoragePlayerPool = 'playerPool';
	private inSessionStorageTeamSize = 'teamSize';
	private inSessionStorageMidSession = 'midSession';
	private inLocalStorageNameFormat = 'nameFormat';
	private inLocalStorageProtectLosers = 'protectLosers';

	#nameFormat: NameFormat;
	readonly pool: Player[] = [];
	availablePool: Player[];
	private blue: Player[];
	private red: Player[];
	private blueLastRoster: number[];
	private redLastRoster: number[];
	#teamSize: number;
	#midSession: boolean;
	#protectLosers: boolean;

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

		this.blue = [];
		this.red = [];
		this.blueLastRoster = [];
		this.redLastRoster = [];
	}


	add(newPlayer: ConstructorParameters<typeof Player>): void {
		const player = new Player(...newPlayer);
		player.status = Status.available;
		this.pool.push(player);
		this.sortPool();
		this.setAvailable();
		this.setTeamSize();
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
				player.roll(3);
			});
			toAdd.sort((a, b) => a.rollValue - b.rollValue);

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
					player.roll(3);
				}
				else if (player.status === Status.red || player.status === Status.blue) {
					player.roll(2);
				}
				else player.roll(1);
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
			console.log(this.availablePool);
			for (let i = 0; i < this.#teamSize; i++) {
				const player = this.availablePool[i];
				player.roll();
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
			// chek if teams are the same as before
			if (!this.checkRoster()) this.roll();
		}

		this.setRoster();
		this.midSession = false;
		this.savePool();
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
			blue.every((player) => this.blueLastRoster.includes(player))
			|| blue.every((player) => this.redLastRoster.includes(player))
			|| red.every((player) => this.blueLastRoster.includes(player))
			|| red.every((player) => this.redLastRoster.includes(player))
		) {
			return false;
		}
		return true;
	}


	savePool(): void {
		sessionStorage.setItem(this.inSessionStoragePlayerPool, JSON.stringify(this.pool));
	}


	setAvailable(): void {
		this.availablePool = this.pool.filter((player) => player.status !== Status.off);
	}


	private setRoster() {
		this.blueLastRoster = [];
		this.redLastRoster = [];
		this.availablePool.forEach(({ status, idx }) => {
			switch (status) {
				case Status.blue:
					this.blueLastRoster.push(idx);
					break;
				case Status.red:
					this.redLastRoster.push(idx);
					break;
				default:
					break;
			}
		});
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