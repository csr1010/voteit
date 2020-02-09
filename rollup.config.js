import multi from '@rollup/plugin-multi-entry';

export default {
    input: "./src/**/*.js",
    output: {
        format: "cjs",
        file: "./dist/bundle.js"
    },
    plugins: [multi()],
    external: ["fs", "unique-names-generator", "puppeteer"]
};
