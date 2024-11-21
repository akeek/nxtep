const fs = require("fs");
const pdf = require("pdf-parse");

let dataBuffer = fs.readFileSync(
  "/Users/akeek/Dropbox/Mac/Documents/GitHub/JSS/nxtep/public/data/pdf/soknad---avfallsanlegg---iris-produksjon-as---bodo.pdf"
);

pdf(dataBuffer).then(function (data) {
  // PDF info
  console.log(data.info);

  console.log(data.metadata);
});
