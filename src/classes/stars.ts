export class Stars {

	private darkColour = 'black';
	private lightColour = '#fc0';

	private black: string;
	private half: string;
	private full: string;

	constructor(private parentElement: HTMLDivElement) {
		this.black = this.starCreator('black');
		this.half = this.starCreator('half');
		this.full = this.starCreator('full');
	}

	render(): void {
		for (let i = 0; i < 5; i++) {

			this.parentElement.innerHTML += this.black;
		}
	}

	private starCreator(colour: 'black' | 'half' | 'full') {
		const creator = (left: string, right: string) => {
			return `
				<svg width="2.1em" height="2em" viewBox="0 0 32 28" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M16 0L19.5922 10.3647H31.2169L21.8123 16.7705L25.4046 27.1353L16 20.7295L6.59544 27.1353L10.1877 16.7705L0.783095 10.3647H12.4078L16 0Z" fill="url(#paint0_linear)" />
					<defs>
						<linearGradient id="paint0_linear" x1="0" y1="0" x2="32" y2="0" gradientUnits="userSpaceOnUse">
							<stop stop-color="${left}" />
							<stop stop-color="${left}" />
							<stop offset="0.5" stop-color="${left}" />
							<stop offset="0.5" stop-color="${right}" />
							<stop offset="1" />
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