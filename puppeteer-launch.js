export const puppeteer_launch = {
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
