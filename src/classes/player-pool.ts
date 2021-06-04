import { NameFormat, Status } from '../types';
import { Player } from './player';


export class PlayerPool {

	private inSessionStoragePlayerPool = 'playerPool';
	private inLocalStorageNameFormat = 'nameFormat';

	private namingConvention: NameFormat;
	private pool: Player[] = [];
	private availablePool: Player[];

	constructor(
		private playerList: ConstructorParameters<typeof Player>[],
		private language: string,
		private availablesElement: HTMLDivElement,
		private parentElement: HTMLDivElement
	) {
		const fromStorage = localStorage.getItem(this.inLocalStorageNameFormat);
		if (fromStorage) {
			this.namingConvention = fromStorage as NameFormat;
		}
		else {
			localStorage.setItem(this.inLocalStorageNameFormat, NameFormat.fullName);
			this.namingConvention = NameFormat.fullName;
		}

		const fromSession = sessionStorage.getItem(this.inSessionStoragePlayerPool);
		if (fromSession) {
			this.pool = JSON.parse(fromSession) as Player[];
		}
		else {
			this.playerList.forEach((member) => {
				const player = new Player(...member);
				this.pool.push(player);
				this.sort();
			});
		}

		this.availablePool = this.pool.filter((player) => player.status !== Status.off);
	}

	get nameFormat(): NameFormat {
		return this.namingConvention;
	}

	set nameFormat(format: NameFormat) {
		this.namingConvention = format;
		this.sort();
		this.setAvailable();
		this.render();
		localStorage.setItem(this.inLocalStorageNameFormat, this.namingConvention);
	}

	render(): void {
		this.renderPlayers();
		this.renderAvailable();
	}

	roll(): void {
		this.availablePool.forEach((player) => {
			player.roll = Math.random();
		});
		this.renderAvailable();
		this.save();
	}

	private renderAvailable(): void {
		while (this.availablesElement.lastChild) {
			this.availablesElement.lastChild.remove();
		}

		this.availablePool.sort((a, b) => b.roll - a.roll);

		this.availablePool.forEach((player) => {
			const availableDiv = document.createElement('div');

			availableDiv.id = player.idx.toString();
			availableDiv.classList.add('player');
			availableDiv.classList.add('available');
			availableDiv.innerText = player[this.namingConvention];

			availableDiv.addEventListener('dblclick', (e) => {
				const target = e.target as HTMLDivElement;
				this.pool[parseInt(target.id)].status = Status.off;
				this.pool[parseInt(target.id)].roll = -1;
				this.setAvailable();
				this.renderAvailable();
				this.parentElement.childNodes.forEach((node) => {
					const nodeElement = node as HTMLDivElement;
					if (nodeElement.id === target.id) {
						nodeElement.classList.remove(Status.off);
					}
				});
				this.save();
			});

			switch (player.status) {
				case Status.blue:
					availableDiv.classList.add(Status.blue);
					break;
				case Status.red:
					availableDiv.classList.add(Status.red);
					break;
				case Status.defeated:
					availableDiv.classList.add(Status.defeated);
					break;
				default:
					break;
			}

			this.availablesElement.appendChild(availableDiv);
		});
	}

	private renderPlayers(): void {
		while (this.parentElement.lastChild) {
			this.parentElement.lastChild.remove();
		}

		this.pool.forEach((player) => {
			const playerDiv = document.createElement('div');

			playerDiv.id = player.idx.toString();
			playerDiv.classList.add('player');
			playerDiv.innerText = player[this.namingConvention];

			playerDiv.addEventListener('click', (e) => {
				const target = e.target as HTMLDivElement;
				target.classList.add(Status.off);
				this.pool[parseInt(target.id)].status = Status.available;
				this.pool[parseInt(target.id)].roll = -1;
				this.setAvailable();
				this.renderAvailable();
				this.save();
			});

			switch (player.status) {
				case Status.off:
					playerDiv.classList.remove(Status.off);
					break;
				default:
					playerDiv.classList.add(Status.off);
					break;
			}

			this.parentElement.appendChild(playerDiv);
		});
	}

	private save(): void {
		sessionStorage.setItem(this.inSessionStoragePlayerPool, JSON.stringify(this.pool));
	}

	private setAvailable(): void {
		this.availablePool = this.pool.filter((player) => player.status !== Status.off);
	}

	private sort(): void {
		this.pool.sort((a, b) => a[this.namingConvention].localeCompare(b[this.namingConvention], this.language));
		this.pool.forEach((player, idx) => {
			player.idx = idx;
		});
		this.save();
	}

}