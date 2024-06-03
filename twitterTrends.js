const { Builder, By, Browser , until , click } = require('selenium-webdriver');
const Trend = require('./model');
const { connectDb } = require('./db');
const axios =require('axios')

function generateRandomIP() {
    // Generate each octet randomly between 0 and 255
    const octet1 = Math.floor(Math.random() * 256);
    const octet2 = Math.floor(Math.random() * 256);
    const octet3 = Math.floor(Math.random() * 256);
    const octet4 = Math.floor(Math.random() * 256);
    
    // Concatenate octets with periods to form the IP address
    return `${octet1}.${octet2}.${octet3}.${octet4}`;
}




(async function helloSelenium() {

    connectDb();
    let ip =generateRandomIP();
    let driver = await new Builder().forBrowser(Browser.CHROME).build();

    
    const twitterLoginUrl = 'https://twitter.com/login';
    await driver.get(twitterLoginUrl);

        
        let usernameInput = await driver.wait(until.elementLocated(By.xpath('//input[@name="text"]')), 10000);

        await usernameInput.sendKeys('captaincoro44');

        await driver.findElement(By.xpath('//span[contains(text(),"Next")]')).click();

        let password = await driver.wait(until.elementLocated(By.xpath('//input[@name="password"]')), 10000);

        await password.sendKeys('fugacity55$');

        await driver.findElement(By.xpath('//span[contains(text(),"Log in")]')).click();
      
        
        let trendingNowElements = await driver.wait(
            until.elementsLocated(By.xpath('//div[@aria-label="Timeline: Trending now"]//span[contains(@class, "css-1jxf684")]')),
            10000
        );

        const topics = [];

        

        // Extract and log the text of the first 5 trending topics
        for (let i =2; i <Math.min(trendingNowElements.length,15); i+=3) {
            let itemText = await trendingNowElements[i].getText();
           
                topics.push(itemText);
            
          


          

            
            
            console.log(itemText);
            
        };

        console.log(topics)

        const newTrend = new Trend({
            trends:topics,
            ipAddress:ip
            
        });

        await newTrend.save();



        console.log("Data Saved SuccessFully in the Database");
        



    
})();
