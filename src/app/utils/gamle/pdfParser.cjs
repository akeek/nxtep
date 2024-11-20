const fs = require("fs");
const path = require("path");
const pdf = require("pdf-parse");

// Directory path containing the PDFs
const dirPath =
  "/Users/akeek/Dropbox/Mac/Documents/GitHub/JSS/next-episode/next-episode/public/data/pdfs/statsforvalteren/hoeringer/";

// Read the scraped JSON file containing URLs (if still needed in the future)
const scrapedDataFilePath = path.join(__dirname, "public/data/scraped.json");
let scrapedData = [];

// Read and parse scraped data
try {
  const scrapedDataBuffer = fs.readFileSync(scrapedDataFilePath);
  scrapedData = JSON.parse(scrapedDataBuffer);
  console.log("Scraped data loaded successfully");
} catch (err) {
  console.error("Failed to load scraped data:", err.message);
}

async function extractDataFromPDFs() {
  // Array to store parsed data from each PDF
  const resultsArray = [];

  // Read all files in the directory
  const files = fs.readdirSync(dirPath).filter((file) => file.endsWith(".pdf"));

  for (const [index, file] of files.entries()) {
    const filePath = path.join(dirPath, file);
    console.log(`Processing file: ${filePath}`);

    const dataBuffer = fs.readFileSync(filePath);

    try {
      const data = await pdf(dataBuffer);
      let text = data.text;

      // Normalize the text by replacing line breaks with a space and multiple spaces with a single space
      text = text.replace(/[\n\r]+/g, " "); // Replace all line breaks with spaces
      text = text.replace(/\s{2,}/g, " "); // Replace multiple spaces with a single space

      // Define regex patterns
      const regexValuesInSentences =
        /([^.]*\d{1,3}(?:\s?\d{3})*(?:[.,]?\d+)?\s?(m²|m³|am²)[^.]*\.)/g;
      const regexMudring = /([^.]*\bmudring\b[^.]*\.)/gi;
      const regexMolo = /([^.]*\molo\b[^.]*\.)/gi;
      const regexSjøarbeid = /([^.]*\sjøarbeid\b[^.]*\.)/gi;
      const regexUtdyping = /([^.]*\utdyping\b[^.]*\.)/gi;
      const regexTildekking = /([^.]*\btildekking\b[^.]*\.)/gi;
      const regexUtfylling = /([^.]*\butfylling\b[^.]*\.)/gi;
      const regexDykking = /([^.]*\bdykking\b[^.]*\.)/gi;
      const regexUndervannsprenging = /([^.]*\bundervannsprenging\b[^.]*\.)/gi;

      // Format the file name to a readable "name"
      const formattedName = file.replace(/[-_]/g, " ").replace(".pdf", "");

      // Prepare result object for the current PDF
      const result = {
        id: index + 1,
        name: formattedName, // Use formatted file name
        filePath: `/data/pdfs/statsforvalteren/hoeringer/${file}`,
        squareCubicMeterSentences: [],
        mudringSentences: [],
        moloSentences: [],
        sjøarbeidSentences: [],
        utdypingSentences: [],
        tildekkingSentences: [],
        utfyllingSentences: [],
        dykkingSentences: [],
        undervannsprengingSentences: [],
        wordsFound: {},
      };

      // Find all full sentences containing square/cubic meter values
      let valueSentenceMatch;
      while (
        (valueSentenceMatch = regexValuesInSentences.exec(text)) !== null
      ) {
        result.squareCubicMeterSentences.push(valueSentenceMatch[0].trim());
      }

      // Find all sentences with the word "mudring"
      let mudringMatch;
      while ((mudringMatch = regexMudring.exec(text)) !== null) {
        result.mudringSentences.push(mudringMatch[0].trim());
      }

      let moloMatch;
      while ((moloMatch = regexMolo.exec(text)) !== null) {
        result.moloSentences.push(moloMatch[0].trim());
      }

      let sjøarbeidMatch;
      while ((sjøarbeidMatch = regexSjøarbeid.exec(text)) !== null) {
        result.sjøarbeidSentences.push(sjøarbeidMatch[0].trim());
      }

      let utdypingMatch;
      while ((utdypingMatch = regexUtdyping.exec(text)) !== null) {
        result.utdypingSentences.push(utdypingMatch[0].trim());
      }

      let tildekkingMatch;
      while ((tildekkingMatch = regexTildekking.exec(text)) !== null) {
        result.tildekkingSentences.push(tildekkingMatch[0].trim());
      }

      let utfyllingMatch;
      while ((utfyllingMatch = regexUtfylling.exec(text)) !== null) {
        result.utfyllingSentences.push(utfyllingMatch[0].trim());
      }

      let dykkingMatch;
      while ((dykkingMatch = regexDykking.exec(text)) !== null) {
        result.dykkingSentences.push(dykkingMatch[0].trim());
      }

      let undervannsprengingMatch;
      while (
        (undervannsprengingMatch = regexUndervannsprenging.exec(text)) !== null
      ) {
        result.undervannsprengingSentences.push(
          undervannsprengingMatch[0].trim()
        );
      }

      // Search for specific words in the text and count occurrences
      const wordsToFind = [
        "m³",
        "m²",
        "molo",
        "sjøarbeid",
        "utdyping",
        "tildekking",
        "utfylling",
        "dykking",
        "undervannsprenging",
      ];
      wordsToFind.forEach((word) => {
        const regex = new RegExp(`\\b${word}\\b`, "gi");
        const matches = text.match(regex);
        result.wordsFound[word] = {
          found: matches !== null,
          count: matches ? matches.length : 0,
        };
      });

      // Add the parsed data for the current PDF to results array
      resultsArray.push(result);
    } catch (err) {
      console.error(`Failed to process ${file}:`, err.message);
    }
  }

  // Define the output JSON file path
  const jsonFilePath = "./public/data/parseResults.json";

  // Ensure the directory exists before writing (optional check)
  const dir = path.dirname(jsonFilePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Save all results to a JSON file, overwriting it if it already exists
  fs.writeFileSync(jsonFilePath, JSON.stringify(resultsArray, null, 2));
  console.log(`All results saved to ${jsonFilePath}`);
}

// Run the extraction function
extractDataFromPDFs();
