//var erc721 = artifacts.require("./Broker.sol");
var Broker = artifacts.require("./Broker.sol");

module.exports = function(deployer) {
  //deployer.deploy(erc721, "ipfstoken", "itk");
  //deployer.deploy(erc721);
  deployer.deploy(Broker);
};
