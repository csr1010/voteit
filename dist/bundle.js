'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var puppeteer = _interopDefault(require('puppeteer'));
var uniqueNamesGenerator = require('unique-names-generator');
var nodeCron = require('node-cron');

const puppeteer_launch = {
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-infobars',
        '--incognito'
    ],
    defaultViewport: {
        width: 1920,
        height: 1080,
        isMobile: false
    },
    dumpio: true
};

function delay(timeout) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}

const launchPuppeeteer = (() => {
  // let browser;
  return async () => {
    // if (browser) return;
    return await puppeteer.launch(puppeteer_launch);
  };
})();

async function vote() {
  const browser = await launchPuppeeteer();
  const context = await browser.createIncognitoBrowserContext();
  const page = await context.newPage();
  const fullName = uniqueNamesGenerator.uniqueNamesGenerator({
    dictionaries: [uniqueNamesGenerator.names, uniqueNamesGenerator.starWars],
    separator: " ",
    length: 2
  });
  await page.goto("https://mycutebaby.in/contest/participant/?n=5e3bd8b8378bf&utm_source=wsapp_share&utm_campaign=February_2020&utm_medium=shared&utm_term=wsapp_shared_5e3bd8b8378bf&utm_content=participant", { waitUntil: "domcontentloaded" });
  await page.waitForSelector("#vote_btn");
  await page.waitForFunction("document.querySelector('#vote_btn span:last-child').innerText === 'TAP TO VOTE !'");
  await page.evaluate(() => {
    const inputEl = document.querySelector("#v");
    window.scrollTo({ top: inputEl.getBoundingClientRect().top - 300, left: 0, behavior: "smooth" });
  });
  await delay(5000);
  await page.$eval("#v", (el, value) => el.value = value, fullName);
  await page.click("a[id=vote_btn]");
  await delay(5000);
  await page.evaluate(() => {
    const fbBox = document.querySelector("fb-close");
    if (fbBox) {
      fbBox.click();
    }
  });
  await page.screenshot({ path: "./image.jpg", type: "jpeg" });
  browser.close();
}

const cronJob = nodeCron.schedule("*/30 * * * *", async () => {
  try {
    vote();
  } catch (error) {
    cronJob.stop();
    cronJob.destroy();
  }
});
