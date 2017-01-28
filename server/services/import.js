const cheerio = require('cheerio');
const request = require('request');

class ImportService {

    constructor() {
        this.parsers = {
            default: require('./parsers/default'),

            coupdepouce: require('./parsers/coupdepouce'),
            recettesqc: require('./parsers/recettesqc'),
            ricardo: require('./parsers/ricardo'),
            troisfoisparjour: require('./parsers/troisfoisparjour'),
        };
    }

    parseUrl(url, callback) {
        request.get(url, (error, response, body) => {
            if (response.statusCode === 200) {
                const parser = this._findParser(url);

                const document = cheerio.load(body);

                parser(url, document, callback);
            } else {
                callback(`Page Web introuvable (HTTP: ${response.statusCode})`);
            }
        });
    }

    _findParser(url) {
        const domain = this._extractDomain(url);

        const domainParsers = {
            'coupdepouce.com': this.parsers.coupdepouce,
            'recettes.qc.ca': this.parsers.recettesqc,
            'ricardocuisine.com': this.parsers.ricardo,
            'troisfoisparjour.com': this.parsers.troisfoisparjour,
        };

        if (domainParsers[domain]) {
            return domainParsers[domain];
        } else {
            return this.parsers.default;
        }
    }

    _extractDomain(url) {
        let domain;

        // Find & remove protocol (http, ftp, etc.) and get domain
        if (url.indexOf("://") > -1) {
            domain = url.split('/')[2];
        } else {
            domain = url.split('/')[0];
        }

        // Find & remove port number
        domain = domain.split(':')[0];

        // Remove www
        domain = domain.replace(/^www\./i, '');

        return domain;
    }
}

module.exports = new ImportService();
