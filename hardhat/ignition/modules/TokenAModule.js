const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const TokenBModule = buildModule("TokenBModule", (m) => {
  const owner = m.getParameter("owner");
  const tokenB = m.contract("TokenB", [owner]);

  return { tokenB };
});

module.exports = TokenBModule;