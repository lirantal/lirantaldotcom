import assert from 'node:assert/strict';
import { test } from 'node:test';
import { legacySpeakingRedirects } from '../legacy-speaking-redirects.mjs';

test('redirects only published routes affected by the old canonical bug', () => {
	const redirects = legacySpeakingRedirects([
		'/speaking',
		'/speaking/press-kit',
		'/speaking/events',
		'/speaking/talks',
		'/speaking/podcasts',
		'/speaking/recordings',
		'/speaking/events/2020-10-20-vonage-developer-hacktoberfest-event-2020',
		'/speaking/talks/developer-security-essentials-with-snyk',
		'/research/papers',
	]);
	assert.equal(redirects.length, 6);
	for (const destination of [
		'/speaking/events',
		'/speaking/talks',
		'/speaking/podcasts',
		'/speaking/recordings',
		'/speaking/events/2020-10-20-vonage-developer-hacktoberfest-event-2020',
		'/speaking/talks/developer-security-essentials-with-snyk',
	]) {
		const source = destination.replaceAll('/', '-').replace(/^-/, '/');
		const rule = redirects.find((entry) => new RegExp(entry.src).test(source));
		assert.equal(rule.status, 308);
		const match = source.match(new RegExp(rule.src));
		assert.equal(rule.headers.Location.replace('$1', match[1]), destination);
		assert.ok(new RegExp(rule.src).test(`${source}/`));
		assert.ok(!redirects.some((entry) => new RegExp(entry.src).test(`${source}-unknown`)));
	}
});

test('fails rather than redirecting a real page or an ambiguous alias', () => {
	assert.throws(() => legacySpeakingRedirects(['/speaking/events', '/speaking-events']), /collides/);
	assert.throws(() => legacySpeakingRedirects(['/speaking/talks/a.b', '/speaking/talks/a-b']), /collides/);
});

test('redirects retired event URLs to their published successors and preserves restored events', () => {
	const retired = '/speaking/events/2021-10-18-nodeconf-remote';
	const flattened = '/speaking-events-2021-10-18-nodeconf-remote';
	const successor = '/speaking/talks/how-react-applications-get-hacked-in-the-real-world';
	const matches = (redirects, source) => redirects.find(({ src }) => new RegExp(src).test(source));
	const redirects = legacySpeakingRedirects([successor]);
	for (const path of [retired, flattened, `${retired}/`, `${flattened}/`]) {
		assert.equal(matches(redirects, path)?.headers.Location, successor);
	}
	assert.equal(matches(legacySpeakingRedirects([]), retired), undefined);
	const restored = legacySpeakingRedirects([successor, retired]);
	assert.equal(matches(restored, retired), undefined);
	const redirect = matches(restored, flattened);
	assert.equal(flattened.replace(new RegExp(redirect.src), redirect.headers.Location), retired);
});

test('batches exact aliases within the deployment route budget', () => {
	const paths = Array.from({ length: 419 }, (_, index) => `/speaking/events/2026-01-01-conference-${index}`);
	const redirects = legacySpeakingRedirects(paths);
	assert.ok(redirects.length < 20);
	assert.ok(redirects.every((entry) => entry.src.length < 1600));
	for (const destination of paths) {
		const source = destination.replaceAll('/', '-').replace(/^-/, '/');
		const matches = redirects.filter((entry) => new RegExp(entry.src).test(source));
		assert.equal(matches.length, 1);
		assert.equal(matches[0].headers.Location.replace('$1', source.match(new RegExp(matches[0].src))[1]), destination);
	}
});
