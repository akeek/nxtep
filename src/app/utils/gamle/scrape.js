const puppeteer = require("puppeteer");
const axios = require("axios");
const fs = require("fs").promises;
const path = require("path");

const publicDir = path.join(__dirname, "../../../public", "data");

// Ensure the public directory exists
async function ensurePublicDir() {
  await fs.mkdir(publicDir, { recursive: true });
}

// Save scraped data to a JSON file
async function saveDataToFile(filePath, data) {
  try {
    const existingData = await fs.readFile(filePath, "utf8");
    const jsonData = JSON.parse(existingData);

    // Check for existing entry based on pageTitle and pageHeader
    const existingEntry = jsonData.find(
      (entry) =>
        entry.pageTitle === data.pageTitle &&
        entry.pageHeader === data.pageHeader
    );

    if (existingEntry) {
      const newLinks = data.links.filter(
        (newLink) =>
          !existingEntry.links.some(
            (existingLink) => existingLink.link === newLink.link
          )
      );
      if (newLinks.length > 0) {
        existingEntry.links.push(...newLinks);
        await fs.writeFile(filePath, JSON.stringify(jsonData, null, 2));
        console.log("New links appended to existing entry.");
      } else {
        console.log("No new links to append.");
      }
    } else {
      jsonData.push(data);
      await fs.writeFile(filePath, JSON.stringify(jsonData, null, 2));
      console.log("New data saved to the file.");
    }
  } catch (err) {
    await fs.writeFile(filePath, JSON.stringify([data], null, 2));
    console.log("Data saved to a new file.");
  }
}

// Scrape data and download PDFs/screenshots
async function scrapeDataAndDownloadPDFs(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  await page.setViewport({ width: 1920, height: 1080 });

  // Extract page title, header text, and links
  const title = await page.title();
  const headerText = await page.$eval("h1", (el) => el.textContent);

  // Extract all links within tables
  let links = await page.$$eval("table a", (anchors) =>
    anchors.map((anchor) => anchor.href)
  );
  console.log("Links:", links);
  links = [...new Set(links)]; // Remove duplicates

  // Extract hoering titles
  const hoeringTitles = await page.$$eval("table a", (anchors) =>
    anchors.map((anchor) => anchor.textContent)
  );
  console.log("Hoering Titles:", hoeringTitles);

  const dataToSave = {
    pageTitle: title,
    pageHeader: headerText,
    links: links.map((link, index) => ({
      link,
      hoeringTitle: hoeringTitles[index],
    })),
  };

  // Ensure the public directory is set up
  await ensurePublicDir();

  // Define the file path for scraped data
  const filePath = path.join(publicDir, "scraped.json");

  // Save the data to the file
  await saveDataToFile(filePath, dataToSave);

  // Process each link for PDFs and screenshots
  for (const { link, hoeringTitle } of dataToSave.links) {
    await processLinkForPDFsAndScreenshots(browser, link, hoeringTitle);
  }

  await browser.close();
}

// Process each link for downloading PDFs and screenshots
async function processLinkForPDFsAndScreenshots(browser, link, hoeringTitle) {
  const pageScreenshot = await browser.newPage();
  await pageScreenshot.goto(link);
  await pageScreenshot.setViewport({ width: 1920, height: 1080 });

  // Extract PDF links from the page
  const pdfLinks = await pageScreenshot.$$eval("a[href$='.pdf']", (anchors) =>
    anchors.map((anchor) => anchor.href)
  );

  // Download PDFs
  await downloadPDFs(pdfLinks);

  // Capture screenshot
  await captureScreenshot(pageScreenshot, link);

  await pageScreenshot.close(); // Close after processing
}

// Download PDFs from a list of URLs
async function downloadPDFs(pdfLinks) {
  for (const pdfLink of pdfLinks) {
    try {
      const pdfResponse = await axios.get(pdfLink, {
        responseType: "arraybuffer",
      });
      const pdfName = pdfLink.split("/").pop(); // Extract filename

      const pdfDir = path.join(
        publicDir,
        "pdfs",
        "statsforvalteren",
        "hoeringer"
      );
      await fs.mkdir(pdfDir, { recursive: true });

      const pdfPath = path.join(pdfDir, pdfName);
      await fs.writeFile(pdfPath, pdfResponse.data);
      console.log(`Downloaded PDF: ${pdfName}`);
    } catch (err) {
      console.error(`Failed to download PDF from ${pdfLink}:`, err.message);
    }
  }
}

// Capture a screenshot and save it
async function captureScreenshot(page, link) {
  const screenshotDir = path.join(
    publicDir,
    "screenshots",
    "statsforvalteren",
    "hoeringer"
  );
  await fs.mkdir(screenshotDir, { recursive: true });

  const screenshotPath = path.join(
    screenshotDir,
    `${link.replace(/[^a-zA-Z0-9]/g, "_")}.png`
  );
  await page.screenshot({ path: screenshotPath });
  console.log(`Screenshot saved: ${screenshotPath}`);
}

// Scrape multiple URLs concurrently
async function scrapeMultipleUrls(urls) {
  await Promise.all(urls.map(scrapeDataAndDownloadPDFs));
}

// List of URLs to scrape
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

// Start scraping the URLs
scrapeMultipleUrls(urls);
