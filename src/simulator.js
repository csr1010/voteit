import { launchPuppeeteer, delay } from "../util/util";
import { uniqueNamesGenerator, names } from "unique-names-generator";
// import { schedule } from "node-cron";
import { promisify } from "util";
import { exec } from "child_process";
const promiseExec = promisify(exec);
let lastUsedWifi = 0;
const wifiScript = ["./src/pixel.sh", "./src/studio.sh"];
const safeUA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36";

async function vote() {
  if (lastUsedWifi === wifiScript.length) {
    lastUsedWifi = 0;
  }
  // await promiseExec(wifiScript[lastUsedWifi]);
  // await delay(7000);
  const browser = await launchPuppeeteer();
  const context = await browser.createIncognitoBrowserContext();
  const page = await context.newPage();
  await page.setUserAgent(safeUA);
  await page.setRequestInterception(true);
  page.on("request", request => {
    const headers = Object.assign({}, request.headers(), {
      "user-agent": safeUA
    });
    request.continue({headers});
  });
  const fullName = uniqueNamesGenerator({
    dictionaries: [names],
    separator: " ",
    length: 1
  });
  await page.goto("https://mycutebaby.in/contest/participant/?n=5e3bd8b8378bf&utm_source=wsapp_share&utm_campaign=February_2020&utm_medium=shared&utm_term=wsapp_shared_5e3bd8b8378bf&utm_content=participant", { waitUntil: "domcontentloaded" });
  await delay(7000);
  await page.waitForSelector("#vote_btn");
  await page.waitForFunction("document.querySelector('#vote_btn span:last-child').innerText === 'TAP TO VOTE !'");
  await page.evaluate(() => {
    const inputEl = document.querySelector("#v");
    window.scrollTo({ top: inputEl.getBoundingClientRect().top - 300, left: 0, behavior: "smooth" });
  });
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
    const fbBox = document.querySelector("fb-close");
    if (fbBox) {
      fbBox.click();
    }
  });
  const msg = await page.evaluate(() => {
    return document.querySelector("p[id=vote_msg]").innerText;
  });
  try {
    await page.waitForFunction("document.querySelector('p[id=vote_msg]').innerText.includes('Thank You')");
    console.log(`Voted Successfully by ${fullName} - ${msg}`);
  } catch (e) {
    console.log(`Vote Un-Successfully by ${fullName} - ${msg}`);
  }
  await page.screenshot({ path: "./image.jpg", type: "jpeg" });
  lastUsedWifi++;
  await browser.close();
}

async function doVote() {
  let startTime = Date.now();
  console.log("vote started at ", new Date(startTime));
  await vote();
  let endTime = Date.now();
  let timeout = 1800000 + (endTime - startTime);
  console.log("next vote at ", new Date(Date.now() + timeout));
  let timer = setTimeout(() => {
    doVote();
    clearTimeout(timer);
  }, timeout);
}

doVote();

// const cronJob = schedule("*/15 * * * *", async () => {
// const interval = setInterval(() => {
//   try {
//     console.log("started", Date.now());
//     vote();
//     console.log("finished", Date.now());
//   } catch (error) {
//     clearInterval(interval);
//   }
// }, 900000);

// });
