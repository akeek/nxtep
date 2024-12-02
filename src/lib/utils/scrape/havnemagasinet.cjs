const puppeteer = require("puppeteer");
const fs = require("fs").promises;
const path = require("path");

const publicDir = path.join(__dirname, "../../../../public", "data", "json");

async function ensureDirExists(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function saveToFile(filePath, data) {
  await ensureDirExists(path.dirname(filePath));
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  console.log(`Data saved to ${filePath}`);
}

(async () => {
  console.time("Time used");

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://havnemagasinet.no");

  const searchwords = [
    "millioner",
    "milliarder",
    "mill",
    "mrd",
    "prosjekt",
    "bygging",
    "kai",
    "utbygging",
    "tilskudd",
    "mudring",
    "utfylling",
    "molo",
  ];

  // Get all links and content of a elements with itemprop="url"
  const links = await page.evaluate((searchwords) => {
    const linkElements = document.querySelectorAll('a[itemprop="url"]');
    const linkArray = [];
    linkElements.forEach((link) => {
      const storytitle = link.textContent.trim();
      if (searchwords.some((word) => storytitle.includes(word))) {
        const imgElement = link.querySelector("picture img");
        const imgSrc = imgElement ? imgElement.src : null;
        const timeElement = link.closest("article").querySelector("time");
        const publishedTime = timeElement
          ? new Date(timeElement.getAttribute("datetime"))
          : null;
        linkArray.push({
          link: link.href,
          storytitle: storytitle,
          imgSrc: imgSrc,
          publishedTime: publishedTime ? publishedTime.toISOString() : null,
        });
      }
    });
    return linkArray;
  }, searchwords);

  // Store the results in a JSON array
  const results = links.map((link, index) => ({
    id: index + 1,
    ...link,
  }));

  await saveToFile(path.join(publicDir, "havnemagasinet.json"), results);

  await browser.close();

  console.timeEnd("Time used");
})();
