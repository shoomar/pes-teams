export class Stars {

	private backgroundColor = '#333';
	private foregroundColor = '#ffb000';
	private inSessionStorage = 'stars';
	private lvls = [ 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5 ];

	private lastRoll = 0;
	private lvlvsForRoll: number[] = [];
	#min: number;
	#max: number;
	private selectedLvls: number[];

	constructor(
		private parentElement: HTMLDivElement
	) {
		const fromSession = sessionStorage.getItem(this.inSessionStorage);
		if (fromSession) {
			const minMaxArr = JSON.parse(fromSession) as number[];
			this.#min = minMaxArr[0];
			this.#max = minMaxArr[1];
		}
		else {
			this.#min = 1.5;
			this.#max = 5;
		}

		this.selectedLvls = this.lvls.slice(
			this.lvls.indexOf(this.#min),
			this.lvls.indexOf(this.#max) + 1
		);

		for (let i = 0; i < 5; i++) {
			this.parentElement.innerHTML += this.starCreator('empty', i);
		}
	}


	get max(): number {
		return this.#max;
	}

	set max(value: number) {
		if (value <= this.#min) {
			throw new Error('maximum must be at least 0.5 more than min');
		}
		this.#max = value;
		sessionStorage.setItem(this.inSessionStorage, `[${this.#min}, ${this.#max}]`);
		this.lvlvsForRoll = [];
		this.selectedLvls = this.lvls.slice(
			this.lvls.indexOf(this.#min),
			this.lvls.indexOf(this.#max) + 1
		);
	}


	get min(): number {
		return this.#min;
	}

	set min(value: number) {
		if (value >= this.#max) {
			throw new Error('minimum must be at least 0.5 less than max');
		}
		this.#min = value;
		sessionStorage.setItem(this.inSessionStorage, `[${this.#min}, ${this.#max}]`);
		this.lvlvsForRoll = [];
		this.selectedLvls = this.lvls.slice(
			this.lvls.indexOf(this.#min),
			this.lvls.indexOf(this.#max) + 1
		);
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
			content += this.starCreator('empty', i + whole + half);
		}

		this.parentElement.innerHTML = content;
	}


	roll(): void {
		if (!this.lvlvsForRoll.length) this.lvlvsForRoll = [ ...this.selectedLvls ];
		const idx = Math.floor(Math.random() * this.lvlvsForRoll.length);
		const rollValue = this.lvlvsForRoll.splice(idx, 1)[0];
		if (rollValue === this.lastRoll) {
			this.roll();
		}
		else {
			this.lastRoll = rollValue;
			this.render(rollValue);
		}
	}


	private starCreator(fill: 'empty' | 'half' | 'full', id = 0) {
		const creator = (leftHalfColor: string, rightHalfColor: string) => {
			return `
				<svg width="2.1em" height="2em" viewBox="0 0 32 30" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M16 0L19.5922 10.3647H31.2169L21.8123 16.7705L25.4046 27.1353L16 20.7295L6.59544 27.1353L10.1877 16.7705L0.783095 10.3647H12.4078L16 0Z" fill="url(#solids${id})" />
					<defs>
						<linearGradient id="solids${id}" x1="0%" y1="0%" x2="100%" y2="0%">
							<stop offset="0%" stop-color="${leftHalfColor}" />
							<stop offset="50%" stop-color="${leftHalfColor}" />
							<stop offset="50%" stop-color="${rightHalfColor}" />
							<stop offset="100%" stop-color="${rightHalfColor}" />
						</linearGradient>
					</defs>
				</svg>
			`;
		};

		switch (fill) {
			case 'empty':
				return creator(this.backgroundColor, this.backgroundColor );
			case 'half':
				return creator(this.foregroundColor, this.backgroundColor );
			case 'full':
				return creator(this.foregroundColor, this.foregroundColor );
		}
	}
}