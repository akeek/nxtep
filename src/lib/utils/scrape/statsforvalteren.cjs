const puppeteer = require("puppeteer");
const axios = require("axios");
const fs = require("fs").promises;
const path = require("path");
const pdf = require("pdf-parse");

const publicDir = path.join(__dirname, "../../../../public", "data", "json");

async function ensureDirExists(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function saveToFile(filePath, data) {
  await ensureDirExists(path.dirname(filePath));
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  console.log(`Data saved to ${filePath}`);
}

async function scrapeMainPage(browser, url) {
  const page = await browser.newPage();
  try {
    await page.goto(url, { waitUntil: "load", timeout: 60000 });
    await page.setViewport({ width: 1920, height: 1080 });

    const title = await page.title();
    const headerText = await page.$eval("h1", (el) => el.textContent || "");
    const links = await page.$$eval("table a", (anchors) =>
      anchors.map((anchor) => ({
        link: anchor.href,
        hoeringTitle: anchor.textContent.trim(),
      }))
    );

    return { pageTitle: title, pageHeader: headerText, links };
  } catch (err) {
    console.error(`Error scraping main page (${url}): ${err.message}`);
    return null;
  } finally {
    await page.close();
  }
}

async function scrapeNestedPage(browser, link) {
  const page = await browser.newPage();
  try {
    await page.goto(link, { waitUntil: "load", timeout: 60000 });

    const summary = await page.$eval(
      ".lead.article",
      (el) => el.textContent.trim() || ""
    );

    const pdfLinks = await page.$$eval('a[href$=".pdf"]', (anchors) =>
      anchors.map((anchor) => anchor.href)
    );

    return { summary, pdfLinks };
  } catch (err) {
    console.error(`Error scraping nested page (${link}): ${err.message}`);
    return { summary: "", article: "", pdfLinks: [] };
  } finally {
    await page.close();
  }
}

const isValidPDF = (buffer) => buffer.toString("utf8", 0, 4) === "%PDF";

async function processPDF(pdfUrl) {
  try {
    const response = await axios.get(pdfUrl, { responseType: "arraybuffer" });

    if (!isValidPDF(response.data)) {
      throw new Error("Invalid PDF structure");
    }

    const pdfData = await pdf(response.data);
    const text = pdfData.text.replace(/[\n\r]+/g, " ").replace(/\s{2,}/g, " ");

    const patterns = {
      m2m3: /([^.]*\d{1,3}(?:\s?\d{3})*(?:[.,]?\d+)?\s?(m²|m³|am²)[^.]*\.)/g,
      mudring: /([^.]*\bmudring\b[^.]*\.)/gi,
      molo: /([^.]*\bmolo\b[^.]*\.)/gi,
      sjøarbeid: /([^.]*\bsjøarbeid\b[^.]*\.)/gi,
      utdyping: /([^.]*\butdyping\b[^.]*\.)/gi,
      tildekking: /([^.]*\btildekking\b[^.]*\.)/gi,
      utfylling: /([^.]*\butfylling\b[^.]*\.)/gi,
      dykking: /([^.]*\bdykking\b[^.]*\.)/gi,
      undervannsprenging: /([^.]*\bundervannsprenging\b[^.]*\.)/gi,
    };

    const extractedData = {};
    for (const [key, regex] of Object.entries(patterns)) {
      const matches = [...text.matchAll(regex)].map((match) => match[0].trim());
      extractedData[key] = matches;
    }

    const wordsToFind = [
      "m³",
      "m²",
      "mudring",
      "molo",
      "sjøarbeid",
      "utdyping",
      "tildekking",
      "utfylling",
      "dykking",
      "undervannsprenging",
    ];

    const wordsFound = wordsToFind.reduce((acc, word) => {
      const regex = new RegExp(`\\b${word}\\b`, "gi");
      const matches = text.match(regex);
      acc[word] = { found: !!matches, count: matches?.length || 0 };
      return acc;
    }, {});

    extractedData.wordsFound = wordsFound;

    return extractedData;
  } catch (err) {
    console.error(`Error processing PDF (${pdfUrl}): ${err.message}`);
    return null;
  }
}

async function scrapeAndParse(urls) {
  const browser = await puppeteer.launch();
  const results = [];
  const seenPdfUrls = new Set();

  for (const url of urls) {
    console.log(`Scraping main page: ${url}`);
    const mainPageData = await scrapeMainPage(browser, url);
    if (!mainPageData) continue;

    const county = new URL(url).pathname.split("/")[2].replace(/-/g, " ");

    for (const { link, hoeringTitle } of mainPageData.links) {
      console.log(`Scraping nested page: ${link}`);
      const nestedData = await scrapeNestedPage(browser, link);

      for (const pdfUrl of nestedData.pdfLinks) {
        if (seenPdfUrls.has(pdfUrl)) {
          console.log(`Skipping duplicate PDF: ${pdfUrl}`);
          continue;
        }

        console.log(`Processing PDF: ${pdfUrl}`);
        const pdfData = await processPDF(pdfUrl);
        if (pdfData) {
          results.push({
            county,
            hoeringTitle,
            hoeringUrl: link,
            pdfUrl,
            pageTitle: mainPageData.pageTitle,
            pageHeader: mainPageData.pageHeader,
            summary: nestedData.summary,
            pdfData,
          });
          seenPdfUrls.add(pdfUrl);
        }
      }
    }
  }

  await browser.close();

  const groupedResults = results.reduce((acc, item) => {
    const countyData = acc.find((c) => c.county === item.county);
    if (!countyData) {
      acc.push({ county: item.county, results: [item] });
    } else {
      countyData.results.push(item);
    }
    return acc;
  }, []);

  const outputFile = path.join(publicDir, "statsforvalteren.json");
  await saveToFile(outputFile, groupedResults);
}

const urls = [
  "https://www.statsforvalteren.no/nb/innlandet/horinger/",
  "https://www.statsforvalteren.no/nb/Nordland/Hoeringer/",
  "https://www.statsforvalteren.no/nn/More-og-Romsdal/Hoyringar/",
  "https://www.statsforvalteren.no/nn/Rogaland/Hoyringar/",
  "https://www.statsforvalteren.no/nb/troms-finnmark/horinger/",
  "https://www.statsforvalteren.no/nb/Trondelag/Horinger/",
  "https://www.statsforvalteren.no/nb/vestfold-og-telemark/horinger/",
  "https://www.statsforvalteren.no/nn/vestland/hoyringar/",
  "https://www.statsforvalteren.no/nb/ostfold-buskerud-oslo-og-akershus/horinger/",
];

scrapeAndParse(urls).catch((err) => console.error("Error:", err.message));