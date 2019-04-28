const relayHub = artifacts.require("RelayHub");
const RLPReader = artifacts.require("RLPReader");


module.exports = function(deployer) {
  deployer.deploy(RLPReader);
  deployer.link(RLPReader, relayHub)
  deployer.deploy(relayHub);
};
