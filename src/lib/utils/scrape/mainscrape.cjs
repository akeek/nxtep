const havnemagasinet = require("./havnemagasinet.cjs");
const norskeUtslipp = require("./norskeUtslipp.cjs");
const statsforvalteren = require("./statsforvalteren.cjs");

function runAllScripts() {
  console.time("Time used");
  havnemagasinet();
  norskeUtslipp();
  statsforvalteren();
  console.timeEnd("Time used");
}

module.exports = runAllScripts;
