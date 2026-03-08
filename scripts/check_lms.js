const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    await page.setViewport({ width: 1280, height: 800 });
    console.log("Navigating to https://batechu.com/lms/courses ...");

    try {
        await page.goto('https://batechu.com/lms/courses', { waitUntil: 'networkidle2' });
        await new Promise(r => setTimeout(r, 5000));

        await page.screenshot({ path: 'batechu_lms_check.png', fullPage: true });
        const pageTitle = await page.title();
        console.log("Page Title:", pageTitle);

        const text = await page.evaluate(() => document.body.innerText);
        console.log("Page Text Preview:", text.substring(0, 500));
    } catch (error) {
        console.error("Error navigating:", error);
    } finally {
        await browser.close();
    }
})();
