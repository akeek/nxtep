const puppeteer = require("puppeteer");
const fs = require("fs").promises;
const path = require("path");

async function ensureDirExists(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function scrapeNorskeUtslipp() {
  const url =
    "https://www.norskeutslipp.no/no/Listesider/Virksomheter-med-utslippstillatelse/?SectorID=90&s=800";

  const publicDir = path.join(__dirname, "../../../../public", "data", "json");
  const outputFile = path.join(publicDir, "norskeUtslipp.json");

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    console.log(`Navigating to ${url}`);
    await page.goto(url, { waitUntil: "load", timeout: 60000 });

    // Wait for the table to load
    await page.waitForSelector("div.bcdeCol table");

    // Extract data from the table
    const data = await page.evaluate(() => {
      const rows = Array.from(
        document.querySelectorAll("div.bcdeCol table tbody tr")
      );
      return rows.map((row, index) => {
        const cells = Array.from(row.querySelectorAll("td"));
        return {
          id: index + 1,
          Virksomhet: cells[0]?.querySelector("span")?.textContent.trim() || "",
          Sektor: cells[1]?.querySelector("span")?.textContent.trim() || "",
          "Type virksomhet":
            cells[2]?.querySelector("span")?.textContent.trim() || "",
          Fylke: cells[3]?.querySelector("span")?.textContent.trim() || "",
          Kommune: cells[4]?.querySelector("span")?.textContent.trim() || "",
          Tillatelser:
            cells[5]?.querySelector("a")?.href.trim() || "No Link Available",
          Kontroller:
            cells[6]?.querySelector("a")?.href.trim() || "No Link Available",
        };
      });
    });

    // Ensure the directory exists
    await ensureDirExists(publicDir);

    // Save data to a JSON file
    await fs.writeFile(outputFile, JSON.stringify(data, null, 2));
    console.log(`Data successfully saved to ${outputFile}`);
  } catch (error) {
    console.error(`Error while scraping: ${error.message}`);
  } finally {
    await browser.close();
  }
}

scrapeNorskeUtslipp().catch((error) =>
  console.error(`Script failed: ${error.message}`)
);
