const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const { vars } = require("hardhat/config");

const OWNER_ADDRESS = vars.get("OWNER_ADDRESS");

const SimpleSwapModule = buildModule("SimpleSwapModule", (m) => {
  const owner = m.getParameter("owner", OWNER_ADDRESS);
  const simpleSwap = m.contract("SimpleSwap", [owner]);

  return { simpleSwap };
});

module.exports = SimpleSwapModule;