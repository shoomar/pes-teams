
import { test, expect } from '@playwright/test';


test('mid-session', async ({ page }) => {
	await page.goto('http://127.0.0.1:3000/');
	await page.getByRole('button', { name: 'Add', exact: true }).click();
	await page.getByText('Aca Todorović').click();
	await page.getByText('Bojan Zlatković').click();

	await expect(page.locator('#mid-session')).toBeDisabled();

	await page.getByText('Dejan Ćurković').click();

	await expect(page.locator('#mid-session')).toBeEnabled();

	await page.getByRole('button', { name: 'Back' }).click();

	await page.getByRole('button', { name: 'Opt' }).click();
	await page.getByLabel('mid-session').click();
	await page.getByRole('button', { name: 'Back' }).click();

	let midSession = await page.evaluate(() => {
		const p = window.sessionStorage.getItem('midSession');
		if (p) {
			return JSON.parse(p) as boolean;
		}
	});
	expect(midSession).toBe(true);

	await page.locator('#available-players').getByText('Aca Todorović').click({ clickCount: 2 });
	await page.locator('#available-players').getByText('Aca Todorović').isVisible();

	midSession = await page.evaluate(() => {
		const p = window.sessionStorage.getItem('midSession');
		if (p) {
			return JSON.parse(p) as boolean;
		}
	});
	expect(midSession).toBe(true);

	await page.getByRole('button', { name: 'Opt' }).click();
	await page.getByLabel('mid-session').click();

	midSession = await page.evaluate(() => {
		const p = window.sessionStorage.getItem('midSession');
		if (p) {
			return JSON.parse(p) as boolean;
		}
	});
	expect(midSession).toBe(false);

	await page.getByRole('button', { name: 'Back' }).click();
	await page.locator('#available-players').getByText('Aca Todorović').click({ clickCount: 2 });
	await expect(page.locator('#mid-session')).toBeDisabled();
});