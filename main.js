var request = require('http-request');
var nodeskull = require('./index.js');
var readline = require('readline');
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on('line', function (line) {
    nodeskull.search(line, function (link) {
        if (!link) {
            console.log(line + "\tNOT FOUND");
            return;
        }
        console.log(line + "\t" + link);
        request.get(
            link,
            line + ".mp3",
            function (err) {
                if (!err) {
                    console.log(line + " downloaded");
                }
            }
        );
    });
});
