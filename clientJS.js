'use strict';

var https = require('https')
    , fetch = require('node-fetch')
    , fs = require('fs')
    , path = require('path')
    // , ca = fs.readFileSync(path.join(__dirname, 'client', 'my-private-root-ca.cert.pem'))
    , ca = fs.readFileSync(path.join(__dirname, '..', 'cert', 'localhost.crt'))
    , port = process.argv[2] || 31022
    , hostname = process.argv[3] || 'localhost'
;

var options = {
    host: hostname
    , port: port
    , path: '/'
    , ca: ca
};
options.agent = new https.Agent(options);

https.request(options, function (res) {
    res.pipe(process.stdout);
}).end();


//--------------------

const agent = new https.Agent({
    ca
})
const url = 'https://localhost:31022/'

const run = async () => {
    await fetch(
        url, {
            method: 'GET',
            agent
        }).then(dat => dat.body.pipe(process.stdout)).catch(er => console.error(er));
}

run();
