#!/usr/bin/env node

'use strict';

/* dependencies */

const fs = require('fs');
const http = require('follow-redirects').http; // just in case
const mkdirp = require('mkdirp');
const md5 = require('md5');
const Parse = require('jsonparse');
const boxen = require('boxen');
const request = require('request');
const https = require('https');
const colors = require('colors');
colors.setTheme({
    directory: ['cyan', 'bold']
});

colors.setTheme({
    info: ['cyan', 'bold']
});

colors.setTheme({
    normal: ['red', 'bold']
});

colors.setTheme({
    connection: ['red', 'underline']
});

colors.setTheme({
	error: ['red', 'bold']
});

const argv = require('yargs')
    .usage('\nUsage : $0 -u [/email@id] -n [file name]'.info)
    .demand(['u', 'n'])
    .describe('u', 'Email-Id of any gravatar user')
    .describe('n', 'Name of Image')
    .argv;

const hashEmail = md5(argv.u);

const usedAs = hashEmail;

const saveImage = "./Gravatar/";

const removeSlash = saveImage.replace("./", '');

mkdirp(removeSlash, function(err) {
    if (err) {
        console.log(boxen("  Failed to create the directory   ").error);
    } else {
        console.log("\n\t ❭ Directory Created     :     ".directory + "✔");
    }
})

request('http://rishigiri.com/gravatar/', function(error, response) {
    if (!error && response.statusCode == 200) {
        console.log('\n\t ❭ Internet Connection    :    '.directory + '✔'.normal);
    } else {
        console.log('\n');
        console.log(boxen("  Please check your internet connection  ").error);
        console.log('\n');
    }
});

const imageFile = fs.createWriteStream(removeSlash + argv.n + '.png');