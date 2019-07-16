const floridaLicense = require('./FloridaLicense');

(async() => {
    //This will initialize 10 tabs for scrapping 
    await floridaLicense.initialize();
})();