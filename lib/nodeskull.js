var https = require('https');
var $ = require('cheerio');

var host = 'mp3skull.cr';
var query = '/search_db.php?q=%s';

function getHttpsContent(url, cb) {
    var request = https.get(url, function (res) {
        var data = '';
        res.on('data', function (chunk) {
            data += chunk;
        });
        res.on('end', function () {
            cb(data);
        });
    });
    request.on('error', function (e) {
        console.error(e.message);
    });
}

function getLinks(content) {
}

function getToken() {
}

exports.search = function (author, song, minbitrate) {
    var url = host + query.replace('%s', author + " " + song);
};
