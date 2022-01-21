const VanityNameSystem = artifacts.require("VanityNameSystem");

module.exports = function(deployer) {
  deployer.deploy(VanityNameSystem);
};
