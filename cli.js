#!/usr/bin/env node

'use strict';

const fs = require('fs');
const http = require('follow-redirects').http;
const mkdirp = require('mkdirp');
const md5 = require('md5');
const colors = require('colors');
const Parse = require('jsonparse');
const boxen = require('boxen');
const request = require('request');

colors.setTheme({
    directory: ['cyan', 'bold']
});

colors.setTheme({
    info: ['cyan', 'bold']
});

colors.setTheme({
    normal: ['green', 'bold']
});

const argv = require('yargs')
    .usage('\nUsage : $0 -u [/email@id] -n [file name]'.info)
    .demand(['u', 'n'])
    .describe('u', 'Email-Id of any gravatar user')
    .describe('n', 'Name of Image')
    .argv;

const hashEmail = md5(argv.u);

const saveImage = "./Gravatar/";

const removeSlash = saveImage.replace("./", '');

request('https://gravatar.com', function(error, response) {
    if (!error && response.statusCode == 200) {
    	mkdirp(saveImage, function(err) {
    		if (err) {
    			console.log(err);
    		} else {
    			console.log('\n\t ❭ Directory Created 	:'.directory + '    ✔'.normal);
    		}
    	});
            console.log('\n\t ❭ Downloading 		:'.directory + '    ✔'.normal);
    } else {
        console.log(boxen(" SLOW INTERNET! ").rainbow);
    }
});
