#!/usr/bin/env node

'use strict';

const fs = require('fs');
const os = require('os');
const dns = require('dns');
const http = require('http');
const imageType = require('image-type');
const fse = require('fs-extra');
const got = require('got');
const chalk = require('chalk');
const ora = require('ora');
const logUpdate = require('log-update');
const updateNotifier = require('update-notifier');
const pkg = require('./package.json');

updateNotifier({pkg}).notify();

const inf = process.argv[2];
const arg = process.argv[3] || 400;
const pre = chalk.red.bold('›');
const pos = chalk.cyan.bold('›');
const dir = `${os.homedir()}/Gravatars/`;
const spinner = ora();
const image = Math.random().toString(15).substr(4, 8);
// Required: const email = /^([\w_\.\-\+])+\@([\w\-]+\.)+([\w]{2,10})+$/;

if (!inf) {
	console.log(`
  ${chalk.cyan('Usage')}    :   gravatar-of [email-address] ${chalk.dim('<size>')}

  ${chalk.cyan('Commands')} :
   <size>      Define size to download image in provided resolution

  ${chalk.cyan('Help')}     :
   $ gravatar-of user@gmail.com
   $ gravatar-of user@gmail.com ${chalk.dim('400')}

  ${chalk.dim('Note : Defining resolution is optional')}
	`);
	process.exit(1);
}

fse.ensureDir(dir, err => {
	if (err) {
		process.exit(1);
	}
});

logUpdate();
spinner.text = 'Please wait!';
spinner.start();

dns.lookup('gravatar.com', err => {
	if (err) {
		logUpdate(`\n${pre} Please check your internet conenction!\n`);
		process.exit(1);
	} else {
		logUpdate();
		spinner.text = 'Almost there';
	}
});

const download = (link, ext) => {
	const save = fs.createWriteStream(dir + `${image}.${ext}`);
	http.get(link, (res, cb) => {
		res.pipe(save);
		save.on('finish', () => {
			save.close(cb);
			logUpdate(`\n${pos} Image Saved! ${chalk.dim(`   [ ${image}.${ext} ]`)}\n`);
			spinner.stop();
		});
	});
};

if (inf) {
	const profile = `http://en.gravatar.com/${inf.split('@')[0]}.json`;
	got(profile, {json: true}).then(res => {
		const source = res.body;
		const img = `${source.entry[0].thumbnailUrl}?size=${arg}`;

		http.get(img, res => {
			res.once('data', chunk => {
				res.destroy();
				const type = imageType(chunk).ext;
				spinner.text = 'Downloading';
				download(img, type);
			});
		});
	}).catch(err => {
		if (err) {
			logUpdate(`\n${pre} ${chalk.dim('The given email is not associated with any account!')}\n`);
			spinner.stop();
		}
	});
} else {
	logUpdate(`\n${pre} ${chalk.dim('Please provide a valid email address!')} \n`);
	process.exit(1);
}

