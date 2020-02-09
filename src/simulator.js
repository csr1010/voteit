import { launchPuppeeteer, delay } from "../util/util";
import { uniqueNamesGenerator, names, starWars } from "unique-names-generator";
// import { schedule } from "node-cron";

async function vote() {
  const browser = await launchPuppeeteer();
  const context = await browser.createIncognitoBrowserContext();
  const page = await context.newPage();
  const fullName = uniqueNamesGenerator({
    dictionaries: [names, starWars],
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
    const aClose = document.querySelector("button.close");
    if (aClose) {
      aClose.click();
    }
  });
  await delay(5000);
  await page.evaluate(() => {
    if (fbBox) {
      fbBox.click();
    }
    const fbBox = document.querySelector("fb-close");
  });
  await page.waitForFunction("document.querySelector('p[id=vote_msg]').innerText.includes('Thank You')");
  console.log(`Voted Successfully by ${fullName}`);
  await page.screenshot({ path: "./image.jpg", type: "jpeg" });
  browser.close();
}

(async function () {
  await vote();
});
// const cronJob = schedule("*/30 * * * *", async () => {
//   try {
//     vote();
//   } catch (error) {
//     cronJob.stop();
//     cronJob.destroy();
//   }
// });
