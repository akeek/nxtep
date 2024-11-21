const fs = require("fs");
const pdf = require("pdf-parse");

let dataBuffer = fs.readFileSync(
  "/Users/akeek/Dropbox/Mac/Documents/GitHub/JSS/nxtep/public/data/pdf/soknad---avfallsanlegg---iris-produksjon-as---bodo.pdf"
);

pdf(dataBuffer).then(function (data) {
  // Access the metadata
  const metadata = data.metadata._metadata;

  // Grab the 'xmp:createdate' value
  const createdDate = metadata["xmp:createdate"];

  // Convert the date string to a Date object and extract the year
  const year = new Date(createdDate).getFullYear();

  console.log("Year:", year);
});
