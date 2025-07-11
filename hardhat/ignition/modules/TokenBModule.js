const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const TokenAModule = buildModule("TokenAModule", (m) => {
  const owner = m.getParameter("owner");
  const tokenA = m.contract("TokenA", [owner]);

  return { tokenA };
});

module.exports = TokenAModule;