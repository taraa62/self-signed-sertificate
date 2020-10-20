'use strict';

var https = require('https')
    , port = process.argv[2] || 31022
    , fs = require('fs')
    , path = require('path')
    , server
    , options
;

require('ssl-root-cas/latest')
    .inject()
    .addFile(path.join(__dirname, 'cert', 'localhost.crt'))


options = {
    key: fs.readFileSync(path.join(__dirname, 'cert', 'localhost.key'))
    , cert: fs.readFileSync(path.join(__dirname, 'cert', 'localhost.crt'))
};


function app(req, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.end(JSON.stringify({
        val: 'Hello, encrypted world!'
    }));
}

server = https.createServer(options, app).listen(port, function () {
    port = server.address().port;
    console.log('Listening on https://127.0.0.1:' + port);
    console.log('Listening on https://' + server.address().address + ':' + port);
    console.log('Listening on https://localhost:' + port);
});
