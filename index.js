const puppeteer = require('puppeteer');
const floridaLicense = require('./FloridaLicense');

(async() => {
    //This will initialize 10 tabs for scrapping 
    await floridaLicense.initialize();

    await floridaLicense.selectDropdown();



    //Selectors

    //License Category
    // #main > tbody > tr > td > table:nth-child(1) > tbody > tr:nth-child(2) > td:nth-child(2) > form > table > tbody > tr > td > table > tbody > tr:nth-child(4) > td:nth-child(2) > font > select

    //License Type
    //#main > tbody > tr > td > table:nth-child(1) > tbody > tr:nth-child(2) > td:nth-child(2) > form > table > tbody > tr > td > table > tbody > tr:nth-child(5) > td:nth-child(2) > font > select

    //Country
    //#main > tbody > tr > td > table:nth-child(1) > tbody > tr:nth-child(2) > td:nth-child(2) > form > table > tbody > tr > td > table > tbody > tr:nth-child(7) > td:nth-child(2) > font > select
})();