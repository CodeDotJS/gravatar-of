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
const colors = require('colors/safe');
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

const argv = require('yargs')
    .usage(colors.cyan.bold('\nUsage : $0 -u [/email@id] -n [file name]'))
    .demand(['u', 'n'])
    .describe('u', 'Email-Id of any gravatar user')
    .describe('n', 'Name of Image')
    .argv;

const hashEmail = md5(argv.u);

request('https://google.com', function(error, response) {
    if (!error && response.statusCode == 200) {
        console.log('\n\t ❭ Internet Connection    :    '.directory + '✔'.normal);
    } else {
        console.log('\n');
        console.log("              " + "Please check your internet connection".connection);
        console.log('\n');
    }
});

const saveImage = "./Gravatar/";

const removeSlash = saveImage.replace("./", '');