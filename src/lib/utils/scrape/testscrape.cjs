const fs = require("fs");
const pdf = require("pdf-parse");

let dataBuffer = fs.readFileSync(
  "/Users/akeek/Dropbox/Mac/Documents/GitHub/JSS/nxtep/public/data/pdf/soknad---avfallsanlegg---iris-produksjon-as---bodo.pdf"
);

pdf(dataBuffer).then(function (data) {
  // Access the metadata
  const metadata = data.metadata._metadata;

  // Grab the 'xmp:createdate' value
  const createdDateStr = metadata["xmp:createdate"];

  if (createdDateStr) {
    // Convert the date string to a Date object
    const dateObj = new Date(createdDateStr);

    // Extract the components
    const day = dateObj.getDate().toString().padStart(2, "0"); // Ensure 2-digit format
    const month = (dateObj.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-indexed
    const year = dateObj.getFullYear();

    // Construct the createdDate value
    const createdDate = `${day}-${month}-${year}`;

    console.log("Created Date:", createdDate); // Logs: Created Date: 2024-09-27
  } else {
    console.log('No "xmp:createdate" field found.');
  }
});
