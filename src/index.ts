import './styles/index.scss';
import { Teams, Stars } from './classes';
import { locale, pesCrew } from './customizable';
import { addBtn, addGuestDiv, addGuestForm, allContainerDiv, allPlayersDiv, availablePlayersDiv, backAllPlyBtn, backGuestBtn, backOptBtn, guestBtn, guestNameInput, maxSelect, maxSelectOpt, midSessionCheckbox, minSelect, minSelectOpt, nameFormatInputs, numberButtonList, optBtn, optionsDiv, resetBtn, splitBtn, starBtn, starsDiv, viewport } from './dom-elements';
import { NameFormat } from './types';

// prevent soft keyboard from making problems with screen height
if (
	!(
		[
			'iPad Simulator',
			'iPhone Simulator',
			'iPod Simulator',
			'iPad',
			'iPhone',
			'iPod'
		].includes(navigator.platform)
	// iPad on iOS 13 detection
	|| (navigator.userAgent.includes('Mac') && 'ontouchend' in document)
	)
) {
	viewport.setAttribute('content', `${viewport.content}, height=${window.innerHeight}`);
}

// init
const teams = new Teams(
	pesCrew, locale, availablePlayersDiv, numberButtonList, allPlayersDiv
);

const stars = new Stars(starsDiv);

// main
numberButtonList.forEach((btn) => {
	btn.addEventListener('click', (e) => {
		const target = e.target as HTMLButtonElement;
		teams.teamSize = parseInt(target.value);
	});
});

starBtn.addEventListener('click', () => {
	stars.roll();
});

optBtn.addEventListener('click', () => {
	optionsDiv.classList.add('open');
});

addBtn.addEventListener('click', () => {
	allContainerDiv.classList.add('open');
});

splitBtn.addEventListener('click', () => teams.roll());

// all players
addGuestDiv.addEventListener('transitionend', () => {
	guestNameInput.focus();
});

guestBtn.addEventListener('click', () => {
	addGuestDiv.classList.add('open');
});

backAllPlyBtn.addEventListener('click', () => {
	allContainerDiv.classList.remove('open');
});

// guest
backGuestBtn.addEventListener('click', () => {
	addGuestDiv.classList.remove('open');
});

addGuestForm.onsubmit = () => {
	const formData = new FormData(addGuestForm);
	const name = formData.get('name') as string;
	const surname = formData.get('surname') as string;
	const nickname = formData.get('nickname') as string;
	teams.add([ name, surname, nickname ]);
	addGuestForm.reset();
	addGuestDiv.classList.remove('open');
	return false;
};

// options
nameFormatInputs.forEach((input) => {
	if (input.value === teams.nameFormat) {
		input.checked = true;
	}
	input.addEventListener('change', () => teams.nameFormat =  input.value as NameFormat);
});

midSessionCheckbox.checked = teams.midSession;

midSessionCheckbox.addEventListener('change', (e) => {
	const check = e.target as HTMLInputElement;
	teams.midSession = check.checked;
});

minSelect.addEventListener('change', (e) => {
	const opt = e.target as HTMLOptionElement;
	stars.min = parseFloat(opt.value);
	maxSelectOpt.forEach((opt) => {
		if (parseFloat(opt.value) <= stars.min) {
			opt.disabled = true;
		}
		else opt.disabled = false;
	});
});

minSelectOpt.forEach((opt) => {
	if (parseFloat(opt.value) === stars.min) opt.selected = true;
});

maxSelect.addEventListener('change', (e) => {
	const opt = e.target as HTMLOptionElement;
	stars.max = parseFloat(opt.value);
	minSelectOpt.forEach((opt) => {
		if (parseFloat(opt.value) >= stars.max) {
			opt.disabled = true;
		}
		else opt.disabled = false;
	});
});

maxSelectOpt.forEach((opt) => {
	if (parseFloat(opt.value) === stars.max) opt.selected = true;
});

resetBtn.addEventListener('click', () => {
	localStorage.clear();
	sessionStorage.clear();
	window.location.reload();
});

backOptBtn.addEventListener('click', () => {
	optionsDiv.classList.remove('open');
});