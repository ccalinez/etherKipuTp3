const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const SimpleSwapModule = buildModule("SimpleSwapModule", (m) => {
  const owner = m.getParameter("owner");
  const simpleSwap = m.contract("SimpleSwap", [owner]);

  return { simpleSwap };
});

module.exports = SimpleSwapModule;