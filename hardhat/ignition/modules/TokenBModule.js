const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const { vars } = require("hardhat/config");

const OWNER_ADDRESS = vars.get("OWNER_ADDRESS");

const TokenBModule = buildModule("TokenBModule", (m) => {
  const owner = m.getParameter("owner", OWNER_ADDRESS);
  const tokenB = m.contract("MyTokenB", [owner]);

  return { tokenB };
});

module.exports = TokenBModule;