const cheerio   = require('cheerio');
const request   = require('request');
const program   = require('commander');
const fs        = require('fs');
const pjson     = require('./package.json');

const download = function(uri, filename, callback) {
    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
};

function getImages(uri, dirname) {
    request(uri, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            const $ = cheerio.load(body);
            fs.mkdirSync(dirname);
            $('img[data-origin-src]').each(function(index) {
                const src = $(this).attr('data-origin-src');
                download(`http:${src}`, `${dirname}/${index}.jpg`, function() {
                    console.log(`http:${src}`);
                });
            });
        } else {
            console.log('Failed connect to Yupoo Link');
        }
    });
};

program
    .version(pjson.version)
    .option('-u, --url <n>', 'Yupoo URL')
    .option('-d, --dirname <n>', 'Download Dirname')
    .parse(process.argv);

if (program.url) {
    getImages(program.url, program.dirname);
} else {
    console.log('Need Yupoo Link');
}


