/**
 * This script is used to test the regex for extracting the original URL from
 * a web.archive.org URL.
 */

const input =
	'https://web.archive.org/web/20140703102650/https://github.com/lirantal/contrib/tree/master/plugins/drupal';

const regex = /https:\/\/web\.archive\.org\/web\/\d+\/(https?:\/\/.+)/;
const match = input.match(regex);

if (match) {
	const url = match[1];
	console.log(url);
} else {
	console.log('No match found');
}
