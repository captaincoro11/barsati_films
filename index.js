const express = require('express');
const { Builder, By, Browser, until } = require('selenium-webdriver');
const Trend = require('./model');
const { connectDb } = require('./db');

const app = express();

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
        connectDb(); // Connect to the MongoDB database
        const ip = generateRandomIP(); // Generate a random IP address
        const driver = await new Builder().forBrowser(Browser.CHROME).build();
        await driver.get('https://twitter.com/login'); // Navigate to Twitter login page
        // Add your Selenium script logic here
        let usernameInput = await driver.wait(until.elementLocated(By.xpath('//input[@name="text"]')), 10000);

        await usernameInput.sendKeys('captaincoro44');

        await driver.findElement(By.xpath('//span[contains(text(),"Next")]')).click();

        let password = await driver.wait(until.elementLocated(By.xpath('//input[@name="password"]')), 10000);

        await password.sendKeys('fugacity55$');

        await driver.findElement(By.xpath('//span[contains(text(),"Log in")]')).click();
        // ... continue with the rest of your Selenium script ...
        // Once you have fetched the trending topics array, store it in the database
        const trendingNowElements = await driver.wait(
            until.elementsLocated(By.xpath('//div[@aria-label="Timeline: Trending now"]//span[contains(@class, "css-1jxf684")]')),
            10000
        );
        const topics = [];
        for (let i = 2; i < Math.min(trendingNowElements.length, 15); i += 3) {
            let itemText = await trendingNowElements[i].getText();
            topics.push(itemText);
        }
        const newTrend =await Trend.create({
            ipAddress:ip,
            trends:topics
        });

        const newip=newTrend.ipAddress;
        

         // Save the trending topics and IP address to the database
        console.log("Data saved successfully in the database");
        // Close the browser after the script execution
        await driver.quit();
        res.json({ message: 'Selenium script executed successfully!',topics,ip});
    } catch (error) {
        console.error('Error executing Selenium script:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Serve the HTML file
app.get('/', (req, res) => {
    res.send("Hi tehre");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
