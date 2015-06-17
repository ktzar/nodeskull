var request = require('http-request');
var nodeskull = require('./index.js');
var readline = require('readline');
var semaphoreFactory = require('semaphore');
var fs = require('fs');
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

var limiter = semaphoreFactory(5);

rl.on('line', function (line) {
    var path = line + ".mp3";
    if (fs.existsSync(path)) {
        console.log(line + " already exists");
        return;
    }
    limiter.take(function () {
        nodeskull.search(line, function (link) {
            if (!link) {
                console.log(line + "\tNOT FOUND");
                return;
            }
            console.log(line + "\t" + link);
            request.get(link, path, function (err) {
                limiter.leave();
                if (!err) {
                    console.log(line + " downloaded");
                }
            });
        });
    });
});
