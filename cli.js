#!/usr/bin/env node

'use strict';

const fs = require('fs');
const http = require('follow-redirects').http;
const mkdirp = require('mkdirp');
const md5 = require('md5');
const colors = require('colors');
const Parse = require('jsonparse');

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
