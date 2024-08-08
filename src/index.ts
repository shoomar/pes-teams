import './styles/index.scss';
import { Stars, Render } from './classes';
import { locale, playerList } from './customizable';
import {  starsDiv, viewport } from './dom-elements';

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
const stars = new Stars(starsDiv);

new Render(playerList, locale, stars);