import localForage from 'localforage';
import { ResultOffset, RollType, StarLevels, StarMaximum, StarMinimum, StarSettings } from '../types';

export class Stars {

	private inSessionStorage = 'stars';
	private darkColour = '#333';
	private lightColour = '#ffb000';
	private lvls: Readonly<StarLevels> = [ 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5 ];

	#min: StarMinimum;
	#max: StarMaximum;
	#rollType: RollType;
	#resultOffset: ResultOffset;
	private selectedLvls: number[];
	private lvlvsForRoll: number[] = [];
	private lastRoll = 0;

	constructor(
		private parentElement: HTMLDivElement
	) {
		const fromSession = sessionStorage.getItem(this.inSessionStorage);
		if (fromSession) {
			const settingsArr = JSON.parse(fromSession) as StarSettings;
			this.#min = settingsArr[0];
			this.#max = settingsArr[1];
			this.#rollType = settingsArr[2];
			this.#resultOffset = settingsArr[3];
		}
		else {
			this.#min = 1.5;
			this.#max = 5;
			this.#rollType = RollType.every;
			this.#resultOffset = ResultOffset.none;
		}

		this.selectedLvls = this.lvls.slice(
			this.lvls.indexOf(this.#min),
			this.lvls.indexOf(this.#max) + 1
		);

		for (let i = 0; i < 5; i++) {
			this.parentElement.innerHTML += this.starCreator('black', i);
		}
	}


	get max(): StarMaximum {
		return this.#max;
	}


	set max(value: StarSettings[1]) {
		if (value <= this.#min) {
			throw new Error('maximum must be at least 0.5 more than min');
		}
		this.#max = value;
		this.saveSettings();
		this.lvlvsForRoll = [];
		this.selectedLvls = this.lvls.slice(
			this.lvls.indexOf(this.#min),
			this.lvls.indexOf(this.#max) + 1
		);
	}


	get min(): StarMinimum {
		return this.#min;
	}


	set min(value: StarMinimum) {
		if (value >= this.#max) {
			throw new Error('minimum must be at least 0.5 less than max');
		}
		this.#min = value;
		this.saveSettings();
		this.lvlvsForRoll = [];
		this.selectedLvls = this.lvls.slice(
			this.lvls.indexOf(this.#min),
			this.lvls.indexOf(this.#max) + 1
		);
	}


	get resultOffset() {
		return this.#resultOffset;
	}


	set resultOffset(value: ResultOffset) {
		if (!Object.values(ResultOffset).includes(value)) {
			throw new Error('result offset value must be 0,1,2 or 3');
		}

		this.#resultOffset = value;

		const diff = this.#max - this.#min;
		if (diff < this.#resultOffset + 0.5) {
			this.max = 5;
			this.min = 1.5;
		}

		this.lvlvsForRoll = [];
		this.saveSettings();
	}


	get rollType() {
		return this.#rollType;
	}


	set rollType(value: RollType) {
		if (!Object.values(RollType).includes(value)) {
			throw new Error('role type value must be 0 or 1');
		}
		this.#rollType = value;
		this.lvlvsForRoll = [];
		this.saveSettings();
	}


	permuteAndFilter() {
		function permute(arr: number[], perms: number[][] = [], len = arr.length) {
			if (len === 1) perms.push(arr.slice(0));

			for (let i = 0; i < len; i++) {
				permute(arr, perms, len - 1);

				len % 2
					? [ arr[0], arr[len - 1] ] = [ arr[len - 1], arr[0] ]
					: [ arr[i], arr[len - 1] ] = [ arr[len - 1], arr[i] ];
			}

			return perms;
		}
		const filterFrom = permute(this.selectedLvls);
		console.log(filterFrom);
		return filterFrom.filter((e) => {
			for (let i = 0; i < e.length - 1; i++) {
				if (Math.abs(e[i + 1] - e[i]) <= this.#resultOffset * 0.5) return false;
			}
			return true;
		});
	}


	async roll(): Promise<void> {
		let rollValue: number;
		let lrIdx: number;
		let minIdx: number;
		let maxIdx: number;

		if (this.#resultOffset && this.lastRoll) {
			lrIdx = this.selectedLvls.indexOf(this.lastRoll);
			minIdx = lrIdx - this.#resultOffset < 0 ? 0 : lrIdx - this.#resultOffset ;
			maxIdx = lrIdx + this.#resultOffset > this.selectedLvls.length - 1 ? this.selectedLvls.length - 1 : lrIdx + this.#resultOffset;
		}

		switch (this.#rollType) {
			case RollType.every: {
				if (this.#resultOffset) {
					const storageName = `${this.#min}_${this.#max}_${this.#resultOffset}`;
					let toRollFrom;
					try {
						toRollFrom = await localForage.getItem(storageName) as number[][];
						if (!toRollFrom) {
							toRollFrom = this.permuteAndFilter();
							await localForage.setItem(storageName, toRollFrom);
						}
					}
					catch (err) {
						let msg;
						if (err instanceof Error) msg = err.message;
						else msg = String(err);
						throw new Error(msg);
					}
					if (!this.lvlvsForRoll.length) {
						this.lvlvsForRoll = toRollFrom[Math.floor(Math.random() * toRollFrom.length)];
						if (
							this.lvlvsForRoll[this.lvlvsForRoll.length - 1] === this.lastRoll
							|| this.lastRoll - this.lvlvsForRoll[this.lvlvsForRoll.length - 1] <= this.#resultOffset * 0.5
						) this.lvlvsForRoll.pop();
					}
					rollValue = this.lvlvsForRoll.pop() as number;
				}
				else {
					if (!this.lvlvsForRoll.length) this.lvlvsForRoll = [ ...this.selectedLvls ];
					const idx = Math.floor(Math.random() * this.lvlvsForRoll.length);
					rollValue = this.lvlvsForRoll.splice(idx, 1)[0];
				}
				break;
			}
			case RollType.random:{
				if (this.#resultOffset && this.lastRoll) {
					this.lvlvsForRoll = this.selectedLvls.filter((_, i) => {
						if (i < minIdx || i > maxIdx) return true;
					});
					const idx = Math.floor(Math.random() * this.lvlvsForRoll.length);
					rollValue = this.lvlvsForRoll[idx];
				}
				else {
					const idx = Math.floor(Math.random() * this.selectedLvls.length);
					rollValue = this.selectedLvls[idx];
				}
				break;
			}
			default:
				throw new Error('role type value must be 0 or 1');
		}

		if (rollValue === this.lastRoll) {
			await this.roll();
		}
		else {
			this.lastRoll = rollValue;
			this.render(rollValue);
		}
	}


	private render(numOfStars: number) {
		while (this.parentElement.lastChild) {
			this.parentElement.lastChild.remove();
		}

		let whole = 0;
		let half = 0;
		if (Number.isInteger(numOfStars)) {
			whole = numOfStars;
		}
		else {
			whole = numOfStars - 0.5;
			half = 1;
		}

		let content = '';
		for (let i = 0; i < whole; i++) {
			content += this.starCreator('full', i);
		}
		for (let i = 0; i < half; i++) {
			content += this.starCreator('half', i + whole);
		}
		for (let i = 0; i < 5 - whole - half; i++) {
			content += this.starCreator('black', i + whole + half);
		}

		this.parentElement.innerHTML = content;
	}


	private saveSettings() {
		sessionStorage.setItem(this.inSessionStorage, `[${this.#min}, ${this.#max}, ${this.#rollType}, ${this.#resultOffset}]`);
	}


	private starCreator(colour: 'black' | 'half' | 'full', id = 0) {
		const creator = (left: string, right: string) => {
			return `
				<svg width="2.1em" height="2em" viewBox="0 0 32 30" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M16 0L19.5922 10.3647H31.2169L21.8123 16.7705L25.4046 27.1353L16 20.7295L6.59544 27.1353L10.1877 16.7705L0.783095 10.3647H12.4078L16 0Z" fill="url(#solids${id})" />
					<defs>
						<linearGradient id="solids${id}" x1="0%" y1="0%" x2="100%" y2="0%">
							<stop offset="0%" stop-color="${left}" />
							<stop offset="50%" stop-color="${left}" />
							<stop offset="50%" stop-color="${right}" />
							<stop offset="100%" stop-color="${right}" />
						</linearGradient>
					</defs>
				</svg>
			`;
		};

		switch (colour) {
			case 'black':
				return creator(this.darkColour, this.darkColour );
			case 'half':
				return creator(this.lightColour, this.darkColour );
			case 'full':
				return creator(this.lightColour, this.lightColour );
		}
	}

}