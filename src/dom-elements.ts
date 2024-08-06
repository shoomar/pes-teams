// meta
export const viewport = document.querySelector('meta[name=viewport]') as HTMLMetaElement;

// available
export const availablePlayersDiv = document.getElementById('available-players') as HTMLDivElement;

// team size
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
export const numberButtonList = document.getElementById('players-in-play-number')?.children as HTMLCollectionOf<HTMLButtonElement>;

// main
export const optBtn = document.getElementById('opt-btn') as HTMLButtonElement;
export const addBtn = document.getElementById('add-btn') as HTMLButtonElement;
export const starsDiv = document.getElementById('stars') as HTMLDivElement;
export const starBtn = document.getElementById('star-btn') as HTMLButtonElement;
export const splitBtn = document.getElementById('split-btn') as HTMLButtonElement;

// all
export const allContainerDiv = document.getElementById('all-container') as HTMLDivElement;
export const guestBtn = document.getElementById('guest-btn') as HTMLButtonElement;
export const allPlayersDiv = document.getElementById('all-players') as HTMLDivElement;
export const backAllPlyBtn = document.getElementById('back-all-btn') as HTMLButtonElement;

// guest
export const addGuestDiv = document.getElementById('add-guest') as HTMLDivElement;
export const addGuestForm = document.getElementById('add-guest-form') as HTMLFormElement;
export const guestNameInput = document.getElementById('guest-name') as HTMLInputElement;
export const backGuestBtn = document.getElementById('back-guest-btn') as HTMLButtonElement;

// options
export const optionsDiv = document.getElementById('options') as HTMLDivElement;
export const nameFormatInputs = document.getElementsByName('name-format') as NodeListOf<HTMLInputElement>;
export const midSessionCheckbox = document.getElementById('mid-session') as HTMLInputElement;
export const protectLosersCheckbox = document.getElementById('protect-losers') as HTMLInputElement;
export const minSelect = document.getElementById('min-select') as HTMLSelectElement;
export const minSelectOpt = minSelect.querySelectorAll('option');
export const maxSelect = document.getElementById('max-select') as HTMLSelectElement;
export const maxSelectOpt = maxSelect.querySelectorAll('option');
export const resetBtn = document.getElementById('reset-btn') as HTMLButtonElement;
export const backOptBtn = document.getElementById('back-opt-btn') as HTMLButtonElement;