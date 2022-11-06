const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Voting Power Pool Testing', async () => {
  let VotingPowerPool;
  let votingPowerPool;
  let nounsTokenMock;
  let nounsDAOLogicMock;
  let owner;
  let nonOwner;

  before(async () => {
    [owner, nonOwner] = await ethers.getSigners();

    // deploy NounsTokenMock
    const NounsTokenMock = await ethers.getContractFactory('NounsTokenMock');
    nounsTokenMock = await NounsTokenMock.deploy();

    // deploy NounsDAOLogicMock
    const NounsDAOLogicMock = await ethers.getContractFactory('NounsDAOLogicMock');
    nounsDAOLogicMock = await NounsDAOLogicMock.deploy();

    VotingPowerPool = await ethers.getContractFactory('VotingPowerPool');
    votingPowerPool = await VotingPowerPool.deploy(
      nounsDAOLogicMock.address,
      nounsTokenMock.address,
    );
  });

  describe('Deployment', async () => {
    it('should deployed', async function () {
      expect(nounsTokenMock.address).to.not.equal('');
      expect(nounsDAOLogicMock.address).to.not.equal('');
      expect(votingPowerPool.address).to.not.equal('');
    });
  });

  describe('Testing Deposit, Withdraw & Delegate', async () => {
    before(async () => {
      await nounsTokenMock.mint();
      await nounsTokenMock.mint();
    });

    it('should deposit', async () => {
      await nounsTokenMock.setApprovalForAll(votingPowerPool.address, true);

      await votingPowerPool.deposit(
        [0, 1],
        ethers.utils.parseUnits('1', 'ether'),
        ethers.utils.parseUnits('1', 'ether'),
      );

      expect(await nounsTokenMock.balanceOf(owner.address)).to.eq(ethers.BigNumber.from('0'));
      expect(await nounsTokenMock.balanceOf(votingPowerPool.address)).to.eq(
        ethers.BigNumber.from('2'),
      );
    });

    it('should delegate', async () => {
      expect(await nounsTokenMock.delegates(nonOwner.address)).to.eq(nonOwner.address);
    });

    it('should withdraw', async () => {
      await votingPowerPool.withdraw();

      expect(await nounsTokenMock.balanceOf(owner.address)).to.eq(ethers.BigNumber.from('2'));
      expect(await nounsTokenMock.balanceOf(votingPowerPool.address)).to.eq(
        ethers.BigNumber.from('0'),
      );
    });
  });

  describe('Testing DAO Function', async () => {
    before(async () => {
      await votingPowerPool.deposit(
        [0, 1],
        ethers.utils.parseUnits('1', 'ether'),
        ethers.utils.parseUnits('1', 'ether'),
      );
    });

    it('should vote', async () => {
      expect(
        await votingPowerPool.buyCastVote(1, 0, { value: ethers.utils.parseUnits('1', 'ether') }),
      ).not.to.be.reverted;
    });

    it('should vote reverted with NotEnoughETH', async () => {
      await expect(
        votingPowerPool.buyCastVote(1, 0, { value: ethers.utils.parseUnits('0.5', 'ether') }),
      ).to.be.revertedWithCustomError(VotingPowerPool, 'NotEnoughETH');
    });

    it('should vote with reason', async () => {
      expect(
        await votingPowerPool.buyCastVoteWithReason(1, 0, 'reason', {
          value: ethers.utils.parseUnits('1', 'ether'),
        }),
      ).not.to.be.reverted;
    });

    it('should vote with reason reverted with NotEnoughETH', async () => {
      await expect(
        votingPowerPool.buyCastVoteWithReason(1, 0, 'reason', {
          value: ethers.utils.parseUnits('0.5', 'ether'),
        }),
      ).to.be.revertedWithCustomError(VotingPowerPool, 'NotEnoughETH');
    });

    it('should propose', async () => {
      function encodeParameters(types, values) {
        const abi = new ethers.utils.AbiCoder();
        return abi.encode(types, values);
      }
      const targets = [owner.address];
      const values = ['0'];
      const signatures = ['getBalanceOf(address)'];
      const callDatas = [encodeParameters(['address'], [owner.address])];

      expect(
        await votingPowerPool.buyPropose(targets, values, signatures, callDatas, 'do nothing', {
          value: ethers.utils.parseUnits('1', 'ether'),
        }),
      ).not.to.be.reverted;
    });

    it('should propose reverted with NotEnoughETH', async () => {
      function encodeParameters(types, values) {
        const abi = new ethers.utils.AbiCoder();
        return abi.encode(types, values);
      }
      const targets = [owner.address];
      const values = ['0'];
      const signatures = ['getBalanceOf(address)'];
      const callDatas = [encodeParameters(['address'], [owner.address])];

      await expect(
        votingPowerPool.buyPropose(targets, values, signatures, callDatas, 'do nothing', {
          value: ethers.utils.parseUnits('0.5', 'ether'),
        }),
      ).to.be.revertedWithCustomError(VotingPowerPool, 'NotEnoughETH');
    });
  });
});
