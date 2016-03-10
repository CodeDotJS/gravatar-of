#!/usr/bin/env node

'use strict';

/* dependencies */

const fs = require('fs');
const http = require('follow-redirects').http;
const mkdirp = require('mkdirp');
const md5 = require('md5');
// const Parse = require('jsonparse');
const request = require('request');
const boxen = require('boxen');
const cheerio = require('cheerio');
const colors = require('colors');

colors.setTheme({
	directory: ['cyan', 'bold']
});

colors.setTheme({
	description: ['green', 'bold']
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
	.usage('\n Usage : $0 -u [email@id] -n [file name]'.info)
	.demand(['u', 'n'])
	.describe('u', '❱'.status + ' Email-Id of any gravatar user')
	.describe('n', '❱'.status + ' Name of Image')
	.argv;

const localFold = argv.n;

// hashing and storing the email
const hashEmail = md5(argv.u);

// passed
const usedAs = hashEmail;

// defining directories
// is the directory where the image will be saved
const saveImage = './Gravatar/';

// because I want to
const removeSlash = saveImage.replace('./', '');

// used where the directory is shown to the user
const forSaved = removeSlash.replace('/', '');

// finding username based on email address
// will show the user's data only if the gravatar user name of a person is starting chars of his email before '@'
function removeString(emailAddress) {
	// removing everything after '@', basic strategy used by gravtar for username
	return emailAddress.replace(/\@.*/, '');
}

// stored argument
const replacedString = removeString(argv.u);

mkdirp(removeSlash, err => {
	if (err) {
		console.error(boxen('  Failed to create the directory   ').error);
	} else { /* referred to another mkdirp */ }
});

// loading lightweight page to check internet connection and creating directory based on the same process.
request('http://rishigiri.com/gravatar/', (error, response) => {
	if (!error && response.statusCode === 200) {
		console.log('\n\t ❱ Internet Connection    :    '.directory + '✔'.status);
		// another with same name
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
		// console when statusCode !== 200 or no internet connection
		console.log('\n');
		console.log(boxen('  ERROR : Please check your internet connection  ').error);
		console.log('\n');
		// stop the whole process
		process.exit(1);
	}
});

console.log('\n  Fetching'.status, replacedString.toString().info, '\'s'.info,
	'gravatar data.'.status);
// requesting for image with hashed email address which was previously stored in 'usedAs'

request
	.get('http://1.gravatar.com/avatar/' + usedAs)

.on('response', response => {
	// checking for the type of remote image.
	const storeType = response.headers['content-type'];

	// initially the result comes like image/.gif
	// thus removing the 'image/' part
	const parseType = storeType.toString().replace('image/', '');

	// stored the possible extension in typeArray
	const typeArray = ['png', 'jpeg', 'gif'];

	// checking if the remote image is png
	if (response.statusCode === 200 && typeArray[0] === parseType) {
		// will save the image in the default defined directory
		const imageFile = fs.createWriteStream(removeSlash + argv.n + '.png');

		// started downloading image
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
		// Parsing the HTML content for getting user's data.
		setTimeout(() => {
			function getProfile() {
				request('http://en.gravatar.com/' + replacedString, (error, response,
					html) => {
					if (!error && response.statusCode === 200) {
						// loading the whole HTML
						const $ = cheerio.load(html);
						return {
							// returning the datas
							name: console.log(' Name      :     '.info + $('h2.fn').text().toString()
								.description, '\n') || null,

							place: console.log(' Location  :     '.info + $('p.location').text()
								.toString()
								.description, '\n') || null,

							bio: console.log(' Bio       :     '.info + $('p.description').text()
									.trim().replace('<br>', '').toString().description, '\n') ||
								null,

							twitter: console.log(' Twitter   :     '.info + $(
									'a.accounts_twitter')
								.attr('href')
								.toString().description, '\n'
							) || null,

							facebook: console.log(' Facebook  :     '.info + $(
										'a.accounts_facebook').attr('href')
									.toString().description,
									'\n') ||
								null,

							googlePlus: console.log(' Google +  :     '.info + $(
								'a.accounts_google').attr('href')
							.toString().description,
							'\n') || null,

							linkedIn: console.log(' LinkedIn  :     '.info + $(
								'a.accounts_linkedin').attr('href')
							.toString().description,
							'\n') || null
						};
					}
				});
			}
			getProfile();
		}, 5000);
	} else {
		/* something to be done | but no need */
	}
	// checking if the remote image if jpg/jpeg
	if (response.statusCode === 200 && typeArray[1] === parseType) {
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
		// Parsing the HTML content for getting user's data.
		setTimeout(() => {
			function getProfile() {
				request('http://en.gravatar.com/' + replacedString, (error, response,
					html) => {
					if (!error && response.statusCode === 200) {
						// loading the whole HTML
						const $ = cheerio.load(html);
						return {
							// returning the datas
							name: console.log(' Name      :     '.info + $('h2.fn').text().toString()
								.description, '\n') || null,

							place: console.log(' Location  :     '.info + $('p.location').text()
								.toString()
								.description, '\n') || null,

							bio: console.log(' Bio       :     '.info + $('p.description').text()
									.trim().replace('<br>', '').toString().description, '\n') ||
								null,

							twitter: console.log(' Twitter   :     '.info + $(
									'a.accounts_twitter')
								.attr('href')
								.toString().description, '\n'
							) || null,

							facebook: console.log(' Facebook  :     '.info + $(
										'a.accounts_facebook').attr('href')
									.toString().description,
									'\n') ||
								null,

							googlePlus: console.log(' Google +  :     '.info + $(
								'a.accounts_google').attr('href')
							.toString().description,
							'\n') || null,

							linkedIn: console.log(' LinkedIn  :     '.info + $(
								'a.accounts_linkedin').attr('href')
							.toString().description,
							'\n') || null
						};
					}
				});
			}
			getProfile();
		}, 5000);
	} else {
		/* do something */
	}
});
// to be continued ... [ Maths examination on 14th of March]
