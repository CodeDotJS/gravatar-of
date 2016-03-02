var request = require('request');

request
  .get('http://1.gravatar.com/avatar/343237491762eb627f25e0cd02527ac8')
  .on('response', function(response) {
    console.log(response.headers['content-type']) // 'image/png'
  })
