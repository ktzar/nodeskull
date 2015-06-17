var request = require('http-request');
var nodeskull = require('./index.js');
var readline = require('readline');
var colors = require('colors');
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
        console.log("Already here\t".gray + line);
        return;
    }
    limiter.take(function () {
        nodeskull.search(line, function (link) {
            if (!link) {
                console.log("Not found\t".red + line);
                return;
            }
            console.log("Downloading\t".yellow + line);
            request.get(link, path, function (err) {
                limiter.leave();
                if (!err) {
                    console.log("Downloaded\t".green + line);
                }
            });
        });
    });
});
