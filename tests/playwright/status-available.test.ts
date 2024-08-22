import { test, expect } from '@playwright/test';
import { Player } from '../../src/classes';
import { playerList } from '../../src/customizable';
import { Status } from '../../src/types';

test('status available', async ({ page }) => {
	await page.goto('http://127.0.0.1:3000/');
	await page.getByRole('button', { name: 'Add', exact: true }).click();
	await page.getByText('Aca Todorović').click();
	await page.getByText('Bojan Zlatković').click();
	await page.getByText('Dejan Ćurković').click();
	await page.getByText('Filip Sabo Batanč').click();
	await page.getByText('Igor Savin').click();
	await page.getByText('Luka Erdeljanovic').click();
	await page.getByText('Nikola Vrhovac').click();
	await page.getByText('Predrag Novaković').click();
	await page.getByText('Vladimir Atlagić').click();
	await page.getByRole('button', { name: 'Back' }).click();
	await page.getByRole('button', { name: '6' }).click();
	let playerPool = await page.evaluate(() => {
		const p = window.sessionStorage.getItem('playerPool');
		if (p) {
			return JSON.parse(p);
		}
	}) as Player[];
	expect(playerPool).toHaveLength(playerList.length);
	expect(
		playerPool.filter((p) => p.status === Status.available)
	).toHaveLength(9);

	await page.locator('#available-players').getByText('Aca Todorović').click({ clickCount: 2 });
	await page.locator('#available-players').getByText('Bojan Zlatković').click({ clickCount: 2 });
	await page.locator('#available-players').getByText('Dejan Ćurković').click({ clickCount: 2 });
	await page.locator('#available-players').getByText('Filip Sabo Batanč').click({ clickCount: 2 });
	await page.locator('#available-players').getByText('Igor Savin').click({ clickCount: 2 });
	await page.locator('#available-players').getByText('Luka Erdeljanovic').click({ clickCount: 2 });
	await page.locator('#available-players').getByText('Nikola Vrhovac').click({ clickCount: 2 });
	await page.locator('#available-players').getByText('Predrag Novaković').click({ clickCount: 2 });
	await page.locator('#available-players').getByText('Vladimir Atlagić').click({ clickCount: 2 });

	playerPool = await page.evaluate(() => {
		const p = window.sessionStorage.getItem('playerPool');
		if (p) {
			return JSON.parse(p);
		}
	}) as Player[];
	expect(
		playerPool.filter((p) => p.status === Status.available)
	).toHaveLength(0);
});