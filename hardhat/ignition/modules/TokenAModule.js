const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const { vars } = require("hardhat/config");

const OWNER_ADDRESS = vars.get("OWNER_ADDRESS");

const TokenAModule = buildModule("TokenAModule", (m) => {
  const owner = m.getParameter("owner", OWNER_ADDRESS);
  const tokenA = m.contract("MyTokenA", [owner]);

  return { tokenA };
});

module.exports = TokenAModule;