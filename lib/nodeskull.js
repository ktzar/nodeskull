var Q = require('q');
var https = require('https');
var $ = require('cheerio');

var host = 'mp3skull.cr';
var query = '/search_db.php?q={query}&fckh={token}';

function getHttpsContent(url) {
    var defer = Q.defer();
        request = https.get(url, function (res) {
        var data = '';
        res.on('data', function (chunk) {
            data += chunk;
        });
        res.on('end', function () {
            defer.resolve(data);
        });
    });
    request.on('error', function (e) {});
    return defer;
}

function getLinks(song, token) {
    var url = 'https://' + host + query.replace('{query}', song).replace('{token}', token),
        defer = Q.defer();

    getHttpsContent(url).promise.done(function (content) {
        var link = $(content).find('.download_button a').first().attr('href');
        defer.resolve(link); 
    });
    return defer;
}

function getToken() {
    var defer = Q.defer();
    getHttpsContent('https://' + host).promise.done(function (content) {
        var token = $(content).find('[name=fckh]').first().val();
        defer.resolve(token); 
    });
    return defer;
}

exports.search = function (song, cb) {
    getToken().promise.done(function (token) {
        getLinks(song, token).promise.done(function (link) {
            cb(link);
        });
    });
};
