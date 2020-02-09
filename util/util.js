import puppeteer from "puppeteer";
import { puppeteer_launch } from "../puppeteer-launch";

export function delay(timeout) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}

export const launchPuppeeteer = (() => {
  // let browser;
  return async () => {
    // if (browser) return;
    return await puppeteer.launch(puppeteer_launch);
  };
})();
