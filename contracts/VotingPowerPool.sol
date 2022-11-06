// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import '@openzeppelin/contracts/access/Ownable.sol';
import './interfaces/INounsToken.sol';
import './interfaces/INounsDAOLogic.sol';

contract VotingPowerPool is Ownable {
    error NotAuthorized();
    error Forbidden();
    error NotEnoughETH();

    address public factory;
    address public delegator;
    uint256[] public tokenIds;

    uint256 public proposePrice;
    uint256 public votePrice;

    INounsDAOLogic public nounsDAOLogic;
    INounsToken public nounsToken;

    constructor(address _nounsDAOLogic, address _nounsToken) {
        factory = msg.sender;
        nounsDAOLogic = INounsDAOLogic(_nounsDAOLogic);
        nounsToken = INounsToken(_nounsToken);
    }

    function initialize(address _owner) external {
        if (msg.sender != factory) revert Forbidden();
        _transferOwnership(_owner);
    }

    function getVotingPower() external view returns (uint256) {
        return tokenIds.length;
    }

    function deposit(
        uint256[] memory _tokenIds,
        uint256 _proposePrice,
        uint256 _votePrice
    ) external onlyOwner {
        proposePrice = _proposePrice;
        votePrice = _votePrice;
        for (uint256 i = 0; i < _tokenIds.length; i++) {
            nounsToken.transferFrom(owner(), address(this), _tokenIds[i]);
            tokenIds.push(_tokenIds[i]);
        }
    }

    function withdraw() external onlyOwner {
        for (uint256 i = 0; i < tokenIds.length; i++) {
            nounsToken.transferFrom(address(this), owner(), tokenIds[i]);
            delete tokenIds[i];
        }
    }

    function setPrice(uint256 _proposePrice, uint256 _votePrice) external onlyOwner {
        proposePrice = _proposePrice;
        votePrice = _votePrice;
    }

    function delegates(address _delegator) external {
        if (msg.sender != owner() || msg.sender != delegator) revert NotAuthorized();

        delegator = _delegator;
        nounsToken.delegates(_delegator);
    }

    function buyCastVote(uint256 proposalId, uint8 support) external payable onlyOwner {
        if (msg.value < votePrice) revert NotEnoughETH();
        nounsDAOLogic.castVote(proposalId, support);
    }

    function buyCastVoteWithReason(
        uint256 proposalId,
        uint8 support,
        string calldata reason
    ) external payable onlyOwner {
        if (msg.value < votePrice) revert NotEnoughETH();
        nounsDAOLogic.castVoteWithReason(proposalId, support, reason);
    }

    function buyPropose(
        address[] memory targets,
        uint256[] memory values,
        string[] memory signatures,
        bytes[] memory calldatas,
        string memory description
    ) external payable onlyOwner {
        if (msg.value < proposePrice) revert NotEnoughETH();
        nounsDAOLogic.propose(targets, values, signatures, calldatas, description);
    }
}
