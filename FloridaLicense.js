const puppeteer = require('puppeteer');

const BASE_URL = 'https://www.myfloridalicense.com/';
const SEARCH_URL = 'https://www.myfloridalicense.com/wl11.asp?mode=1&SID=&brd=&typ=';

let browser = null;

//Ten pages;
let page = null;
let page2 = null;
let page3 = null;
let page4 = null;
let page5 = null;
let page6 = null;
let page7 = null;
let page8 = null;
let page9 = null;
let page10 = null;

let links = [];
let pages = [];

const FloridaLicense = {
    //start puppeter and go to page
    initialize: async() => {

        browser = await puppeteer.launch({
            headless: false
        });

        //10 new tabs
        page = await browser.newPage();
        page2 = await browser.newPage();
        page3 = await browser.newPage();
        page4 = await browser.newPage();
        page5 = await browser.newPage();
        page6 = await browser.newPage();
        page7 = await browser.newPage();
        page8 = await browser.newPage();
        page9 = await browser.newPage();
        page10 = await browser.newPage();

        //Fill the array of pages to use after in a for loop 
        pages.push(page);
        pages.push(page2);
        pages.push(page3);
        pages.push(page4);
        pages.push(page5);
        pages.push(page6);
        pages.push(page7);
        pages.push(page8);
        pages.push(page9);
        pages.push(page10);

        //go to page 
        await page.goto(SEARCH_URL);
        await page2.goto(SEARCH_URL);
        await page3.goto(SEARCH_URL);
        await page4.goto(SEARCH_URL);
        await page5.goto(SEARCH_URL);
        await page6.goto(SEARCH_URL);
        await page7.goto(SEARCH_URL);
        await page8.goto(SEARCH_URL);
        await page9.goto(SEARCH_URL);
        await page10.goto(SEARCH_URL);

    },
    selectDropdown: async() => {
        // for (let page of pages) {
        //Select License Category
        await page.waitFor('select[name="Board"]');
        await page.select('select[name="Board"]', '400');

        //Select License Type
        await page.waitFor('select[name="LicenseType"]');
        await page.select('select[name="LicenseType"]', '4006');

        //Select Country 
        await page.waitFor('select[name="County"]');
        await page.select('select[name="County"]', '23');

        //Select #Pages
        await page.waitFor('select[name="RecsPerPage"]');
        await page.select('select[name="RecsPerPage"]', '50');

        //Click search
        await page.click('input[value ="Search"]');
        await page.waitFor("table table table table table tbody > tr:nth-child(2) > td:nth-child(2)");

        // First i need #Pages
        // #pages / 10 --> 296 / 10 = 29,6 --> +1 --> floor() --- > 30 
        // 30 times my ten tabs will change making page 1 -- > page 11 and so on
        // ¿ How ? -- Typing on #page Selector and then clicking the buttom 

        //Index will be prob need it 


        //getting every link 
        for (let i = 2; i < 101; i = i + 2) {
            link = BASE_URL + await page.$eval(`table table table table table tbody > tr:nth-child(${i}) > td:nth-child(2) a`, a => a.getAttribute('href'));
            links.push(link);
        }

        debugger;
        // }



    },
    //PROB USEFULL
    gettingPages: async() => {

        return await browser.pages();
    },

    end: async() => {
        await browser.close();
    },
};


module.exports = FloridaLicense;