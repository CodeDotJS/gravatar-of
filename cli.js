#!/usr/bin/env node

'use strict';

/* dependencies */

const fs = require('fs');
const http = require('follow-redirects').http;
const mkdirp = require('mkdirp');
const md5 = require('md5');

// const Parse = require('jsonparse');

const boxen = require('boxen');
const request = require('request');

// const cheerio = require('cheerio');

const colors = require('colors');

colors.setTheme({
	directory: ['cyan', 'bold']
});

colors.setTheme({
	info: ['cyan', 'bold']
});

colors.setTheme({
	status: ['green', 'bold']
});

colors.setTheme({
	normal: ['red', 'bold']
});

colors.setTheme({
	error: ['red', 'bold']
});

const argv = require('yargs')
	.usage('\n Usage : $0 -u [/email@id] -n [file name]'.info)
	.demand(['u', 'n'])
	.describe('u', '❱'.status + '  Email-Id of any gravatar user')
	.describe('n', '❱'.status + '  Name of Image')
	.argv;

const localFold = argv.n;

const hashEmail = md5(argv.u);

const usedAs = hashEmail;

const saveImage = './Gravatar/';

const removeSlash = saveImage.replace('./', '');

const forSaved = removeSlash.replace('/', '');

request('http://rishigiri.com/gravatar/', (error, response) => {
	if (!error && response.statusCode === 200) {
		console.log('\n\t ❱ Internet Connection    :    '.directory + '✔'.status);
		mkdirp(removeSlash, err => {
			if (err) {
				console.log(boxen('  Failed to create the directory   ').error);
			} else {
				setTimeout(() => {
					console.log('\n\t ❱ Directory Created      :    '.directory + '✔'.status);
				}, 1000);
			}
		});
	} else {
		console.log('\n');
		console.log(boxen('  ERROR : Please check your internet connection  ').error);
		console.log('\n');
		process.exit(1);
	}
});

request
	.get('http://1.gravatar.com/avatar/' + usedAs)

.on('response', response => {
	const storeType = response.headers['content-type'];
	const parseType = storeType.toString().replace('image/', '');
	const typeArray = ['png', 'jpeg', 'gif'];

	if (typeArray[0] === parseType) {
		const imageFile = fs.createWriteStream(removeSlash + argv.n + '.png');
		http.get('http://1.gravatar.com/avatar/' + usedAs + '?size=400px',
			res => {
				res.pipe(imageFile);
				setTimeout(() => {
					console.log('\n\t ❱ Image Saved In         :    '.directory +
						forSaved.toString().status + ' ❱ ' + localFold.toString().status +
						'.png\n'.status);
				}, 2000);
			}).on('error', err => {
				console.log(err);
			});
	}

	if (typeArray[1] === parseType) {
		const imageFile = fs.createWriteStream(removeSlash + argv.n + '.jpeg');

		http.get('http://1.gravatar.com/avatar/' + usedAs + '?size=400px',
			res => {
				res.pipe(imageFile);
				setTimeout(() => {
					console.log('\n\t ❱ Image Saved In         :    '.directory +
						forSaved.toString().status + ' ❱ ' + localFold.toString().status +
						'.jpeg\n'.status);
				}, 2000);
			}).on('error', err => {
				console.log(err);
			});
	}
});

function removeString(emailAddress) {
	return emailAddress.replace(/\@.*/, '');
}

const replacedString = removeString(argv.u);

