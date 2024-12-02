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

    // Extract høringsfrist (hearing deadline)
    const hearingDeadline = await page.evaluate(() => {
      const calendarDl = document.querySelector("dl.widecalendar");
      if (calendarDl) {
        const dtElements = calendarDl.querySelectorAll("dt");
        for (const dt of dtElements) {
          if (
            dt.textContent.toLowerCase().includes("høringsfrist") ||
            dt.textContent.toLowerCase().includes("høyringsfrist")
          ) {
            const dd = dt.nextElementSibling;
            return dd ? dd.textContent.trim() : null;
          }
        }
      }
      return null; // If no matching dt is found
    });

    const pdfLinks = await page.$$eval('a[href$=".pdf"]', (anchors) =>
      anchors.map((anchor) => anchor.href)
    );

    return { summary, hearingDeadline, pdfLinks };
  } catch (err) {
    console.error(`Error scraping nested page (${link}): ${err.message}`);
    return { summary: "", hearingDeadline: null, pdfLinks: [] };
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
    const metadata = pdfData.metadata?._metadata;
    const createdDateStr = metadata ? metadata["xmp:createdate"] : null;

    // Parse the date as a Date object if available
    let createdDate = null;
    if (createdDateStr) {
      createdDate = new Date(createdDateStr);
      if (isNaN(createdDate)) {
        console.warn(`Invalid date format in metadata: ${createdDateStr}`);
        createdDate = null;
      }
    }

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

    return {
      textData: {
        ...extractedData,
        wordsFound,
      },
      createdDate, // Return as a Date object
    };
  } catch (err) {
    console.error(`Error processing PDF (${pdfUrl}): ${err.message}`);
    return null;
  }
}

function parseHøringsfristToDate(data) {
  // Mapping Norwegian month names to English
  const monthMap = {
    januar: "January",
    februar: "February",
    mars: "March",
    april: "April",
    mai: "May",
    juni: "June",
    juli: "July",
    august: "August",
    september: "September",
    oktober: "October",
    november: "November",
    desember: "December",
  };

  // Preprocess the høringsfrist string
  let høringsfrist = data.høringsfrist;
  for (const [noMonth, enMonth] of Object.entries(monthMap)) {
    if (høringsfrist.includes(noMonth)) {
      høringsfrist = høringsfrist.replace(noMonth, enMonth);
      break; // Replace only the first matching month
    }
  }

  // Attempt to parse the date
  const parsedDate = new Date(høringsfrist);
  if (!isNaN(parsedDate)) {
    data.høringsfrist = parsedDate.toISOString(); // Convert to ISO 8601 format
  } else {
    console.warn(`Invalid date format in høringsfrist: ${data.høringsfrist}`);
    data.høringsfrist = null; // Set to null if parsing fails
  }
}

async function scrapeAndParse(urls) {
  const browser = await puppeteer.launch();
  const results = [];
  const seenPdfUrls = new Set();
  let idCounter = 1; // Initialize the id counter

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
          const dataToSave = {
            id: idCounter++,
            county,
            hoeringTitle,
            hoeringUrl: link,
            pdfUrl,
            pageTitle: mainPageData.pageTitle,
            pageHeader: mainPageData.pageHeader,
            summary: nestedData.summary,
            createdDate: pdfData.createdDate,
            høringsfrist: nestedData.hearingDeadline,
            pdfData: pdfData.textData,
          };

          parseHøringsfristToDate(dataToSave);

          results.push(dataToSave);
          seenPdfUrls.add(pdfUrl);
        }
      }
    }
  }

  await browser.close();
  return results;
}

console.time("scrapeDuration");

(async () => {
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
  const results = await scrapeAndParse(urls);
  await saveToFile(path.join(publicDir, "statsforvalteren1.json"), results);
  console.timeEnd("scrapeDuration");
})();
