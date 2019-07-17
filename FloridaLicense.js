const puppeteer = require('puppeteer');

const BASE_URL = 'https://www.myfloridalicense.com/';
const SEARCH_URL = 'https://www.myfloridalicense.com/wl11.asp?mode=1&SID=&brd=&typ=';
const firebase = require("firebase");
require("firebase/firestore");
const config = require('./app');
firebase.initializeApp(config)
const db = firebase.firestore()

let browser = null;
let page = null;

let pages = [];
let promises = [];

async function getLinks(page, links) {
    await page.waitFor("table table table table table tbody > tr:nth-child(2) > td:nth-child(2)");
    for (let i = 2; i < 101; i = i + 2) {
        link = BASE_URL + await page.$eval(`table table table table table tbody > tr:nth-child(${i}) > td:nth-child(2) a`, a => a.getAttribute('href'));
        links.push(link);
    }
}

async function navigateTo(page, pageTo) {
    try {
        await page.waitFor('input[name ="Page"]');
        await page.click('input[name ="Page"]');
        await page.keyboard.type(`${pageTo}`);
        await page.waitFor('input[name = "SearchGo"]');
        await page.click('input[name ="SearchGo"]');
        await page.waitForNavigation({ waitUntil: 'domcontentloaded' })
            // await getLinks(page, links);
    } catch (error) {

    }
}
async function selectOptions(page) {
    try {
        await page.waitFor('select[name="Board"]');
        await page.select('select[name="Board"]', '400');

        //Select License Type
        await page.waitFor('select[name="LicenseType"]')
        await page.select('select[name="LicenseType"]', '4006');

        //Select Country 
        await page.waitFor('select[name="County"]');
        await page.select('select[name="County"]', '23');

        //Select #Pages
        await page.waitFor('select[name="RecsPerPage"]');
        await page.select('select[name="RecsPerPage"]', '50');

        //Click search
        await page.waitFor('input[value="Search"]');
        await page.click('input[value ="Search"]');

    } catch (e) {
        console.log(e);
    }
}

const FloridaLicense = {
    //start puppeter and go to page
    initialize: async() => {

        browser = await puppeteer.launch({
            headless: true
        });

        for (let i = 0; i < 8; i++) {
            promises.push(browser.newPage());
        }

        await Promise.all(promises).then(async(values) => {
            for (const page of values) {
                pages.push(page);
                page.goto(SEARCH_URL, { waitUntil: 'domcontentloaded' });
            }
        });
        await Promise.all(pages.map(async(value) => await selectOptions(value))).then(async() => {
            console.log('All options selected');
        });
        var i = 0;
        // 296 is total pages --> Prob going to scrap to improve code
        // 296 / 8 = 37  q=)
        while (i <= 37) {
            var links = [
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
            ]
            await Promise.all(pages.map(async(value) => await navigateTo(value, pages.indexOf(value) + 1 + 10 * i))).then(async() => {
                await Promise.all(pages.map(async(value) => await getLinks(value, links[pages.indexOf(value)]))).then(async() => {
                    for (let i = 0; i < links.length; i++) {
                        var Fecha = new Date();
                        var timestamp = Fecha.getTime();
                        var Batch = {
                            links: links[i],
                            status: "Not Scrapped",
                            LastModifiedAt: timestamp
                        }
                        db.collection("Batches").add(Batch).then(function(docRef) {
                                console.log("Document written with ID: ", docRef.id);
                            })
                            .catch(function(error) {
                                console.error("Error adding document: ", error);
                            });
                    }
                    i++;
                })
            });
        }
        this.FloridaLicense.end();
    },

    end: async() => {
        await browser.close();
    },
};


module.exports = FloridaLicense;