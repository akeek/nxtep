const havnemagasinet = require("./havnemagasinet.cjs");
const norskeUtslipp = require("./norskeUtslipp.cjs");
const statsforvalteren = require("./statsforvalteren.cjs");

async function runAllScripts() {
  await Promise.all([havnemagasinet(), norskeUtslipp(), statsforvalteren()]);
}

module.exports = runAllScripts;
