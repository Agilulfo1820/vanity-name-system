const VanityNameController = artifacts.require("VanityNameController");

module.exports = function(deployer) {
  deployer.deploy(VanityNameController);
};
