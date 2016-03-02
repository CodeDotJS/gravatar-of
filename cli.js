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
  status: ['green', 'bold']
})

colors.setTheme({
  normal: ['red', 'bold']
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

const localFold = argv.n;

const hashEmail = md5(argv.u);

const usedAs = hashEmail;

const saveImage = "./Gravatar/";

const removeSlash = saveImage.replace("./", '');

const forSaved = removeSlash.replace("/", '');

mkdirp(removeSlash, function(err) {
  if (err) {
    console.log(boxen("  Failed to create the directory   ").error);
  } else {
    setTimeout(function() {
      console.log("\n\t ❱ Directory Created      :    ".directory + "✔"
        .status);
    }, 1000);
  }
});

request('http://rishigiri.com/gravatar/', function(error, response) {
  if (!error && response.statusCode == 200) {
    console.log('\n\t ❱ Internet Connection    :    '.directory + "✔".status);
  } else {
    console.log('\n');
    console.log(boxen("  Please check your internet connection  ").error);
    console.log('\n');
  }
});


request
  .get('http://1.gravatar.com/avatar/' + usedAs)
  .on('response', function(response) {
    const storeType = response.headers['content-type'];
    const parseType = storeType.toString().replace('image/', '');
    const typeArray = ['png', 'jpeg', 'gif'];
    if (typeArray[0] === parseType) {
      const imageFile = fs.createWriteStream(removeSlash + argv.n + '.png\n');

      http.get('http://1.gravatar.com/avatar/' + usedAs + '?size=400px',
        function(res) {
          res.pipe(imageFile);
          setTimeout(function() {
            console.log("\n\t ❱ Image Saved In         :    ".directory +
              forSaved.toString().status + " ❱ " + localFold.toString()
              .status +
              "\n".status);
          }, 2000);
        }).on('error', function(err) {
        console.log(err);
      });
    };
    if (typeArray[1] === parseType) {
      const imageFile = fs.createWriteStream(removeSlash + argv.n + '.jpeg\n');

      http.get('http://1.gravatar.com/avatar/' + usedAs + '?size=400px',
        function(res) {
          res.pipe(imageFile);
          setTimeout(function() {
            console.log("\n\t ❱ Image Saved In         :    ".directory +
              forSaved.toString().status + " ❱ " + localFold.toString()
              .status +
              "\n".status);
          }, 2000);
        }).on('error', function(err) {
        console.log(err);
      });
    };
  });
