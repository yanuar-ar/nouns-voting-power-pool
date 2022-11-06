const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Voting Power Factory Testing', async () => {
  let votingPowerFactory;

  before(async () => {
    [owner, nonOwner] = await ethers.getSigners();

    // deploy NounsTokenMock
    const NounsTokenMock = await ethers.getContractFactory('NounsTokenMock');
    const nounsTokenMock = await NounsTokenMock.deploy();

    // deploy NounsDAOLogicMock
    const NounsDAOLogicMock = await ethers.getContractFactory('NounsDAOLogicMock');
    const nounsDAOLogicMock = await NounsDAOLogicMock.deploy();

    const VotingPowerFactory = await ethers.getContractFactory('VotingPowerFactory');
    votingPowerFactory = await VotingPowerFactory.deploy(
      nounsDAOLogicMock.address,
      nounsTokenMock.address,
    );
  });

  describe('Deployment', async () => {
    it('should deployed', async function () {
      expect(votingPowerFactory.address).to.not.equal('');
    });

    it('should create splitable', async () => {
      expect(votingPowerFactory.createPool()).not.to.be.reverted;
    });
  });
});
