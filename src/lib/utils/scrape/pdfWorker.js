const axios = require("axios");
const pdf = require("pdf-parse");

const isValidPDF = (buffer) => buffer.toString("utf8", 0, 4) === "%PDF";

async function processPDF(pdfUrl) {
    try {
        const response = await axios.get(pdfUrl, {responseType: "arraybuffer"});

        if (!isValidPDF(response.data)) {
            throw new Error("Invalid PDF structure");
        }

        const pdfData = await pdf(response.data);
        const metadata = pdfData.metadata?._metadata;
        const createdDateStr = metadata ? metadata["xmp:createdate"] : null;

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
            acc[word] = {found: !!matches, count: matches?.length || 0};
            return acc;
        }, {});

        return {
            textData: {
                ...extractedData,
                wordsFound,
            },
            createdDate,
        };
    } catch (err) {
        console.error(`Error processing PDF (${pdfUrl}): ${err.message}`);
        return null;
    }
}

self.onmessage = async (event) => {
    const { pdfUrl } = event.data;
    const result = await processPDF(pdfUrl);
    self.postMessage(result);
};