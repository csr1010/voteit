export const puppeteer_launch = {
    headless: true,
    args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-infobars',
        '--incognito',
        "--user-agent=\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36"
    ],
    defaultViewport: {
        width: 1920,
        height: 1080,
        isMobile: false
    },
    dumpio: true
};
