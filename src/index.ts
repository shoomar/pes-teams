import './styles/index.scss';
import { Teams, Stars, Render } from './classes';
import { locale, pesCrew } from './customizable';
import {  allPlayersDiv, availablePlayersDiv,  midSessionCheckbox,  numberButtonList, starsDiv, viewport } from './dom-elements';

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
	pesCrew, locale, availablePlayersDiv, numberButtonList, allPlayersDiv, midSessionCheckbox
);

const stars = new Stars(starsDiv);

new Render(teams, stars);