import puppeteer from 'puppeteer';
import type { LocalStorage } from '$lib/types';
import { type RequestHandler } from '@sveltejs/kit';

import { BASE_URL } from '$env/static/private';

export const POST: RequestHandler = async ({ request }) => {
	const { ls } = (await request.json()) as { ls: LocalStorage };
	const { books, sortBy, isAscending } = ls;

	const browser = await puppeteer.launch();
	const page = await browser.newPage();

	await page.goto(BASE_URL, { waitUntil: 'load' });

	await page.evaluate(
		({ books, sortBy, isAscending, pageLimit }) => {
			localStorage.setItem('books', JSON.stringify(books));
			localStorage.setItem('sortBy', JSON.stringify(sortBy));
			localStorage.setItem('isAscending', JSON.stringify(isAscending));
			localStorage.setItem('pageLimit', JSON.stringify(pageLimit));
		},
		{ books, sortBy, isAscending, pageLimit: 1000 }
	);

	await page.goto(`${BASE_URL}/reports/user-books`, { waitUntil: 'networkidle0' });

	await page.waitForFunction(() => window.renderReady === true);

	await page.addStyleTag({
		content: `
			@page:first {
				margin: 0;
			}
	
			@page {
				margin: 1.5rem 0;
			}
		`
	});

	const pdf = await page.pdf({
		format: 'LEGAL',
		printBackground: true,
		footerTemplate: `<span style="font-size:10px; margin-left:20px;">Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>`,
		landscape: true
	});

	await page.evaluate(() => {
		localStorage.clear();
	});

	await browser.close();

	return new Response(pdf, {
		status: 200,
		headers: {
			'Content-Type': 'application/pdf',
			'Content-Disposition': 'attachment; filename="my-books.pdf"'
		}
	});
};
