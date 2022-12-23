/**
 * Run through all files in a directory and replace all Wayback Machine links
 * with the original URL.
 *
 * How to use this:
 * ```
 * node scripts/waybackmachine-fix-links.js <path to directory>
 * ```
 *
 * For example:
 * ```
 * node scripts/waybackmachine-fix-links.js "data"
 * ```
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.join(process.cwd(), process.argv[2]);

function replaceUrl(input) {
	const regex = /https:\/\/web\.archive\.org\/web\/\d+\/(https?:\/\/.+?)[\)\s\]]/gi;
	const output = input.replaceAll(regex, '$1');
	return output;
}

function processFile(filePath) {
	fs.readFile(filePath, 'utf8', (err, data) => {
		if (err) {
			console.error(err);
			return;
		}

		const output = replaceUrl(data);

		fs.writeFile(filePath, output, 'utf8', (err) => {
			if (err) {
				console.error(err);
			}
		});
	});
}

function processDirectory(dirPath) {
	fs.readdir(dirPath, (err, files) => {
		if (err) {
			console.error(err);
			return;
		}

		for (const file of files) {
			const filePath = path.join(dirPath, file);
			fs.stat(filePath, (err, stat) => {
				if (err) {
					console.error(err);
					return;
				}

				if (stat.isDirectory()) {
					processDirectory(filePath);
				} else if (stat.isFile()) {
					processFile(filePath);
				}
			});
		}
	});
}

processDirectory(rootDir);
