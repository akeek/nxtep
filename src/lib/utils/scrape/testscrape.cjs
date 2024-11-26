const fs = require("fs");
const pdf = require("pdf-parse");

let dataBuffer = fs.readFileSync(
  "/Users/akeek/Dropbox/Mac/Documents/GitHub/JSS/nxtep/public/data/pdf/soknad---avfallsanlegg---iris-produksjon-as---bodo.pdf"
);

pdf(dataBuffer).then(function (data) {
  const infoData = data.info;
  console.log("Infodata: ", infoData);

  const metadata = data.metadata;
  console.log("Metadata: ", metadata);

  // Use CreationDate or fallback to ModDate, then look for "xmp:createdate"
  const dateStr =
    infoData.CreationDate || infoData.ModDate || metadata?.["xmp:createdate"];

  if (dateStr) {
    // Extract the date components from the PDF date format
    const match =
      dateStr.match(/D:(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/) ||
      dateStr.match(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/);

    if (match) {
      const [_, year, month, day, hour, minute, second] = match;

      // Construct a standard ISO date string
      const isoDateStr = `${year}-${month}-${day}T${hour}:${minute}:${second}`;

      // Convert to a JavaScript Date object
      const dateObj = new Date(isoDateStr);

      // Extract and format components as needed
      const formattedDate = `${day}-${month}-${year}`;
      console.log("Extracted Date:", formattedDate);
    } else {
      console.log("Unrecognized date format:", dateStr);
    }
  } else {
    console.log(
      'Neither "CreationDate", "ModDate", nor "xmp:createdate" fields are found.'
    );
  }
});
