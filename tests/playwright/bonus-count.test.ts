
import { test, expect } from '@playwright/test';
import { Player } from '../../src/classes';
import { Status } from '../../src/types';


test('bonus-count', async ({ page }) => {
	test.slow();
	await page.goto('http://127.0.0.1:3000/');

	const pl = await page.evaluate(() => {
		const p = window.localStorage.getItem('protectLosers');
		if (p !== null) {
			return p;
		}
		else return 'true';
	});
	expect(JSON.parse(pl)).toBeTruthy();

	const participants = [
		'Aca Todorović',
		'Bojan Zlatković',
		'Branko Tošković',
		'Dejan Ćurković',
		'Filip Sabo Batanč',
		'Igor Savin',
		'Luka Erdeljanovic',
		'Marko Stamenković',
		'Nikola Vrhovac',
		'Predrag Novaković',
		'Vladimir Atlagić'
	];

	await page.getByRole('button', { name: 'Add', exact: true }).click();
	for (const name of participants) {
		await page.getByText(name).click();
	}
	await page.getByRole('button', { name: 'Back' }).click();

	const teamSize = await page.evaluate(() => {
		const p = window.sessionStorage.getItem('teamSize');
		if (p) {
			return JSON.parse(p) as number;
		}
		else throw new Error('no teamSize in storage.');
	});

	let playerPool = await page.evaluate(() => {
		const p = window.sessionStorage.getItem('playerPool');
		if (p) {
			return JSON.parse(p) as Player[];
		}
		else throw new Error('no playerPool in storage.');
	});

	let bonusCount = 0;
	let playerCount = 0;
	for (const player of playerPool) {
		if (player.status === Status.available) playerCount++;
		if (player.bonus > 0) {
			bonusCount += player.bonus;
		}
	}
	expect(bonusCount).toEqual(0);
	expect(playerCount).toEqual(participants.length);

	// control number of cycles (more than 100 will fail prob)
	const numOfRols = 8;
	const rollCount = numOfRols * participants.length;
	for (let i = 0; i < rollCount; i++) {
		await page.getByText('SPLIT').click();
		if (Math.random() < 0.5) {
			await page.locator('.blue.first').click();
		}
		else {
			await page.locator('.red.last').click();
		}
	}

	playerPool = await page.evaluate(() => {
		const p = window.sessionStorage.getItem('playerPool');
		if (p) {
			return JSON.parse(p) as Player[];
		}
		else throw new Error('no playerPool in storage.');
	});

	bonusCount = 0;
	const distribution = [];
	for (const player of playerPool) {
		if (player.bonus > 0) {
			bonusCount += player.bonus;
			distribution.push({
				name  : player.fullName,
				bonus : player.bonus
			});
		}
	}
	expect(bonusCount).toEqual(rollCount * (participants.length - teamSize));

	const diffs = [];
	for (const e of distribution) {
		diffs.push(e.bonus - numOfRols * (participants.length - teamSize));
	}
	const min = Math.min(...diffs);
	const max = Math.max(...diffs);
	console.log(distribution, diffs, min, max);
	expect(min).toBeGreaterThan(-3);
	expect(max).toBeLessThan(3);
});