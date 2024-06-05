const express = require('express');
const { Builder, By, Browser, until } = require('selenium-webdriver');
const Trend = require('./model');
const { connectDb } = require('./db');
const cors = require('cors');
const path =require('path');
const dotenv = require('dotenv');

dotenv.config({})

const app = express();


app.use(cors({}));
// Function to generate a random IP address
function generateRandomIP() {
    const octet1 = Math.floor(Math.random() * 256);
    const octet2 = Math.floor(Math.random() * 256);
    const octet3 = Math.floor(Math.random() * 256);
    const octet4 = Math.floor(Math.random() * 256);
    return `${octet1}.${octet2}.${octet3}.${octet4}`;
}

// Endpoint to run the Selenium script
app.get('/run-selenium-script', async (req, res) => {
    try {
        connectDb(); 
        const ip = generateRandomIP(); 
        const driver = await new Builder().forBrowser(Browser.CHROME).build();
        await driver.get('https://twitter.com/login'); 
        
        let usernameInput = await driver.wait(until.elementLocated(By.xpath('//input[@name="text"]')), 10000);

        await usernameInput.sendKeys('captaincoro44');

        await driver.findElement(By.xpath('//span[contains(text(),"Next")]')).click();

        let password = await driver.wait(until.elementLocated(By.xpath('//input[@name="password"]')), 10000);

        await password.sendKeys('fugacity55$');

        await driver.findElement(By.xpath('//span[contains(text(),"Log in")]')).click();
        
        const trendingNowElements = await driver.wait(
            until.elementsLocated(By.xpath('//div[@aria-label="Timeline: Trending now"]//div[contains(@class, "r-b88u0q")]//span[contains(@class,"css-1jxf684")]')),
            10000
        );
        const topics = [];
        for (let i = 1; i < Math.min(trendingNowElements.length, 5); i ++) {
            let itemText = await trendingNowElements[i].getText();
            topics.push(itemText);
            console.log(itemText)
        }
        const newTrend =await Trend.create({
            ipAddress:ip,
            trends:topics
        });

        const newip=newTrend.ipAddress;
        

        console.log("Data saved successfully in the database");
        
        await driver.quit();
        res.json({ message: 'Selenium script executed successfully!',topics,ip});
    } catch (error) {
        console.error('Error executing Selenium script:', error);
        res.status(500).json({ error: error.message });
    }
});


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,"public", 'index.html'));
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} \n You can go to http://localhost:${PORT}  to access the script`);
});
