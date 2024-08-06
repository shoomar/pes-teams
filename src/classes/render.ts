import { Teams, Stars } from './index';
import * as dom from '../dom-elements';
import { NameFormat } from '../types';

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
}