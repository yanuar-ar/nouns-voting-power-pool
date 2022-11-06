const { task } = require('hardhat/config');

task('deploy', 'Deploy contract').setAction(async ({}, { ethers, upgrades }) => {
  const VotingPowerFactory = await ethers.getContractFactory('VotingPowerFactory');

  const votingPowerFactory = await VotingPowerFactory.deploy('', { gasLimit: 3000000 });

  await votingPowerFactory.deployed();

  console.log('Contract deployed to: ', votingPowerFactory.address);
});
