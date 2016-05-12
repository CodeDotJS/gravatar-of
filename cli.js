#!/usr/bin/env node

'use strict';

const fs = require('fs');

const http = require('follow-redirects').http;

const mkdirp = require('mkdirp');

const md5 = require('md5');

const request = require('request');

const colors = require('colors/safe');

const updateNotifier = require('update-notifier');

const pkg = require('./package.json');

updateNotifier({pkg}).notify();

const argv = require('yargs')

	.usage(colors.cyan.bold('\n Usage : $0 -u [email@id] -n [file name]'))

	.demand(['u', 'n'])

	.describe('u', '❱ Email-Id of any gravatar user')

	.describe('n', '❱ Name of Image')

	.example(colors.cyan.bold('\n$0 abc@gmail.com -n ab'))

	.argv;

const localFold = argv.n;

// hashing and storing the email
const hashEmail = md5(argv.u);

// passed
const usedAs = hashEmail;

// directory where the image will be saved
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
		process.exit(1);

		console.log(err);
	} else {
		// no need
	}
});

// checking if the email is valid or not
function checkEmail(emailString) {
	const heckString = new RegExp('@.');
	if (heckString.test(emailString) === true) {
		return ['Valid Email'];
	} else {
		return ['Invalid Email'];
	}
}

function checkInternet(cb) {
	require('dns').lookup('gravatar.com', err => {
		if (err && err.code === 'ENOTFOUND') {
			cb(false);
		} else {
			cb(true);
		}
	});
}

checkInternet(isConnected => {
	if (isConnected) {
		const checkPoint = checkEmail(argv.u);
		let pointOne = ['Valid Email'];
		let pointTwo = ['Invalid Email'];

		if (checkPoint[0] === pointOne[0]) {
			// do nothing
		} else {
			console.log(colors.red.bold('\n ❱ Valid email address  :   ✖\n'));

			process.exit(1);
		}
		console.log(colors.cyan.bold('\n Downloading', replacedString, '\'s gravatar image...'));
	} else {
		console.log(colors.red.bold('\n ❱ Internet Connection  j:   ✖\n'));

		process.exit(1);
	}
});

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
					console.log(colors.cyan.bold('\n ❱ Image Saved In  :  ') + colors.green.bold(forSaved.toString() + ' ❱ ' + localFold.toString() + '.png\n'));
				}, 2000);
			}).on('error', err => {
				process.exit(1);

				console.log(err);

			});
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
					console.log(colors.cyan.bold('\n ❱ Image Saved In  :  ') + colors.green.bold(forSaved + ' ❱ ' + localFold + '.jpeg\n'));
				}, 2000);
			}).on('error', err => {
				process.exit(1);

				console.log(err);
			});
	} else {
		/* do something */
	}
});
